/*:
 * @target MZ
 * @plugindesc マップ選択式ファストトラベル機能を実装します。
 *
 * @command startFastTravel
 * @text ファストトラベル開始
 * @desc マップ選択画面を開きます。
 *
 * @command showAllSpotsDebug
 * @text 全スポット表示(デバッグ)
 * @desc 全スポットにヒロイン画像を表示した状態でシーンを開きます。
 *
 * @param BackgroundImage
 * @text 通常背景画像
 * @type file
 * @dir img/pictures
 * @desc マップ選択画面に表示する通常時の背景画像。
 * @default MapBg
 *
 * @param AltBackgroundImage
 * @text 進行背景画像
 * @type file
 * @dir img/pictures
 * @desc 条件を満たした際に切り替える背景画像。未指定で切替無効。
 *
 * @param AltBackgroundVariableId
 * @text 背景切替判定変数
 * @type variable
 * @desc この変数の値が閾値より大きい場合に背景を切り替えます。
 * @default 0
 *
 * @param AltBackgroundThreshold
 * @text 背景切替閾値
 * @type number
 * @desc 背景切替判定となる値。変数がこの値より大きい場合に切替。
 * @default 0
 *
 * @param AltDisabledNodes
 * @text 無効ノード条件
 * @type struct<NodeDisableRule>[]
 * @desc 指定条件を満たす間は対象ノードを選択できなくします。
 *
 * @param HeroineImage
 * @text ヒロイン画像（通常時）
 * @type file
 * @dir img/pictures
 * @desc ヒロイン位置表示に使用する通常時画像。
 * @default HeroIcon
 *
 * @param HeroineEventImage
 * @text ヒロイン画像（イベント発生時）
 * @type file
 * @dir img/pictures
 * @desc イベント発生時に表示するヒロイン画像。
 * @default HeroIconEvent
 *
 * @param CursorImage
 * @text カーソル画像
 * @type file
 * @dir img/pictures
 * @desc 選択カーソルに使用する画像。
 * @default Cursor
 *
 * @param ProgressVariableId
 * @text 進行度変数
 * @type variable
 * @default 11
 *
 * @param DateVariableId
 * @text 日付変数
 * @type variable
 * @default 12
 *
 * @param TimeVariableId
 * @text 時間帯変数
 * @type variable
 * @default 13
 *
 * @param HitRange
 * @text マウス吸着距離(px)
 * @type number
 * @default 80
 *
 * @param NodeList
 * @text 地点データ一覧
 * @type struct<Node>[]
 * @desc マップ上に配置する地点データ。未設定時はサンプルを使用。
 *
 * @param SpotList
 * @text ヒロインスポット一覧
 * @type struct<Spot>[]
 * @desc ヒロインの表示座標データ。未設定時はサンプルを使用。
 *
 * @param HeroineSwitchStates
 * @text ヒロインスイッチ監視設定
 * @type struct<HeroineSwitchState>[]
 * @desc 進行度/日付/時間ごとのスイッチ監視設定。スイッチが全てONなら通常時、1つでもOFFならイベント発生時画像を表示。
 *
 * @param HeroineImageOverrides
 * @text ヒロイン画像オーバーライド
 * @type struct<HeroineImageOverride>[]
 * @desc 進行度/日付/時間とスイッチ条件に応じて画像を強制変更します。通常のスイッチ監視設定より優先されます。
 *
 * @param HeroineSpotOverrides
 * @text スポット条件オーバーライド
 * @type struct<HeroineSpotOverride>[]
 * @desc 条件に応じて指定時間帯のスポットを強制変更します。
 *
 * @param LabelFontFace
 * @text ラベルフォント
 * @type string
 * @desc ノード名に使用するフォント名。空欄で既定フォント。
 *
 * @param LabelFontSize
 * @text ラベル文字サイズ
 * @type number
 * @desc ノード名のフォントサイズ。未入力で24。
 * @default 24
 *
 * @param LabelBackgroundEnabled
 * @text ラベル背景の表示
 * @type boolean
 * @desc ノード名の背後に半透明の背景を描画します。
 * @default true
 *
 * @param UseCursorImage
 * @text カーソル画像を使用
 * @type boolean
 * @desc ON: カーソル画像を表示 / OFF: カーソルなしでラベル強調演出のみ
 * @default true
 *
 * @param TravelSe
 * @text 移動時SE
 * @type struct<Se>
 * @desc ファストトラベル実行時に再生するSE。未設定で無音。
 *
 * @param HideDisabledLabels
 * @text 無効ノードの文字を隠す
 * @type boolean
 * @desc ONにすると無効ノードのラベルを非表示にし、カーソルも移動しません。
 * @default false
 *
 * @param OpenSe
 * @text オープンSE
 * @type struct<Se>
 * @desc シーンを開いた時に再生するSE。未設定で無音。
 *
 * @param CloseSe
 * @text クローズSE
 * @type struct<Se>
 * @desc シーンを閉じる時に再生するSE。未設定で無音。
 *
 * @param BlockSwitches
 * @text ファストトラベル禁止スイッチ設定
 * @type struct<BlockSwitch>[]
 * @desc 指定したスイッチがONのとき、ファストトラベルを禁止します。
 *
 * @param BathSwitchId
 * @text 入浴スイッチ
 * @type switch
 * @desc ONのとき、着替えコモンイベントを実行してからファストトラベル画面を開きます。0で無効。
 * @default 0
 *
 * @param BathCommonEventId
 * @text 入浴着替えコモンイベント
 * @type common_event
 * @desc 入浴スイッチON時に先に実行するコモンイベント。0で無効。
 * @default 0
 *
 * @help
 * ■ 概要
 * プラグインコマンド「ファストトラベル開始」を実行すると
 * 専用のマップ選択画面が開きます。
 *
 * ■ 画像の準備
 * img/pictures フォルダに以下の画像を用意してください。
 * 1. 背景マップ画像
 * 2. ヒロインアイコン画像
 * 3. カーソル画像
 * ※ファイル名はソースコード内の「設定エリア」で指定します。
 *
 * ■ 設定方法
 * プラグイン管理画面から各種パラメータを設定してください。
 * 画像パラメータはリソース選択ウィンドウでプレビューしながら選択できます。
 */

/*~struct~Node:
 * @param key
 * @text キー
 * @desc ノードを識別するキー。スケジュールや無効化設定でも使用します。
 *
 * @param name
 * @text 表示名
 * @desc 確認ウィンドウに表示する名称。
 *
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param up
 * @text 上方向キー
 * @desc 上入力で遷移するノードキー。空欄で遷移不可。
 *
 * @param down
 * @text 下方向キー
 * @desc 下入力で遷移するノードキー。
 *
 * @param left
 * @text 左方向キー
 * @desc 左入力で遷移するノードキー。
 *
 * @param right
 * @text 右方向キー
 * @desc 右入力で遷移するノードキー。
 *
 * @param mapId
 * @text マップID
 * @type number
 * @default 1
 *
 * @param mapX
 * @text マップX
 * @type number
 * @default 0
 *
 * @param mapY
 * @text マップY
 * @type number
 * @default 0
 */

/*~struct~NodeDisableRule:
 * @param key
 * @text ノードキー
 * @desc 無効にするノードのキー。
 *
 * @param variableId
 * @text 判定変数
 * @type variable
 * @default 0
 * @desc 0で常時無効。指定した変数値が条件を満たすと無効化されます。
 *
 * @param minValue
 * @text 最小値(以上)
 * @type number
 * @desc 指定値以上となった場合に無効化します。空欄で制限なし。
 *
 * @param maxValue
 * @text 最大値(以下)
 * @type number
 * @desc 指定値以下となった場合に無効化します。空欄で制限なし。
 */

/*~struct~Spot:
 * @param key
 * @text スポットキー
 * @desc スケジュールから参照するキー。
 *
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 *
 */

/*~struct~HeroineSwitchState:
 * @param progress
 * @text 進行度
 * @type number
 * @default 0
 *
 * @param date
 * @text 日付
 * @type number
 * @default 0
 *
 * @param time
 * @text 時間帯
 * @type number
 * @default 0
 *
 * @param switchId1
 * @text 監視スイッチ1
 * @type switch
 * @default 0
 * @desc 監視するスイッチ番号。0で無効。
 *
 * @param switchId2
 * @text 監視スイッチ2
 * @type switch
 * @default 0
 * @desc 監視するスイッチ番号。0で無効。
 *
 * @param switchId3
 * @text 監視スイッチ3
 * @type switch
 * @default 0
 * @desc 監視するスイッチ番号。0で無効。
 */

/*~struct~HeroineImageOverride:
 * @param progress
 * @text 進行度
 * @type number
 * @default 0
 * @desc 条件を適用する進行度
 *
 * @param date
 * @text 日付
 * @type number
 * @default 0
 * @desc 条件を適用する日付
 *
 * @param time
 * @text 時間帯
 * @type number
 * @default 0
 * @desc 条件を適用する時間帯
 *
 * @param switchId
 * @text 判定スイッチ
 * @type switch
 * @default 0
 * @desc 判定に使用するスイッチID。0で無効（スイッチ判定なし）。
 *
 * @param switchState
 * @text スイッチ状態
 * @type select
 * @option ON
 * @value on
 * @option OFF
 * @value off
 * @option 無視
 * @value ignore
 * @desc スイッチがON/OFFの時に適用。無視の場合はスイッチに関係なく適用。
 * @default ignore
 *
 * @param forceEventImage
 * @text 常にイベント画像を表示
 * @type boolean
 * @desc ON: スイッチに関係なく常にイベント発生時画像を表示 / OFF: スイッチ条件に応じて判定
 * @default false
 */

/*~struct~HeroineSpotOverride:
 * @param progress
 * @text 進行度
 * @type number
 * @default 0
 *
 * @param date
 * @text 日付
 * @type number
 * @default 0
 *
 * @param time
 * @text 時間帯
 * @type number
 * @default 0
 *
 * @param spotKey
 * @text 強制スポットキー
 * @desc 条件を満たした際に差し替えるスポットキー。
 *
 * @param switchId
 * @text 判定スイッチ
 * @type switch
 * @default 0
 * @desc OFFのとき発動。0で無効。
 *
 * @param variableId
 * @text 判定変数
 * @type variable
 * @default 0
 *
 * @param minValue
 * @text 最小値(以上)
 * @type number
 * @desc 指定値以上の場合に発動。空欄で無効。
 *
 * @param maxValue
 * @text 最大値(以下)
 * @type number
 * @desc 指定値以下の場合に発動。空欄で無効。
 */

/*~struct~Se:
 * @param name
 * @text ファイル名
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @type number
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @default 100
 *
 * @param pan
 * @text パン
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

/*~struct~BlockSwitch:
 * @param switchId
 * @text スイッチID
 * @type switch
 * @desc 監視するスイッチ番号。このスイッチがONのとき、ファストトラベルを禁止します。
 * @default 0
 *
 * @param showMessage
 * @text メッセージを表示
 * @type boolean
 * @desc ON: 禁止時に通知メッセージを表示 / OFF: メッセージを表示しない
 * @default true
 *
 * @param message
 * @text メッセージ内容
 * @type multiline_string
 * @desc 禁止時に表示する通知メッセージの内容。空欄の場合は表示しません。
 * @default 現在ファストトラベルは使用できません
 *
 * @param playSe
 * @text 効果音を再生
 * @type boolean
 * @desc ON: メッセージ表示時に効果音を再生 / OFF: 効果音を再生しない
 * @default true
 *
 * @param se
 * @text 効果音設定
 * @type struct<Se>
 * @desc メッセージ表示時に再生する効果音。未設定で無音。
 */

(() => {
    'use strict';

    const pluginName = "FastTravelSystem";
    const params = PluginManager.parameters(pluginName);

    const DEFAULT_NODES = {
        HeroHouse: {
            name: "Protagonist's House", x: 170, y: 225,
            up: "NorthExit", down: "SouthExit", left: null, right: "VillageHead",
            mapId: 53, mapX: 11, mapY: 18
        },
        NorthExit: {
            name: "North Exit", x: 275, y: 160,
            up: null, down: "HeroHouse", left: "HeroHouse", right: "EastExit",
            mapId: 53, mapX: 24, mapY: 11
        },
        SouthExit: {
            name: "South Exit", x: 255, y: 500,
            up: "HeroHouse", down: null, left: "HeroHouse", right: "VillageHead",
            mapId: 53, mapX: 22, mapY: 42
        },
        VillageHead: {
            name: "Village Chief's House", x: 315, y: 350,
            up: "NorthExit", down: "SouthExit", left: "HeroHouse", right: "EastExit",
            mapId: 53, mapX: 29, mapY: 31
        },
        EastExit: {
            name: "East Exit", x: 595, y: 320,
            up: "NorthExit", down: "SouthExit", left: "VillageHead", right: "MansionPath",
            mapId: 53, mapX: 52, mapY: 27
        },
        MansionPath: {
            name: "Path to the Mansion", x: 950, y: 300,
            up: null, down: null, left: "EastExit", right: null,
            mapId: 20, mapX: 20, mapY: 22
        }
    };

    const DEFAULT_SPOTS = {
        Home: {
            x: 110, y: 179
        },
        North: {
            x: 255, y: 75
        },
        Inn: {
            x: 287, y: 419
        },
        CheifHouse: {
            x: 287, y: 303
        },
        DalioHouse: {
            x: 134, y: 291
        },
        Mansion: {
            x: 960, y: 75
        },
        DalioHut: {
            x: 90, y: 426
        },
        Shop: {
            x: 312, y: 182
        },
        Bath: {
            x: 412, y: 171
        },
        Townsquare: {
            x: 515, y: 317
        },
        OldmanHouse: {
            x: 400, y: 460
        },
        Hole: {
            x: 956, y: 392
        },
    };

    /**
     * 日付0:陽の日, 1:雲の日, 2:霧の日, 3:嵐の日
 * 進行度1～5、各日付0～3、時間帯0～3のマスにスポットキーを入力してください。
     */
    const DEFAULT_SCHEDULE = {
        "1": {
            "0": { "0": "North", "1": "Inn", "2": "Bath", "3": "Home" },
            "1": { "0": "North", "1": "Inn", "2": "Bath", "3": "Home" },
            "2": { "0": "North", "1": "Inn", "2": "Bath", "3": "Home" },
            "3": { "0": "Inn", "1": "Inn", "2": "Inn", "3": "Home" }
        },
        "2": {
            "0": { "0": "Home", "1": "Shop", "2": "Inn", "3": "Home" },
            "1": { "0": "Inn", "1": "Inn", "2": "Bath", "3": "Home" },
            "2": { "0": "North", "1": "Townsquare", "2": "Home", "3": "Home" },
            "3": { "0": "Home", "1": "Inn", "2": "Inn", "3": "DalioHouse" }
        },
        "3": {
            "0": { "0": "Home", "1": "Shop", "2": "Inn", "3": "Home" },
            "1": { "0": "North", "1": "Shop", "2": "Bath", "3": "Home" },
            "2": { "0": "North", "1": "North", "2": "Inn", "3": "DalioHouse" },
            "3": { "0": "DalioHouse", "1": "DalioHut", "2": "Home", "3": "Home" }
        },
        "4": {
            "0": { "0": "Home", "1": "Townsquare", "2": "CheifHouse", "3": "CheifHouse" },
            "1": { "0": "Hole", "1": "Hole", "2": "Bath", "3": "DalioHouse" },
            "2": { "0": "North", "1": "Mansion", "2": "Inn", "3": "Inn" },
            "3": { "0": "Townsquare", "1": "OldmanHouse", "2": "Home", "3": "Home" }
        },
        "5": {
            "0": { "0": "HeroHouseFront", "1": "NorthGateSide", "2": "EastCrossing", "3": "MansionPathRest" },
            "1": { "0": "SouthGateShade", "1": "VillageHeadYard", "2": "EastCrossing", "3": "MansionPathRest" },
            "2": { "0": "NorthGateSide", "1": "HeroHouseFront", "2": "MansionPathRest", "3": "SouthGateShade" },
            "3": { "0": "VillageHeadYard", "1": "SouthGateShade", "2": "EastCrossing", "3": "MansionPathRest" }
        }
    };

    /**
     * 進行度1～5、各日付0～3、時間帯0～3のマスに監視スイッチ番号を3つまで入力してください。
     * 全てnullの場合は通常時画像、スイッチがある場合は全てONで通常時、1つでもOFFでイベント発生時画像を表示。
     */
    const DEFAULT_HEROINE_SWITCH_STATES = {
        "1": {
            "0": { "0": { switch1: 52, switch2: null, switch3: null }, "1": { switch1: 56, switch2: null, switch3: null }, "2": { switch1: 57, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "1": { "0": { switch1: 52, switch2: null, switch3: null }, "1": { switch1: 56, switch2: null, switch3: null }, "2": { switch1: 57, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "2": { "0": { switch1: 52, switch2: null, switch3: null }, "1": { switch1: 56, switch2: null, switch3: null }, "2": { switch1: 57, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "3": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } }
        },
        "2": {
            "0": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 64, switch2: null, switch3: null }, "2": { switch1: 65, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "1": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: 66, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "2": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 67, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "3": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } }
        },
        "3": {
            "0": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 69, switch2: null, switch3: null }, "2": { switch1: 70, switch2: 71, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "1": { "0": { switch1: 72, switch2: null, switch3: null }, "1": { switch1: 73, switch2: null, switch3: null }, "2": { switch1: 74, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "2": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 75, switch2: null, switch3: null }, "2": { switch1: 76, switch2: null, switch3: null }, "3": { switch1: 77, switch2: null, switch3: null } },
            "3": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 79, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } }
        },
        "4": {
            "0": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 81, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: 82, switch2: null, switch3: null } },
            "1": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: 83, switch2: 84, switch3: 85 }, "2": { switch1: 86, switch2: null, switch3: null }, "3": { switch1: 87, switch2: null, switch3: null } },
            "2": { "0": { switch1: 88, switch2: null, switch3: null }, "1": { switch1: 89, switch2: null, switch3: null }, "2": { switch1: 90, switch2: null, switch3: null }, "3": { switch1: 91, switch2: null, switch3: null } },
            "3": { "0": { switch1: 92, switch2: null, switch3: null }, "1": { switch1: 93, switch2: 94, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: 95, switch2: null, switch3: null } }
        },
        "5": {
            "0": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "1": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "2": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } },
            "3": { "0": { switch1: null, switch2: null, switch3: null }, "1": { switch1: null, switch2: null, switch3: null }, "2": { switch1: null, switch2: null, switch3: null }, "3": { switch1: null, switch2: null, switch3: null } }
        }
    };

    function paramNumber(name, defaultValue) {
        const value = Number(params[name]);
        return Number.isNaN(value) ? defaultValue : value;
    }

    function paramString(name, defaultValue) {
        const value = params[name];
        return value !== undefined && value !== "" ? String(value) : defaultValue;
    }

    function parseStructArray(raw) {
        if (!raw) return [];
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            return [];
        }
        if (!Array.isArray(data)) return [];
        return data
            .map(item => {
                try {
                    return JSON.parse(item);
                } catch (e) {
                    return null;
                }
            })
            .filter(item => item);
    }

    function normalizeLink(value) {
        return value ? String(value) : null;
    }

    function buildNodeConfig(nodeStructs) {
        if (!nodeStructs.length) {
            return DEFAULT_NODES;
        }
        const result = {};
        for (const node of nodeStructs) {
            if (!node.key) continue;
            result[node.key] = {
                name: node.name || node.key,
                x: Number(node.x || 0),
                y: Number(node.y || 0),
                up: normalizeLink(node.up),
                down: normalizeLink(node.down),
                left: normalizeLink(node.left),
                right: normalizeLink(node.right),
                mapId: Number(node.mapId || 0),
                mapX: Number(node.mapX || 0),
                mapY: Number(node.mapY || 0)
            };
        }
        return Object.keys(result).length ? result : DEFAULT_NODES;
    }

    function buildSpotConfig(spotStructs) {
        const base = spotStructs.length ? spotStructs : Object.keys(DEFAULT_SPOTS).map(key => ({
            key,
            x: DEFAULT_SPOTS[key].x,
            y: DEFAULT_SPOTS[key].y
        }));
        const result = {};
        for (const spot of base) {
            if (!spot.key) continue;
            result[spot.key] = {
                x: Number(spot.x || 0) + 22,
                y: Number(spot.y || 0) + 50
            };
        }
        return result;
    }

    function normalizeTimelineKey(value) {
        if (value === undefined || value === null || value === "") return null;
        const num = Number(value);
        return Number.isNaN(num) ? null : String(num);
    }

    function buildHeroineSwitchStateMap(raw) {
        const structs = parseStructArray(raw);
        const result = JSON.parse(JSON.stringify(DEFAULT_HEROINE_SWITCH_STATES));
        for (const entry of structs) {
            const progressKey = normalizeTimelineKey(entry.progress);
            const dateKey = normalizeTimelineKey(entry.date);
            const timeKey = normalizeTimelineKey(entry.time);
            if (progressKey == null || dateKey == null || timeKey == null) continue;
            // スイッチIDが0または未指定の場合はnullに変換
            const switch1 = parseOptionalNumber(entry.switchId1);
            const switch2 = parseOptionalNumber(entry.switchId2);
            const switch3 = parseOptionalNumber(entry.switchId3);
            const normalizedSwitch1 = (switch1 === null || switch1 === 0) ? null : switch1;
            const normalizedSwitch2 = (switch2 === null || switch2 === 0) ? null : switch2;
            const normalizedSwitch3 = (switch3 === null || switch3 === 0) ? null : switch3;
            if (!result[progressKey]) result[progressKey] = {};
            if (!result[progressKey][dateKey]) result[progressKey][dateKey] = {};
            result[progressKey][dateKey][timeKey] = {
                switch1: normalizedSwitch1,
                switch2: normalizedSwitch2,
                switch3: normalizedSwitch3
            };
        }
        return result;
    }

    function buildHeroineImageOverrides(raw) {
        const structs = parseStructArray(raw);
        const result = [];
        for (let i = 0; i < structs.length; i++) {
            const entry = structs[i];
            const progressKey = normalizeTimelineKey(entry.progress);
            const dateKey = normalizeTimelineKey(entry.date);
            const timeKey = normalizeTimelineKey(entry.time);
            if (progressKey == null || dateKey == null || timeKey == null) continue;
            const override = {
                index: i, // リストのインデックス（優先順位判定用）
                progress: Number(entry.progress || 0),
                date: Number(entry.date || 0),
                time: Number(entry.time || 0),
                switchId: Number(entry.switchId || 0),
                switchState: String(entry.switchState || 'ignore').toLowerCase(),
                forceEventImage: entry.forceEventImage === "true" || entry.forceEventImage === true
            };
            result.push(override);
        }
        // インデックス順（リストの数値が大きい順）にソート
        result.sort((a, b) => b.index - a.index);
        return result;
    }

    function buildHeroineSpotOverrides(raw) {
        const structs = parseStructArray(raw);
        const result = {};
        for (const entry of structs) {
            const progressKey = normalizeTimelineKey(entry.progress);
            const dateKey = normalizeTimelineKey(entry.date);
            const timeKey = normalizeTimelineKey(entry.time);
            if (progressKey == null || dateKey == null || timeKey == null) continue;
            if (!entry.spotKey) continue;
            const override = {
                spotKey: entry.spotKey,
                switchId: Number(entry.switchId || 0),
                variableId: Number(entry.variableId || 0),
                minValue: parseOptionalNumber(entry.minValue),
                maxValue: parseOptionalNumber(entry.maxValue)
            };
            result[progressKey] = result[progressKey] || {};
            result[progressKey][dateKey] = result[progressKey][dateKey] || {};
            result[progressKey][dateKey][timeKey] = result[progressKey][dateKey][timeKey] || [];
            result[progressKey][dateKey][timeKey].push(override);
        }
        return result;
    }

    function parseSeParam(raw) {
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            return {
                name: data.name || "",
                volume: Number(data.volume || 90),
                pitch: Number(data.pitch || 100),
                pan: Number(data.pan || 0)
            };
        } catch (e) {
            return null;
        }
    }

    function playConfiguredSe(se) {
        if (!se || !se.name) return;
        AudioManager.playSe({
            name: se.name,
            volume: se.volume ?? 90,
            pitch: se.pitch ?? 100,
            pan: se.pan ?? 0
        });
    }

    function parseOptionalNumber(value) {
        if (value === undefined || value === null || value === "") return null;
        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    }

    function buildDisabledRules(raw) {
        const structs = parseStructArray(raw);
        return structs
            .map(entry => {
                if (!entry.key) return null;
                return {
                    key: entry.key,
                    variableId: Number(entry.variableId || 0),
                    minValue: parseOptionalNumber(entry.minValue),
                    maxValue: parseOptionalNumber(entry.maxValue)
                };
            })
            .filter(entry => entry);
    }

    function buildBlockSwitches(raw) {
        const structs = parseStructArray(raw);
        return structs
            .map(entry => {
                const switchId = Number(entry.switchId || 0);
                if (!switchId) return null;
                return {
                    switchId: switchId,
                    showMessage: entry.showMessage === "true" || entry.showMessage === true,
                    message: String(entry.message || ""),
                    playSe: entry.playSe === "true" || entry.playSe === true,
                    se: parseSeParam(entry.se)
                };
            })
            .filter(entry => entry);
    }

    const CONFIG = (() => {
        const nodes = buildNodeConfig(parseStructArray(params.NodeList));
        const spots = buildSpotConfig(parseStructArray(params.SpotList));
        return {
            images: {
                background: paramString("BackgroundImage", "MapBg"),
                heroine: paramString("HeroineImage", "HeroIcon"),
                heroineEvent: paramString("HeroineEventImage", "HeroIconEvent"),
                cursor: paramString("CursorImage", "Cursor"),
                altBackground: paramString("AltBackgroundImage", "")
            },
            vars: {
                progress: paramNumber("ProgressVariableId", 11),
                date: paramNumber("DateVariableId", 12),
                time: paramNumber("TimeVariableId", 13)
            },
            hitRange: paramNumber("HitRange", 80),
            nodes,
            spots,
            schedule: DEFAULT_SCHEDULE,
            heroineSwitchStates: buildHeroineSwitchStateMap(params.HeroineSwitchStates),
            heroineImageOverrides: buildHeroineImageOverrides(params.HeroineImageOverrides),
            heroineSpotOverrides: buildHeroineSpotOverrides(params.HeroineSpotOverrides),
            altCondition: {
                variableId: paramNumber("AltBackgroundVariableId", 0),
                threshold: paramNumber("AltBackgroundThreshold", 0)
            },
            altDisabledRules: buildDisabledRules(params.AltDisabledNodes),
            blockSwitches: buildBlockSwitches(params.BlockSwitches),
            bath: {
                switchId: paramNumber("BathSwitchId", 0),
                commonEventId: paramNumber("BathCommonEventId", 0)
            },
            se: {
                travel: parseSeParam(params.TravelSe),
                open: parseSeParam(params.OpenSe),
                close: parseSeParam(params.CloseSe)
            },
            hideDisabledLabels: params.HideDisabledLabels === "true",
            labelFont: {
                face: paramString("LabelFontFace", ""),
                size: paramNumber("LabelFontSize", 24)
            },
            labelBackgroundEnabled: params.LabelBackgroundEnabled !== "false",
            useCursorImage: params.UseCursorImage !== "false"
        };
    })();

    // ======================================================================
    // ■ 以下、システム処理（書き換え不要）
    // ======================================================================

    // 禁止スイッチをチェックして、通知を表示する（シーンを開く前に使用）
    function checkBlockSwitchesBeforeOpen() {
        if (!CONFIG.blockSwitches || CONFIG.blockSwitches.length === 0) {
            return false;
        }
        for (const blockSwitch of CONFIG.blockSwitches) {
            if ($gameSwitches.value(blockSwitch.switchId)) {
                // スイッチがONなので、通知を表示してシーンを開かない
                handleBlockSwitchBeforeOpen(blockSwitch);
                return true;
            }
        }
        return false;
    }

    // 入浴スイッチON時にコモンイベントを挟んでから遷移するためのフロー
    function startFastTravelFlow(debugMode = false) {
        openFastTravelScene(debugMode);
    }

    function openFastTravelScene(debugMode = false) {
        if (checkBlockSwitchesBeforeOpen()) {
            return;
        }
        $gameTemp._fastTravelDebugShowAll = !!debugMode;
        SceneManager.push(Scene_FastTravel);
    }

    function isBathEventActive() {
        const { switchId, commonEventId } = CONFIG.bath;
        if (!switchId || !commonEventId) return false;
        return $gameSwitches.value(switchId);
    }

    function reserveBathCommonEvent() {
        const { commonEventId } = CONFIG.bath;
        if (!commonEventId) return false;
        $gameTemp.reserveCommonEvent(commonEventId);
        return true;
    }

    function runBathCommonEventImmediate() {
        const { commonEventId } = CONFIG.bath;
        if (!commonEventId) return false;
        const commonEvent = $dataCommonEvents[commonEventId];
        if (!commonEvent || !commonEvent.list) return false;
        const interpreter = new Game_Interpreter();
        interpreter.setup(commonEvent.list, 0);
        // 即時実行（ウェイトはスキップせず逐次進める）
        while (interpreter.isRunning()) {
            interpreter.update();
        }
        return true;
    }

    function setPendingBathTransfer(node) {
        $gameTemp._fastTravelPendingTransfer = {
            mapId: node.mapId,
            mapX: node.mapX,
            mapY: node.mapY,
            direction: 2,
            fadeType: 0,
            usedTransition: false
        };
    }

    function updatePendingBathTransfer() {
        const pending = $gameTemp._fastTravelPendingTransfer;
        if (!pending) return;
        if ($gameMap.isEventRunning() || $gameTemp.isCommonEventReserved()) return;
        if (SceneManager.isSceneChanging()) return;
        $gameTemp._fastTravelPendingTransfer = null;
        playConfiguredSe(CONFIG.se.travel);
        $gamePlayer.reserveTransfer(pending.mapId, pending.mapX, pending.mapY, pending.direction, pending.fadeType);
    }

    function handleBlockSwitchBeforeOpen(blockSwitch) {
        // 効果音再生（メッセージ表示と同時に再生）
        if (blockSwitch.playSe && blockSwitch.se && blockSwitch.se.name) {
            playConfiguredSe(blockSwitch.se);
        }
        // メッセージ表示
        if (blockSwitch.showMessage && blockSwitch.message) {
            showBlockMessageBeforeOpen(blockSwitch);
        }
    }

    function showBlockMessageBeforeOpen(blockSwitch) {
        // TorigoyaMZ_NotifyMessageプラグインが利用可能かチェック
        if (typeof window.Torigoya !== "undefined" &&
            window.Torigoya.NotifyMessage &&
            window.Torigoya.NotifyMessage.Manager) {
            // NotifyItemを作成して通知を表示
            const NotifyItem = window.Torigoya.NotifyMessage.NotifyItem;
            if (NotifyItem) {
                const notifyItem = new NotifyItem({
                    message: blockSwitch.message,
                    icon: 0,
                    note: "<noSound>" // 効果音は別途再生するので、通知の効果音は無効化
                });
                window.Torigoya.NotifyMessage.Manager.notify(notifyItem);
            }
        }
    }

    // プラグインコマンド登録
    PluginManager.registerCommand(pluginName, "startFastTravel", args => {
        startFastTravelFlow(false);
    });

    PluginManager.registerCommand(pluginName, "showAllSpotsDebug", () => {
        // デバッグコマンドでは禁止スイッチをチェックしない
        $gameTemp._fastTravelDebugShowAll = true;
        SceneManager.push(Scene_FastTravel);
    });

    // ----------------------------------------------------------------------
    // シーンクラス: Scene_FastTravel
    // ----------------------------------------------------------------------
    class Scene_FastTravel extends Scene_MenuBase {
        create() {
            super.create();
            this._isAltBackground = this.shouldUseAltBackground();
            this._labelCursorMode = false;
            this._currentKey = this.getInitialKey();
            this._heroineSpotKey = null;
            this._debugShowAllSpots = !!$gameTemp._fastTravelDebugShowAll;
            $gameTemp._fastTravelDebugShowAll = false;
            this._travelLayerMotion = null;
            this._pendingSceneExit = null;
            this.createTravelLayer();
            this.createBackgroundMap();
            this.createHeroineIcon();
            this.createCursor();
            this.createNodeLabels();
            this.createConfirmWindow();
            this._pendingTransferCallback = null;
            this._usedTransferTransition = false;
            this._travelConfirmed = false; // 移動確定フラグ（フェード中の入力を防ぐ）
            this.updateCursorPos(false); // 初期位置セット
            this.refreshLabelStates();
            this.startTravelLayerEnter();
        }

        start() {
            super.start();
            this.playOpenSe();
        }

        // 初期選択位置の決定
        getInitialKey() {
            // 前回の記憶があればそれを使う、なければ先頭
            if ($gameTemp._lastFastTravelKey && this.canSelectNode($gameTemp._lastFastTravelKey)) {
                return $gameTemp._lastFastTravelKey;
            }
            return this.findFirstAvailableKey();
        }

        findFirstAvailableKey() {
            return Object.keys(CONFIG.nodes).find(key => this.canSelectNode(key)) || null;
        }

        canSelectNode(key) {
            if (!key) return false;
            if (!CONFIG.nodes[key]) return false;
            return !this.isNodeDisabled(key);
        }

        isNodeDisabled(key) {
            return CONFIG.altDisabledRules.some(rule => {
                if (rule.key !== key) return false;
                return this.doesDisableRuleMatch(rule);
            });
        }

        doesDisableRuleMatch(rule) {
            if (!rule.variableId) return true;
            const value = $gameVariables.value(rule.variableId);
            const meetsMin = rule.minValue == null || value >= rule.minValue;
            const meetsMax = rule.maxValue == null || value <= rule.maxValue;
            return meetsMin && meetsMax;
        }

        createTravelLayer() {
            this._travelLayer = new Sprite();
            this._travelLayer.y = -Graphics.boxHeight;
            const bgIndex = this.children.indexOf(this._backgroundSprite);
            if (bgIndex >= 0) {
                this.addChildAt(this._travelLayer, bgIndex + 1);
            } else {
                this.addChildAt(this._travelLayer, 0);
            }
        }

        createBackgroundMap() {
            this._mapSprite = new Sprite();
            this.refreshBackgroundBitmap();
            if (this._travelLayer) {
                this._travelLayer.addChildAt(this._mapSprite, 0);
            } else {
                this.addChildAt(this._mapSprite, 0);
            }
        }

        refreshBackgroundBitmap() {
            if (!this._mapSprite) return;
            const name = (this._isAltBackground && CONFIG.images.altBackground)
                ? CONFIG.images.altBackground
                : CONFIG.images.background;
            this._mapSprite.bitmap = ImageManager.loadPicture(name);
        }

        createHeroineIcon() {
            this._heroineSprite = new Sprite_HeroineIcon();
            if (this._travelLayer) {
                this._travelLayer.addChild(this._heroineSprite);
            } else {
                this.addChild(this._heroineSprite);
            }
            this.updateHeroineAppearance(true);
            if (this._debugShowAllSpots) {
                this.createHeroineDebugIcons();
            }
        }

        createHeroineDebugIcons() {
            this._debugHeroineSprites = [];
            const baseImage = CONFIG.images.heroine;
            const parent = this._travelLayer || this;
            for (const key in CONFIG.spots) {
                const spot = CONFIG.spots[key];
                if (!spot) continue;
                const sprite = new Sprite_HeroineIcon();
                sprite.setPicture(baseImage);
                sprite.setBasePosition(spot.x, spot.y);
                sprite.setSpotKey(key);
                sprite.setEventGlowEnabled(false);
                sprite.setDebugMode(true);
                sprite.alpha = 0.6;
                parent.addChild(sprite);
                this._debugHeroineSprites.push(sprite);
            }
            this._heroineSprite.visible = false;
        }

        createCursor() {
            const cursorName = CONFIG.images.cursor;
            const useCursor = CONFIG.useCursorImage && cursorName;
            if (!useCursor) {
                this._cursorSprite = null;
                this._labelCursorMode = true;
                return;
            }
            this._cursorSprite = new Sprite();
            this._cursorSprite.bitmap = ImageManager.loadPicture(cursorName);
            this._cursorSprite.anchor.x = 0.5;
            this._cursorSprite.anchor.y = 0.5;
            if (this._travelLayer) {
                this._travelLayer.addChild(this._cursorSprite);
            } else {
                this.addChild(this._cursorSprite);
            }
        }

        createNodeLabels() {
            this._labelSprites = [];
            this._labelSpriteMap = {};
            const offset = 32;
            for (const key in CONFIG.nodes) {
                const node = CONFIG.nodes[key];
                const label = new Sprite_FastTravelLabel(node.name);
                label.x = node.x;
                label.y = node.y + offset;
                label.setClickCallback(() => this.onLabelClicked(key));
                label.setHighlightMode(this._labelCursorMode);
                label.nodeKey = key;
                this._labelSprites.push(label);
                this._labelSpriteMap[key] = label;
                if (this._travelLayer) {
                    this._travelLayer.addChild(label);
                } else {
                    this.addChild(label);
                }
            }
            this.updateLabelHighlightState();
        }

        createConfirmWindow() {
            // 確認ウィンドウ（最初は非表示）
            const rect = this.confirmWindowRect();
            this._confirmWindow = new Window_FastTravelConfirm(rect);
            this._confirmWindow.setHandler("yes", this.onConfirmYes.bind(this));
            this._confirmWindow.setHandler("no", this.onConfirmNo.bind(this));
            this._confirmWindow.setHandler("cancel", this.onConfirmNo.bind(this));
            this._confirmWindow.hide();
            this._confirmWindow.deactivate();
            this.addWindow(this._confirmWindow);
        }

        confirmWindowRect() {
            const ww = 420;
            const wh = 140;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2 + 60;
            return new Rectangle(wx, wy, ww, wh);
        }

        update() {
            super.update();
            const travelAnimating = this.updateTravelLayerMotion();
            this.updateBackgroundState();
            this.refreshLabelStates();
            this.updateHeroineAppearance();
            this.ensureSelectableCursor();
            this.updateTransferTransition();
            if (!travelAnimating && this.hasMouseMoved()) {
                this.updateLabelHoverState();
            }
            // ウィンドウが開いている時、演出中、または移動確定済みの場合は操作しない
            if (this._confirmWindow.active || travelAnimating || this._travelConfirmed) return;

            this.updateInput();
            this.updateTouch();
        }

        // マウスカーソルが移動したかどうかを判定
        hasMouseMoved() {
            const currentX = TouchInput.x;
            const currentY = TouchInput.y;
            // 初回呼び出し時は前回位置を初期化
            if (this._lastMouseX === undefined) {
                this._lastMouseX = currentX;
                this._lastMouseY = currentY;
                return false;
            }
            const moved = (this._lastMouseX !== currentX || this._lastMouseY !== currentY);
            // 位置を更新
            this._lastMouseX = currentX;
            this._lastMouseY = currentY;
            return moved;
        }

        shouldUseAltBackground() {
            const condition = CONFIG.altCondition;
            if (!condition.variableId || !CONFIG.images.altBackground) {
                return false;
            }
            return $gameVariables.value(condition.variableId) > condition.threshold;
        }

        updateBackgroundState() {
            const nextState = this.shouldUseAltBackground();
            if (nextState === this._isAltBackground) {
                return;
            }
            this._isAltBackground = nextState;
            this.refreshBackgroundBitmap();
        }

        ensureSelectableCursor() {
            if (this.canSelectNode(this._currentKey)) {
                return;
            }
            this._currentKey = this.findFirstAvailableKey();
            this.updateCursorPos(false);
        }

        updateInput() {
            if (!this._currentKey) return;
            const node = CONFIG.nodes[this._currentKey];
            if (!node) return;
            let nextKey = null;

            if (Input.isRepeated("up")) nextKey = node.up;
            if (Input.isRepeated("down")) nextKey = node.down;
            if (Input.isRepeated("left")) nextKey = node.left;
            if (Input.isRepeated("right")) nextKey = node.right;

            if (nextKey) {
                this.tryMoveCursor(nextKey);
            }

            // 決定キー
            if (Input.isTriggered("ok")) {
                this.startConfirm(this._currentKey);
            }
            // キャンセルキー
            if (Input.isTriggered("cancel")) {
                this.exitScene();
            }
        }

        updateTouch() {
            // 右クリック判定
            if (TouchInput.isCancelled()) {
                this.exitScene();
            }
        }

        updateCursorPos(animation) {
            const node = CONFIG.nodes[this._currentKey];
            if (this._labelCursorMode || !this._cursorSprite) {
                if (this._cursorSprite) {
                    this._cursorSprite.visible = false;
                }
                if (node) {
                    $gameTemp._lastFastTravelKey = this._currentKey;
                }
                this.updateLabelHighlightState();
                return;
            }
            if (node) {
                this._cursorSprite.visible = true;
                this._cursorSprite.x = node.x;
                this._cursorSprite.y = node.y;
                $gameTemp._lastFastTravelKey = this._currentKey;
                this.updateLabelHighlightState();
            } else {
                this._cursorSprite.visible = false;
            }
        }

        tryMoveCursor(key, skipSound = false) {
            if (!CONFIG.nodes[key]) return false;
            if (!this.canSelectNode(key)) {
                if (CONFIG.hideDisabledLabels) {
                    return false;
                }
                SoundManager.playBuzzer();
                return false;
            }
            if (this._currentKey !== key) {
                this._currentKey = key;
                if (!skipSound) {
                    SoundManager.playCursor();
                }
                this.updateCursorPos(true);
            } else if (this._labelCursorMode) {
                this.updateLabelHighlightState();
            }
            return true;
        }

        startConfirm(key = this._currentKey) {
            if (!this.canSelectNode(key)) {
                SoundManager.playBuzzer();
                return;
            }
            this._currentKey = key;
            SoundManager.playOk();
            const node = CONFIG.nodes[this._currentKey];
            this._confirmWindow.setInfo(node.name); // 場所名を渡す
            this._confirmWindow.show();
            this._confirmWindow.open();
            this._confirmWindow.activate();
            this._confirmWindow.select(0); // 「はい」を選択状態に
        }

        onConfirmYes() {
            const node = CONFIG.nodes[this._currentKey];
            this._travelConfirmed = true; // 移動確定、以降の入力を無効化
            this.closeConfirmWindow();
            if (this.tryHandleBathBeforeTravel(node)) return;
            if (!this.tryStartTransferTransition(node)) {
                this.performFastTravel(node);
            }
        }

        onConfirmNo() {
            this.closeConfirmWindow();
            // カーソル操作に戻る
        }

        closeConfirmWindow() {
            if (!this._confirmWindow) return;
            this._confirmWindow.deactivate();
            this._confirmWindow.close();
            this._confirmWindow.hide();
        }

        tryHandleBathBeforeTravel(node) {
            if (!isBathEventActive()) return false;
            // 入浴スイッチON時はコモンイベントを即時実行してから通常遷移
            if (!runBathCommonEventImmediate()) {
                return false;
            }
            return false;
        }

        updateLabelHoverState() {
            if (!this._labelSprites || SceneManager.isSceneChanging()) return;
            const mouseX = TouchInput.x;
            const mouseY = TouchInput.y;
            let hoveredHandled = false;
            for (const sprite of this._labelSprites) {
                const hovered = this.isPointerInsideLabel(sprite, mouseX, mouseY) &&
                    (!CONFIG.hideDisabledLabels || this.canSelectNode(sprite.nodeKey));
                sprite.setHover(hovered);
                if (hovered && !hoveredHandled && !this._confirmWindow.active) {
                    hoveredHandled = true;
                    this.onLabelHover(sprite.nodeKey);
                }
            }
        }

        isPointerInsideLabel(sprite, x, y) {
            if (!sprite || !sprite.bitmap || !sprite.isInteractableForPointer()) return false;
            const width = sprite.bitmap.width;
            const height = sprite.bitmap.height;
            const left = sprite.x - width * sprite.anchor.x;
            const right = left + width;
            const top = sprite.y - height * sprite.anchor.y;
            const bottom = top + height;
            return x >= left && x <= right && y >= top && y <= bottom;
        }

        updateTransferTransition() {
            if (this._pendingTransferCallback && !this.isTransitioning()) {
                const callback = this._pendingTransferCallback;
                this._pendingTransferCallback = null;
                callback();
            }
        }

        tryStartTransferTransition(node) {
            if (typeof this.hideScreenWithPreset !== "function" ||
                typeof this.needsPresetTransition !== "function") {
                return false;
            }
            const type = "Transfer Player (Hide)";
            if (!this.needsPresetTransition(type)) {
                return false;
            }
            const duration = typeof this.presetTransitionSpeed === "function"
                ? this.presetTransitionSpeed(type)
                : this.fadeSpeed();
            this.hideScreenWithPreset(duration, type);
            this._usedTransferTransition = true;
            this._pendingTransferCallback = () => this.performFastTravel(node);
            return true;
        }

        performFastTravel(node) {
            if (this._usedTransferTransition) {
                $gameTemp._fastTravelNeedsShowTransition = true;
                this._usedTransferTransition = false;
            }
            this.playTravelSe();
            this.exitScene(() => {
                // NRP_ParallaxesPlus.jsの遠景データをクリア
                // Scene_FastTravelからの遷移では自動でクリアされないため、明示的にクリアする
                if ($gameMap) {
                    $gameMap._parallaxPlus = undefined;
                }
                // 場所移動実行
                $gamePlayer.reserveTransfer(node.mapId, node.mapX, node.mapY, 2, 0);
            }, true);
        }

        refreshLabelStates() {
            if (!this._labelSprites) return;
            for (const sprite of this._labelSprites) {
                const enabled = this.canSelectNode(sprite.nodeKey);
                const shouldHide = CONFIG.hideDisabledLabels && !enabled;
                sprite.setEnabled(enabled);
                sprite.setForceHidden(shouldHide);
            }
            this.updateLabelHighlightState();
        }

        onLabelClicked(key) {
            if (this._confirmWindow.active) return;
            if (!this.tryMoveCursor(key)) return;
            this.startConfirm(this._currentKey);
        }

        onLabelHover(key) {
            const skipSound = !this._labelCursorMode;
            this.tryMoveCursor(key, skipSound);
        }

        updateLabelHighlightState() {
            if (!this._labelCursorMode || !this._labelSpriteMap) return;
            for (const key in this._labelSpriteMap) {
                const sprite = this._labelSpriteMap[key];
                sprite.setHighlight(key === this._currentKey);
            }
        }

        startTravelLayerEnter() {
            if (!this._travelLayer) return;
            const startY = -Graphics.boxHeight / 4;
            this._travelLayerMotion = {
                mode: "enter",
                duration: 14,
                elapsed: 0,
                from: startY,
                to: 0,
                alphaFrom: 0,
                alphaTo: 1
            };
            this._travelLayer.y = startY;
            this._travelLayer.alpha = 0;
        }

        startTravelLayerExit() {
            if (!this._travelLayer) {
                this.finishSceneExit();
                return;
            }
            const current = this._travelLayerMotion;
            if (current && current.mode === "exit") return;
            this._travelLayerMotion = {
                mode: "exit",
                duration: 9,
                elapsed: 0,
                from: this._travelLayer.y,
                to: -Graphics.boxHeight / 4,
                alphaFrom: this._travelLayer.alpha ?? 1,
                alphaTo: 0
            };
        }

        isTravelLayerAnimating() {
            return !!this._travelLayerMotion;
        }

        updateTravelLayerMotion() {
            if (!this._travelLayer || !this._travelLayerMotion) {
                return false;
            }
            const motion = this._travelLayerMotion;
            motion.elapsed = Math.min(motion.elapsed + 1, motion.duration);
            const progress = motion.elapsed / motion.duration;
            let eased = progress;
            if (motion.mode === "enter") {
                eased = this.easeOutBack(progress, 1.15);
            } else if (motion.mode === "exit") {
                eased = this.easeInCubic(progress);
            }
            const nextY = motion.from + (motion.to - motion.from) * eased;
            this._travelLayer.y = nextY;
            if (motion.alphaFrom != null && motion.alphaTo != null) {
                const nextAlpha = motion.alphaFrom + (motion.alphaTo - motion.alphaFrom) * eased;
                this._travelLayer.alpha = nextAlpha;
            }
            if (motion.elapsed >= motion.duration) {
                if (motion.mode === "exit") {
                    this._travelLayer.y = motion.to;
                    if (motion.alphaTo != null) {
                        this._travelLayer.alpha = motion.alphaTo;
                    }
                    this._travelLayerMotion = null;
                    this.finishSceneExit();
                    return true;
                }
                this._travelLayer.y = motion.to;
                if (motion.alphaTo != null) {
                    this._travelLayer.alpha = motion.alphaTo;
                }
                this._travelLayerMotion = null;
            }
            return !!this._travelLayerMotion;
        }

        easeOutBack(t, overshoot = 1.70158) {
            const s = overshoot;
            const inv = t - 1;
            return inv * inv * ((s + 1) * inv + s) + 1;
        }

        easeInCubic(t) {
            return t * t * t;
        }

        getTimelineValues() {
            return {
                progress: $gameVariables.value(CONFIG.vars.progress),
                date: $gameVariables.value(CONFIG.vars.date),
                time: $gameVariables.value(CONFIG.vars.time)
            };
        }

        getCurrentHeroineSpotKey(timeline = this.getTimelineValues()) {
            const progressKey = normalizeTimelineKey(timeline.progress);
            const dateKey = normalizeTimelineKey(timeline.date);
            const timeKey = normalizeTimelineKey(timeline.time);
            if (progressKey == null || dateKey == null || timeKey == null) return null;
            const overrideSpot = this.getOverrideSpotKey(progressKey, dateKey, timeKey);
            if (overrideSpot) {
                return overrideSpot;
            }
            const progressData = CONFIG.schedule[progressKey];
            if (!progressData) return null;
            const dateData = progressData[dateKey];
            if (!dateData) return null;
            return dateData[timeKey] || null;
        }

        getOverrideSpotKey(progressKey, dateKey, timeKey) {
            const progressData = CONFIG.heroineSpotOverrides[progressKey];
            if (!progressData) return null;
            const dateData = progressData[dateKey];
            if (!dateData) return null;
            const overrides = dateData[timeKey];
            if (!overrides || !overrides.length) return null;
            for (const override of overrides) {
                if (this.doesSpotOverrideApply(override)) {
                    return override.spotKey;
                }
            }
            return null;
        }

        doesSpotOverrideApply(override) {
            let conditionDefined = false;
            let triggered = false;
            if (override.switchId > 0) {
                conditionDefined = true;
                if (!$gameSwitches.value(override.switchId)) {
                    triggered = true;
                }
            }
            if (override.variableId > 0) {
                conditionDefined = true;
                const value = $gameVariables.value(override.variableId);
                const meetsMin = override.minValue == null || value >= override.minValue;
                const meetsMax = override.maxValue == null || value <= override.maxValue;
                if (meetsMin && meetsMax) {
                    triggered = true;
                }
            }
            if (!conditionDefined) {
                return true;
            }
            return triggered;
        }

        getHeroineSwitchStateEntry(timeline = this.getTimelineValues()) {
            const progressKey = normalizeTimelineKey(timeline.progress);
            const dateKey = normalizeTimelineKey(timeline.date);
            const timeKey = normalizeTimelineKey(timeline.time);
            if (progressKey == null || dateKey == null || timeKey == null) return null;
            const progressData = CONFIG.heroineSwitchStates[progressKey];
            if (!progressData) return null;
            const dateData = progressData[dateKey];
            if (!dateData) return null;
            return dateData[timeKey] || null;
        }

        getHeroineAppearance(timeline = this.getTimelineValues()) {
            const defaultImage = CONFIG.images.heroine;
            const eventImage = CONFIG.images.heroineEvent || defaultImage;

            // オーバーライドルールを優先的にチェック（リストの数値が大きい順にチェック）
            const override = this.getHeroineImageOverride(timeline);
            if (override) {
                if (override.forceEventImage) {
                    // スイッチに関係なく常にイベント発生時画像を表示
                    return { image: eventImage, eventActive: true };
                }
                // スイッチ条件に応じて判定
                if (override.switchId > 0) {
                    const switchValue = $gameSwitches.value(override.switchId);
                    if (override.switchState === 'on' && switchValue) {
                        return { image: eventImage, eventActive: true };
                    }
                    if (override.switchState === 'off' && !switchValue) {
                        return { image: eventImage, eventActive: true };
                    }
                } else if (override.switchState === 'ignore') {
                    // スイッチ無視の場合は常にイベント画像
                    return { image: eventImage, eventActive: true };
                }
            }

            // 通常のスイッチ監視設定をチェック
            const state = this.getHeroineSwitchStateEntry(timeline);
            if (!state) {
                return { image: defaultImage, eventActive: false };
            }
            const switches = [state.switch1, state.switch2, state.switch3].filter(s => s != null);
            if (switches.length === 0) {
                return { image: defaultImage, eventActive: false };
            }
            const allOn = switches.every(switchId => $gameSwitches.value(switchId));
            if (allOn) {
                return { image: defaultImage, eventActive: false };
            }
            return { image: eventImage, eventActive: true };
        }

        getHeroineImageOverride(timeline = this.getTimelineValues()) {
            const progress = timeline.progress;
            const date = timeline.date;
            const time = timeline.time;

            // リストの数値が大きい順（既にソート済み）にチェック
            for (const override of CONFIG.heroineImageOverrides) {
                if (override.progress !== progress) continue;
                if (override.date !== date) continue;
                if (override.time !== time) continue;

                // 条件チェック
                let matches = false;

                if (override.forceEventImage) {
                    // 常にイベント画像を表示する設定
                    matches = true;
                } else if (override.switchId > 0) {
                    // スイッチ判定あり
                    const switchValue = $gameSwitches.value(override.switchId);
                    if (override.switchState === 'on' && switchValue) {
                        matches = true;
                    } else if (override.switchState === 'off' && !switchValue) {
                        matches = true;
                    } else if (override.switchState === 'ignore') {
                        matches = true;
                    }
                } else if (override.switchState === 'ignore') {
                    // スイッチ無視
                    matches = true;
                }

                if (matches) {
                    return override;
                }
            }
            return null;
        }

        updateHeroineAppearance(force = false) {
            if (!this._heroineSprite) return;
            const timeline = this.getTimelineValues();
            const spotKey = this.getCurrentHeroineSpotKey(timeline);
            const spot = spotKey ? CONFIG.spots[spotKey] : null;
            const appearance = this.getHeroineAppearance(timeline);
            const imageName = appearance.image;
            if (!spot || !imageName) {
                this._heroineSprite.visible = false;
                this._heroineSprite.setSpotKey(null);
                this._heroineSprite.setEventGlowEnabled(false);
                return;
            }
            if (force || this._heroineSprite.getImageName() !== imageName) {
                this._heroineSprite.setPicture(imageName);
            }
            if (force || this._heroineSprite.getSpotKey() !== spotKey ||
                this._heroineSprite.getBaseX() !== spot.x ||
                this._heroineSprite.getBaseY() !== spot.y) {
                this._heroineSprite.setBasePosition(spot.x, spot.y);
                this._heroineSprite.setSpotKey(spotKey);
            }
            this._heroineSprite.visible = true;
            this._heroineSprite.setEventGlowEnabled(appearance.eventActive);
        }

        playOpenSe() {
            playConfiguredSe(CONFIG.se.open);
        }

        playCloseSe() {
            playConfiguredSe(CONFIG.se.close);
        }

        playTravelSe() {
            playConfiguredSe(CONFIG.se.travel);
        }

        exitScene(beforePopCallback, suppressCloseSe = false) {
            if (!this._pendingSceneExit) {
                this._pendingSceneExit = {
                    beforePopCallback,
                    suppressCloseSe
                };
            } else {
                if (!this._pendingSceneExit.beforePopCallback && beforePopCallback) {
                    this._pendingSceneExit.beforePopCallback = beforePopCallback;
                }
                this._pendingSceneExit.suppressCloseSe =
                    this._pendingSceneExit.suppressCloseSe || suppressCloseSe;
            }
            if (this._travelLayer) {
                this.startTravelLayerExit();
            } else {
                this.finishSceneExit();
            }
        }

        finishSceneExit() {
            if (!this._pendingSceneExit) return;
            const { beforePopCallback, suppressCloseSe } = this._pendingSceneExit;
            this._pendingSceneExit = null;
            if (beforePopCallback) {
                beforePopCallback();
            }
            if (!suppressCloseSe) {
                this.playCloseSe();
            }
            this.popScene();
        }
    }

    class Sprite_HeroineIcon extends Sprite_Clickable {
        constructor() {
            super();
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this._spotKey = null;
            this._imageName = null;
            this._eventGlowEnabled = false;
            this._spotBaseX = 0;
            this._spotBaseY = 0;
            this._currentOffsetX = 0;
            this._wiggleState = "pause";
            this._wiggleTimer = 0;
            this._wiggleDuration = 30;
            this._wiggleInterval = 60;
            this._wiggleAmplitude = 2;
            this._debugMode = false;
            this.resetEventGlow();
        }

        update() {
            super.update();
            this.updateEventGlow();
        }

        setPicture(name) {
            if (this._imageName === name) return;
            this._imageName = name;
            this.bitmap = name ? ImageManager.loadPicture(name) : null;
        }

        setBasePosition(x, y) {
            this._spotBaseX = x;
            this._spotBaseY = y;
            this.updatePositionWithOffset();
        }

        getBaseX() {
            return this._spotBaseX;
        }

        getBaseY() {
            return this._spotBaseY;
        }

        updatePositionWithOffset() {
            this.x = this._spotBaseX + this._currentOffsetX;
            this.y = this._spotBaseY;
        }

        setSpotKey(key) {
            this._spotKey = key;
        }

        getSpotKey() {
            return this._spotKey;
        }

        getImageName() {
            return this._imageName;
        }

        setEventGlowEnabled(enabled) {
            if (this._eventGlowEnabled === enabled) return;
            this._eventGlowEnabled = enabled;
            if (!enabled) {
                this.resetEventGlow();
            } else {
                this._wiggleState = "active";
                this._wiggleTimer = 0;
            }
        }

        setDebugMode(enabled) {
            this._debugMode = enabled;
            if (enabled) {
                this.resetEventGlow();
            }
        }

        resetEventGlow() {
            this._currentOffsetX = 0;
            this.updatePositionWithOffset();
            this.alpha = 1;
            this._wiggleState = "pause";
            this._wiggleTimer = 0;
        }

        updateEventGlow() {
            if (this._debugMode || !this._eventGlowEnabled) return;
            if (this._wiggleState === "pause") {
                if (this._wiggleTimer > 0) {
                    this._wiggleTimer--;
                    return;
                }
                this._wiggleState = "active";
                this._wiggleTimer = 0;
            }
            this._wiggleTimer++;
            const progress = this._wiggleTimer / this._wiggleDuration;
            const offset = Math.sin(progress * Math.PI * 2) * this._wiggleAmplitude;
            this._currentOffsetX = offset;
            this.updatePositionWithOffset();
            if (this._wiggleTimer >= this._wiggleDuration) {
                this._wiggleState = "pause";
                this._wiggleTimer = this._wiggleInterval;
                this._currentOffsetX = 0;
                this.updatePositionWithOffset();
            }
        }
    }
    // Expose for external plugins
    window.Sprite_HeroineIcon = Sprite_HeroineIcon;

    class Sprite_FastTravelLabel extends Sprite_Clickable {
        constructor(text) {
            super();
            this._text = text;
            this.anchor.x = 0.5;
            this.anchor.y = 0;
            this._enabled = true;
            this._clickCallback = null;
            this._hovered = false;
            this._forceHidden = false;
            this._highlightMode = false;
            this._highlighted = false;
            this.createBitmap();
        }

        createBitmap() {
            const fontSize = CONFIG.labelFont.size || 24;
            const fontFace = CONFIG.labelFont.face;
            const paddingX = 8;
            const paddingY = 6;
            const temp = new Bitmap(1, 1);
            temp.fontSize = fontSize;
            if (fontFace) {
                temp.fontFace = fontFace;
            }
            const textWidth = temp.measureTextWidth(this._text);
            const width = Math.max(48, Math.ceil(textWidth) + paddingX * 2);
            const height = fontSize + paddingY * 2;
            this.bitmap = new Bitmap(width, height);
            this.bitmap.fontSize = fontSize;
            if (fontFace) {
                this.bitmap.fontFace = fontFace;
            }
            if (CONFIG.labelBackgroundEnabled) {
                this.bitmap.paintOpacity = 160;
                this.bitmap.fillRect(0, 0, width, height, "rgba(0, 0, 0, 0.5)");
                this.bitmap.paintOpacity = 255;
            }
            this.bitmap.textColor = "#ffffff";
            this.bitmap.drawText(this._text, 0, paddingY, width, fontSize, "center");
        }

        setEnabled(enabled) {
            if (this._enabled === enabled) return;
            this._enabled = enabled;
            this.updateVisualState();
        }

        setClickCallback(callback) {
            this._clickCallback = callback;
        }

        setHover(hovered) {
            if (this._hovered === hovered) return;
            this._hovered = hovered;
            this.updateVisualState();
        }

        setForceHidden(hidden) {
            if (this._forceHidden === hidden) return;
            this._forceHidden = hidden;
            this.updateVisualState();
        }

        setHighlightMode(mode) {
            if (this._highlightMode === mode) return;
            this._highlightMode = mode;
            this.updateVisualState();
        }

        setHighlight(highlight) {
            if (this._highlighted === highlight) return;
            this._highlighted = highlight;
            this.updateVisualState();
        }

        isInteractableForPointer() {
            return this.visible && !this._forceHidden;
        }

        isHovering() {
            return this._hovered;
        }

        updateVisualState() {
            if (this._forceHidden) {
                this.alpha = 0;
                this.visible = false;
                return;
            }
            this.visible = true;
            const highlightMode = this._highlightMode;
            const highlight = this._highlighted;
            const bright = highlight || this._hovered;
            const baseAlpha = highlightMode
                ? (this._enabled ? 0.6 : 0.3)
                : (this._enabled ? 1.0 : 0.5);
            const alpha = bright
                ? Math.min(baseAlpha + 0.4, 1.0)
                : baseAlpha * (highlightMode ? 0.9 : 0.85);
            this.alpha = alpha;
            const blend = bright ? [64, 64, 64, 0] : [0, 0, 0, 0];
            this.setBlendColor(blend);
            const scale = highlightMode && highlight ? 1.08 : 1.0;
            this.scale.x = scale;
            this.scale.y = scale;
        }

        onClick() {
            if (!this._enabled) return;
            if (this._clickCallback) {
                this._clickCallback();
            }
        }
    }

    // ----------------------------------------------------------------------
    // 確認ウィンドウクラス
    // ----------------------------------------------------------------------
    class Window_FastTravelConfirm extends Window_Command {
        initialize(rect) {
            this._locationName = "";
            super.initialize(rect);
        }

        setInfo(name) {
            this._locationName = name;
            this.refresh();
        }

        makeCommandList() {
            this.addCommand("Yes", "yes");
            this.addCommand("No", "no");
        }

        // ウィンドウの上部に文字を表示するための描画処理
        refresh() {
            super.refresh();
            const rect = this.itemLineRect(0);
            rect.y -= this.lineHeight(); // コマンドの1行上に描画
            this.drawText(`${this._locationName} Move to this Area？`, 0, 0, this.innerWidth, "center");
        }

        // コマンドの表示位置を下げる
        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += this.lineHeight(); // 文字表示分下げる
            return rect;
        }
    }

    // ----------------------------------------------------------------------
    // Scene_Map 拡張（ファストトラベル復帰トランジション）
    // ----------------------------------------------------------------------
    const FAST_TRAVEL_TRANSITION_FLAG = "_fastTravelNeedsShowTransition";

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        if ($gameTemp[FAST_TRAVEL_TRANSITION_FLAG]) {
            delete $gameTemp[FAST_TRAVEL_TRANSITION_FLAG];
            this.playFastTravelReturnTransition();
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        updatePendingBathTransfer();
    };

    Scene_Map.prototype.playFastTravelReturnTransition = function () {
        if (typeof this.showScreenWithPreset !== "function" ||
            typeof this.presetTransitionSpeed !== "function" ||
            typeof this.needsPresetTransition !== "function") {
            return;
        }
        const type = "Transfer Player (Show)";
        if (!this.needsPresetTransition(type)) return;
        const duration = this.presetTransitionSpeed(type);
        this.showScreenWithPreset(duration, type);
    };

    window.Scene_FastTravel = Scene_FastTravel;
})();