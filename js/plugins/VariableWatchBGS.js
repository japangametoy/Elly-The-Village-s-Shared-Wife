//=============================================================================
// VariableWatchBGS.js
//=============================================================================

/*:
 * @plugindesc 変数監視BGS自動再生プラグイン
 * @target MZ
 * @base Triacontane/SimpleVoice_modified
 * @orderAfter Triacontane/SimpleVoice_modified
 *
 * @param variableId1
 * @text 監視変数1のID
 * @desc 監視する変数1のID
 * @default 1
 * @type variable
 *
 * @param variableId2
 * @text 監視変数2のID
 * @desc 監視する変数2のID（0で無視）
 * @default 2
 * @type variable
 *
 * @param variableId3
 * @text 監視変数3のID
 * @desc 監視する変数3のID（0で無視）
 * @default 3
 * @type variable
 *
 * @param decayRate
 * @text 距離減衰率（%）
 * @desc 距離1マスごとの音量減衰率。85なら1マスごとに85%に減衰。
 * @default 85
 * @type number
 * @min 1
 * @max 99
 *
 * @param cutoffVolume
 * @text カットオフ音量（%）
 * @desc この音量以下になったらミュートにする閾値。
 * @default 1
 * @type number
 * @min 0
 * @max 50
 *
 * @help VariableWatchBGS.js
 *
 * 指定した変数の組み合わせを監視し、条件を満たしたときに
 * イベント位置からBGSを自動再生します。
 * 条件から外れたら自動的に停止します。
 *
 * ■使い方
 * 1. プラグイン設定で監視する変数1,2,3のIDを設定
 * 2. マップ上のイベントに「並列処理」でプラグインコマンドを配置
 * 3. 「BGS条件登録」コマンドで条件値とBGS設定を登録
 *    - 条件値は「2,0,1」のようにカンマ区切りで入力
 * 4. 条件を満たすと自動的にそのイベント位置からBGSが再生される
 * 5. 条件から外れると自動的に停止
 *
 * ■複数条件の設定
 * 同じイベント内に複数の「BGS条件登録」コマンドを配置できます。
 * 各コマンドには異なるチャンネル番号を指定してください。
 *
 * ■標準BGS機能（ParallelBgs.js連携）
 * 「標準BGS条件登録（ライン2）」コマンドを使用すると、
 * SimpleVoice_modifiedのボイスチャンネルではなく、
 * RPGツクールMZの標準BGS機能（ParallelBgs.jsのライン2）を使用して
 * BGSを再生できます。
 * 
 * - 複数の条件を登録可能（条件IDで識別）
 * - 条件を満たすものが見つかると自動的にBGSを再生
 * - 条件から外れると自動的に停止
 * - ライン番号は2固定（ライン1は通常のBGS用に空けておく）
 *
 * ■注意
 * - SimpleVoice_modified.js が必要です（先に読み込んでください）
 * - ParallelBgs.js が必要です（標準BGS機能を使用する場合）
 * - マップ移動時は自動的にリセットされます
 *
 * @command RegisterBGSCondition
 * @text BGS条件登録
 * @desc 変数条件とBGS設定を登録します。条件を満たすとイベント位置からBGSを再生。
 *
 * @arg conditionValues
 * @text 条件値（カンマ区切り）
 * @desc 変数1,2,3の条件値をカンマ区切りで入力（例: 2,0,1）
 * @default 0,0,0
 * @type string
 *
 * @arg channel
 * @text チャンネル番号
 * @desc BGSのチャンネル番号（条件ごとに異なる番号を指定）
 * @default 1
 * @type number
 * @min 1
 *
 * @arg name
 * @text SEファイル名
 * @desc 再生するSEファイル
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc BGSの音量
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @arg pitch
 * @text ピッチ
 * @desc BGSのピッチ
 * @default 100
 * @type number
 *
 * @arg loop
 * @text ループ
 * @desc ループ再生するか
 * @default true
 * @type boolean
 *
 * @arg adjustBgmVolume
 * @text BGM音量を下げる
 * @desc BGS再生中にBGM音量を下げるか
 * @default true
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量(%)
 * @desc BGS再生中のBGM音量（%）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command RegisterSpecificVariableWatch
 * @text 任意変数BGS条件登録
 * @desc 指定した変数を監視してBGSを再生します。条件は比較演算子で指定可能。
 *
 * @arg variableList
 * @text 複数条件リスト
 * @desc 複数の変数条件を指定します（AND条件）。
 * @type struct<VariableCondition>[]
 * @default []
 *
 * @arg variableId
 * @text 監視する変数ID
 * @desc 監視対象の変数ID
 * @default 1
 * @type variable
 *
 * @arg comparison
 * @text 比較演算子
 * @desc 変数値の比較条件
 * @default equal
 * @type select
 * @option 等しい (=)
 * @value equal
 * @option 以上 (>=)
 * @value greaterEqual
 * @option 以下 (<=)
 * @value lessEqual
 * @option より大きい (>)
 * @value greater
 * @option より小さい (<)
 * @value less
 * @option 等しくない (!=)
 * @value notEqual
 *
 * @arg value
 * @text 条件値
 * @desc 比較対象の値
 * @default 0
 * @type number
 * @min -99999999
 *
 * @arg channel
 * @text チャンネル番号
 * @desc BGSのチャンネル番号
 * @default 1
 * @type number
 * @min 1
 *
 * @arg name
 * @text SEファイル名
 * @desc 再生するSEファイル
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc BGSの音量
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @arg pitch
 * @text ピッチ
 * @desc BGSのピッチ
 * @default 100
 * @type number
 *
 * @arg loop
 * @text ループ
 * @desc ループ再生するか
 * @default true
 * @type boolean
 *
 * @arg adjustBgmVolume
 * @text BGM音量を下げる
 * @desc BGS再生中にBGM音量を下げるか
 * @default true
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量(%)
 * @desc BGS再生中のBGM音量（%）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command RegisterParallelBGSCondition
 * @text 標準BGS条件登録（ライン2）
 * @desc ParallelBgs.jsのライン2を使用してBGSを再生します。複数条件を監視可能。
 *
 * @arg variableList
 * @text 複数条件リスト
 * @desc 複数の変数条件を指定します（AND条件）。
 * @type struct<VariableCondition>[]
 * @default []
 *
 * @arg variableId
 * @text 監視する変数ID
 * @desc 監視対象の変数ID
 * @default 1
 * @type variable
 *
 * @arg comparison
 * @text 比較演算子
 * @desc 変数値の比較条件
 * @default equal
 * @type select
 * @option 等しい (=)
 * @value equal
 * @option 以上 (>=)
 * @value greaterEqual
 * @option 以下 (<=)
 * @value lessEqual
 * @option より大きい (>)
 * @value greater
 * @option より小さい (<)
 * @value less
 * @option 等しくない (!=)
 * @value notEqual
 *
 * @arg value
 * @text 条件値
 * @desc 比較対象の値
 * @default 0
 * @type number
 * @min -99999999
 *
 * @arg conditionId
 * @text 条件ID
 * @desc この条件を識別するための一意のID（同じIDは上書きされます）
 * @default 1
 * @type number
 * @min 1
 *
 * @arg name
 * @text BGSファイル名
 * @desc 再生するBGSファイル
 * @default
 * @type file
 * @dir audio/bgs
 *
 * @arg volume
 * @text 音量
 * @desc BGSの音量
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @arg pitch
 * @text ピッチ
 * @desc BGSのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 位相
 * @desc BGSの位相（左:-100 ～ 右:100）
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @arg adjustBgmVolume
 * @text BGM音量を下げる
 * @desc BGS再生中にBGM音量を下げるか
 * @default false
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量(%)
 * @desc BGS再生中のBGM音量（%）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command RegisterParallelBGSConditionByValues
 * @text 標準BGS条件登録（ライン2・変数123）
 * @desc プラグインパラメータで設定した変数1,2,3の条件値をカンマ区切りで指定してBGSを再生。
 *
 * @arg conditionValues
 * @text 条件値（カンマ区切り）
 * @desc 変数1,2,3の条件値をカンマ区切りで入力（例: 2,0,1）
 * @default 0,0,0
 * @type string
 *
 * @arg conditionId
 * @text 条件ID
 * @desc この条件を識別するための一意のID（同じIDは上書きされます）
 * @default 1
 * @type number
 * @min 1
 *
 * @arg name
 * @text BGSファイル名
 * @desc 再生するBGSファイル
 * @default
 * @type file
 * @dir audio/bgs
 *
 * @arg volume
 * @text 音量
 * @desc BGSの音量
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @arg pitch
 * @text ピッチ
 * @desc BGSのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 位相
 * @desc BGSの位相（左:-100 ～ 右:100）
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @arg adjustBgmVolume
 * @text BGM音量を下げる
 * @desc BGS再生中にBGM音量を下げるか
 * @default false
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量(%)
 * @desc BGS再生中のBGM音量（%）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command ClearParallelBGSConditions
 * @text 標準BGS条件クリア（ライン2）
 * @desc RegisterParallelBGSConditionで登録されたすべての条件をクリアします。
 *
 * @command ClearBGSConditions
 * @text BGS条件クリア
 * @desc このイベントに登録されたBGS条件をすべてクリアします。
 *
 * @command AdjustBGSVolume
 * @text BGS音量調整
 * @desc 指定チャンネルのBGS音量を調整します。フェード機能付き。
 *
 * @arg channel
 * @text チャンネル番号
 * @desc 音量を調整するBGSのチャンネル番号
 * @default 1
 * @type number
 * @min 1
 *
 * @arg targetVolume
 * @text 目標音量
 * @desc 調整後の音量（0-100）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @arg fadeDuration
 * @text フェード時間(秒)
 * @desc 音量変化にかける時間（0で即座に変化）
 * @default 1
 * @type number
 * @decimals 1
 * @min 0
 *
 * @command AdjustVoiceVolume
 * @text ボイス音量調整
 * @desc 指定チャンネルのボイス音量を調整します。フェード機能付き。次回再生時にリセットされます。
 *
 * @arg channel
 * @text チャンネル番号
 * @desc 音量を調整するボイスのチャンネル番号（0で再生中の全チャンネル）
 * @default 0
 * @type number
 * @min 0
 *
 * @arg targetVolume
 * @text 目標音量
 * @desc 調整後の音量（0-100）
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @arg fadeDuration
 * @text フェード時間(秒)
 * @desc 音量変化にかける時間（0で即座に変化）
 * @default 1
 * @type number
 * @decimals 1
 * @min 0
 *
 * @command AdjustParallelBGSVolume
 * @text 標準BGS音量調整（ライン2）
 * @desc 再生中の標準BGS（ライン2）の音量を一時的に変更します。次回再生時にはリセットされます。
 *
 * @arg targetVolume
 * @text 目標音量
 * @desc 調整後の音量（0-100）
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @arg fadeDuration
 * @text フェード時間(秒)
 * @desc 音量変化にかける時間（0で即座に変化）
 * @default 1
 * @type number
 * @decimals 1
 * @min 0
 *
 * @param DebugMode
 * @text デバッグモード
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc コンソールにデバッグログを出力するかどうか
 * @default false
 * @desc コンソールにデバッグログを出力するかどうか
 * @default false
 *
 * @command Dummy
 * @text ダミー
 * @desc これは使用しません
 */

/*~struct~VariableCondition:
 * @param type
 * @text 監視タイプ
 * @desc 監視対象の種類（変数/スイッチ）
 * @default variable
 * @type select
 * @option 変数
 * @value variable
 * @option スイッチ
 * @value switch
 *
 * @param variableId
 * @text 変数ID
 * @desc 監視対象の変数ID（タイプが変数の場合）
 * @type variable
 * @default 1
 *
 * @param comparison
 * @text 比較演算子
 * @desc 変数値の比較条件（タイプが変数の場合）
 * @default equal
 * @type select
 * @option 等しい (=)
 * @value equal
 * @option 以上 (>=)
 * @value greaterEqual
 * @option 以下 (<=)
 * @value lessEqual
 * @option より大きい (>)
 * @value greater
 * @option より小さい (<)
 * @value less
 * @option 等しくない (!=)
 * @value notEqual
 *
 * @param value
 * @text 条件値
 * @desc 比較対象の値（タイプが変数の場合）
 * @default 0
 * @type number
 * @min -99999999
 *
 * @param switchId
 * @text スイッチID
 * @desc 監視対象のスイッチID（タイプがスイッチの場合）
 * @type switch
 * @default 1
 *
 * @param switchValue
 * @text スイッチ状態
 * @desc 期待するスイッチの状態（タイプがスイッチの場合）
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 */

(() => {
    'use strict';

    const pluginName = 'VariableWatchBGS';
    const parameters = PluginManager.parameters(pluginName);
    const variableId1 = Number(parameters['variableId1']) || 1;
    const variableId2 = Number(parameters['variableId2']) || 0;
    const variableId3 = Number(parameters['variableId3']) || 0;
    const decayRate = Number(parameters['decayRate']) || 85;
    const cutoffVolume = Number(parameters['cutoffVolume']) || 1;
    const DEBUG_MODE = parameters['DebugMode'] === 'true';

    // 登録された条件を保持する配列
    let _registeredConditions = [];

    // 前回のマップID（マップ移動検知用）
    let _lastMapId = 0;

    // console.log('[VariableWatchBGS] Plugin initialized v2. VarIDs:', variableId1, variableId2, variableId3);

    // 条件値をパースする関数
    function parseConditionValues(str) {
        const parts = (str || '0,0,0').split(',').map(s => Number(s.trim()) || 0);
        return {
            value1: parts[0] || 0,
            value2: parts[1] || 0,
            value3: parts[2] || 0
        };
    }

    // 変数条件リストをパースする関数
    function parseVariableList(jsonStr) {
        if (!jsonStr) return [];

        try {
            // RMMZの配列パラメータはJSON文字列として渡される
            // 中身も各要素がJSON文字列になっている場合があるため、二重パースが必要なケースがあるが
            // 基本的には parseVariableList(args.variableList) で渡された時点で
            // 配列文字列なので JSON.parse する
            const parsedArray = JSON.parse(jsonStr);

            if (!Array.isArray(parsedArray)) return [];

            return parsedArray.map(itemStr => {
                // 配列の中身もJSON文字列（struct）になっている
                const item = JSON.parse(itemStr);
                return {
                    type: item.type || 'variable', // デフォルトは変数
                    id: Number(item.variableId) || 0,
                    comparison: item.comparison || 'equal',
                    value: Number(item.value) || 0,
                    switchId: Number(item.switchId) || 0,
                    switchValue: item.switchValue === 'true'
                };
            });
        } catch (e) {
            console.error('[VariableWatchBGS] Failed to parse variable list:', e);
            return [];
        }
    }

    // プラグインコマンド: BGS条件登録
    PluginManager.registerCommand(pluginName, 'RegisterBGSCondition', function (args) {
        const mapId = $gameMap.mapId();
        const eventId = this.eventId();
        const channel = Number(args.channel) || 1;

        // 同じマップ・イベント・チャンネルの既存条件を検索
        const existingCondition = _registeredConditions.find(c =>
            c.mapId === mapId && c.eventId === eventId && c.channel === channel
        );

        // 既に登録済みなら何もしない（isPlaying状態を保持）
        if (existingCondition) {
            return;
        }

        // 条件値をパース
        const values = parseConditionValues(args.conditionValues);

        // 新しい条件を登録
        const condition = {
            mapId: mapId,
            eventId: eventId,
            channel: channel,
            value1: values.value1,
            value2: values.value2,
            value3: values.value3,
            name: args.name || '',
            volume: Number(args.volume) || 90,
            pitch: Number(args.pitch) || 100,
            loop: args.loop === 'true' || args.loop === true,
            adjustBgmVolume: args.adjustBgmVolume !== 'false' && args.adjustBgmVolume !== false,
            bgmTargetVolume: (args.bgmTargetVolume !== undefined && args.bgmTargetVolume !== '') ? Number(args.bgmTargetVolume) : 50,
            isPlaying: false
        };

        _registeredConditions.push(condition);
        if (DEBUG_MODE) {
            console.log(`[VariableWatchBGS] Registered: channel=${channel}, event=${eventId}, values=${values.value1},${values.value2},${values.value3}`);
        }
    });

    // プラグインコマンド: 任意変数BGS条件登録
    PluginManager.registerCommand(pluginName, 'RegisterSpecificVariableWatch', function (args) {
        const mapId = $gameMap.mapId();
        const eventId = this.eventId();
        const channel = Number(args.channel) || 1;

        // 同じマップ・イベント・チャンネルの既存条件を検索
        const existingCondition = _registeredConditions.find(c =>
            c.mapId === mapId && c.eventId === eventId && c.channel === channel
        );

        // 既に登録済みなら何もしない（isPlaying状態を保持）
        if (existingCondition) {
            return;
        }

        // 新しい条件を登録
        const condition = {
            mapId: mapId,
            eventId: eventId,
            channel: channel,
            // 新仕様: 個別監視設定
            targetVariableId: Number(args.variableId) || 0,
            comparison: args.comparison || 'equal',
            targetValue: Number(args.value) || 0,
            // 複数条件リスト
            variableList: parseVariableList(args.variableList),

            name: args.name || '',
            volume: Number(args.volume) || 90,
            pitch: Number(args.pitch) || 100,
            loop: args.loop === 'true' || args.loop === true,
            adjustBgmVolume: args.adjustBgmVolume !== 'false' && args.adjustBgmVolume !== false,
            bgmTargetVolume: (args.bgmTargetVolume !== undefined && args.bgmTargetVolume !== '') ? Number(args.bgmTargetVolume) : 50,
            isPlaying: false
        };

        _registeredConditions.push(condition);
        // console.log(`[VariableWatchBGS] Registered Specific: var=${condition.targetVariableId}, cmp=${condition.comparison}, val=${condition.targetValue}`);
    });

    // プラグインコマンド: BGS条件クリア
    PluginManager.registerCommand(pluginName, 'ClearBGSConditions', function (args) {
        const mapId = $gameMap.mapId();
        const eventId = this.eventId();

        // このイベントの条件をすべて削除し、再生中のものは停止
        _registeredConditions.forEach(c => {
            if (c.mapId === mapId && c.eventId === eventId && c.isPlaying) {
                AudioManager.stopVoice(null, c.channel);
            }
        });

        _registeredConditions = _registeredConditions.filter(c =>
            !(c.mapId === mapId && c.eventId === eventId)
        );
    });

    // ===== ParallelBgs.js連携用機能（ライン番号2固定） =====

    // ParallelBGS条件を保持する配列
    let _parallelBgsConditions = [];

    // ParallelBGS用のBGSライン番号（固定値）
    const PARALLEL_BGS_LINE = 2;

    // 現在ParallelBGSで再生中かどうかのフラグ
    let _isParallelBgsPlaying = false;

    // 現在再生中のParallelBGS条件
    let _currentPlayingCondition = null;

    // 音量オーバーライド情報
    let _parallelVolumeOverride = {
        active: false,
        currentVolume: 0,
        targetVolume: 0,
        duration: 0,
        elapsed: 0
    };

    // プラグインコマンド: 標準BGS条件登録（ライン2）
    PluginManager.registerCommand(pluginName, 'RegisterParallelBGSCondition', function (args) {
        const conditionId = Number(args.conditionId) || 1;
        const mapId = $gameMap.mapId();
        const eventId = this.eventId();

        // 同じ条件IDの既存条件を検索
        const existingIndex = _parallelBgsConditions.findIndex(c => c.conditionId === conditionId);

        // 既に登録済みなら何もしない（再登録防止）
        if (existingIndex >= 0) {
            return;
        }

        // 新しい条件を登録
        const condition = {
            conditionId: conditionId,
            mapId: mapId,
            eventId: eventId,
            targetVariableId: Number(args.variableId) || 0,
            comparison: args.comparison || 'equal',
            targetValue: Number(args.value) || 0,
            // 複数条件リスト
            variableList: parseVariableList(args.variableList),
            name: args.name || '',
            volume: Number(args.volume) || 90,
            pitch: Number(args.pitch) || 100,
            pan: Number(args.pan) || 0,
            adjustBgmVolume: args.adjustBgmVolume === 'true' || args.adjustBgmVolume === true,
            bgmTargetVolume: (args.bgmTargetVolume !== undefined && args.bgmTargetVolume !== '') ? Number(args.bgmTargetVolume) : 50,
            isPlaying: false
        };

        _parallelBgsConditions.push(condition);
        // console.log(`[VariableWatchBGS] ParallelBGS Registered: id=${conditionId}, var=${condition.targetVariableId}`);
    });

    // プラグインコマンド: 標準BGS条件登録（ライン2・変数123）
    PluginManager.registerCommand(pluginName, 'RegisterParallelBGSConditionByValues', function (args) {
        const conditionId = Number(args.conditionId) || 1;
        const mapId = $gameMap.mapId();
        const eventId = this.eventId();

        // 同じ条件IDの既存条件を検索
        const existingIndex = _parallelBgsConditions.findIndex(c => c.conditionId === conditionId);

        // 既に登録済みなら何もしない（再登録防止）
        if (existingIndex >= 0) {
            return;
        }

        // 条件値をパース
        const values = parseConditionValues(args.conditionValues);

        // 新しい条件を登録（変数123モード）
        const condition = {
            conditionId: conditionId,
            mapId: mapId,
            eventId: eventId,
            // 変数123モードのフラグ
            useVariables123: true,
            value1: values.value1,
            value2: values.value2,
            value3: values.value3,
            name: args.name || '',
            volume: Number(args.volume) || 90,
            pitch: Number(args.pitch) || 100,
            pan: Number(args.pan) || 0,
            adjustBgmVolume: args.adjustBgmVolume === 'true' || args.adjustBgmVolume === true,
            bgmTargetVolume: (args.bgmTargetVolume !== undefined && args.bgmTargetVolume !== '') ? Number(args.bgmTargetVolume) : 50,
            isPlaying: false
        };

        _parallelBgsConditions.push(condition);
        // console.log(`[VariableWatchBGS] ParallelBGS Registered (Values123): id=${conditionId}, values=${values.value1},${values.value2},${values.value3}`);
    });

    // プラグインコマンド: 標準BGS条件クリア（ライン2）
    PluginManager.registerCommand(pluginName, 'ClearParallelBGSConditions', function (args) {
        // 再生中のBGSを停止
        if (_isParallelBgsPlaying) {
            stopParallelBgs();
        }

        // すべての条件をクリア
        _parallelBgsConditions = [];
        // console.log(`[VariableWatchBGS] ParallelBGS conditions cleared`);
    });

    // プラグインコマンド: 標準BGS音量調整（ライン2）
    PluginManager.registerCommand(pluginName, 'AdjustParallelBGSVolume', function (args) {
        if (!_isParallelBgsPlaying) return;

        const targetVolume = Number(args.targetVolume) || 0;
        const fadeDuration = Number(args.fadeDuration) || 0;

        // 現在の音量を取得（オーバーライド中ならその値、そうでなければ現在のBGS音量）
        let startVolume;
        if (_parallelVolumeOverride.active) {
            startVolume = _parallelVolumeOverride.currentVolume;
        } else {
            // 現在の計算済み音量（距離減衰込み）を起点にする
            startVolume = AudioManager._currentBgs ? AudioManager._currentBgs.volume : (_currentPlayingCondition ? _currentPlayingCondition.volume : 90);
        }

        _parallelVolumeOverride = {
            active: true,
            startVolume: startVolume,
            currentVolume: startVolume,
            targetVolume: targetVolume,
            duration: fadeDuration * 60, // フレーム換算
            elapsed: 0
        };
    });

    // ParallelBGS条件をチェックする関数
    function checkParallelBgsCondition(condition) {
        // 変数123モードの場合
        if (condition.useVariables123) {
            // 既存のcheckConditionと同じロジック（プラグインパラメータで指定された3変数を監視）
            // 変数1をチェック
            if (variableId1 > 0) {
                if ($gameVariables.value(variableId1) !== condition.value1) {
                    return false;
                }
            }
            // 変数2をチェック（ID設定されている場合のみ）
            if (variableId2 > 0) {
                if ($gameVariables.value(variableId2) !== condition.value2) {
                    return false;
                }
            }
            // 変数3をチェック（ID設定されている場合のみ）
            if (variableId3 > 0) {
                if ($gameVariables.value(variableId3) !== condition.value3) {
                    return false;
                }
            }
            return true;
        }

        // 単一変数モードの場合
        if (!condition.targetVariableId || condition.targetVariableId <= 0) {
            // targetVariableIdがない場合でもvariableListがあれば判定続行
            if (!condition.variableList || condition.variableList.length === 0) {
                return false;
            }
        }

        // 複数条件リストがある場合はそちらを優先チェック（AND条件）
        if (condition.variableList && condition.variableList.length > 0) {
            for (const cond of condition.variableList) {
                let matched = false;

                if (cond.type === 'switch') {
                    // スイッチ監視
                    const val = $gameSwitches.value(cond.switchId);
                    matched = (val === cond.switchValue);
                } else {
                    // 変数監視 (デフォルト)
                    const val = $gameVariables.value(cond.id);
                    const target = cond.value;

                    switch (cond.comparison) {
                        case 'equal': matched = (val === target); break;
                        case 'greaterEqual': matched = (val >= target); break;
                        case 'lessEqual': matched = (val <= target); break;
                        case 'greater': matched = (val > target); break;
                        case 'less': matched = (val < target); break;
                        case 'notEqual': matched = (val !== target); break;
                        default: matched = (val === target); break;
                    }
                }

                if (!matched) return false;
            }
            // リストの条件を全て満たした
            return true;
        }

        const val = $gameVariables.value(condition.targetVariableId);
        const target = condition.targetValue;

        switch (condition.comparison) {
            case 'equal': return val === target;
            case 'greaterEqual': return val >= target;
            case 'lessEqual': return val <= target;
            case 'greater': return val > target;
            case 'less': return val < target;
            case 'notEqual': return val !== target;
            default: return val === target;
        }
    }

    // ParallelBGSを再生する関数
    function playParallelBgs(condition) {
        if (!condition.name) return;

        // ParallelBgs.jsのライン2に切り替え
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(PARALLEL_BGS_LINE);
        }

        const bgs = {
            name: condition.name,
            volume: condition.volume,
            pitch: condition.pitch,
            pan: condition.pan
        };

        AudioManager.playBgs(bgs);
        condition.isPlaying = true;
        _isParallelBgsPlaying = true;
        _currentPlayingCondition = condition; // 現在再生中の条件を保存

        // BGM音量調整（SimpleVoice_modified.jsと同じ仕組みを使用）
        if (condition.adjustBgmVolume && AudioManager.increaseBgmAdjustmentRequest) {
            AudioManager.increaseBgmAdjustmentRequest(condition.bgmTargetVolume);
        }

        // ▼ 修正: 再生命令後はラインを1に戻しておく（他のプラグインへの影響を最小限に）
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(1);
        }

        // オーバーライド情報をリセット
        _parallelVolumeOverride.active = false;

        // console.log(`[VariableWatchBGS] ParallelBGS Playing: ${condition.name}`);
    }

    // ParallelBGSを停止する関数
    function stopParallelBgs() {
        // BGM音量を元に戻す（先に実行）
        if (_currentPlayingCondition && _currentPlayingCondition.adjustBgmVolume && AudioManager.decreaseBgmAdjustmentRequest) {
            AudioManager.decreaseBgmAdjustmentRequest();
        }

        // ParallelBgs.jsのライン2に切り替え
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(PARALLEL_BGS_LINE);
        }

        AudioManager.stopBgs();

        // すべてのParallelBGS条件のisPlayingをリセット
        _parallelBgsConditions.forEach(c => {
            c.isPlaying = false;
        });
        _isParallelBgsPlaying = false;
        _currentPlayingCondition = null; // 現在再生中の条件をクリア

        // ▼ 修正: 停止後はラインを1に戻しておく
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(1);
        }

        // オーバーライド情報をリセット
        _parallelVolumeOverride.active = false;

        // console.log(`[VariableWatchBGS] ParallelBGS Stopped`);
    }

    // 距離に応じてBGS音量を計算する関数
    function calculateDistanceVolume(condition) {
        if (!condition || !condition.eventId || !$gameMap || !$gamePlayer) {
            return condition ? condition.volume : 0;
        }

        const sourceEvent = $gameMap.event(condition.eventId);
        if (!sourceEvent) {
            return condition.volume;
        }

        const listenerX = $gamePlayer._realX;
        const listenerY = $gamePlayer._realY;
        const sourceX = sourceEvent._realX;
        const sourceY = sourceEvent._realY;

        const dx = $gameMap.deltaX(sourceX, listenerX);
        const dy = $gameMap.deltaY(sourceY, listenerY);
        const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));

        let volumeRate = 1.0;
        if (distance > 1) {
            const decayFactor = Math.max(0.01, decayRate / 100);
            volumeRate = Math.pow(decayFactor, distance - 1);
        }

        const baseVolume = condition.volume;
        let finalVolume = baseVolume * volumeRate;

        if (finalVolume < cutoffVolume) {
            finalVolume = 0;
        }

        // パンの計算（距離に応じて左右に振る）
        const panFactor = 10;
        const finalPan = Math.max(-100, Math.min(100, dx * panFactor));

        return {
            volume: Math.round(Math.max(0, Math.min(100, finalVolume))),
            pan: Math.round(finalPan)
        };
    }

    // ParallelBGSの音量を更新する関数
    function updateParallelBgsVolume() {
        if (!_isParallelBgsPlaying || !_currentPlayingCondition) return;

        let finalVolume;
        let finalPan;

        // オーバーライド処理
        if (_parallelVolumeOverride.active) {
            if (_parallelVolumeOverride.duration > 0 && _parallelVolumeOverride.elapsed < _parallelVolumeOverride.duration) {
                _parallelVolumeOverride.elapsed++;
                const progress = _parallelVolumeOverride.elapsed / _parallelVolumeOverride.duration;
                // イージング
                const easedProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                _parallelVolumeOverride.currentVolume = _parallelVolumeOverride.startVolume + (_parallelVolumeOverride.targetVolume - _parallelVolumeOverride.startVolume) * easedProgress;
            } else if (_parallelVolumeOverride.duration > 0 && _parallelVolumeOverride.elapsed >= _parallelVolumeOverride.duration) {
                _parallelVolumeOverride.currentVolume = _parallelVolumeOverride.targetVolume;
            } else if (_parallelVolumeOverride.duration === 0) {
                _parallelVolumeOverride.currentVolume = _parallelVolumeOverride.targetVolume;
            }

            finalVolume = Math.round(_parallelVolumeOverride.currentVolume);

            // オーバーライド中でもパンは距離依存を維持するか？
            // ユーザー要件は「音量」のみだが、パンも継続計算したほうが自然。
            // ただし、もしパンも含めて制御したい場合は別途要望があるはず。
            // ここではパンは通常通り距離計算の結果を使うことにする。
            const distData = calculateDistanceVolume(_currentPlayingCondition);
            finalPan = distData.pan;

        } else {
            // 通常の距離計算
            const volumeData = calculateDistanceVolume(_currentPlayingCondition);
            finalVolume = volumeData.volume;
            finalPan = volumeData.pan;
        }

        // ParallelBgs.jsのライン2に切り替えてBGSパラメータを更新
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(PARALLEL_BGS_LINE);
        }

        // AudioManager._currentBgsを更新
        // 注意: AudioManager._currentBgs は現在再生中のBGS（ラインごとに保持されていないので、ライン切り替えが必要）
        // ParallelBgs.js を使っている場合、Line切り替え後に AudioManager.updateBgsParameters を呼ぶと
        // そのラインのバッファに対して音量変更が適用されるはず。

        if (AudioManager._currentBgs) {
            // volumeは0-100に制限
            AudioManager._currentBgs.volume = Math.max(0, Math.min(100, finalVolume));
            AudioManager._currentBgs.pan = finalPan;
            AudioManager.updateBgsParameters(AudioManager._currentBgs);
        }

        // ▼ 修正: 更新後はラインを1に戻しておく（他のプラグインへの影響を最小限に）
        if ($gameSystem && $gameSystem.setBgsLine) {
            $gameSystem.setBgsLine(1);
        }
    }

    // ParallelBGS条件の更新処理
    function updateParallelBgsConditions() {
        if (_parallelBgsConditions.length === 0) return;

        // 条件を満たしているものを探す（優先度: 配列順）
        let foundMatchingCondition = null;
        for (const condition of _parallelBgsConditions) {
            if (checkParallelBgsCondition(condition)) {
                foundMatchingCondition = condition;
                break;
            }
        }

        if (foundMatchingCondition) {
            // 条件を満たしているものがある
            if (!foundMatchingCondition.isPlaying) {
                // 別のBGSが再生中なら停止してから新しいものを再生
                if (_isParallelBgsPlaying) {
                    stopParallelBgs();
                }
                playParallelBgs(foundMatchingCondition);
            }
            // 距離に応じた音量調整（毎フレーム実行）
            updateParallelBgsVolume();
        } else {
            // 条件を満たすものがない場合は停止
            if (_isParallelBgsPlaying) {
                stopParallelBgs();
            }
        }
    }

    // 音量フェード中の情報を保持する配列
    // { channel, startVolume, targetVolume, duration, elapsed }
    let _volumeFades = [];

    // プラグインコマンド: BGS音量調整 (AdjustBGSVolume)
    PluginManager.registerCommand(pluginName, 'AdjustBGSVolume', function (args) {
        adjustVoiceVolume(args);
    });

    // プラグインコマンド: ボイス音量調整 (AdjustVoiceVolume)
    PluginManager.registerCommand(pluginName, 'AdjustVoiceVolume', function (args) {
        adjustVoiceVolume(args);
    });

    // 共通の音量調整処理
    function adjustVoiceVolume(args) {
        const channel = Number(args.channel) || 0;
        const targetVolume = (args.targetVolume !== undefined && args.targetVolume !== '') ? Number(args.targetVolume) : 50;
        const fadeDuration = Number(args.fadeDuration) || 0;

        // 調整対象のバッファリスト
        let targetBuffers = [];

        if (channel > 0) {
            // 特定チャンネル指定
            const buffer = AudioManager._voiceBuffers.find(b => b.channel === channel);
            if (buffer) targetBuffers.push(buffer);
        } else {
            // チャンネル0 = 自動（再生中の全チャンネル）
            // 再生中かつ準備完了しているすべてのバッファを対象
            if (AudioManager._voiceBuffers) {
                targetBuffers = AudioManager._voiceBuffers.filter(b => b.isReady() && b.isPlaying());
            }
        }

        if (targetBuffers.length === 0) {
            // console.log(`[VariableWatchBGS] No active buffers found for channel ${channel}`);
            return;
        }

        targetBuffers.forEach(buffer => {
            // 現在の音量を取得（_originalVolumeから計算）
            const currentVolume = buffer._originalVolume || 90;

            if (fadeDuration <= 0) {
                // 即座に音量変更
                buffer._originalVolume = targetVolume;
                // gainNodeの更新はSimpleVoiceのupdateループ（距離減衰計算含む）に任せる
            } else {
                // フェード情報を登録
                _volumeFades = _volumeFades.filter(f => f.channel !== buffer.channel);
                _volumeFades.push({
                    channel: buffer.channel,
                    startVolume: currentVolume,
                    targetVolume: targetVolume,
                    duration: fadeDuration * 60, // 秒をフレームに変換
                    elapsed: 0
                });
            }
        });
    }

    // 音量フェードの更新処理
    function updateVolumeFades() {
        if (_volumeFades.length === 0) return;

        _volumeFades = _volumeFades.filter(fade => {
            const buffer = AudioManager._voiceBuffers.find(b => b.channel === fade.channel);
            if (!buffer) return false; // バッファがなくなったらフェード終了

            fade.elapsed++;
            const progress = Math.min(fade.elapsed / fade.duration, 1);

            // イージング（スムーズに）
            const easedProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const currentVolume = fade.startVolume + (fade.targetVolume - fade.startVolume) * easedProgress;
            buffer._originalVolume = currentVolume;

            // gainNodeの更新はSimpleVoiceのupdateループ（距離減衰計算含む）に任せる

            // フェード完了したら削除
            return progress < 1;
        });
    }

    // 条件チェック関数
    function checkCondition(condition) {
        // 1. 新仕様: 特定変数ID指定モード (または複数変数リストモード)
        if (condition.targetVariableId > 0 || (condition.variableList && condition.variableList.length > 0)) {

            // 複数条件リストがある場合はそちらを優先チェック（AND条件）
            if (condition.variableList && condition.variableList.length > 0) {
                for (const cond of condition.variableList) {
                    let matched = false;

                    if (cond.type === 'switch') {
                        // スイッチ監視
                        const val = $gameSwitches.value(cond.switchId);
                        matched = (val === cond.switchValue);
                    } else {
                        // 変数監視 (デフォルト)
                        const val = $gameVariables.value(cond.id);
                        const target = cond.value;

                        switch (cond.comparison) {
                            case 'equal': matched = (val === target); break;
                            case 'greaterEqual': matched = (val >= target); break;
                            case 'lessEqual': matched = (val <= target); break;
                            case 'greater': matched = (val > target); break;
                            case 'less': matched = (val < target); break;
                            case 'notEqual': matched = (val !== target); break;
                            default: matched = (val === target); break;
                        }
                    }

                    if (!matched) return false;
                }
                // リストの条件を全て満たした
                return true;
            }

            // 単一変数チェック（フォールバック）
            if (condition.targetVariableId > 0) {
                const val = $gameVariables.value(condition.targetVariableId);
                const target = condition.targetValue;

                switch (condition.comparison) {
                    case 'equal': return val === target;
                    case 'greaterEqual': return val >= target;
                    case 'lessEqual': return val <= target;
                    case 'greater': return val > target;
                    case 'less': return val < target;
                    case 'notEqual': return val !== target;
                    default: return val === target;
                }
            }
        }

        // 2. 旧仕様: プラグインパラメータで指定された3変数を監視
        // 変数1をチェック
        if (variableId1 > 0) {
            if ($gameVariables.value(variableId1) !== condition.value1) {
                return false;
            }
        }
        // 変数2をチェック（ID設定されている場合のみ）
        if (variableId2 > 0) {
            if ($gameVariables.value(variableId2) !== condition.value2) {
                return false;
            }
        }
        // 変数3をチェック（ID設定されている場合のみ）
        if (variableId3 > 0) {
            if ($gameVariables.value(variableId3) !== condition.value3) {
                return false;
            }
        }
        return true;
    }

    // BGS再生
    function playConditionBGS(condition) {
        if (!condition.name) return;

        const voiceArgs = {
            name: condition.name,
            volume: condition.volume,
            pitch: condition.pitch,
            pan: 0,
            adjustBgmVolume: condition.adjustBgmVolume,
            bgmTargetVolume: condition.bgmTargetVolume
        };

        // SimpleVoice_modified.jsのplayVoiceを呼び出し
        if (DEBUG_MODE) {
            console.log(`[VariableWatchBGS] Calling AudioManager.playVoice: channel=${condition.channel}, name=${condition.name}, event=${condition.eventId}`);
        }
        AudioManager.playVoice(voiceArgs, condition.loop, condition.channel, condition.eventId);
        condition.isPlaying = true;
        // console.log(`[VariableWatchBGS] Playing: channel=${condition.channel}, name=${condition.name}`);
    }

    // BGS停止
    function stopConditionBGS(condition) {
        if (DEBUG_MODE) {
            console.log(`[VariableWatchBGS] Stopping voice: channel=${condition.channel}, event=${condition.eventId}, reason=NotMet`);
        }
        AudioManager.stopVoice(null, condition.channel);
        condition.isPlaying = false;
        // console.log(`[VariableWatchBGS] Stopping: channel=${condition.channel}`);
    }

    // 全条件の更新処理
    function updateAllConditions() {
        const currentMapId = $gameMap.mapId();

        // マップ移動直後の初回更新でリセット漏れがないか確認
        if (_lastMapId !== currentMapId) {
            // console.log(`[VariableWatchBGS] Map changed: ${_lastMapId} -> ${currentMapId}`);
            _registeredConditions.forEach(c => {
                // マップが変わったら強制的にisPlayingをfalseに
                c.isPlaying = false;
            });
            _lastMapId = currentMapId;
            // console.log(`[VariableWatchBGS] Total conditions: ${_registeredConditions.length}`);
        }

        // 現在のマップの条件のみ処理
        const currentMapConditions = _registeredConditions.filter(c => c.mapId === currentMapId);

        // デバッグ: 現在の登録条件リストを1回だけ表示（数が変わった時など）
        // ここでは簡易的に、毎フレームチェックして channel 2 が含まれていればログを出す（頻度制限付き）
        if (Graphics.frameCount % 60 === 0) {
            const ch2 = currentMapConditions.filter(c => c.channel === 2);
            if (ch2.length > 0) {
                // console.log(`[VariableWatchBGS] Frame ${Graphics.frameCount}: Channel 2 conditions: ${ch2.length}`, ch2.map(c => `Ev${c.eventId}`));
            }
        }

        currentMapConditions.forEach(condition => {
            const meetsCondition = checkCondition(condition);

            // 実際にAudioManagerで再生されているかチェック（チャンネル使用状況）
            const activeBufferOnChannel = AudioManager._voiceBuffers && AudioManager._voiceBuffers.find(buffer =>
                buffer.channel === condition.channel && (buffer.isPlaying() || !buffer.isReady())
            );
            // 誰かが再生しているか
            const isActuallyPlaying = !!activeBufferOnChannel;

            if (meetsCondition) {
                // 条件を満たしているが、実際には再生されていない場合（マップ移動後など）
                if (!isActuallyPlaying) {
                    playConditionBGS(condition);
                } else if (!condition.isPlaying) {
                    // 条件満たす＆実際再生中
                    // もし再生しているのが自分ならフラグを復帰
                    if (activeBufferOnChannel && activeBufferOnChannel._sourceEventId === condition.eventId) {
                        condition.isPlaying = true;
                    }
                }
            } else {
                // 条件を満たさなくなった
                // 停止すべきか判定：自分が再生している場合のみ停止する
                // 他のイベントが同じチャンネルを使っている場合は干渉しない
                const isPlayingMySound = activeBufferOnChannel && activeBufferOnChannel._sourceEventId === condition.eventId;

                if (isPlayingMySound || condition.isPlaying) {
                    stopConditionBGS(condition);
                }
            }
        });
    }

    // Game_Map.updateにフック
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _Game_Map_update.apply(this, arguments);
        if (sceneActive) {
            updateAllConditions();
            updateParallelBgsConditions(); // ParallelBGS条件の更新
            updateVolumeFades(); // 音量フェードの更新
        }
    };

    // マップ移動時に条件リストの再生状態をリセット
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        // 移動前のマップの条件の再生状態をリセット
        const oldMapId = $gameMap.mapId();
        // console.log(`[VariableWatchBGS] Map Transfer Start. Old Map: ${oldMapId}`);
        _registeredConditions.forEach(c => {
            // 前のマップの条件は再生終了フラグを立てる
            if (c.mapId === oldMapId) {
                c.isPlaying = false;
                // console.log(`[VariableWatchBGS] Resetting isPlaying for Map ${c.mapId}, Channel ${c.channel}`);
            }
        });

        // ParallelBGS: BGM音量調整をリセット（マップ移動前に実行）
        if (_currentPlayingCondition && _currentPlayingCondition.adjustBgmVolume && AudioManager.decreaseBgmAdjustmentRequest) {
            AudioManager.decreaseBgmAdjustmentRequest();
        }

        // 再生中のParallelBGSを停止 (ライン2)
        if (_isParallelBgsPlaying) {
            // stopParallelBgs() は _parallelBgsConditions を使うため、ここでは手動で停止
            if ($gameSystem && typeof $gameSystem.setBgsLine === 'function') {
                $gameSystem.setBgsLine(PARALLEL_BGS_LINE);
                AudioManager.stopBgs();
                // ラインを1に戻しておく（MapBgmManagerなどへの影響を最小限に）
                $gameSystem.setBgsLine(1);
            }
        }

        // ParallelBGS条件を完全にクリア（マップ移動時は再登録が必要）
        _parallelBgsConditions = [];
        _isParallelBgsPlaying = false;
        _currentPlayingCondition = null;

        // オーバーライド情報をリセット
        _parallelVolumeOverride.active = false;

        _Game_Player_performTransfer.apply(this, arguments);
    };

    // イベントページ設定時のリセット（ページ切り替え対策）
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
        // ページが切り替わるタイミングで、このイベントが登録した条件をクリアする
        if (this._eventId) {
            const mapId = $gameMap.mapId();
            const eventId = this._eventId;

            if (DEBUG_MODE) {
                console.log(`[VariableWatchBGS] setupPage for Event ${eventId}, PageIndex: ${this._pageIndex}`);
            }

            // 1. 通常BGS条件のクリア
            // 再生中のものがあれば停止
            let stoppedCount = 0;
            _registeredConditions.forEach(c => {
                if (c.mapId === mapId && c.eventId === eventId && c.isPlaying) {
                    if (DEBUG_MODE) {
                        console.log(`[VariableWatchBGS] force stop due to setupPage: channel=${c.channel}`);
                    }
                    AudioManager.stopVoice(null, c.channel);
                    stoppedCount++;
                }
            });
            // リストから削除
            const prevLen = _registeredConditions.length;
            _registeredConditions = _registeredConditions.filter(c =>
                !(c.mapId === mapId && c.eventId === eventId)
            );
            if (_registeredConditions.length !== prevLen) {
                if (DEBUG_MODE) {
                    console.log(`[VariableWatchBGS] Removed ${prevLen - _registeredConditions.length} conditions`);
                }
            }

            // 2. ParallelBGS条件のクリア
            // リストから削除（停止は次フレームのupdateParallelBgsConditionsで判定される）
            _parallelBgsConditions = _parallelBgsConditions.filter(c =>
                !(c.mapId === mapId && c.eventId === eventId)
            );
        }

        _Game_Event_setupPage.apply(this, arguments);
    };

    // シーン開始時のリセット（ロード後など）
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.apply(this, arguments);
        const currentMapId = $gameMap.mapId();
        // console.log(`[VariableWatchBGS] Scene Map Start. Current Map: ${currentMapId}, lastMapId: ${_lastMapId}`);

        // 現在マップの条件のisPlayingをリセット（マップ移動後やロード後は必ず再生停止しているため）
        _registeredConditions.forEach(c => {
            if (c.mapId === currentMapId) {
                c.isPlaying = false;
            }
        });

        // メニュー等から戻ってきた場合はリセットしない
        const prevSceneClass = SceneManager._previousSceneClass;
        if (prevSceneClass && (
            prevSceneClass.name === 'Scene_Menu' ||
            prevSceneClass.name === 'Scene_Options' ||
            prevSceneClass.name === 'Scene_Mymenu' ||
            prevSceneClass.name === 'Scene_Save' ||
            prevSceneClass.name === 'Scene_Load' || // Loadしても同じマップなら維持したい？いやLoadは通常リセットだが、Scene_Loadから戻る＝キャンセル時
            prevSceneClass.name === 'Scene_Shop' ||
            prevSceneClass.name === 'Scene_Name' ||
            prevSceneClass.name === 'Scene_TextLog' ||
            prevSceneClass.name === 'Scene_FastTravel' ||
            prevSceneClass.name === 'Scene_TimeWait' ||
            prevSceneClass.name === 'Scene_Debug'
        )) {
            // console.log(`[VariableWatchBGS] Scene_Map.start: Returning from ${prevSceneClass.name}, skipping reset.`);
            return;
        }

        // ParallelBGS: BGM音量調整をリセット
        if (_currentPlayingCondition && _currentPlayingCondition.adjustBgmVolume && AudioManager.decreaseBgmAdjustmentRequest) {
            AudioManager.decreaseBgmAdjustmentRequest();
        }

        // ParallelBGS条件を完全にクリア
        _parallelBgsConditions = [];
        _isParallelBgsPlaying = false;
        _currentPlayingCondition = null;

        // オーバーライド情報をリセット
        _parallelVolumeOverride.active = false;

        // _lastMapId は updateAllConditions で更新するので、ここでは更新しない
    };

})();
