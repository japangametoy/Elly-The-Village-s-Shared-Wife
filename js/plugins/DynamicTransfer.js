/*:
 * @plugindesc 場所移動を動的に振り分けるプラグイン
 * @target MZ
 * @version 1.0.0
 *
 * @help DynamicTransfer.js
 *
 * このプラグインは、特定のマップへの場所移動イベントが発生した際に、
 * 指定した変数の値に応じて、移動先を動的に変更します。
 *
 *【使い方】
 * 1. プラグインパラメータ「監視設定リスト」に新しい設定を追加します。
 *
 * 2.「監視するマップID」に、振り分けの起点としたいマップIDを設定します。
 *   (例: 秘密の神殿の入口(ID:5)への移動を監視したい場合、「5」と設定)
 *
 * 3.「参照する変数ID」に、進行度などを管理している変数を設定します。
 *
 * 4.「スイッチ優先ルール」で、優先的にチェックしたいスイッチと移動先を設定します。
 *    先頭から順番にスイッチがONか確認され、該当した時点でその移動先に置き換えられます。
 *
 * 5.「振り分けルール」に、条件と移動先を設定します。
 *   -「変数の値」: この値以上になった場合にルールが適用されます。
 *     複数のルールがある場合、この値が大きいものから順にチェックされます。
 *     (例: 値が10と20のルールがある場合、まず変数が20以上かチェックされ、
 *      そうでなければ次に10以上かがチェックされます)
 *
 *   -「移動先のマップID」: ルールが適用された時の新しい移動先マップです。
 *
 *   -「移動先のX,Y座標」: 新しい移動先の座標です。
 *     ここを -1 のままにしておくと、イベントで指定された
 *     元の座標がそのまま使われます（マップIDだけが変わります）。
 *
 *【例】
 * 変数1番(進行度)の値に応じて、マップID:5 への移動を振り分ける
 *
 * ◆監視設定リスト
 *   - 監視するマップID: 5
 *   - 参照する変数ID: 1 (進行度)
 *   - 振り分けルール:
 *     [ルール1]
 *       - 変数の値: 20
 *       - 移動先のマップID: 7 (神殿・深部)
 *       - 移動先のX座標: 10
 *       - 移動先のY座標: 15
 *     [ルール2]
 *       - 変数の値: 10
 *       - 移動先のマップID: 6 (神殿・中枢)
 *       - 移動先のX座標: -1 (元の座標を維持)
 *       - 移動先のY座標: -1 (元の座標を維持)
 *
 * この設定の場合、マップID:5への場所移動が実行されると…
 * ・スイッチ1がONなら → マップ8へ移動（スイッチ優先ルール）
 * ・スイッチ1がOFFで、変数1が20以上なら → マップ7の(10, 15)へ移動
 * ・スイッチ1がOFFで、変数1が10以上20未満なら → マップ6の(元の指定座標)へ移動
 * ・上記いずれにも該当しなければ → 通常通りマップ5へ移動
 *
 * @param watchConfigs
 * @text 監視設定リスト
 * @desc 監視するマップIDと振り分けルールのリストです。
 * @type struct<WatchConfig>[]
 * @default []
 */

/*~struct~WatchConfig:
 * @param watchMapId
 * @text 監視するマップID
 * @desc このマップIDへの移動が発生した時に振り分け処理を行います。
 * @type map
 * @default 0
 *
 * @param variableId
 * @text 参照する変数ID
 * @desc 進行度の判定に使う変数を指定します。
 * @type variable
 * @default 0
 *
 * @param switchRules
 * @text スイッチ優先ルール
 * @desc ONのスイッチに応じて移動先を変更します。変数より優先されます。
 * @type struct<SwitchRedirectRule>[]
 * @default []
 *
 * @param rules
 * @text 振り分けルール
 * @desc 変数の値に応じた移動先のリストです。変数の値が大きい順に評価されます。
 * @type struct<RedirectRule>[]
 * @default []
 */

/*~struct~RedirectRule:
 * @param variableValue
 * @text 変数の値
 * @desc 条件に使う変数の値です。「条件の種類」によって以上/以下の判定に使われます。
 * @type number
 * @default 0
 *
 * @param compareMode
 * @text 条件の種類
 * @desc 「以上」か「以下」かを選択します。未指定の場合は「以上」として扱われます。
 * @type select
 * @option 以上
 * @value greaterOrEqual
 * @option 以下
 * @value lessOrEqual
 * @default greaterOrEqual
 *
 * @param newMapId
 * @text 移動先のマップID
 * @desc このルールが適用された時の、新しい移動先マップIDです。
 * @type map
 * @default 0
 *
 * @param newX
 * @text 移動先のX座標
 * @desc -1を指定すると元の座標を維持します。
 * @type number
 * @min -1
 * @default -1
 *
 * @param newY
 * @text 移動先のY座標
 * @desc -1を指定すると元の座標を維持します。
 * @type number
 * @min -1
 * @default -1
 */

/*~struct~SwitchRedirectRule:
 * @param switchId
 * @text 判定するスイッチID
 * @desc このスイッチの状態を判定します。
 * @type switch
 * @default 0
 *
 * @param state
 * @text スイッチ状態
 * @desc ONかOFFかを選択します。未指定の場合はONとして扱われます。
 * @type select
 * @option ON
 * @value on
 * @option OFF
 * @value off
 * @default on
 *
 * @param newMapId
 * @text 移動先のマップID
 * @desc スイッチ条件を満たした時の移動先マップIDです。
 * @type map
 * @default 0
 *
 * @param newX
 * @text 移動先のX座標
 * @desc -1を指定すると元の座標を維持します。
 * @type number
 * @min -1
 * @default -1
 *
 * @param newY
 * @text 移動先のY座標
 * @desc -1を指定すると元の座標を維持します。
 * @type number
 * @min -1
 * @default -1
 */

(() => {
    'use strict';

    const pluginName = 'DynamicTransfer';
    const params = PluginManager.parameters(pluginName);

    // パラメータをパースして使いやすい形に変換
    const watchConfigs = JSON.parse(params.watchConfigs || '[]').map(configStr => {
        const config = JSON.parse(configStr);
        const switchRules = JSON.parse(config.switchRules || '[]').map(ruleStr => {
            const rule = JSON.parse(ruleStr);
            return {
                switchId: Number(rule.switchId || 0),
                state: String(rule.state || 'on'),
                newMapId: Number(rule.newMapId || 0),
                newX: Number(rule.newX || -1),
                newY: Number(rule.newY || -1)
            };
        });
        const rules = JSON.parse(config.rules || '[]').map(ruleStr => {
            const rule = JSON.parse(ruleStr);
            return {
                variableValue: Number(rule.variableValue || 0),
                compareMode: String(rule.compareMode || 'greaterOrEqual'),
                newMapId: Number(rule.newMapId || 0),
                newX: Number(rule.newX || -1),
                newY: Number(rule.newY || -1)
            };
        });
        // ルールを変数の値の降順（大きい順）でソート
        rules.sort((a, b) => b.variableValue - a.variableValue);
        return {
            watchMapId: Number(config.watchMapId || 0),
            variableId: Number(config.variableId || 0),
            switchRules: switchRules,
            rules: rules
        };
    });

    // 元の場所移動予約の関数を保存
    const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
        // 変更後の値を保持する変数を用意
        let newMapId = mapId;
        let newX = x;
        let newY = y;

        // 監視対象のマップIDに一致する設定を探す
        const config = watchConfigs.find(c => c.watchMapId === newMapId);

        if (config) {
            const switchRule = config.switchRules.find(rule => {
                if (rule.switchId <= 0) {
                    return false;
                }
                const value = $gameSwitches.value(rule.switchId);
                const state = rule.state || 'on';
                return state === 'off' ? !value : value;
            });
            if (switchRule) {
                newMapId = switchRule.newMapId;
                if (switchRule.newX !== -1) {
                    newX = switchRule.newX;
                }
                if (switchRule.newY !== -1) {
                    newY = switchRule.newY;
                }
            } else if (config.variableId > 0) {
                const progress = $gameVariables.value(config.variableId);

                // 適用されるルールを探す（ソート済みなので最初に見つかったものが正解）
                for (const rule of config.rules) {
                    const mode = rule.compareMode || 'greaterOrEqual';
                    const ok = mode === 'lessOrEqual'
                        ? progress <= rule.variableValue
                        : progress >= rule.variableValue;
                    if (ok) {
                        // ルールが適用されたら、移動先情報を上書き
                        newMapId = rule.newMapId;
                        // X,Y座標が-1でなければ上書きする
                        if (rule.newX !== -1) {
                            newX = rule.newX;
                        }
                        if (rule.newY !== -1) {
                            newY = rule.newY;
                        }
                        // 一致するルールが見つかったらループを抜ける
                        break;
                    }
                }
            }
        }

        // 最終的に決まった移動先情報で、元の関数を呼び出す
        _Game_Player_reserveTransfer.call(this, newMapId, newX, newY, d, fadeType);
    };

})();