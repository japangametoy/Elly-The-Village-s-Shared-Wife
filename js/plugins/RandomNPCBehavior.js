/*:
 * @target MZ
 * @plugindesc [Ver1.5] ランダムNPC行動・時間経過管理システム

 * @help
 * 進行度5におけるNPCのランダム配置およびHステータスパラメータの変動を管理します。
 * ゲーム内変数（進行度・日付・時間）の変化を監視し、自動的に処理を実行します。
 * 
 * ■ Ver1.5 更新
 * - 妊娠ステータス(pregStats)の実装
 * - 身体部位テキストの妊娠/通常切り替え(normal/pregnancy)
 * - パートナーID4(村人・老)への妊娠時ステータス分岐追加
 *
 * @param SwitchesToResetAtProgress5
 * @text 進行度5時間経過時OFFスイッチ
 * @type switch[]
 * @default []
 * @desc 進行度が5の時に時間が経過した際、自動的にOFFにするスイッチのリスト。
 *
 * @param PartnerImages
 * @text パートナー画像設定
 * @type struct<PartnerImage>[]
 * @desc パートナーIDごとの表示画像設定。
 * 
 * @param DualIconOffset
 * @text 2人表示時のオフセットX(px)
 * @type number
 * @default 18
 * @desc ヒロインとパートナーを並べて表示する際の、中心からのずらし幅（X方向）。
 *
 * @param DualIconOffsetY
 * @text 2人表示時のオフセットY(px)
 * @type number
 * @default 0
 * @min -999
 * @desc パートナー表示時のY方向の調整値。
 *
 * @command CheckPregnancyImmediate
 * @text 妊娠判定の即時実行
 * @desc 現在の時間帯の妊娠判定を即時実行します。実行後は時間経過時の判定がスキップされます。
 *
 * @arg forceEventId
 * @text 強制イベントID
 * @desc 妊娠確定時に実行するコモンイベントID。0の場合は実行しません。
 * @type common_event
 * @default 0
 *
 * @arg force
 * @text 強制妊娠
 * @desc ONにすると確率を無視して確実に妊娠させます。
 * @type boolean
 * @default false
 *
 * @command ForceNextSchedule
 * @text 次回スケジュール強制
 * @desc 次に更新される時間帯のイベントを強制的に指定します。
 *
 * @arg partnerId
 * @text パートナーID
 * @desc 強制するパートナーID（7:連続ダリオ, 8:連続村長, 9:連続子供, 他も指定可）
 * @type number
 * @default 7
 *
 * @command ForcePregnancy
 * @text 次回妊娠確定
 * @desc 次の妊娠判定タイミングで確実に妊娠させます。


 * @command ForceNextDayPartner
 * @text 翌日相手固定(デバッグ)
 * @desc 次の日付更新時の出現NPCを全ての時間帯で指定したIDに固定します。
 *
 * @arg partnerId
 * @text パートナーID
 * @desc 固定するパートナーID
 * @type select
 * @option ダリオ
 * @value 1
 * @option 村長
 * @value 2
 * @option 子供たち
 * @value 3
 * @option 親父
 * @value 4
 * @option モブ
 * @value 5
 * @option 解除(ランダム)
 * @value 0
 * @default 1
 *
 * @param ProgressVarId
 * @text 進行度変数ID
 * @type variable
 * @default 1
 *
 * @param DateVarId
 * @text 日付変数ID
 * @type variable
 * @default 2
 *
 * @param TimeVarId
 * @text 時間変数ID
 * @type variable
 * @default 3
 *
 * @param CurrentPartnerVarId
 * @text 現在の相手変数ID
 * @type variable
 * @default 101
 *
 * @param CurrentLocationVarId
 * @text 現在の場所変数ID
 * @type variable
 * @default 102
 *
 * @param ContinuousEventCommonId
 * @text 連続イベント開始コモンID
 * @type common_event
 * @default 0
 * @desc 連続イベント（デート等）が確定した瞬間に実行されるコモンイベント。
 *
 * @param ContinuousEventSwitchId
 * @text 連続イベント中スイッチID
 * @type switch
 * @default 0
 * @desc 連続イベントが発生している日の間、ONになるスイッチID。翌日(非連続なら)OFFになります。
 *
 * @param PregnancySwitchId
 * @text 妊娠中スイッチID
 * @type switch
 * @default 52
 *
 * @param PregnantPartnerVarId
 * @text 妊娠相手変数ID
 * @type variable
 * @default 103
 *
 * @param PregnantPartnerFixedVarId
 * @text 妊娠相手確定変数ID
 * @type variable
 * @default 104
 *
 * @param ContinuousEventCommonId
 * @text 連続イベント発生時コモン
 * @type common_event
 * @default 0
 *
 * @param PregnancyPartnerNameVariableId
 * @text 妊娠相手名変数ID
 * @type variable
 * @default 0
 * @desc 妊娠確定時に、相手の名前（文字列）を代入する変数のID。0で無効。
 *
 * @param PregnancyProbability
 * @text 妊娠確率
 * @type number
 * @decimals 3
 * @default 0.05
 * @desc 妊娠判定時の確率。0.05で5%、1で100%になります。
 *
 * @param PregnancyProbabilityImmediate
 * @text 妊娠確率(強制用)
 * @type number
 * @decimals 3
 * @default 
 * @desc CheckPregnancyImmediate実行時の確率。空欄時は通常の「妊娠確率」を使用します。
 *
 * @param PregnancyPartnerNames
 * @text 妊娠相手名リスト
 * @type struct<PartnerName>[]
 * @desc パートナーIDごとの名前定義。妊娠確定時にこの名前が変数に代入されます。
 *
 * @param PregnancyEventCommonId
 * @text 妊娠発覚時コモン
 * @type common_event
 * @default 0
 * 
 * @param BodyPartVariables
 * @text 身体部位変数設定
 * 
 * @param LipVarId
 * @text Lip変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 210
 * 
 * @param BustVarId
 * @text Bust変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 211
 * 
 * @param PussyVarId
 * @text Pussy変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 212
 * 
 * @param HipVarId
 * @text Hip変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 213
 * 
 * @param LipIconVarId
 * @text Lipアイコン変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 220
 * 
 * @param BustIconVarId
 * @text Bustアイコン変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 221
 * 
 * @param PussyIconVarId
 * @text Pussyアイコン変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 222
 * 
 * @param HipIconVarId
 * @text Hipアイコン変数ID
 * @parent BodyPartVariables
 * @type variable
 * @default 223
 * 
 * @param CounterVariables
 * @text カウンター変数設定
 * 
 * @param CountFriendVariableId
 * @text countFriend変数ID
 * @parent CounterVariables
 * @type variable
 * @default 202
 * 
 * @param CountMayorVariableId
 * @text countMayor(Chief)変数ID
 * @parent CounterVariables
 * @type variable
 * @default 203
 * 
 * @param CountKidVariableId
 * @text countKid変数ID
 * @parent CounterVariables
 * @type variable
 * @default 204
 * 
 * @param CountUncleVariableId
 * @text countUncle(Mob)変数ID
 * @parent CounterVariables
 * @type variable
 * @default 205
 * 
 * @param CountCondomVariableId
 * @text countCondom変数ID
 * @parent CounterVariables
 * @type variable
 * @default 206
 * 
 * @param CountRawVariableId
 * @text countRaw変数ID
 * @parent CounterVariables
 * @type variable
 * @default 207
 * 
 * @param CountAssVariableId
 * @text countAss変数ID
 * @parent CounterVariables
 * @type variable
 * @default 208
 * 
 * @param CountBreastVariableId
 * @text countBreast変数ID
 * @parent CounterVariables
 * @type variable
 * @default 209
 * 
 * @param CountHandVariableId
 * @text countHand変数ID
 * @parent CounterVariables
 * @type variable
 * @default 210
 * 
 * @param CountLiquidVariableId
 * @text countLiquid変数ID
 * @parent CounterVariables
 * @type variable
 * @default 211
 * 
 * @param CountPregnantVariableId
 * @text countPregnant変数ID
 * @parent CounterVariables
 * @type variable
 * @default 212
 * 
 * @param CountTotalVariableId
 * @text countTotal変数ID
 * @parent CounterVariables
 * @type variable
 * @default 213
 * 
 * @param CountMouthVariableId
 * @text countMouth変数ID
 * @parent CounterVariables
 * @type variable
 * @default 214
 *
 * @param OverrideMapIdSettings
 * @text 【進行度5】マップID置換設定
 * 
 * @param OverrideMapIdHome
 * @parent OverrideMapIdSettings
 * @text マップ53（自宅周辺）の置換先
 * @type number
 * @default 0
 * @desc 進行度5の時、マップID 53への移動をこのIDに置換します。0で無効。
 * 
 * @param OverrideMapIdMansion
 * @parent OverrideMapIdSettings
 * @text マップ20（屋敷道）の置換先
 * @type number
 * @default 0
 * @desc 進行度5の時、マップID 20への移動をこのIDに置換します。0で無効。
 *
 */

/*~struct~PartnerImage:
 * @param id
 * @text パートナーID
 * @type number
 * @desc 1:幼馴染, 2:村長, 3:ダリオ, 4:村人(老), 5:村人(若)
 * 
 * @param image
 * @text 表示画像
 * @type file
 * @dir img/pictures
 * @desc 表示する画像ファイル。
 */

/*~struct~PartnerName:
 * @param id
 * @text パートナーID
 * @type number
 * @desc パートナーのID。
 * 
 * @param name
 * @text 名前
 * @type string
 * @desc 変数に代入される名前。
 */

(() => {
    'use strict';

    const pluginName = "RandomNPCBehavior";
    const parameters = PluginManager.parameters(pluginName);

    const PARAMS = {
        progressVarId: Number(parameters['ProgressVarId'] || 1),
        dateVarId: Number(parameters['DateVarId'] || 2),
        timeVarId: Number(parameters['TimeVarId'] || 3),

        currentPartnerVarId: Number(parameters['CurrentPartnerVarId'] || 101),
        currentLocationVarId: Number(parameters['CurrentLocationVarId'] || 102),

        pregnancySwitchId: Number(parameters['PregnancySwitchId'] || 51),
        pregnantPartnerVarId: Number(parameters['PregnantPartnerVarId'] || 103),
        pregnantPartnerFixedVarId: Number(parameters['PregnantPartnerFixedVarId'] || 104),

        continuousEventCommonId: Number(parameters['ContinuousEventCommonId'] || 0),
        pregnancyEventCommonId: Number(parameters['PregnancyEventCommonId'] || 0),
        pregnancyPartnerNameVarId: Number(parameters['PregnancyPartnerNameVariableId'] || 0),
        pregnancyProbability: parameters['PregnancyProbability'] !== undefined ? Number(parameters['PregnancyProbability']) : 0.05,
        pregnancyProbabilityImmediate: parameters['PregnancyProbabilityImmediate'] && parameters['PregnancyProbabilityImmediate'].trim() !== "" ? Number(parameters['PregnancyProbabilityImmediate']) : null,

        pregnancyPartnerNames: ((params) => {
            if (!params) return {};
            try {
                const list = JSON.parse(params);
                const map = {};
                list.forEach(item => {
                    const data = JSON.parse(item);
                    map[Number(data.id)] = data.name;
                });
                return map;
            } catch (e) {
                console.error("Failed to parse PregnancyPartnerNames", e);
                return {};
            }
        })(parameters['PregnancyPartnerNames']),

        bodyParts: {
            lip: { text: Number(parameters['LipVarId'] || 210), icon: Number(parameters['LipIconVarId'] || 220) },
            bust: { text: Number(parameters['BustVarId'] || 211), icon: Number(parameters['BustIconVarId'] || 221) },
            pussy: { text: Number(parameters['PussyVarId'] || 212), icon: Number(parameters['PussyIconVarId'] || 222) },
            hip: { text: Number(parameters['HipVarId'] || 213), icon: Number(parameters['HipIconVarId'] || 223) }
        },

        vars: {
            countFriend: Number(parameters['CountFriendVariableId'] || 202),
            countMayor: Number(parameters['CountMayorVariableId'] || 203),
            countKid: Number(parameters['CountKidVariableId'] || 204),
            countUncle: Number(parameters['CountUncleVariableId'] || 205),
            countCondom: Number(parameters['CountCondomVariableId'] || 206),
            countRaw: Number(parameters['CountRawVariableId'] || 207),
            countAss: Number(parameters['CountAssVariableId'] || 208),
            countBreast: Number(parameters['CountBreastVariableId'] || 209),
            countHand: Number(parameters['CountHandVariableId'] || 210),
            countLiquid: Number(parameters['CountLiquidVariableId'] || 211),
            countPregnant: Number(parameters['CountPregnantVariableId'] || 212),
            countTotal: Number(parameters['CountTotalVariableId'] || 213),
            countMouth: Number(parameters['CountMouthVariableId'] || 214)
        },

        switchesToResetAtProgress5: (JSON.parse(parameters['SwitchesToResetAtProgress5'] || '[]')).map(Number),

        overrideMapIds: {
            home: Number(parameters['OverrideMapIdHome'] || 0),
            mansion: Number(parameters['OverrideMapIdMansion'] || 0)
        },

        partnerImages: ((params) => {
            if (!params) return {};
            try {
                const list = JSON.parse(params);
                const map = {};
                list.forEach(item => {
                    const data = JSON.parse(item);
                    map[Number(data.id)] = data.image;
                });
                return map;
            } catch (e) {
                console.error("Failed to parse PartnerImages", e);
                return {};
            }
        })(parameters['PartnerImages']),
        dualIconOffset: Number(parameters['DualIconOffset'] || 18),
        dualIconOffsetY: Number(parameters['DualIconOffsetY'] || 0)
    };

    // Load Body Texts JSON
    DataManager.loadDataFile("$dataRandomNPCBodyTexts", "RandomNPC_BodyTexts.json");

    // Totalに加算されるキー
    const TOTAL_ADD_KEYS = ["countRaw", "countMouth", "countAss", "countBreast", "countHand"];

    // アイコン接頭辞マッピング (IDベース)
    const ICON_MAPPING = {
        "1": "Dalio",   // Friend
        "2": "Chief",   // Cheif
        "3": "Kids",    // Kids
        "4": "Mob",     // Mob
        "5": "Mob",     // Mobs
        "6": null,      // Free
        "7": "Dalio",   // Friend Continuous
        "8": "Chief",   // Cheif Continuous
        "9": "Kids"     // Kids Continuous
    };

    // ============================================================================
    // ハードコード設定リスト
    // ============================================================================

    const CONST_LOCATIONS = {
        "Home": {
            name: "自宅",
            switchId: 111,
            animSwitches: { 0: 112, 1: 113, 2: 114 }
        },
        "North": {
            name: "北口",
            switchId: 115,
            animSwitches: { 0: 116, 1: 117, 2: 118 }
        },
        "Inn": {
            name: "宿屋",
            switchId: 119,
            animSwitches: { 0: 120, 1: 121, 2: 122 }
        },
        "CheifHouse": {
            name: "村長の家",
            switchId: 123,
            animSwitches: { 0: 124, 1: 125, 2: 126 }
        },
        "DalioHouse": {
            name: "ダリオの家",
            switchId: 127,
            animSwitches: { 0: 128, 1: 129, 2: 130 }
        },
        "Mansion": {
            name: "屋敷",
            switchId: 131,
            animSwitches: { 0: 132, 1: 133, 2: 134 }
        },
        "Bath": {
            name: "浴場",
            switchId: 135,
            animSwitches: { 0: 136, 1: 137, 2: 138 }
        },
        "Townsquare": {
            name: "広場",
            switchId: 139,
            animSwitches: { 0: 140, 1: 141, 2: 142 }
        },
        "OldmanHouse": {
            name: "老人の家",
            switchId: 143,
            animSwitches: { 0: 144, 1: 145, 2: 146 }
        },
        "Hole": {
            name: "穴",
            switchId: 147,
            animSwitches: { 0: 148, 1: 149, 2: 150 }
        }
    };

    /**
     * パートナー定義データ
     * 
     * ■変数加算ルールの説明
     * - randomAddAmount: randomステータスの加算を行う総回数。
     * - stats:
     *   - fixed: 確定で加算される変数キーのリストまたはオブジェクト。
     *       リストの場合: 各変数が+1されます (例: ["countFriend"])
     *       オブジェクトの場合: 指定した値が加算されます (例: { "countRaw": 3 })
     *   - random: 重み付け抽選で選ばれる変数キーと重み(weight)。
     *     randomAddAmountの回数分だけ抽選を行い、当選した変数を+1します。
     *     (例: { "A": 3, "B": 2 } の場合、Aが選ばれる確率は 3/5、Bは 2/5)
     */
    const CONST_PARTNERS = {
        "1": { // Friend
            name: "幼馴染",
            randomAddAmount: 2,
            stats: {
                fixed: { "countRaw": 3 },
                random: { "countBreast": 1, "countHand": 1 }
            },
            pregStats: {
                randomAddAmount: 4, // 妊娠時はこちらが優先
                fixed: { "countRaw": 1 },
                random: { "countBreast": 3, "countHand": 2, "countMouth": 3 }
            },
            // 未定義時は通常を使用
            // bodyTexts removed (Moved to JSON)
            locations: [
                { time: 0, keys: ["North"] },
                { time: -1, keys: ["DalioHouse", "Home"] }
            ]
        },
        "2": { // Cheif
            name: "村長",
            randomAddAmount: 2,
            stats: {
                fixed: { "countRaw": 3 },
                random: { "countMouth": 1, "countBreast": 2 }
            },
            pregStats: {
                randomAddAmount: 4, // 妊娠時はこちらが優先
                fixed: { "countRaw": 1 },
                random: { "countBreast": 1, "countMouth": 1 }
            },
            locations: [
                { time: -1, keys: ["CheifHouse"] }
            ]
        },
        "3": { // Kids
            name: "子供達",
            randomAddAmount: 2,
            stats: {
                fixed: { "countRaw": 6 },
                random: { "countBreast": 1, "countMouth": 1 }
            },
            pregStats: null,
            locations: [
                { time: -1, keys: ["Mansion"] }
            ]
        },
        "4": { // Mob (Old Man)
            name: "村人(老)",
            randomAddAmount: 0,
            stats: {
                fixed: { "countAss": 4 },
                random: {}
            },
            // [Pregnancy Logic] 妊娠中ステータス
            pregStats: {
                fixed: { "countRaw": 4 },
                random: {}
            },
            locations: [
                { time: -1, keys: ["OldmanHouse"] }
            ]
        },
        "5": { // Mobs
            name: "村人",
            randomAddAmount: 8,
            stats: {
                fixed: { "countRaw": 6 },
                random: { "countMouth": 3, "countHand": 2, "countAss": 1, "countBreast": 1 }
            },
            pregStats: {
                randomAddAmount: 10, // 妊娠時はこちらが優先
                fixed: { "countRaw": 4 },
                random: { "countBreast": 2, "countMouth": 2, "countAss": 1, "countHand": 2 }
            },
            // 特定の日時で抽選から除外する設定
            exclude: [
                { date: 3, time: 1 }
            ],
            locations: [
                { time: 0, keys: ["North"] },
                { time: 1, keys: ["Townsquare"] },
                { time: 2, keys: ["Inn"] },
                { time: 3, keys: ["Home"] }
            ]
        },
        "6": { // Free
            name: "フリー",
            randomAddAmount: 0,
            stats: {},
            pregStats: null,
            locations: [
                { time: 0, keys: ["North"] }, //洗濯
                { time: 1, keys: ["Hole"] }, //グローリーホール
                { time: 2, keys: ["Inn"] }, //接客
                { time: 3, keys: ["Home"] } //帰宅
            ]
        },
        "7": { // Friend Continuous
            name: "幼馴染(連)",
            randomAddAmount: 3,
            stats: {
                fixed: { "countRaw": 2 },
                random: { "countBreast": 1, "countHand": 1 }
            },
            pregStats: {
                randomAddAmount: 4, // 妊娠時はこちらが優先
                fixed: { "countRaw": 1 },
                random: { "countBreast": 3, "countHand": 2, "countMouth": 3 }
            },
            // 未定義時は通常を使用
            // bodyTexts removed (Moved to JSON)
            locations: [
                { time: 0, keys: ["North"] }, //連続イベント時はlocationは無視されるDalioHouse固定！lockey参照                { time: -1, keys: ["DalioHouse", "Home"] }
            ]
        },
        "8": { // Cheif Continuous
            name: "村長(連)",
            randomAddAmount: 2,
            stats: {
                fixed: { "countRaw": 3 },
                random: { "countMouth": 1, "countBreast": 2 }
            },
            pregStats: {
                randomAddAmount: 4, // 妊娠時はこちらが優先
                fixed: { "countRaw": 1 },
                random: { "countBreast": 1, "countMouth": 1 }
            },
            locations: [
                { time: -1, keys: ["CheifHouse"] }
            ]
        },
        "9": { // Kids Continuous
            name: "子供達(連)",
            randomAddAmount: 2,
            stats: {
                fixed: { "countRaw": 6 },
                random: { "countBreast": 1, "countMouth": 1 }
            },
            pregStats: null,
            locations: [
                { time: -1, keys: ["Mansion"] }
            ]
        }
    };

    // ============================================================================
    // 内部変数
    // ============================================================================

    // _lastTime, _lastDate は廃止し、$gameSystem._randomNPC 内で管理する
    // これによりニューゲーム時とロード時の挙動を適切に分離できる

    let _inProcessing = false;
    let _updateScheduled = false; // 更新予約フラグ

    // Debug Force Flags
    let _forceNextPartnerId = 0;
    let _forceNextPregnancy = false;

    // 連続イベント状態保持
    const KEY_CONTINUOUS_EVENT = "RandomNPC_ContinuousEvent";
    const KEY_PREVIOUS_PARTNER = "RandomNPC_PreviousPartner";

    // ============================================================================
    // Game_System 拡張
    // ============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._randomNPC = {
            continuousEvent: null,
            pregnancyPartners: [],
            pregnancyEventPending: false, // 妊娠発覚イベント待ちフラグ
            checkedTimeKeys: {}, // 妊娠判定済み時間帯キー { "date-time": true }
            firstWeekPassed: false, // 最初の週経過フラグ
            dailySchedule: [], // { partnerId, locationKey } for time 0-3
            lastDate: 0, // ニューゲーム時の初期値
            lastTime: 0,  // ニューゲーム時の初期値
            forceNextDayPartnerId: 0 // デバッグ用：翌日固定パートナーID
        };
    };

    Game_System.prototype.resetRandomNPCInternalState = function () {
        // 進行度5リセット時は現在時刻に同期させる（リセット直後の過剰反応を防ぐため）
        this.ensureRandomNPCData();
        this._randomNPC.lastDate = $gameVariables.value(PARAMS.dateVarId);
        this._randomNPC.lastTime = $gameVariables.value(PARAMS.timeVarId);
        _inProcessing = false;
        if (this._randomNPC) {
            this._randomNPC.checkedTimeKeys = {};
            this._randomNPC.dailySchedule = [];
            this._randomNPC.continuousEvent = null;
        }
        console.log(`[${pluginName}] Internal state reset.`);
    };

    Game_System.prototype.setContinuousEvent = function (data) {
        if (!this._randomNPC) this._randomNPC = {};
        this._randomNPC.continuousEvent = data;
    };


    const _Scene_FastTravel_getCurrentHeroineSpotKey = window.Scene_FastTravel
        ? window.Scene_FastTravel.prototype.getCurrentHeroineSpotKey
        : null;

    if (_Scene_FastTravel_getCurrentHeroineSpotKey) {
        window.Scene_FastTravel.prototype.getCurrentHeroineSpotKey = function (timeline) {
            const progress = $gameVariables.value(PARAMS.progressVarId);
            if (progress === 5) {
                const currentKey = $gameVariables.value(PARAMS.currentLocationVarId);
                // 有効なキーであれば使用
                if (currentKey && CONST_LOCATIONS[currentKey]) {
                    return currentKey;
                }
            }
            return _Scene_FastTravel_getCurrentHeroineSpotKey.call(this, timeline);
        };

        // performFastTravelのオーバーライド (マップID置換処理)
        const _Scene_FastTravel_performFastTravel = window.Scene_FastTravel.prototype.performFastTravel;
        window.Scene_FastTravel.prototype.performFastTravel = function (node) {
            const progress = $gameVariables.value(PARAMS.progressVarId);

            // 進行度5の場合のマップID置換
            if (progress === 5) {
                const newNode = { ...node };

                if (node.mapId === 53 && PARAMS.overrideMapIds.home > 0) {
                    console.log(`[${pluginName}] MapID Override: 53 -> ${PARAMS.overrideMapIds.home}`);
                    newNode.mapId = PARAMS.overrideMapIds.home;
                } else if (node.mapId === 20 && PARAMS.overrideMapIds.mansion > 0) {
                    console.log(`[${pluginName}] MapID Override: 20 -> ${PARAMS.overrideMapIds.mansion}`);
                    newNode.mapId = PARAMS.overrideMapIds.mansion;
                }

                _Scene_FastTravel_performFastTravel.call(this, newNode);
                return;
            }

            _Scene_FastTravel_performFastTravel.call(this, node);
        };

        console.log(`[${pluginName}] Scene_FastTravel overridden successfully.`);
    } else {
        console.warn(`[${pluginName}] Scene_FastTravel not found. Ensure FastTravelSystem.js is loaded first and Scene_FastTravel is exposed.`);
    }

    // ============================================================================
    // Game_Variables 拡張 (監視フック追加)
    // ============================================================================
    // ============================================================================
    // Game_Variables 拡張 (監視フック追加)
    // ============================================================================
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        const oldValue = this.value(variableId);
        _Game_Variables_setValue.call(this, variableId, value);
        checkTriggers(variableId, value, oldValue);
    };

    // ============================================================================
    // Game_System 拡張 (続き)
    // ============================================================================

    Game_System.prototype.ensureRandomNPCData = function () {
        if (!this._randomNPC) {
            // 新規作成時はデフォルト値で初期化
            // ニューゲーム時は Game_System.initialize でこれが作られるため、
            // ここに来るのはロード直後など、_randomNPC が存在しない特殊ケースのみ
            this._randomNPC = {
                continuousEvent: null,
                pregnancyPartners: [],
                pregnancyEventPending: false,
                checkedTimeKeys: {},
                firstWeekPassed: false,
                dailySchedule: [],
                // デフォルト値: 0, 0（ニューゲーム想定）
                // 既存セーブからの移行時はこの後の else ブランチで対応
                lastDate: 0,
                lastTime: 0
            };
        } else {
            // プロパティ欠損対策 (後から追加されたプロパティ用)
            // 既存セーブデータで lastDate/lastTime が undefined の場合のみ現在値で同期
            if (this._randomNPC.dailySchedule === undefined) {
                this._randomNPC.dailySchedule = [];
            }
            if (this._randomNPC.lastDate === undefined) {
                this._randomNPC.lastDate = $gameVariables.value(PARAMS.dateVarId);
            }
            if (this._randomNPC.lastTime === undefined) {
                this._randomNPC.lastTime = $gameVariables.value(PARAMS.timeVarId);
            }
            // 妊娠判定済みキーの初期化追加 (エラー修正)
            if (this._randomNPC.checkedTimeKeys === undefined) {
                this._randomNPC.checkedTimeKeys = {};
            }
            if (this._randomNPC.forceNextDayPartnerId === undefined) {
                this._randomNPC.forceNextDayPartnerId = 0;
            }
        }
    };

    Game_System.prototype.setPregnancyEventPending = function (pending) {
        this.ensureRandomNPCData();
        this._randomNPC.pregnancyEventPending = pending;
    };

    Game_System.prototype.isPregnancyEventPending = function () {
        this.ensureRandomNPCData();
        return !!this._randomNPC.pregnancyEventPending;
    };

    Game_System.prototype.addCheckedTimeKey = function (date, time) {
        this.ensureRandomNPCData();
        const key = `${date}-${time}`;
        this._randomNPC.checkedTimeKeys[key] = true;
    };

    Game_System.prototype.isCheckedTimeKey = function (date, time) {
        this.ensureRandomNPCData();
        const key = `${date}-${time}`;
        return !!this._randomNPC.checkedTimeKeys[key];
    };

    Game_System.prototype.clearCheckedTimeKeys = function () {
        this.ensureRandomNPCData();
        this._randomNPC.checkedTimeKeys = {};
    };

    Game_System.prototype.isFirstWeekPassed = function () {
        this.ensureRandomNPCData();
        return !!this._randomNPC.firstWeekPassed;
    };

    Game_System.prototype.setFirstWeekPassed = function (value) {
        this.ensureRandomNPCData();
        this._randomNPC.firstWeekPassed = value;
    };

    Game_System.prototype.setDailySchedule = function (schedule) {
        this.ensureRandomNPCData();
        this._randomNPC.dailySchedule = schedule;
    };

    Game_System.prototype.getDailySchedule = function () {
        this.ensureRandomNPCData();
        return this._randomNPC.dailySchedule || [];
    };

    Game_System.prototype.pushPregnancyHistory = function (partnerId) {
        this.ensureRandomNPCData();
        if (!this._randomNPC.pregnancyPartners) {
            this._randomNPC.pregnancyPartners = [];
        }
        this._randomNPC.pregnancyPartners.push(partnerId);
        if (this._randomNPC.pregnancyPartners.length > 20) {
            this._randomNPC.pregnancyPartners.shift();
        }
    };

    Game_System.prototype.getContinuousEvent = function () {
        this.ensureRandomNPCData();
        return this._randomNPC.continuousEvent;
    };

    Game_System.prototype.clearContinuousEvent = function () {
        this.ensureRandomNPCData();
        this._randomNPC.continuousEvent = null;
    };

    // Getter/Setter for Last Time/Date
    Game_System.prototype.getRandomNPCLastTime = function () {
        this.ensureRandomNPCData();
        return this._randomNPC.lastTime;
    };

    Game_System.prototype.setRandomNPCLastTime = function (val) {
        this.ensureRandomNPCData();
        this._randomNPC.lastTime = val;
    };

    Game_System.prototype.getRandomNPCLastDate = function () {
        this.ensureRandomNPCData();
        return this._randomNPC.lastDate;
    };

    Game_System.prototype.setRandomNPCLastDate = function (val) {
        this.ensureRandomNPCData();
        this._randomNPC.lastDate = val;
    };

    Game_System.prototype.getForceNextDayPartnerId = function () {
        this.ensureRandomNPCData();
        return this._randomNPC.forceNextDayPartnerId || 0;
    };

    Game_System.prototype.setForceNextDayPartnerId = function (val) {
        this.ensureRandomNPCData();
        this._randomNPC.forceNextDayPartnerId = val;
    };

    // ============================================================================
    // スケジュール生成ヘルパー
    // ============================================================================
    function addVar(varId, amount) {
        if (varId > 0) {
            const val = $gameVariables.value(varId) || 0;
            $gameVariables.setValue(varId, val + amount);
        }
    }

    function getPartnerCounterVarId(partnerId) {
        const pid = String(partnerId);
        if (pid === "1" || pid === "7") return PARAMS.vars.countFriend;
        if (pid === "2" || pid === "8") return PARAMS.vars.countMayor;
        if (pid === "3" || pid === "9") return PARAMS.vars.countKid;
        if (pid === "4" || pid === "5") return PARAMS.vars.countUncle;
        return 0;
    }

    function generateSlotData(time, date) {
        // デバッグ用: 翌日パートナー固定
        const forcedPartnerId = $gameSystem.getForceNextDayPartnerId();
        // console.log(`[${pluginName}] generateSlotData(${time}) ForcedID=${forcedPartnerId}`);
        if (forcedPartnerId > 0) {
            const partnerId = String(forcedPartnerId);
            // 固定された場合でも場所はランダム（またはデフォルト）
            let locationKey = null;
            const partnerStore = CONST_PARTNERS[partnerId];
            if (partnerStore) {
                let candidates = [];
                partnerStore.locations.forEach(loc => {
                    if (loc.time === time || loc.time === -1) {
                        candidates = candidates.concat(loc.keys);
                    }
                });
                if (candidates.length > 0) {
                    locationKey = candidates[Math.floor(Math.random() * candidates.length)];
                } else {
                    locationKey = partnerStore.locations[0]?.keys[0] || "Home";
                }
            }
            return { partnerId, locationKey };
        }

        // 連続イベントがあればそれを優先（ただし continuousEvent は setDailySchedule 未満で参照される可能性）
        // 仕様: 連続イベント中はそのパートナーで固定。
        // ここで $gameSystem.getContinuousEvent() を呼ぶ。
        const continuous = $gameSystem.getContinuousEvent();
        if (continuous && continuous.partnerId && continuous.locationKey) {
            console.log(`[${pluginName}] Continuous Event Applied: Partner=${continuous.partnerId}, Location=${continuous.locationKey}`);
            return { partnerId: continuous.partnerId, locationKey: continuous.locationKey };
        } else if (continuous) {
            console.warn(`[${pluginName}] Continuous Event Invalid (Missing ID or Location):`, continuous);
        }

        const partnerKeys = ["1", "2", "3", "4", "5", "6"];

        // 除外設定の反映
        let availableKeys = partnerKeys;
        if (date !== undefined) {
            availableKeys = partnerKeys.filter(pk => {
                const p = CONST_PARTNERS[pk];
                if (p && p.exclude && Array.isArray(p.exclude)) {
                    // Check if any exclusion matches current date/time
                    const isExcluded = p.exclude.some(ex => ex.date === date && ex.time === time);
                    if (isExcluded) {
                        console.log(`[${pluginName}] Partner ${pk} excluded for Date ${date} Time ${time}`);
                        return false;
                    }
                }
                return true;
            });

            if (availableKeys.length === 0) {
                console.warn(`[${pluginName}] All partners excluded for Date ${date} Time ${time}. Fallback to all.`);
                availableKeys = partnerKeys;
            }
        }

        const partnerId = availableKeys[Math.floor(Math.random() * availableKeys.length)];

        let locationKey = null;
        const partnerStore = CONST_PARTNERS[partnerId];
        if (partnerStore) {
            let candidates = [];
            let wildcardCandidates = [];
            partnerStore.locations.forEach(loc => {
                if (loc.time === time) {
                    // 特定の時間帯に一致するものを優先
                    candidates = candidates.concat(loc.keys);
                } else if (loc.time === -1) {
                    // ワイルドカード（全時間帯対応）は別に保持
                    wildcardCandidates = wildcardCandidates.concat(loc.keys);
                }
            });
            // 特定時間帯がなければワイルドカードを使用
            if (candidates.length === 0) {
                candidates = wildcardCandidates;
            }
            if (candidates.length > 0) {
                locationKey = candidates[Math.floor(Math.random() * candidates.length)];
            }
        }
        // 場所が決まらない場合はデフォルトなどを入れたいが、現状はnull許容?
        // updateRandomStateでは partnerId && locationKey の場合のみ更新していた。
        return { partnerId: partnerId, locationKey: locationKey };
    }


    function generateNewDaySchedule(skipLottery = false, date) {
        // スケジュール再生成前のクリア
        $gameSystem.clearContinuousEvent();

        // 連続イベント抽選 (固定予約がない場合のみ)
        const isForcedNext = ($gameSystem.getForceNextDayPartnerId() > 0);
        if (!skipLottery && !$gameSwitches.value(PARAMS.pregnancySwitchId) && !isForcedNext) {
            // 最初の週はスキップ
            if (!$gameSystem.isFirstWeekPassed()) {
                console.log(`[${pluginName}] Continuous lottery skipped (First Week Restriction).`);
            } else {
                if (Math.random() < 0.09) {
                    const rand = Math.random();
                    let targetId = "9"; // Kids Continuous
                    let locKey = "Mansion";

                    if (rand < 0.33) {
                        targetId = "7"; // Friend Continuous
                        locKey = "DalioHouse";
                    } else if (rand < 0.66) {
                        targetId = "8"; // Cheif Continuous
                        locKey = "CheifHouse";
                    }

                    $gameSystem.setContinuousEvent({ partnerId: targetId, locationKey: locKey });
                    if (PARAMS.continuousEventCommonId > 0) {
                        $gameTemp.reserveCommonEvent(PARAMS.continuousEventCommonId);
                    }
                }
            }
        }

        // Daily Schedule 生成 (0~3)
        const newSchedule = [];
        for (let t = 0; t <= 3; t++) {
            newSchedule.push(generateSlotData(t, date));
        }

        // 生成後に固定予約を解除
        if (isForcedNext) {
            console.log(`[${pluginName}] Clearing ForceNextDayPartnerId.`);
            $gameSystem.setForceNextDayPartnerId(0);
        }

        // 連続イベント中スイッチの更新
        if (PARAMS.continuousEventSwitchId > 0) {
            const continuous = $gameSystem.getContinuousEvent();
            // IDと場所があれば連続イベント中とみなす
            if (continuous && continuous.partnerId && continuous.locationKey) {
                $gameSwitches.setValue(PARAMS.continuousEventSwitchId, true);
                console.log(`[${pluginName}] Continuous Event Switch (${PARAMS.continuousEventSwitchId}) ON`);
            } else {
                $gameSwitches.setValue(PARAMS.continuousEventSwitchId, false);
                console.log(`[${pluginName}] Continuous Event Switch (${PARAMS.continuousEventSwitchId}) OFF`);
            }
        }

        $gameSystem.setDailySchedule(newSchedule);
        console.log(`[${pluginName}] Daily Schedule Generated:`, newSchedule);
    }

    function onDayChanged(newDate) {
        console.log(`[${pluginName}] Day Changed to ${newDate}`);
        const currentDate = $gameVariables.value(PARAMS.dateVarId);

        // 妊娠発覚イベントの予約（翌朝実行）は廃止し、発覚即実行に変更
        // if ($gameSystem.isPregnancyEventPending()) {
        //     if (PARAMS.pregnancyEventCommonId > 0) {
        //         console.log(`[${pluginName}] Reserving Pregnancy Event: ${PARAMS.pregnancyEventCommonId}`);
        //         $gameTemp.reserveCommonEvent(PARAMS.pregnancyEventCommonId);
        //     }
        //     $gameSystem.setPregnancyEventPending(false);
        // }

        $gameSystem.clearCheckedTimeKeys();

        // 日付変更時にアニメーションスイッチを全OFF
        clearAllAnimSwitches();

        generateNewDaySchedule(false, newDate);
    }

    function checkTriggers(changedVarId, newValue, oldValue) {
        const progress = $gameVariables.value(PARAMS.progressVarId);

        // 進行度が5になった瞬間を検知
        if (changedVarId === PARAMS.progressVarId && newValue === 5) {
            // 前の値も5だった場合は、重複セットとみなしてスキップ（セーブロード時の誤爆防止など）
            if (oldValue === 5) {
                return;
            }

            // 既にスケジュールがあっても、進行度が5にセットされたなら明示的にリセットして再生成する
            // (デバッグ等で 5 -> 4 -> 5 と遷移した際に古いスケジュールが残るのを防ぐため)

            console.log(`[${pluginName}] Progress changed to 5. Resetting state and updating.`);
            $gameSystem.resetRandomNPCInternalState();

            // 強制的にスケジュール生成（連続イベント抽選は行わない＝初日はランダムのみ）
            const currentDate = $gameVariables.value(PARAMS.dateVarId);
            // 進行度5初期化時は、変数の値に関わらず「朝(0)」として初期化する
            // (イベントの実行順序により、時間がまだ夕方(2)等の場合に意図しない配置になるのを防ぐ)
            const currentTime = 0;

            generateNewDaySchedule(true, currentDate);

            // lastTime/lastDate を現在の値に同期（キャッチアップループをスキップ）
            $gameSystem.setRandomNPCLastTime(currentTime);
            $gameSystem.setRandomNPCLastDate(currentDate);

            // 現在の時間のスロットを直接適用
            updateRandomState(currentTime);
            console.log(`[${pluginName}] Progress 5 initial state applied: Date=${currentDate}, Time=${currentTime} (Forced Morning)`);
            return;
        }

        if (progress !== 5) return;

        // 時間または日付の変更を監視
        if (changedVarId === PARAMS.timeVarId || changedVarId === PARAMS.dateVarId) {
            requestUpdateState();
        }
    }

    // 更新をマイクロタスクまで遅延させ、連続した変数変更（例：Time変更→Date変更）を1回にまとめる
    function requestUpdateState() {
        if (_updateScheduled) return;
        _updateScheduled = true;
        Promise.resolve().then(() => {
            _updateScheduled = false;
            updateState();
        });
    }

    function updateState() {
        _inProcessing = true;
        try {
            const newTime = $gameVariables.value(PARAMS.timeVarId);
            const newDate = $gameVariables.value(PARAMS.dateVarId);

            console.log(`[${pluginName}] 状態更新開始: Date=${newDate}, Time=${newTime}`);

            // $gameSystem から前回の状態を取得
            let lastTime = $gameSystem.getRandomNPCLastTime();
            let lastDate = $gameSystem.getRandomNPCLastDate();

            // 何も変わっていない場合は何もしない
            if (lastTime === newTime && lastDate === newDate) {
                return;
            }

            // 日付・時間のインデックス化 (4日周期16ステップと仮定)
            const lastIndex = lastDate * 4 + lastTime;
            const newIndex = newDate * 4 + newTime;

            // 差分ステップ数の計算 (循環考慮)
            const steps = (newIndex - lastIndex + 16) % 16;

            console.log(`[${pluginName}] 時間経過ステップ計算: ${steps}回 (前回: ${lastDate}日${lastTime} -> 今回: ${newDate}日${newTime})`);



            let tempTime = lastTime;
            let tempDate = lastDate; // Added to track date changes within the loop

            for (let i = 0; i < steps; i++) {
                // 1. 直前の時間の行動結果を適用
                applyPreviousState(tempTime, tempDate);

                // 2. 時間を進める
                tempTime++;
                if (tempTime > 3) {
                    tempTime = 0;
                    tempDate++; // Increment date when time wraps around

                    // 日付循環 (4日周期 0-3)
                    // 3 -> 4 になったタイミングで 0 に戻し、最初の週経過フラグを立てる
                    if (tempDate > 3) {
                        tempDate = 0;
                        if (!$gameSystem.isFirstWeekPassed()) {
                            $gameSystem.setFirstWeekPassed(true);
                            console.log(`[${pluginName}] First week passed. Continuous events enabled.`);
                        }
                    }

                    onDayChanged(tempDate); // 日付変更処理
                }

                // 3. 次の時間の状態を抽選・セット
                updateRandomState(tempTime);

                // 4. アニメーションスイッチ更新
                const fromT = (tempTime - 1 < 0) ? 3 : tempTime - 1;
                triggerAnimSwitch(fromT, tempTime);
            }

            // 時間が経過しており、かつ保留中の妊娠イベントがある場合（手動判定で妊娠→時間経過で発覚）
            // ループ処理後に移動して、他の予約による上書きを防ぐ
            if (steps > 0 && $gameSystem.isPregnancyEventPending()) {
                if (PARAMS.pregnancyEventCommonId > 0) {
                    console.log(`[${pluginName}] Triggering Pending Pregnancy Event on Time Change.`);
                    $gameTemp.reserveCommonEvent(PARAMS.pregnancyEventCommonId);
                } else {
                    console.warn(`[${pluginName}] Pending Pregnancy Event found, but Common Event ID is 0!`);
                }
                $gameSystem.setPregnancyEventPending(false);
            }

            // 状態更新後に保存
            $gameSystem.setRandomNPCLastTime(newTime);
            $gameSystem.setRandomNPCLastDate(newDate);

            // 進行度5の場合の追加リセット処理
            if ($gameVariables.value(PARAMS.progressVarId) === 5) {
                if (PARAMS.switchesToResetAtProgress5 && PARAMS.switchesToResetAtProgress5.length > 0) {
                    PARAMS.switchesToResetAtProgress5.forEach(swId => {
                        $gameSwitches.setValue(swId, false);
                    });
                    console.log(`[${pluginName}] Progress 5 Reset: Switches ${PARAMS.switchesToResetAtProgress5} turned OFF.`);
                }
            }

        } catch (e) {
            console.error(`[${pluginName}] Error in updateState:`, e);
            _inProcessing = false;
        } finally {
            _inProcessing = false;
        }
    }

    function applyPreviousState(time, date) {
        const partnerId = $gameVariables.value(PARAMS.currentPartnerVarId);
        if (!partnerId || partnerId == 0) return;

        // Logging Containers
        const logAdd = {};    // { varId: amount }

        // Helper to record addition
        const performAdd = (varId, amount) => {
            if (varId > 0) {
                const current = $gameVariables.value(varId) || 0;
                $gameVariables.setValue(varId, current + amount);

                if (!logAdd[varId]) logAdd[varId] = 0;
                logAdd[varId] += amount;
            }
        };

        // Helper to record assignment (ログ収集なし)
        const performAssign = (varId, value) => {
            if (varId > 0) {
                $gameVariables.setValue(varId, value);
            }
        };

        // テキスト内の制御文字を変換するヘルパー
        const convertEscapeCharactersForStorage = (text) => {
            if (typeof text !== 'string') return text;
            // Window_Baseの変換処理を利用
            if (window.Window_Base && Window_Base.prototype.convertEscapeCharacters) {
                const tempWindow = new Window_Base(new Rectangle(0, 0, 1, 1));
                return tempWindow.convertEscapeCharacters(text);
            }
            return text;
        };

        // ----------------------------------------------------------------
        // 妊娠判定処理 (New)
        // ----------------------------------------------------------------
        // 既に妊娠している、またはこの時間帯で既に判定済みの場合はスキップ
        if (!$gameSwitches.value(PARAMS.pregnancySwitchId)) {
            // dateが渡されていない場合のフォールバック（初回呼び出し等）
            const checkDate = (date !== undefined) ? date : $gameVariables.value(PARAMS.dateVarId);

            if (!$gameSystem.isCheckedTimeKey(checkDate, time)) {
                $gameSystem.addCheckedTimeKey(checkDate, time); // 判定済みフラグセット

                let isHit = false;
                // 最初の週は妊娠しない
                if ($gameSystem.isFirstWeekPassed()) {
                    // 確率判定 (または強制フラグ)
                    if (_forceNextPregnancy || Math.random() < PARAMS.pregnancyProbability) {
                        isHit = true;
                        if (_forceNextPregnancy) {
                            console.log(`[${pluginName}] ForcePregnancy applied.`);
                            _forceNextPregnancy = false;
                        }
                    }
                }

                // パートナーIDが有効かチェック
                // ID >= 7 (連続イベント) は正規IDに変換
                let actualPartnerId = partnerId;
                if (actualPartnerId === 7) actualPartnerId = 1;
                else if (actualPartnerId === 8) actualPartnerId = 2;
                else if (actualPartnerId === 9) actualPartnerId = 3;

                // Free(6)と老人(4)は妊娠対象外
                if (actualPartnerId !== 6 && actualPartnerId !== 4) {
                    if (isHit) {
                        $gameSwitches.setValue(PARAMS.pregnancySwitchId, true);
                        $gameVariables.setValue(PARAMS.pregnantPartnerVarId, actualPartnerId);

                        performAdd(PARAMS.vars.countPregnant, 1);

                        // 名前代入
                        if (PARAMS.pregnancyPartnerNameVarId > 0) {
                            let pName = "不明";
                            if (PARAMS.pregnancyPartnerNames[actualPartnerId]) {
                                pName = PARAMS.pregnancyPartnerNames[actualPartnerId];
                            } else {
                                const partner = CONST_PARTNERS[String(actualPartnerId)];
                                if (partner && partner.name) {
                                    pName = partner.name;
                                }
                            }
                            performAssign(PARAMS.pregnancyPartnerNameVarId, pName);
                        }

                        // 翌朝ではなく、即座にイベント予約
                        if (PARAMS.pregnancyEventCommonId > 0) {
                            console.log(`[${pluginName}] Reserving Pregnancy Event Trigger: ${PARAMS.pregnancyEventCommonId}`);
                            $gameTemp.reserveCommonEvent(PARAMS.pregnancyEventCommonId);
                        }
                        console.log(`[${pluginName}] Pregnancy Confirmed! Partner: ${actualPartnerId}, Name: ${PARAMS.pregnancyPartnerNames[actualPartnerId] || "???"}, Time: ${time}`);
                    }
                }
            }
        }

        const partner = CONST_PARTNERS[String(partnerId)];
        if (partner) {
            // 妊娠チェック
            const isPregnant = $gameSwitches.value(PARAMS.pregnancySwitchId);

            // 履歴追加 (Mob, Mobs, Free 以外)
            if (partnerId != "4" && partnerId != "5" && partnerId != "6") {
                $gameSystem.pushPregnancyHistory(String(partnerId));
            }

            // Stats切り替え
            let totalActs = 0;
            let statsConfig = partner.stats;
            if (isPregnant && partner.pregStats) {
                statsConfig = partner.pregStats;
            }

            if (statsConfig && statsConfig.fixed) {
                if (Array.isArray(statsConfig.fixed)) {
                    statsConfig.fixed.forEach(key => {
                        const varId = PARAMS.vars[key];
                        performAdd(varId, 1);
                        if (varId > 0) totalActs++;
                    });
                } else {
                    Object.keys(statsConfig.fixed).forEach(key => {
                        const amount = statsConfig.fixed[key] || 1;
                        const varId = PARAMS.vars[key];
                        performAdd(varId, amount);
                        if (varId > 0) totalActs += amount;
                    });
                }
            }

            // 妊娠時は pregStats.randomAddAmount があればそれを優先、なければ通常の randomAddAmount を使用
            let randomTotal = partner.randomAddAmount || 0;
            if (statsConfig && statsConfig.randomAddAmount !== undefined) {
                randomTotal = statsConfig.randomAddAmount;
            }

            if (randomTotal > 0 && statsConfig && statsConfig.random) {
                const keys = Object.keys(statsConfig.random);
                let totalWeight = 0;
                keys.forEach(k => totalWeight += statsConfig.random[k]);

                if (totalWeight > 0) {
                    totalActs += randomTotal;
                    for (let i = 0; i < randomTotal; i++) {
                        let r = Math.random() * totalWeight;
                        for (const key of keys) {
                            r -= statsConfig.random[key];
                            if (r <= 0) {
                                const varId = PARAMS.vars[key];
                                performAdd(varId, 1);
                                break;
                            }
                        }
                    }
                }
            }

            if (PARAMS.vars.countTotal > 0 && totalActs > 0) {
                performAdd(PARAMS.vars.countTotal, totalActs);

                if (PARAMS.vars.countLiquid > 0) {
                    let liquidAdd = 0;
                    for (let i = 0; i < totalActs; i++) {
                        liquidAdd += Math.floor(Math.random() * (15 - 8 + 1)) + 8;
                    }

                    // 液体量の単位(mL)対応
                    const currentValStr = String($gameVariables.value(PARAMS.vars.countLiquid) || '');
                    let currentLiquid = 0;
                    const match = currentValStr.match(/^(\d+(?:\.\d+)?)\s*mL$/i);
                    if (match) {
                        currentLiquid = Number(match[1]) || 0;
                    } else {
                        currentLiquid = Number(currentValStr);
                        if (isNaN(currentLiquid)) currentLiquid = 0;
                    }

                    const newValue = currentLiquid + liquidAdd;
                    const newValueStr = `${Math.floor(newValue)} mL`;

                    performAssign(PARAMS.vars.countLiquid, newValueStr);
                }
            }

            // Partner Counter Update (Fixed + Random Total)
            const partnerCountVarId = getPartnerCounterVarId(partnerId);
            if (partnerCountVarId > 0 && totalActs > 0) {
                performAdd(partnerCountVarId, totalActs);
            }

            // [Pregnancy Logic] Text切り替え（外部JSON使用）
            let textPartnerId = partnerId;
            if (textPartnerId === 7) textPartnerId = 1;
            else if (textPartnerId === 8) textPartnerId = 2;
            else if (textPartnerId === 9) textPartnerId = 3;

            // テキスト更新処理 (ID 6除外)
            if (String(textPartnerId) !== "6" && typeof $dataRandomNPCBodyTexts !== 'undefined') {
                const textData = $dataRandomNPCBodyTexts[String(textPartnerId)];
                if (textData) {
                    let bt = textData.normal;
                    if (isPregnant && textData.pregnancy) {
                        const hasData = Object.values(textData.pregnancy).some(arr => arr && arr.length > 0);
                        if (hasData) {
                            bt = textData.pregnancy;
                        }
                    }

                    if (bt) {
                        const bp = PARAMS.bodyParts;
                        let iconBase = null;
                        const pId = Number(partnerId);
                        if (pId === 1 || pId === 7) iconBase = "Dalio";
                        else if (pId === 2 || pId === 8) iconBase = "Chief";
                        else if (pId === 3 || pId === 9) iconBase = "Kids";
                        else if (pId === 4 || pId === 5) iconBase = "Mob";

                        const parts = ["lip", "bust", "pussy", "hip"];
                        parts.forEach(part => {
                            if (bt[part] && Array.isArray(bt[part]) && bt[part].length > 0) {
                                const rawText = bt[part][Math.floor(Math.random() * bt[part].length)];
                                const randomText = convertEscapeCharactersForStorage(rawText);
                                if (bp[part].text > 0) {
                                    performAssign(bp[part].text, randomText);
                                }
                                if (iconBase && bp[part].icon > 0) {
                                    performAssign(bp[part].icon, iconBase);
                                }
                            }
                        });
                    }
                }
            }
        }

        // --- Log Output ---
        const addKeys = Object.keys(logAdd);

        console.group(`[${pluginName}] 経過処理ログ: ${date}日目 時間${time}`);
        console.log(`相手: ${partner ? partner.name : "不明"} (ID:${partnerId})`);

        if (addKeys.length > 0) {
            addKeys.forEach(key => {
                const varId = Number(key);
                const varName = $dataSystem.variables[varId] || `変数${varId}`;
                console.log(`  ${varName} (${varId}): +${logAdd[key]}`);
            });
        } else {
            console.log("  (変数加算なし)");
        }

        console.groupEnd();
    }

    function updateRandomState(time) {
        // スケジュールのロード・生成
        $gameSystem.ensureRandomNPCData();
        let schedule = $gameSystem.getDailySchedule();

        // 未生成（初回ロード時など）の場合は生成
        if (!schedule || schedule.length === 0) {
            console.log(`[${pluginName}] Schedule missing (first load?), generating fallback...`);
            const currentDate = $gameVariables.value(PARAMS.dateVarId);
            const tempSchedule = [];
            for (let t = 0; t <= 3; t++) {
                // 全時間帯で正しくgenerateSlotDataを使用する
                tempSchedule.push(generateSlotData(t, currentDate));
            }
            $gameSystem.setDailySchedule(tempSchedule);
            schedule = tempSchedule;
        }

        const slot = schedule[time];
        let partnerId, locationKey;
        if (slot) {
            partnerId = slot.partnerId;
            locationKey = slot.locationKey;
        }

        // Fallback if schedule data is missing or invalid
        if (!partnerId || !locationKey) {
            console.warn(`[${pluginName}] Invalid schedule for time ${time}. Falling back to random.`);
            const currentDate = $gameVariables.value(PARAMS.dateVarId);
            const fallback = generateSlotData(time, currentDate);
            partnerId = fallback.partnerId;
            locationKey = fallback.locationKey;

            // Still no valid data? Force safe default.
            if (!partnerId || !locationKey) {
                console.error(`[${pluginName}] Fallback failed. Forcing Mob/North.`);
                partnerId = "5"; // Mobs
                locationKey = "North";
            }
        }

        // Force Next Schedule Logic
        if (_forceNextPartnerId > 0) {
            partnerId = String(_forceNextPartnerId);
            const partnerStore = CONST_PARTNERS[partnerId];
            if (partnerStore) {
                // Pick a valid location for this time
                let candidates = [];
                partnerStore.locations.forEach(loc => {
                    if (loc.time === time || loc.time === -1) {
                        candidates = candidates.concat(loc.keys);
                    }
                });
                if (candidates.length > 0) {
                    locationKey = candidates[Math.floor(Math.random() * candidates.length)];
                } else {
                    // Fallback if no location found (shouldn't happen with correct config)
                    locationKey = partnerStore.locations[0]?.keys[0] || "North";
                }
            }
            console.log(`[${pluginName}] ForceNextSchedule applied: Partner=${partnerId}, Location=${locationKey}`);
            _forceNextPartnerId = 0;
        }

        if (partnerId && locationKey) {
            console.log(`[${pluginName}] Applied Schedule for Time ${time}: Partner=${partnerId}, Location=${locationKey}`);

            // 変数には正規化されたIDを入れる (7->1, 8->2, 9->3)
            let varPartnerId = Number(partnerId);
            if (varPartnerId === 7) varPartnerId = 1;
            else if (varPartnerId === 8) varPartnerId = 2;
            else if (varPartnerId === 9) varPartnerId = 3;

            $gameVariables.setValue(PARAMS.currentPartnerVarId, varPartnerId);
            $gameVariables.setValue(PARAMS.currentLocationVarId, locationKey);

            // 全ての場所スイッチをOFF
            Object.values(CONST_LOCATIONS).forEach(loc => {
                const sid = loc.switchId;
                if (sid > 0) $gameSwitches.setValue(sid, false);
            });

            // 現在の場所スイッチをON
            const locationData = CONST_LOCATIONS[locationKey];
            if (locationData) {
                const sid = locationData.switchId;
                if (sid > 0) $gameSwitches.setValue(sid, true);
            }
        } else {
            console.error(`[${pluginName}] Failed to apply schedule. Partner or Location missing even after fallback.`);
        }
    }

    function clearAllAnimSwitches() {
        Object.values(CONST_LOCATIONS).forEach(loc => {
            if (loc.animSwitches) {
                Object.values(loc.animSwitches).forEach(swId => {
                    if (swId > 0) $gameSwitches.setValue(swId, false);
                });
            }
        });
        console.log(`[${pluginName}] Animation switches cleared.`);
    }

    function triggerAnimSwitch(fromTime, toTime) {
        // Change: Use location from 'fromTime' (previous time), not current updated variable (toTime)
        // ユーザー要望: 切り替え前の時間の場所にあるスイッチを操作したい
        const schedule = $gameSystem.getDailySchedule();
        const slot = schedule[fromTime];

        // スケジュールが無い場合は変更前の変数を参照したいが、updateRandomStateで更新済みのため
        // 取得できない場合は安全性のため何もしない (または以前のロジックに戻すなら変数参照だが、今回はSkip)
        if (!slot || !slot.locationKey) return;

        const locationKey = slot.locationKey;
        const loc = CONST_LOCATIONS[locationKey];
        if (loc && loc.animSwitches) {
            // ユーザー要望: 1(昼)→0, 2(夕)→1, 3(夜)→2 のスイッチをON
            // つまり time - 1 をキーとする (time=0の時は-1になるので発火しない)
            const switchIndex = toTime - 1;
            const swId = loc.animSwitches[switchIndex];
            if (swId > 0) {
                console.log(`[${pluginName}] AnimSwitch ON: Loc=${locationKey}, Time=${toTime}, SwitchID=${swId}`);
                $gameSwitches.setValue(swId, true);
            }
        }
    }

    // ============================================================================
    // Plugin Command Registration
    // ============================================================================
    PluginManager.registerCommand(pluginName, "CheckPregnancyImmediate", function (args) {
        const forceEventId = Number(args.forceEventId || 0);
        const isForce = (args.force === "true"); // 文字列 "true" を boolean に変換
        checkPregnancyImmediate(forceEventId, isForce, this);
    });

    PluginManager.registerCommand(pluginName, "ForceNextSchedule", args => {
        const partnerId = Number(args.partnerId || 0);
        if (partnerId > 0) {
            _forceNextPartnerId = partnerId;
            console.log(`[${pluginName}] ForceNextSchedule set to PartnerID: ${partnerId}`);
        }
    });

    PluginManager.registerCommand(pluginName, "ForcePregnancy", args => {
        _forceNextPregnancy = true;
        console.log(`[${pluginName}] ForcePregnancy set to TRUE`);
    });

    PluginManager.registerCommand(pluginName, "ForceNextDayPartner", args => {
        const pid = Number(args.partnerId || 0);
        if (pid > 0) {
            $gameSystem.setForceNextDayPartnerId(pid);
            console.log(`[${pluginName}] ForceNextDayPartner set to: ${pid}`);
        }
    });

    // 妊娠判定処理を関数化
    function checkPregnancyImmediate(forceEventId, isForce, interpreter) {
        // 既に妊娠中なら何もしない (強制フラグがある場合は除く)
        if ($gameSwitches.value(PARAMS.pregnancySwitchId) && !isForce) {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Already pregnant.`);
            return;
        }

        const date = $gameVariables.value(PARAMS.dateVarId);
        const time = $gameVariables.value(PARAMS.timeVarId);
        let partnerId = $gameVariables.value(PARAMS.currentPartnerVarId);

        // 既に判定済みならスキップ？ (即時実行コマンドなので強制してもよいが、仕様に従う)
        // "現在の時間の妊娠判定をこのコマンドの実行時に行い、その代わりに時間変更時の現在時間の相手との確率判定をスキップ"
        // -> 判定済みフラグをセットする必要がある。

        if ($gameSystem.isCheckedTimeKey(date, time)) {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Already checked for this time.`);
            return;
        }

        $gameSystem.addCheckedTimeKey(date, time);

        // パートナーID正規化
        if (partnerId === 7) partnerId = 1;
        else if (partnerId === 8) partnerId = 2;
        else if (partnerId === 9) partnerId = 3;

        if (!partnerId || partnerId === 6) {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Invalid partner.`);
            return;
        }

        // 最初の週は妊娠しない（通常の時間進行時と同様の制限）
        if (!$gameSystem.isFirstWeekPassed()) {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Skipped (First Week Restriction).`);
            return;
        }

        const immediateProb = PARAMS.pregnancyProbabilityImmediate !== null && !isNaN(PARAMS.pregnancyProbabilityImmediate) ? PARAMS.pregnancyProbabilityImmediate : PARAMS.pregnancyProbability;

        // 抽選
        if (isForce || Math.random() < immediateProb) {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Hit! (Force=${isForce}, Prob=${immediateProb})`);
            $gameSwitches.setValue(PARAMS.pregnancySwitchId, true);
            $gameVariables.setValue(PARAMS.pregnantPartnerVarId, partnerId);
            addVar(PARAMS.vars.countPregnant, 1);

            // 名前代入
            if (PARAMS.pregnancyPartnerNameVarId > 0) {
                let pName = "不明";
                if (PARAMS.pregnancyPartnerNames[partnerId]) {
                    pName = PARAMS.pregnancyPartnerNames[partnerId];
                } else {
                    const partner = CONST_PARTNERS[String(partnerId)];
                    if (partner && partner.name) {
                        pName = partner.name;
                    }
                }
                $gameVariables.setValue(PARAMS.pregnancyPartnerNameVarId, pName);
            }

            // ユーザー要望: 強制イベント実行時も、別途発覚イベント(Pending)を立てる
            console.log(`[${pluginName}] CheckPregnancyImmediate: Hit! (Setting Pending Flag for Discovery Event)`);
            $gameSystem.setPregnancyEventPending(true);

            if (forceEventId > 0) {
                console.log(`[${pluginName}] CheckPregnancyImmediate: Immediate Execution requested for Event ID ${forceEventId}`);
                // 会話中でも割り込み実行できるようにする
                const commonEvent = $dataCommonEvents[forceEventId];
                if (commonEvent) {
                    // 呼び出し元のインタプリタがあればそれを使い、なければ$gameMap._interpreter (フォールバック)
                    const targetInterpreter = interpreter || $gameMap._interpreter;
                    if (targetInterpreter) {
                        console.log(`[${pluginName}] Injecting Common Event ${forceEventId} into interpreter.`);
                        const eventId = targetInterpreter.eventId();
                        targetInterpreter.setupChild(commonEvent.list, eventId);
                    } else {
                        console.log(`[${pluginName}] Interpreter not found. Reserving Common Event ${forceEventId}.`);
                        $gameTemp.reserveCommonEvent(forceEventId);
                    }
                } else {
                    console.warn(`[${pluginName}] Common Event ${forceEventId} not found!`);
                    $gameTemp.reserveCommonEvent(forceEventId);
                }
            } else {
                console.log(`[${pluginName}] CheckPregnancyImmediate: No Immediate Event ID. Discovery Event deferred to next time change.`);
            }
        } else {
            console.log(`[${pluginName}] CheckPregnancyImmediate: Miss.`);
        }
    }

    // ============================================================================
    // FastTravelSystem 拡張 (進行度5におけるマップ表示拡張)
    // ============================================================================
    const _Scene_FastTravel_createHeroineIcon = window.Scene_FastTravel ? window.Scene_FastTravel.prototype.createHeroineIcon : null;
    const _Scene_FastTravel_updateHeroineAppearance = window.Scene_FastTravel ? window.Scene_FastTravel.prototype.updateHeroineAppearance : null;

    if (_Scene_FastTravel_createHeroineIcon && window.Sprite_HeroineIcon) {
        window.Scene_FastTravel.prototype.createHeroineIcon = function () {
            _Scene_FastTravel_createHeroineIcon.call(this);
            // パートナー用スプライト生成
            this._partnerSprite = new window.Sprite_HeroineIcon();
            this._partnerSprite.setEventGlowEnabled(false); // パートナーは輝かない
            if (this._travelLayer) {
                this._travelLayer.addChild(this._partnerSprite);
            } else {
                this.addChild(this._partnerSprite);
            }
        };

        // getHeroineAppearance のオーバーライド
        // 進行度5のとき、ヒロインを強制的に「イベント画像＋発光(eventActive)」として扱う
        // これにより、FastTravelSystem側のupdateHeroineAppearanceでの上書きリセットを防ぐ
        const _Scene_FastTravel_getHeroineAppearance = window.Scene_FastTravel.prototype.getHeroineAppearance;
        window.Scene_FastTravel.prototype.getHeroineAppearance = function (timeline) {
            // 元の判定を取得
            const result = _Scene_FastTravel_getHeroineAppearance.call(this, timeline);

            const progress = $gameVariables.value(PARAMS.progressVarId);
            if (progress === 5) {
                let partnerId = $gameVariables.value(PARAMS.currentPartnerVarId);
                // ID修正
                if (partnerId === 7) partnerId = 1;
                else if (partnerId === 8) partnerId = 2;
                else if (partnerId === 9) partnerId = 3;

                // パートナー6 (Free) 以外ならイベント状態にする
                if (partnerId !== 6) {
                    const ftParams = PluginManager.parameters('FastTravelSystem');
                    const eventImage = ftParams['HeroineEventImage'] || 'HeroIconEvent';
                    return { image: eventImage, eventActive: true };
                }
            }
            return result;
        };



        window.Scene_FastTravel.prototype.updateHeroineAppearance = function (forceUpdate = false) {
            // 元の処理呼び出し（位置更新・基本画像設定）
            _Scene_FastTravel_updateHeroineAppearance.call(this, forceUpdate);

            // Partner Spriteが存在しない場合は生成試行（念のため）
            if (!this._partnerSprite && this.createHeroineIcon) {
                // createHeroineIconが呼ばれていない可能性への対処は難しいが、通常はcreateで呼ばれている
            }

            const timeline = this.getTimelineValues();
            const progress = timeline.progress;

            // 進行度5以外ならパートナー非表示で終了
            if (progress !== 5) {
                if (this._partnerSprite) {
                    this._partnerSprite.visible = false;
                }
                return;
            }

            // そもそもヒロインが非表示ならパートナーも非表示
            if (!this._heroineSprite.visible) {
                if (this._partnerSprite) this._partnerSprite.visible = false;
                return;
            }

            // 進行度5の専用処理
            let partnerId = $gameVariables.value(PARAMS.currentPartnerVarId);

            // ID修正（連番を基本IDへ）
            if (partnerId === 7) partnerId = 1;
            else if (partnerId === 8) partnerId = 2;
            else if (partnerId === 9) partnerId = 3;

            // FastTravelSystemのパラメータを取得（画像ファイル名参照用）
            const ftParams = PluginManager.parameters('FastTravelSystem');
            const baseImage = ftParams['HeroineImage'] || 'HeroIcon';
            const eventImage = ftParams['HeroineEventImage'] || 'HeroIconEvent';

            // パートナー6 (Free) -> 通常画像
            if (partnerId === 6) {
                this._heroineSprite.setPicture(baseImage);
                this._heroineSprite.setEventGlowEnabled(false);

                // 位置オフセットリセット (本来の場所へ)
                // updateHeroineAppearanceの呼び出し時点でBasePositionはSpotの位置になっているはずだが、
                // 前回変更したままの可能性も考慮して明示的に戻す（ただしgetBaseXは現在の値を返すので注意）
                // _Scene_FastTravel_updateHeroineAppearance内でsetBasePositionが呼ばれていない場合、
                // 前回の2人表示時のズレたBasePositionが残っている可能性がある。
                // よって、スポットの定義座標を取得しなおしてリセットするのが確実だが、
                // ここでは簡易的に現在のBaseXを使う（もしズレていたら補正が必要だが...）

                // FastTravelSystemのupdateHeroineAppearanceを見ると、
                // if (force || ... getBaseX() !== spot.x ...) でリセットされる。
                // なので、ここで何もしなくても、次回のrefreshで戻る可能性はある。
                // ですが、即座に戻したい場合は...

                // 既に_Scene_FastTravel_updateHeroineAppearanceを呼んでいるので、
                // そこが正しく動作していればBaseXはSpotXになっているはず。
                this._heroineSprite.x = this._heroineSprite.getBaseX();

                if (this._partnerSprite) {
                    this._partnerSprite.visible = false;
                }
                return;
            }

            // パートナー1-5 -> イベント画像 + パートナー画像
            // ヒロイン画像設定は getHeroineAppearance のオーバーライドにより自動化されるため、
            // ここでの明示的な setPicture / setEventGlowEnabled は不要（または重複しても問題ない）
            // ただし、もしここで setEventGlowEnabled(true) を呼ぶとタイマーリセットされる可能性があるため削除推奨だが、
            // BasePosition設定のために下記ロジックは必要。

            // パートナーアイコン処理
            if (this._partnerSprite) {
                const partnerImageName = PARAMS.partnerImages[partnerId];
                if (partnerImageName) {
                    this._partnerSprite.bitmap = ImageManager.loadPicture(partnerImageName);
                    this._partnerSprite.visible = true;

                    // 位置調整（2つ並べる）

                    const offsetX = PARAMS.dualIconOffset || 24;
                    const offsetY = PARAMS.dualIconOffsetY || 0;
                    const baseX = this._heroineSprite.getBaseX();
                    const baseY = this._heroineSprite.getBaseY();

                    // アニメーション(updateEventGlow)と競合しないよう、setBasePositionで基準位置を更新する
                    this._heroineSprite.setBasePosition(baseX - offsetX, baseY);

                    this._partnerSprite.setBasePosition(baseX + offsetX, baseY + offsetY);

                    // パートナーはアニメーションさせない（要望により削除）
                    this._partnerSprite.setEventGlowEnabled(false);
                } else {
                    this._partnerSprite.visible = false;
                    // 位置リセットは元のupdateHeroineAppearanceで行われるが、
                    // ここで強制的に戻す必要がある場合は再設定する。
                    // ただし_Scene_FastTravel_updateHeroineAppearanceが毎回spotの位置にセットしてくれるなら
                    // 次のフレームで戻るはず。
                    // 念のため、baseXが変更されている可能性を考慮して戻す必要性については、
                    // _Scene_FastTravel_updateHeroineAppearance呼び出し直後のbaseXはspotの値なので
                    // ここでの変更は次回の呼び出し時にリセットされる（spotKeyが変わらなくてもsetBasePositionが呼ばれるかはFastTravelによる）

                    // FastTravelSystemの実装では、force updateでない限りsetBasePositionは呼ばれない可能性がある。
                    // したがって、パートナーが消えたときはヒロインの位置を中央に戻す処理が必要。
                    this._heroineSprite.setBasePosition(this._heroineSprite.getBaseX(), this._heroineSprite.getBaseY());
                }
            }
        };

    } else {
        console.warn(`[${pluginName}] Scene_FastTravel or Sprite_HeroineIcon not found. Dual icon feature disabled.`);
    }

})();
