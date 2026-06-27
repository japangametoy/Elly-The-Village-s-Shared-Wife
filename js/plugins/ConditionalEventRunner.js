/*:
 * @plugindesc 変数値に応じて文章・選択肢を表示し、コモンイベントを実行するプラグイン
 * @target MZ
 *
 * @param ConditionVariableId
 * @text 条件分岐用変数ID
 * @desc 条件分岐に使用する変数のIDです。
 * @type variable
 * @default 1
 *
 * @param MessageText1
 * @text 表示文章1行目
 * @desc 変数が0の時に表示する文章の1行目です。
 * @type string
 * @default エリィの視点から今回の坑道のイベントを振り返りますか？
 *
 * @param MessageText2
 * @text 表示文章2行目
 * @desc 変数が0の時に表示する文章の2行目です。
 * @type string
 * @default （後に回想部屋にて同じイベントを閲覧できます。）
 *
 * @param ChoiceYes
 * @text 選択肢：見る
 * @desc 「見る」の選択肢のテキストです。
 * @type string
 * @default 見る
 *
 * @param ChoiceNo
 * @text 選択肢：見ない
 * @desc 「見ない」の選択肢のテキストです。
 * @type string
 * @default 見ない
 *
 * @param MessageBackground
 * @text 文章ウィンドウ背景
 * @desc 文章ウィンドウの背景タイプです。
 * @type select
 * @option ウィンドウ
 * @value 0
 * @option 暗くする
 * @value 1
 * @option 透明
 * @value 2
 * @default 1
 *
 * @param MessagePosition
 * @text 文章ウィンドウ位置
 * @desc 文章ウィンドウの表示位置です。
 * @type select
 * @option 上
 * @value 0
 * @option 中
 * @value 1
 * @option 下
 * @value 2
 * @default 2
 *
 * @param ChoicePosition
 * @text 選択肢ウィンドウ位置
 * @desc 選択肢ウィンドウの表示位置です。
 * @type select
 * @option 左
 * @value 0
 * @option 中
 * @value 1
 * @option 右
 * @value 2
 * @default 2
 *
 * @command runConditionalEvent
 * @text 条件付きイベント実行
 * @desc 変数の値に応じて文章・選択肢を表示し、コモンイベントを実行します。
 *
 * @arg commonEventId
 * @text コモンイベントID
 * @desc 実行するコモンイベントのIDです。
 * @type common_event
 * @default 1
 *
 * @help ConditionalEventRunner.js
 *
 * 変数の値に応じて以下の動作を行います：
 *
 * ■ 変数が0の場合：
 *   - 設定した文章を表示
 *   - 選択肢を表示（見る/見ない）
 *   - 「見る」を選んだ場合：指定したコモンイベントを実行
 *   - 「見ない」を選んだ場合：何もしない
 *
 * ■ 変数が1の場合：
 *   - 指定したコモンイベントを直接実行
 *
 * ■ それ以外の場合：
 *   - 何もしない
 *
 * 【使い方】
 * プラグインコマンド「条件付きイベント実行」を呼び出し、
 * 引数にコモンイベントIDを指定してください。
 */

(() => {
    'use strict';

    const pluginName = 'ConditionalEventRunner';
    const parameters = PluginManager.parameters(pluginName);

    const conditionVariableId = Number(parameters['ConditionVariableId']) || 1;
    const messageText1 = String(parameters['MessageText1'] || 'エリィの視点から今回の坑道のイベントを振り返りますか？');
    const messageText2 = String(parameters['MessageText2'] || '（後に回想部屋にて同じイベントを閲覧できます。）');
    const choiceYes = String(parameters['ChoiceYes'] || '見る');
    const choiceNo = String(parameters['ChoiceNo'] || '見ない');
    const messageBackground = Number(parameters['MessageBackground']) || 1;
    const messagePosition = Number(parameters['MessagePosition']) || 2;
    const choicePosition = Number(parameters['ChoicePosition']) || 2;

    // プラグインコマンドの登録
    PluginManager.registerCommand(pluginName, 'runConditionalEvent', function (args) {
        const commonEventId = Number(args.commonEventId) || 1;
        const variableValue = $gameVariables.value(conditionVariableId);

        if (variableValue === 0) {
            // 変数が0の場合：文章と選択肢を表示
            runMessageAndChoice(this, commonEventId);
        } else if (variableValue === 1) {
            // 変数が1の場合：コモンイベントを直接実行
            runCommonEvent(this, commonEventId);
        }
        // それ以外の場合は何もしない
    });

    /**
     * 文章と選択肢を表示し、選択に応じてコモンイベントを実行
     * @param {Game_Interpreter} interpreter - イベントインタプリタ
     * @param {number} commonEventId - コモンイベントID
     */
    function runMessageAndChoice(interpreter, commonEventId) {
        // イベントリストを構築
        const eventList = [];

        // 文章コマンド（1行目と2行目を1つの表示コマンドにまとめる）
        eventList.push({
            code: 101,  // 文章の表示（開始）
            indent: 0,
            parameters: ["", 0, messageBackground, messagePosition, ""]
        });
        eventList.push({
            code: 401,  // 文章の表示（内容1行目）
            indent: 0,
            parameters: [messageText1]
        });
        eventList.push({
            code: 401,  // 文章の表示（内容2行目）
            indent: 0,
            parameters: [messageText2]
        });

        // 選択肢の表示
        // parameters: [選択肢配列, キャンセル時の動作, デフォルトカーソル, 位置, 背景]
        // キャンセル時: 1 = 見ない（インデックス1）を実行
        // デフォルトカーソル: -1 = なし
        // 背景: 1 = 暗くする
        eventList.push({
            code: 102,  // 選択肢の表示
            indent: 0,
            parameters: [[choiceYes, choiceNo], 1, -1, choicePosition, 2]
        });

        // 「見る」の場合（選択肢1）
        eventList.push({
            code: 402,  // 選択肢分岐（見る）
            indent: 0,
            parameters: [0, choiceYes]
        });

        // コモンイベント呼び出し
        eventList.push({
            code: 117,  // コモンイベント
            indent: 1,
            parameters: [commonEventId]
        });

        // 空行
        eventList.push({
            code: 0,
            indent: 1,
            parameters: []
        });

        // 「見ない」の場合（選択肢2）
        eventList.push({
            code: 402,  // 選択肢分岐（見ない）
            indent: 0,
            parameters: [1, choiceNo]
        });

        // 空行（何もしない）
        eventList.push({
            code: 0,
            indent: 1,
            parameters: []
        });

        // 分岐終了
        eventList.push({
            code: 404,  // 分岐終了
            indent: 0,
            parameters: []
        });

        // 終端
        eventList.push({
            code: 0,
            indent: 0,
            parameters: []
        });

        // 子インタプリタでイベントリストを実行
        interpreter.setupChild(eventList, interpreter.eventId());
    }

    /**
     * コモンイベントを実行
     * @param {Game_Interpreter} interpreter - イベントインタプリタ
     * @param {number} commonEventId - コモンイベントID
     */
    function runCommonEvent(interpreter, commonEventId) {
        const commonEvent = $dataCommonEvents[commonEventId];
        if (commonEvent) {
            interpreter.setupChild(commonEvent.list, interpreter.eventId());
        }
    }

})();
