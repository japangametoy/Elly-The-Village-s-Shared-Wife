/*:
 * @target MZ
 * @plugindesc 指定したゲーム変数で管理される日付と時間に基づいて、天候演出を自動で適用するプラグインです。
 *
 * @param DateVariableId
 * @text 日付変数ID
 * @type variable
 * @desc 日付を管理するゲーム変数のID
 * @default 1
 *
 * @param TimeVariableId
 * @text 時間変数ID
 * @type variable
 * @desc 時間を管理するゲーム変数のID
 * @default 2
 *
 * @param SunnyCommonEventId
 * @text 晴れコモンイベントID
 * @type common_event
 * @desc 「晴れ」の天候演出を行うコモンイベントのID
 * @default 10
 *
 * @param CloudyCommonEventId
 * @text 曇りコモンイベントID
 * @type common_event
 * @desc 「曇り」の天候演出を行うコモンイベントのID
 * @default 11
 *
 * @param FogCommonEventId
 * @text 霧コモンイベントID
 * @type common_event
 * @desc 「霧」の天候演出を行うコモンイベントのID
 * @default 12
 *
 * @param RainCommonEventId
 * @text 雨コモンイベントID
 * @type common_event
 * @desc 「雨」の天候演出を行うコモンイベントのID
 * @default 13
 *
 * @param ThunderSwitchId
 * @text 雷演出スイッチID
 * @type switch
 * @desc 雷演出のON/OFFを制御するゲームスイッチのID
 * @default 14
 *
 * @param NightSwitchId
 * @text 夜スイッチID
 * @type switch
 * @desc 特例天気で夜・真夜中の場合にONになるゲームスイッチのID
 * @default 15
 *
 * @param MidnightSwitchId
 * @text 真夜中スイッチID
 * @type switch
 * @desc 特例天気で真夜中の場合のみONになるゲームスイッチのID
 * @default 0
 *
 * @param ThunderIndoorSwitchId
 * @text 雷演出スイッチID（屋内用）
 * @type switch
 * @desc 特例天気「雷」（雨＋夜以降＋屋内）の場合にONになるスイッチのID
 * @default 0
 *
 * @param ThunderOutdoorSwitchId
 * @text 雷演出スイッチID（屋外用）
 * @type switch
 * @desc 特例天気「雷」（雨＋夜以降＋屋外）の場合にONになるスイッチのID
 * @default 0
 *
 * @param RainMorningIndoorCommonEventId
 * @text 雨コモンイベントID（朝・屋内）
 * @type common_event
 * @desc 特例天気「雨」で朝・屋内の場合に実行するコモンイベント（0で無効）
 * @default 0
 *
 * @param RainMorningOutdoorCommonEventId
 * @text 雨コモンイベントID（朝・屋外）
 * @type common_event
 * @desc 特例天気「雨」で朝・屋外の場合に実行するコモンイベント（0で無効）
 * @default 0
 *
 * @param RainAfternoonIndoorCommonEventId
 * @text 雨コモンイベントID（昼以降・屋内）
 * @type common_event
 * @desc 特例天気「雨」で昼以降・屋内の場合に実行するコモンイベント（0で無効）
 * @default 0
 *
 * @param RainAfternoonOutdoorCommonEventId
 * @text 雨コモンイベントID（昼以降・屋外）
 * @type common_event
 * @desc 特例天気「雨」で昼以降・屋外の場合に実行するコモンイベント（0で無効）
 * @default 0
 *
 * @param RecollectionSwitchId
 * @text 回想モードスイッチID
 * @type switch
 * @desc 回想モード中にONになるゲームスイッチのID。このスイッチがONの場合、天気保存は無効化され、特例天気適用時は晴れになります。
 * @default 0
 *
 * @command GetWeatherCommonEventId
 * @text 現在天候のコモンイベントID取得
 * @desc 現在の日付・時間から自動適用される天候コモンイベントIDを変数に格納します（即時実行用の補助）。
 *
 * @arg variableId
 * @text 取得先変数ID
 * @type variable
 * @desc IDを格納するゲーム変数
 * @default 0
 *
 * @command RunWeatherCommonEvent
 * @text 現在天候のコモンイベント実行
 * @desc 現在の日付・時間から自動適用される天候コモンイベントを即時実行します（コモンイベントの実行と同等）。
 *
 * @command SetSpecialWeather
 * @text 特例天気設定
 * @desc <Event>マップで特例天気を設定します
 *
 * @arg weather
 * @text 天候
 * @type select
 * @option 晴れ
 * @option 曇り
 * @option 霧
 * @option 雨
 * @option なし
 * @default なし
 * @desc 天候を選択
 *
 * @arg location
 * @text 屋内/屋外
 * @type select
 * @option 屋内
 * @option 屋外
 * @default 屋外
 * @desc 屋内か屋外かを選択
 *
 * @arg timeOfDay
 * @text 時間帯
 * @type select
 * @option 朝
 * @option 昼
 * @option 夜
 * @option 真夜中
 * @default 昼
 * @desc 時間帯を選択
 *
 * @command GetCurrentWeather
 * @text 現在天候の保存
 * @desc 現在の天候を保存します（回想モードスイッチON時は保存しません）。
 *
 * @command ApplySpecialWeather
 * @text 特例天気設定（保存された天気）
 * @desc 保存された天候を適用します（回想モードスイッチON時は晴れになります）。
 *
 * @arg location
 * @text 屋内/屋外
 * @type select
 * @option 屋内
 * @option 屋外
 * @default 屋外
 * @desc 屋内か屋外かを選択
 *
 * @command SuspendWeatherUpdate
 * @text 天気更新の一時無効
 * @desc 天候の更新やマップ暗さのリセット機能を一時的に無効にします（セーブ・場所移動後も継続）。
 *
 * @arg enabled
 * @text 無効化の設定
 * @type boolean
 * @on 無効にする
 * @off 無効を解除
 * @default true
 * @desc ONで更新無効、OFFで通常動作に戻ります。
 *
 * @command OverrideMapDarkness
 * @text マップ暗さの上書き
 * @desc マップの暗さを強制的に上書きします（自動更新無効化）。
 *
 * @arg darkness
 * @text 暗さ
 * @desc 暗さの値（0-255）
 * @default 0
 * @type number
 * @min 0
 * @max 255
 *
 * @arg color
 * @text 色
 * @desc 暗さの色（CSS形式）
 * @default black
 * @type string
 *
 * @command ResetMapDarknessOverride
 * @text マップ暗さの上書き解除
 * @desc マップの暗さの上書き設定を解除し、自動更新に戻します。
 *
 * @help
 * ■ 概要
 * 指定したゲーム変数で管理される日付と時間に基づいて、
 * あらかじめ設定された天候演出（コモンイベント実行、雷演出のON/OFF）を自動で適用します。
 * マップ切り替え時、または日付・時間変数が変更された際に天候が更新されます。
 *
 * ■ 使い方
 * 1. プラグインパラメータで日付変数ID、時間変数ID、各天候コモンイベントID、雷演出スイッチIDを設定
 * 2. WeatherDataオブジェクト内で日付・時間ごとの天候設定を編集
 * 3. プラグインを有効化
 *
 * ■ 天候の種類
 * - Sunny: 晴れ
 * - Cloudy: 曇り
 * - Fog: 霧
 * - Rain: 雨
 *
 * ■ プラグインコマンド
 * - RunWeatherCommonEvent
 *   現在天候のコモンイベント即時実行（自動予約分のキャンセル付き）
 *
 * - SetSpecialWeather [天候] [屋内/屋外] [時間帯]
 *   特例天気を設定します（<Event>マップでのみ有効）
 *
 * - GetCurrentWeather
 *   現在の天候（通常または特例）を保存します。
 *   ※回想モードスイッチON時は保存されません。
 *
 * - ApplySpecialWeather [屋内/屋外]
 *   保存された天候を適用します。
 *   ※回想モードスイッチON時は自動的に「晴れ」になります。
 *
 * - SuspendWeatherUpdate [無効化の設定]
 *   天気更新とマップ暗さリセットを一時的に無効化/解除します。
 *   無効化中は、場所移動や時間経過による天候変化・暗さリセットが発生しません。
 *
 *   時間帯: 朝、昼、夜、真夜中
 *   例: SetSpecialWeather 晴れ 屋内 真夜中
 *
 * - OverrideMapDarkness [暗さ] [色]
 *   マップの暗さを強制的に上書きします。
 *   この設定が有効な間は、時間経過や天候による暗さの自動変更は無視されます。
 *
 * - ResetMapDarknessOverride
 *   マップの暗さの上書き設定を解除し、現在の時刻・天候に応じた暗さに戻します。
 */

(function () {
    'use strict';

    const pluginName = 'WeatherControl';
    const parameters = PluginManager.parameters(pluginName);

    // プラグインパラメータの取得
    const DateVariableId = Number(parameters['DateVariableId'] || 1);
    const TimeVariableId = Number(parameters['TimeVariableId'] || 2);
    const SunnyCommonEventId = Number(parameters['SunnyCommonEventId'] || 10);
    const CloudyCommonEventId = Number(parameters['CloudyCommonEventId'] || 11);
    const FogCommonEventId = Number(parameters['FogCommonEventId'] || 12);
    const RainCommonEventId = Number(parameters['RainCommonEventId'] || 13);
    const ThunderSwitchId = Number(parameters['ThunderSwitchId'] || 14);
    const NightSwitchId = Number(parameters['NightSwitchId'] || 15);
    const MidnightSwitchId = Number(parameters['MidnightSwitchId'] || 0);
    const ThunderIndoorSwitchId = Number(parameters['ThunderIndoorSwitchId'] || 0);
    const ThunderOutdoorSwitchId = Number(parameters['ThunderOutdoorSwitchId'] || 0);
    const RainMorningIndoorCommonEventId = Number(parameters['RainMorningIndoorCommonEventId'] || 0);
    const RainMorningOutdoorCommonEventId = Number(parameters['RainMorningOutdoorCommonEventId'] || 0);
    const RainAfternoonIndoorCommonEventId = Number(parameters['RainAfternoonIndoorCommonEventId'] || 0);
    const RainAfternoonOutdoorCommonEventId = Number(parameters['RainAfternoonOutdoorCommonEventId'] || 0);
    const RecollectionSwitchId = Number(parameters['RecollectionSwitchId'] || 0);

    // 天候設定データ
    const WeatherData = {
        0: { // 日付 0
            0: { weathers: ["Sunny"], thunder: false },
            1: { weathers: ["Sunny"], thunder: false },
            2: { weathers: [], thunder: false },
            3: { weathers: [], thunder: false }
        },
        1: { // 日付 1
            0: { weathers: ["Cloudy"], thunder: false },
            1: { weathers: ["Cloudy"], thunder: false },
            2: { weathers: ["Cloudy"], thunder: false },
            3: { weathers: ["Cloudy"], thunder: false }
        },
        2: { // 日付 2
            0: { weathers: ["Fog"], thunder: false },
            1: { weathers: ["Fog"], thunder: false },
            2: { weathers: ["Fog"], thunder: false },
            3: { weathers: ["Fog"], thunder: false }
        },
        3: { // 日付 3
            0: { weathers: ["Rain"], thunder: false },
            1: { weathers: ["Rain"], thunder: false },
            2: { weathers: ["Rain"], thunder: true },
            3: { weathers: ["Rain"], thunder: true }
        }
    };

    // 天候名からコモンイベントIDを取得するマッピング
    const WeatherEventMap = {
        "Sunny": SunnyCommonEventId,
        "Cloudy": CloudyCommonEventId,
        "Fog": FogCommonEventId,
        "Rain": RainCommonEventId
    };

    // 遠景IDと天気IDの設定
    const ParallaxId = "10"; // NRP_ParallaxesPlus.js のID 10
    const WeatherId = 0; // MOG_Weather_EX.js のID（必要に応じて変更可能）

    /**
     * 前回の天候設定を初期化
     */
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._weatherControlPreviousWeathers = [];
        this._weatherControlPreviousMapId = -1;
        this._weatherControlTransferPending = false;
        this._weatherControlTransferMapId = -1;
        this._weatherControlUpdatePending = false;
        this._weatherControlUpdateFrame = 0;
        this._weatherControlPreviousTime = -1;
        this._weatherControlSpecialWeather = null; // 特例天気の状態（null=無効、オブジェクト=有効）
        this._weatherControlSavedWeather = null; // GetCurrentWeatherで保存された天気情報
        this._weatherControlSuspended = false; // 天気更新の一時無効フラグ
        this._weatherControlDarknessOverride = null; // 暗さの上書き設定 { darkness, color }
        // <Event>マップ用の暗さ保存
        this._weatherControlEventMapDarkness = null; // { darkness: number, darknessColor: string, mapId: number }
    };

    /**
     * <Event>マップの暗さを保存する（セーブ時に呼び出し）
     */
    function saveEventMapDarkness() {
        if (isEventMap() && $gameMap) {
            $gameSystem._weatherControlEventMapDarkness = {
                darkness: $gameMap._darkness || 0,
                darknessColor: $gameMap._darknessColor || 'black',
                mapId: $gameMap.mapId()
            };
        } else {
            // <Event>タグ無しマップでは保存しない
            $gameSystem._weatherControlEventMapDarkness = null;
        }
    }

    /**
     * <Event>マップの暗さを復元する（ロード時に呼び出し）
     */
    function restoreEventMapDarkness() {
        const saved = $gameSystem._weatherControlEventMapDarkness;
        if (saved && $gameMap && $gameMap.mapId() === saved.mapId) {
            // <Event>マップで同じマップIDなら復元
            if (isEventMap()) {
                if ($gameMap._darkness !== undefined) {
                    $gameMap._darkness = saved.darkness;
                }
                if ($gameMap._darknessColor !== undefined) {
                    $gameMap._darknessColor = saved.darknessColor;
                }
            }
        }
        // 通常マップなら自動更新に任せるため何もしない
    }

    // DataManager.makeSaveContentsをフックして、セーブ時に<Event>マップの暗さを保存
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        saveEventMapDarkness();
        return _DataManager_makeSaveContents.call(this);
    };

    // DataManager.extractSaveContentsをフックして、ロード時にフラグを設定
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Scene_Map.onMapLoaded で復元するためのフラグを設定
        $gameSystem._weatherControlPendingDarknessRestore = true;
    };

    /**
     * 遠景を削除する関数
     * NRP_ParallaxesPlus.js の RemoveParallax コマンドを直接実行
     */
    function removeParallax() {
        try {
            const spriteset = SceneManager._scene && SceneManager._scene._spriteset;
            if (spriteset && spriteset._parallaxPlus) {
                const targetId = ParallaxId;
                const deleteParallaxes = spriteset._parallaxPlus.filter(p => p.id == targetId);

                if (deleteParallaxes.length > 0) {
                    // console.log(`[WC Debug] removeParallax: Found ${deleteParallaxes.length} sprites with ID ${targetId}. Removing...`);

                    // 配列のコピーを作成してループ
                    const targets = [...deleteParallaxes];

                    for (const parallax of targets) {
                        // 配列から削除
                        spriteset._parallaxPlus.remove(parallax);

                        // 親ノードから削除（表示から消す）
                        if ($gameParty.inBattle()) {
                            if (spriteset._battleField) {
                                spriteset._battleField.removeChild(parallax);
                            }
                        } else {
                            if (spriteset._tilemap) {
                                spriteset._tilemap.removeChild(parallax);
                            }
                        }
                        // ※destroy()は呼ばない（NRPが参照を持っている可能性があるため）
                    }
                } else {
                    // console.log(`[WC Debug] removeParallax: No sprites found with ID ${targetId}.`);
                }
            }

            // $gameMapからも削除（永続化データ）
            if ($gameMap && $gameMap._parallaxPlus) {
                const targetId = ParallaxId;
                const beforeLength = $gameMap._parallaxPlus.length;
                $gameMap._parallaxPlus = $gameMap._parallaxPlus.filter(p => p.id != targetId);
                if ($gameMap._parallaxPlus.length < beforeLength) {
                    // console.log(`[WC Debug] removeParallax: Removed from $gameMap._parallaxPlus.`);
                }
            }

            // NRPの抑制リストに追加（自動復活を防ぐ）
            if ($gameMap && !$gameMap._suppressedAutoParallaxIds) {
                $gameMap._suppressedAutoParallaxIds = [];
            }
            if ($gameMap && !$gameMap._suppressedAutoParallaxIds.includes(ParallaxId)) {
                $gameMap._suppressedAutoParallaxIds.push(ParallaxId);
                // console.log(`[WC Debug] removeParallax: Added ID ${ParallaxId} to suppression list.`);
            }

        } catch (e) {
            // console.error('遠景削除エラー:', e);
        }
    }

    /**
     * 天気エフェクトを削除する関数
     * MOG_Weather_EX.js の weatherEXRemoveAll コマンドを直接実行
     */
    function removeWeather() {
        try {
            // MOG_Weather_EX.js の weatherEXRemoveAll コマンドの実装を直接呼び出す
            // これにより雨を含むすべての天候エフェクトが解除される
            if ($gameSystem && typeof $gameSystem.weatherEXPluginComRemoveAll === 'function') {
                $gameSystem.weatherEXPluginComRemoveAll();
            } else if ($gameSystem && typeof $gameSystem.weatherEX_initialize === 'function') {
                // weatherEXPluginComRemoveAllが無い場合は直接初期化を呼ぶ
                $gameSystem.weatherEX_initialize(true);
            }
        } catch (e) {
            // console.error('天気削除エラー:', e);
        }
    }

    /**
     * マップが屋内かどうかを判定する関数
     * @returns {boolean} 屋内の場合true
     */
    function isIndoorMap() {
        // マップデータが存在しない場合は即座にfalse
        if (!$gameMap || !$dataMap) return false;

        // メモ欄(note)が存在しない場合もfalse
        const note = $dataMap.note;
        if (!note) return false;

        return note.includes('<Room>');
    }

    /**
     * マップが地下室かどうかを判定する関数
     * @returns {boolean} 地下室の場合true
     */
    function isBasementMap() {
        // マップデータが存在しない場合は即座にfalse
        if (!$gameMap || !$dataMap) return false;

        // メモ欄(note)が存在しない場合もfalse
        const note = $dataMap.note;
        if (!note) return false;

        return note.includes('<Basement>');
    }

    /**
     * マップがイベントマップかどうかを判定する関数
     * @returns {boolean} イベントマップの場合true
     */
    function isEventMap() {
        // マップデータが存在しない場合は即座にfalse
        if (!$gameMap || !$dataMap) return false;

        // メモ欄(note)が存在しない場合もfalse
        const note = $dataMap.note;
        if (!note) return false;

        return note.includes('<Event>');
    }

    /**
     * 現在の日付・時間に対応する天候コモンイベントIDを返す（最初の1件）
     * 即時実行用コモンイベントをイベント側から呼ぶための補助関数
     */
    function currentWeatherCommonEventId() {
        const date = $gameVariables.value(DateVariableId);
        const time = $gameVariables.value(TimeVariableId);
        const dateData = WeatherData[date];
        if (!dateData) return 0;
        const timeData = dateData[time];
        if (!timeData || !Array.isArray(timeData.weathers) || timeData.weathers.length === 0) return 0;
        const weatherKey = timeData.weathers[0];
        const eventId = WeatherEventMap[weatherKey];
        return Number(eventId || 0);
    }

    /**
     * すべての天候効果をリセットする関数
     */
    function resetAllWeatherEffects() {
        // 遠景と天気を削除
        removeParallax();
        removeWeather();

        // 色調をリセット
        if ($gameScreen) {
            $gameScreen.startTint([0, 0, 0, 0], 0);
        }

        // 暗さをリセット
        if ($gameMap && typeof $gameMap.setDarkness === 'function') {
            $gameMap.setDarkness(0);
            if (typeof $gameMap.setDarknessColor === 'function') {
                $gameMap.setDarknessColor('black');
            }
        }

        // 雷演出スイッチをOFF
        $gameSwitches.setValue(ThunderSwitchId, false);
        // 雷演出スイッチ（屋内・屋外）をOFF
        if (ThunderIndoorSwitchId > 0) {
            $gameSwitches.setValue(ThunderIndoorSwitchId, false);
        }
        if (ThunderOutdoorSwitchId > 0) {
            $gameSwitches.setValue(ThunderOutdoorSwitchId, false);
        }

        // BGSを停止（ただしMapBgmManagerで強制BGSが設定されている場合はスキップ）
        if (!($gameSystem && $gameSystem._mapBgmTempPalette && $gameSystem._mapBgmTempPalette.forcedBgs)) {
            // ▼ 修正: 天候BGSはライン1で管理するため、ライン1に切り替えてから停止する
            // これにより、ライン2で再生中のVariableWatchBGSなどが停止されるのを防ぐ
            if ($gameSystem && typeof $gameSystem.setBgsLine === 'function') {
                $gameSystem.setBgsLine(1);
            }
            AudioManager.stopBgs();
        }
    }

    /**
     * 特例天気を適用する関数
     * @param {string} weather - 天候（晴れ、曇り、霧、雨、なし）
     * @param {string} location - 屋内/屋外（屋内、屋外）
     * @param {string} timeOfDay - 時間帯（朝、昼、夜、真夜中）
     * @param {Game_Interpreter} interpreter - 呼び出し元のインタプリタ（指定された場合、子イベントとして即時実行）
     */
    function applySpecialWeather(weather, location, timeOfDay, interpreter) {
        // まずすべてをリセット
        resetAllWeatherEffects();

        // 天候名のマッピング
        const weatherMap = {
            "晴れ": "Sunny",
            "曇り": "Cloudy",
            "霧": "Fog",
            "雨": "Rain",
            "なし": null
        };

        // 時間帯のマッピング（0=朝、1=昼、2=夜、3=真夜中）
        const timeMap = {
            "朝": 0,
            "昼": 1,
            "夜": 2,
            "真夜中": 3,
            "0": 0, "1": 1, "2": 2, "3": 3 // 数値入力も許容
        };

        const weatherKey = weatherMap[weather] !== undefined ? weatherMap[weather] : weather; // マップにない場合は直接キーとして扱う
        const timeValue = timeMap[timeOfDay];
        const isIndoor = location === "屋内";
        const isNightOrLater = (timeValue === 2 || timeValue === 3); // 夜または真夜中

        // 雨の特殊処理: 時間帯と屋内/屋外に応じて異なるコモンイベントを実行
        if (weatherKey === "Rain" || weather === "雨") {
            let rainEventId = 0;
            if (timeValue === 0) {
                // 朝
                rainEventId = isIndoor ? RainMorningIndoorCommonEventId : RainMorningOutdoorCommonEventId;
            } else {
                // 昼以降（昼、夜、真夜中）
                rainEventId = isIndoor ? RainAfternoonIndoorCommonEventId : RainAfternoonOutdoorCommonEventId;
            }

            if (rainEventId > 0) {
                if (interpreter && interpreter instanceof Game_Interpreter) {
                    const commonEvent = $dataCommonEvents && $dataCommonEvents[rainEventId];
                    const eventIdForInterpreter = interpreter.isOnCurrentMap() ? interpreter._eventId : 0;
                    if (commonEvent) {
                        const waitCommand = { code: 230, indent: 0, parameters: [1] };
                        const listWithWait = [waitCommand, ...commonEvent.list];
                        interpreter.setupChild(listWithWait, eventIdForInterpreter);
                    }
                } else {
                    $gameTemp.reserveCommonEvent(rainEventId);
                }
            }

            // 雷の特殊処理: 雨＋夜以降の場合、屋内/屋外用スイッチをONにする
            if (isNightOrLater) {
                if (isIndoor) {
                    if (ThunderIndoorSwitchId > 0) {
                        $gameSwitches.setValue(ThunderIndoorSwitchId, true);
                    }
                } else {
                    if (ThunderOutdoorSwitchId > 0) {
                        $gameSwitches.setValue(ThunderOutdoorSwitchId, true);
                    }
                }
            }
        } else if (weatherKey && weatherKey !== "なし") {
            // 雨以外の天候: 通常のコモンイベント実行
            const eventId = WeatherEventMap[weatherKey];
            if (eventId && eventId > 0) {
                if (interpreter && interpreter instanceof Game_Interpreter) {
                    // インタプリタが渡された場合、子イベントとして即時実行
                    const commonEvent = $dataCommonEvents && $dataCommonEvents[eventId];
                    const eventIdForInterpreter = interpreter.isOnCurrentMap() ? interpreter._eventId : 0;
                    if (commonEvent) {
                        // ▼ 修正: マップ描画更新待ちのために1フレームウェイトを挿入
                        const waitCommand = { code: 230, indent: 0, parameters: [1] };
                        // ▼ 修正: コモンイベント実行前に強制的にBGSライン1に切り替えるスクリプトを挿入
                        const setLineCommand = { code: 355, indent: 0, parameters: ["if ($gameSystem && $gameSystem.setBgsLine) $gameSystem.setBgsLine(1);"] };
                        const listWithWait = [setLineCommand, waitCommand, ...commonEvent.list];
                        interpreter.setupChild(listWithWait, eventIdForInterpreter);
                    }
                } else {
                    // 通常の予約実行
                    $gameTemp.reserveCommonEvent(eventId);
                }
            }
        }

        // isIndoorは上で定義済み

        // 暗さと色調を設定
        if (timeValue === 0 || timeValue === 1) {
            // 朝・昼：暗さ0、RGB(0,0,0)
            if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                $gameMap.setDarkness(0);
                if (typeof $gameMap.setDarknessColor === 'function') {
                    $gameMap.setDarknessColor('black');
                }
            }
            if ($gameScreen) {
                $gameScreen.startTint([0, 0, 0, 0], 0);
            }
        } else if (timeValue === 2) {
            // 夜
            if (isIndoor) {
                // 屋内：暗さ0、RGB(0,0,0)
                if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                    $gameMap.setDarkness(0);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('black');
                    }
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
            } else {
                // 屋外：暗さ55、RGB(0,0,15)
                if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                    $gameMap.setDarkness(55);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 15, 0], 0);
                }
            }
        } else if (timeValue === 3) {
            // 真夜中
            if (isIndoor) {
                // 屋内：暗さ55、RGB(0,0,15)
                if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                    $gameMap.setDarkness(55);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 15, 0], 0);
                }
            } else {
                // 屋外：暗さ66、RGB(0,0,15)
                if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                    $gameMap.setDarkness(66);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 15, 0], 0);
                }
            }
        }

        // 夜スイッチのON/OFFを設定
        if (timeValue === 2 || timeValue === 3) {
            // 夜・真夜中：スイッチをON
            if (NightSwitchId > 0) {
                $gameSwitches.setValue(NightSwitchId, true);
            }
        } else {
            // 朝・昼：スイッチをOFF
            if (NightSwitchId > 0) {
                $gameSwitches.setValue(NightSwitchId, false);
            }
        }

        // 真夜中スイッチのON/OFFを設定
        if (timeValue === 3) {
            // 真夜中：スイッチをON
            if (MidnightSwitchId > 0) {
                $gameSwitches.setValue(MidnightSwitchId, true);
            }
        } else {
            // その他：スイッチをOFF
            if (MidnightSwitchId > 0) {
                $gameSwitches.setValue(MidnightSwitchId, false);
            }
        }

        // 特例天気の状態を保存
        $gameSystem._weatherControlSpecialWeather = {
            weather: weather,
            location: location,
            timeOfDay: timeOfDay
        };
    }

    /**
     * マップの暗さを設定する関数
     * @param {number} time - 時間（0-3）
     */
    function applyMapDarkness(time) {
        try {
            // 天候更新が一時無効化されている場合は何もしない
            if ($gameSystem._weatherControlSuspended) {
                return;
            }

            if (!$gameMap || typeof $gameMap.setDarkness !== 'function') {
                return; // MPP_MapLight.jsが読み込まれていない場合は何もしない
            }

            // $dataMapが存在しない場合は何もしない
            if (typeof $dataMap === 'undefined' || $dataMap === null) {
                return;
            }

            // $dataMap.noteが存在しない場合は何もしない
            if (typeof $dataMap.note === 'undefined' || $dataMap.note === null) {
                return;
            }

            // ▼ 修正: 暗さの上書き設定がある場合はそれを優先適用
            if ($gameSystem._weatherControlDarknessOverride) {
                const override = $gameSystem._weatherControlDarknessOverride;
                $gameMap.setDarkness(override.darkness);
                if (typeof $gameMap.setDarknessColor === 'function' && override.color) {
                    $gameMap.setDarknessColor(override.color);
                }
                // 必要に応じて色調もリセット（または上書き機能が必要なら拡張）
                // ここでは暗さのみ制御し、色調は天候依存とする（または色調もリセット？）
                // ユーザー要望は「暗さ」なので、一旦暗さのみ適用
                return;
            }

            // 地下室の場合は暗さをリセット
            if (isBasementMap()) {
                $gameMap.setDarkness(0);
                if (typeof $gameMap.setDarknessColor === 'function') {
                    $gameMap.setDarknessColor('black');
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
                return;
            }

            const isIndoor = isIndoorMap();

            // 時間変数が0,1の場合は暗さをリセット
            if (time === 0 || time === 1) {
                $gameMap.setDarkness(0);
                if (typeof $gameMap.setDarknessColor === 'function') {
                    $gameMap.setDarknessColor('black');
                }
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
                return;
            }

            // 時間変数が2（夜）の場合
            if (time === 2) {
                if (isIndoor) {
                    // 屋内：適応しない（暗さをリセット）
                    $gameMap.setDarkness(0);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('black');
                    }
                    if ($gameScreen) {
                        $gameScreen.startTint([0, 0, 0, 0], 0);
                    }
                } else {
                    // 屋外：Darkness 55、rgb=0,0,15
                    $gameMap.setDarkness(55);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                    if ($gameScreen) {
                        $gameScreen.startTint([0, 0, 15, 0], 0);
                    }
                }
            }
            // 時間変数が3（真夜中）の場合
            else if (time === 3) {
                if (isIndoor) {
                    // 屋内：Darkness 55、rgb=0,0,15
                    $gameMap.setDarkness(55);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                    if ($gameScreen) {
                        $gameScreen.startTint([0, 0, 15, 0], 0);
                    }
                } else {
                    // 屋外：Darkness 66、rgb=0,0,15
                    $gameMap.setDarkness(66);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('rgb(0,0,15)');
                    }
                    if ($gameScreen) {
                        $gameScreen.startTint([0, 0, 15, 0], 0);
                    }
                }
            }
        } catch (e) {
            // console.error('マップ暗さ設定エラー:', e);
        }
    }

    /**
     * 天候を適用する関数
     * @param {number} date - 日付（0-3）
     * @param {number} time - 時間（0-3）
     * @param {boolean} isMapLoad - マップ読み込み時かどうか
     * @param {boolean} executeImmediately - コモンイベントを即時実行するか（setupChildで実行）
     * @param {Game_Interpreter} callerInterpreter - 即時実行時に使用するインタプリタ
     */
    function applyWeather(date, time, isMapLoad, executeImmediately, callerInterpreter) {
        // [Debounce] 短期間の連続実行を防止（20フレーム = 約0.33秒）
        // これにより、自動更新と手動更新が重なった際の重複追加を防ぐ
        if ($gameTemp) {
            const now = Graphics.frameCount;
            const last = $gameTemp._lastWeatherUpdateTime || 0;
            // 経過時間が20フレーム未満なら処理をスキップ
            if (now - last < 20) {
                return;
            }
            $gameTemp._lastWeatherUpdateTime = now;
        }

        // 天候更新が一時無効化されている場合は何もしない
        if ($gameSystem._weatherControlSuspended) {
            return;
        }

        // console.log(`[WC Debug] applyWeather: Date=${date}, Time=${time}, isMapLoad=${isMapLoad}, execImm=${executeImmediately}`);
        const runImmediate = !!executeImmediately && callerInterpreter instanceof Game_Interpreter;

        // $dataMapが存在しない場合は何もしない
        if (typeof $dataMap === 'undefined' || $dataMap === null || !$gameMap) {
            return;
        }

        // 前回のマップIDと現在のマップIDを取得（最初に一度だけ宣言）
        const previousMapId = $gameSystem._weatherControlPreviousMapId || -1;
        const currentMapId = $gameMap ? $gameMap.mapId() : -1;

        // マップ移動を検知して特例天気を解除
        if (currentMapId !== previousMapId) {
            if ($gameSystem._weatherControlSpecialWeather !== null) {
                // 特例天気を解除してリセット
                $gameSystem._weatherControlSpecialWeather = null;
                resetAllWeatherEffects();
                if (NightSwitchId > 0) {
                    $gameSwitches.setValue(NightSwitchId, false);
                }
                $gameSystem._weatherControlPreviousWeathers = [];
            }
        }

        // 特例天気が設定されている場合は通常の処理をスキップ（全てのマップで有効）
        if ($gameSystem._weatherControlSpecialWeather !== null) {
            return;
        }

        // <Event>マップの場合は通常天気を適用しない
        if (isEventMap()) {
            // マップ移動直後の場合は初期化
            if (currentMapId !== previousMapId) {
                resetAllWeatherEffects();
                $gameSystem._weatherControlPreviousWeathers = [];
                $gameSystem._weatherControlPreviousMapId = currentMapId;
                $gameSystem._weatherControlPreviousTime = -1;
            }
            return;
        }



        // ▼ 修正: データが存在するかチェックしてから取得
        const dateData = WeatherData[date];
        let currentWeathers = [];
        // 雷判定用の変数も初期化しておく（元のコードでは後方で判定していたが、ここではデータ取得しておく方が安全）
        // ※元のロジックを崩さないため、ここでは配列の取得のみ修正します

        if (dateData) {
            const timeData = dateData[time];
            if (timeData && timeData.weathers && Array.isArray(timeData.weathers)) {
                currentWeathers = timeData.weathers.slice(); // コピーを作成
            }
        }
        // ▲ 修正ここまで

        // console.log(`[WC Debug] Weathers: Current=${JSON.stringify(currentWeathers)}, Previous=${JSON.stringify($gameSystem._weatherControlPreviousWeathers)}`);

        // 前回の天候設定を取得
        const previousWeathers = $gameSystem._weatherControlPreviousWeathers || [];
        // 前回の時間変数を取得
        const previousTime = $gameSystem._weatherControlPreviousTime !== undefined
            ? $gameSystem._weatherControlPreviousTime : -1;

        // 前回の天候にRainが含まれていたかどうかをチェック
        const hadRain = previousWeathers.indexOf("Rain") !== -1;
        // 現在の天候にRainが含まれているかどうかをチェック
        const hasRain = currentWeathers.indexOf("Rain") !== -1;

        // Rainが実行された次の時間にRainが無い場合、BGSを停止し、色調をリセット
        // ただしMapBgmManagerで強制BGSが設定されている場合はBGS停止をスキップ
        if (hadRain && !hasRain) {
            if (!($gameSystem && $gameSystem._mapBgmTempPalette && $gameSystem._mapBgmTempPalette.forcedBgs)) {
                AudioManager.stopBgs();
            }
            // 色調をリセット（即座にリセット）
            if ($gameScreen) {
                $gameScreen.startTint([0, 0, 0, 0], 0);
            }
        }

        // 配列が完全に同じかどうかを判定する関数
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            // ソートして比較（順序が異なっても同じ要素なら同じとみなす）
            const sorted1 = arr1.slice().sort();
            const sorted2 = arr2.slice().sort();
            for (let i = 0; i < sorted1.length; i++) {
                if (sorted1[i] !== sorted2[i]) {
                    return false;
                }
            }
            return true;
        }

        // 現在の天候が空配列の場合、前回の遠景と天気を削除して終了
        if (currentWeathers.length === 0) {
            // console.log(`[WC Debug] No weather. Removing all.`);
            // 前回の天候がある場合、または前回の天候が記録されている場合は削除
            // 前回の天候が空でなく、かつ現在の天候が空の場合、必ず削除を実行
            if (previousWeathers.length > 0) {
                // 削除処理を確実に実行
                removeParallax();
                removeWeather();
            } else {
                // 前回の天候が記録されていない場合でも、遠景が存在する可能性があるため削除を試みる
                // （初回実行時や、記録がリセットされた場合の対策）
                removeParallax();
                removeWeather();
            }
            // 雷演出スイッチをOFFにする
            $gameSwitches.setValue(ThunderSwitchId, false);

            // 時間変数に応じてマップの暗さを設定（weathersが空でも暗さは設定する）
            // 時間変数が0,1に変化した場合は暗さをリセット
            if (previousTime !== -1 && (previousTime === 2 || previousTime === 3) && (time === 0 || time === 1)) {
                // 時間変数が2,3から0,1に変化した場合は暗さをリセット
                if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                    $gameMap.setDarkness(0);
                    if (typeof $gameMap.setDarknessColor === 'function') {
                        $gameMap.setDarknessColor('black');
                    }
                }
                // 色調もリセット
                if ($gameScreen) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
            } else {
                // 時間変数に応じてマップの暗さを設定
                applyMapDarkness(time);
            }

            // 現在の天候設定とマップID、時間変数を記録（空配列として）
            $gameSystem._weatherControlPreviousWeathers = [];
            $gameSystem._weatherControlPreviousMapId = currentMapId;
            $gameSystem._weatherControlPreviousTime = time;
            return; // コモンイベントは実行せず終了
        }

        // 前回の天候と現在の天候を比較
        // 1. 同じマップ内での移動の場合 → 常に削除して再適用（遠景の重複を防ぐ）
        // 2. 完全に同じ場合（例：SunnyからSunny）→ 既に遠景があるなら維持（何もしない）、なければ追加
        // 3. 前回の天候が現在の天候に含まれていない場合 → 削除
        let needRemove = false;
        let skipCommonEvent = false; // コモンイベント実行（遠景追加）をスキップするフラグ
        const isSameMap = (currentMapId !== -1 && previousMapId !== -1 && currentMapId === previousMapId);

        // 現在ID10の遠景が存在するかチェック
        // $gameMapだけでなく、実際の画面表示（Spriteset）もチェックする
        // IDは文字列・数値の両方で比較する
        let hasParallax = false;
        const checkId = (id) => {
            return id == ParallaxId; // loose equality for "10" == 10
        };

        if ($gameMap && $gameMap._parallaxPlus) {
            if ($gameMap._parallaxPlus.some(p => checkId(p.id))) {
                hasParallax = true;
            }
        }

        if (!hasParallax) {
            // Spriteset側も確認
            const spriteset = SceneManager._scene && SceneManager._scene._spriteset;
            if (spriteset && spriteset._parallaxPlus) {
                if (spriteset._parallaxPlus.some(p => checkId(p.id))) {
                    hasParallax = true;
                }
            }
        }

        if (isMapLoad && isSameMap) {
            // 同じマップ内での移動の場合は念のため再適用（遠景の重複を防ぐため一度消す）
            needRemove = true;
        } else if (previousWeathers.length > 0) {
            // 完全に同じ場合、または前回の天候が現在の天候に含まれていない場合
            if (arraysEqual(previousWeathers, currentWeathers)) {
                // 天候が変わっていない場合
                if (hasParallax) {
                    // 既に遠景があり、天候も同じなら、何もしない（維持する）
                    // これにより、場所移動時や時間経過時の重複追加、および一瞬の消滅（点滅）を防ぐ
                    needRemove = false;
                    skipCommonEvent = true;
                } else {
                    // 遠景がないなら、再追加するために削除（念のため）はせず、そのまま追加処理へ進む
                    needRemove = false;
                    // skipCommonEvent = false;
                }
            } else {
                // 前回の天候が現在の天候に含まれていない場合
                for (let i = 0; i < previousWeathers.length; i++) {
                    if (currentWeathers.indexOf(previousWeathers[i]) === -1) {
                        needRemove = true;
                        break;
                    }
                }
            }
        } else {
            // 前回の天候がない場合（初回など）
            // 既に遠景がある場合（セーブロード直後や、他の要因で追加された場合）
            if (hasParallax) {
                // 現在の天候と矛盾しないかチェックすべきだが、
                // ここでは単純に「初期化状態からの復帰」とみなして、
                // 重複を防ぐために維持する（再度追加しない）
                skipCommonEvent = true;
            }
        }

        // 削除が必要な場合、遠景と天気を削除
        if (needRemove && previousWeathers.length > 0) {
            removeParallax();
            removeWeather();
        }

        // まず雷演出スイッチをOFFにする
        $gameSwitches.setValue(ThunderSwitchId, false);

        // 前回の天候と現在の天候が完全に同じかどうかを判定
        const isSameWeather = previousWeathers.length > 0 && arraysEqual(previousWeathers, currentWeathers);

        // RainからRainに変更された場合のみ、色調をリセット
        // （維持する場合でも色調リセットは走らせておく方が安全か？ -> 状態が変わっていないなら不要だが、念のため）
        if (isSameWeather && hasRain) {
            // 色調をリセット（即座にリセット）
            if ($gameScreen) {
                $gameScreen.startTint([0, 0, 0, 0], 0);
            }
        }

        // コモンイベント実行（遠景追加など）
        // スキップフラグが立っていない場合のみ実行
        if (!skipCommonEvent) {
            // 抑制リストから削除（新しい遠景を追加するため）
            if ($gameMap && $gameMap._suppressedAutoParallaxIds) {
                const idx = $gameMap._suppressedAutoParallaxIds.indexOf(ParallaxId);
                if (idx > -1) {
                    $gameMap._suppressedAutoParallaxIds.splice(idx, 1);
                    // console.log(`[WC Debug] applyWeather: Cleared ID ${ParallaxId} from suppression list.`);
                }
            }

            currentWeathers.forEach(function (weather) {
                // 前回の修正で入れた重複チェックは上記ロジックに統合されたため削除しても良いが、念のため残すか、
                // あるいは上記ロジックで制御できているので、ここではシンプルに実行する。
                // hasParallaxチェックは上でやっているので、ここでは再チェックしない（追加すべきと判断されたので）。

                const eventId = WeatherEventMap[weather];
                if (eventId && eventId > 0) {
                    if (runImmediate) {
                        // 呼び出し元インタプリタで即時実行（親は子が終わるまで待つ）
                        const commonEvent = $dataCommonEvents && $dataCommonEvents[eventId];
                        const eventIdForInterpreter = callerInterpreter.isOnCurrentMap() ? callerInterpreter._eventId : 0;
                        if (commonEvent) {
                            // ▼ 修正: マップ描画更新待ちのために1フレームウェイトを挿入
                            const waitCommand = { code: 230, indent: 0, parameters: [1] };
                            // ▼ 修正: コモンイベント実行前に強制的にBGSライン1に切り替えるスクリプトを挿入
                            const setLineCommand = { code: 355, indent: 0, parameters: ["if ($gameSystem && $gameSystem.setBgsLine) $gameSystem.setBgsLine(1);"] };
                            const listWithWait = [setLineCommand, waitCommand, ...commonEvent.list];
                            callerInterpreter.setupChild(listWithWait, eventIdForInterpreter);
                        }
                    } else {
                        // 従来どおり予約実行（イベント終了後に走る）
                        $gameTemp.reserveCommonEvent(eventId);
                    }
                }
            });
        }

        // 雷演出のON/OFFを設定
        if (dateData && dateData[time] && dateData[time].thunder === true) {
            $gameSwitches.setValue(ThunderSwitchId, true);
        } else {
            $gameSwitches.setValue(ThunderSwitchId, false);
        }

        // 時間変数に応じてマップの暗さを設定
        // 時間変数が0,1に変化した場合は暗さをリセット
        if (previousTime !== -1 && (previousTime === 2 || previousTime === 3) && (time === 0 || time === 1)) {
            // 時間変数が2,3から0,1に変化した場合は暗さをリセット
            if ($gameMap && typeof $gameMap.setDarkness === 'function') {
                $gameMap.setDarkness(0);
                if (typeof $gameMap.setDarknessColor === 'function') {
                    $gameMap.setDarknessColor('black');
                }
            }
            // 色調もリセット
            if ($gameScreen) {
                $gameScreen.startTint([0, 0, 0, 0], 0);
            }
        } else {
            // 時間変数に応じてマップの暗さを設定
            applyMapDarkness(time);
        }

        // 現在の天候設定とマップID、時間変数を記録
        $gameSystem._weatherControlPreviousWeathers = currentWeathers;
        $gameSystem._weatherControlPreviousMapId = currentMapId;
        $gameSystem._weatherControlPreviousTime = time;
    }

    // Game_Variables.prototype.setValueをフックして変数変更を監視
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        const oldValue = this.value(variableId);
        _Game_Variables_setValue.call(this, variableId, value);

        // 日付変数または時間変数が変更された場合、次のフレームで天候を更新
        // これにより、連続した変更（例：0,0から3,3への一気の変更）を1回の処理にまとめる
        if (variableId === DateVariableId || variableId === TimeVariableId) {
            $gameSystem._weatherControlUpdatePending = true;
            $gameSystem._weatherControlUpdateFrame = 0;
        }
    };

    // Game_Player.prototype.performTransferをフックして場所移動時に天候を更新
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        // ▼ 修正: 移動先マップIDを取得（実行後にクリアされるため先に取得）
        const nextMapId = (this.isTransferring()) ? this._newMapId : ($gameMap ? $gameMap.mapId() : 0);

        _Game_Player_performTransfer.call(this);

        // ▼ 修正: 場所移動時に特例天気フラグをクリア
        // これにより、<Event>マップで特例天気を設定した後に通常マップへ戻ると
        // 特例天気が解除され、通常の天候ロードが正しく行われるようになる
        if ($gameSystem._weatherControlSpecialWeather !== null) {
            $gameSystem._weatherControlSpecialWeather = null;
            // 雨を含む天候エフェクトを削除
            removeWeather();
            // 夜スイッチもリセット（通常の天候適用で再設定される）
            if (NightSwitchId > 0) {
                $gameSwitches.setValue(NightSwitchId, false);
            }
            // 真夜中スイッチもリセット
            if (MidnightSwitchId > 0) {
                $gameSwitches.setValue(MidnightSwitchId, false);
            }
            // 雷演出スイッチ（屋内・屋外）をリセット
            if (ThunderIndoorSwitchId > 0) {
                $gameSwitches.setValue(ThunderIndoorSwitchId, false);
            }
            if (ThunderOutdoorSwitchId > 0) {
                $gameSwitches.setValue(ThunderOutdoorSwitchId, false);
            }
            // 前回天候もリセットして、次のマップで確実に天候が適用されるようにする
            $gameSystem._weatherControlPreviousWeathers = [];
        }

        // ▼ 修正: 場所移動時に暗さ上書き設定もクリア
        if ($gameSystem._weatherControlDarknessOverride !== null) {
            $gameSystem._weatherControlDarknessOverride = null;
        }

        // 場所移動が実行されたことを記録
        // マップの設定が完了するまで待つ必要があるため、フラグを設定
        if ($gameMap) {
            $gameSystem._weatherControlTransferPending = true;
            $gameSystem._weatherControlTransferMapId = nextMapId; // ▼ 修正: 移動先IDを設定
            // 場所移動時は、変数変更の遅延実行をキャンセル（場所移動時の処理を優先）
            $gameSystem._weatherControlUpdatePending = false;
            $gameSystem._weatherControlUpdateFrame = 0;

            // ▼ 修正: 場所移動時に、前のマップで予約された天候コモンイベントがあればキャンセルする
            // これにより、Map10で予約→Map53で実行、さらにMap53で予約→実行という「2回実行」を防ぐ
            if ($gameTemp.isCommonEventReserved()) {
                let reservedId = 0;
                if (typeof $gameTemp.reservedCommonEvent === 'function') {
                    const reservedCommonEvent = $gameTemp.reservedCommonEvent();
                    if (reservedCommonEvent) {
                        reservedId = reservedCommonEvent.id;
                    }
                } else {
                    reservedId = $gameTemp._commonEventId || 0;
                }

                if (reservedId > 0) {
                    // IDの型不一致（文字列 vs 数値）を防ぐために数値変換して比較
                    const weatherEventIds = Object.values(WeatherEventMap).map(id => Number(id));
                    if (weatherEventIds.includes(Number(reservedId))) {
                        $gameTemp.clearCommonEvent();
                    }
                }
            }
        }
    };

    // Scene_Map.prototype.updateをフックして場所移動完了後に天候を更新
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        // 【修正】イベント実行中は自動天候更新を抑制する
        // これにより、ウェイト中に予約されたコモンイベントがイベント終了後に走る問題を回避
        if ($gameMap && $gameMap.isEventRunning()) {
            return;
        }

        // 【修正】<Event>タグマップ上では自動天候更新をスキップ
        // ただし、場所移動完了時（TransferPending=true）はリセット処理が必要なため通す
        if (isEventMap() && !$gameSystem._weatherControlTransferPending) {
            // フラグをクリアして更新を無効化
            $gameSystem._weatherControlUpdatePending = false;
            $gameSystem._weatherControlUpdateFrame = 0;
            return;
        }

        // 変数変更または場所移動による天候更新（統合して1回のみ実行）
        let shouldUpdate = false;
        let isMapLoad = false;

        // 場所移動が完了した場合のチェック
        if ($gameSystem._weatherControlTransferPending && $gameMap) {
            const currentMapId = $gameMap.mapId();
            if (currentMapId === $gameSystem._weatherControlTransferMapId) {
                $gameSystem._weatherControlTransferPending = false;

                // 【修正】<Event>マップ到達時に強制的に天候をリセット
                // applyWeather内の判定に頼らず、ここで確実に削除を実行する
                if (isEventMap()) {
                    resetAllWeatherEffects();
                }

                const previousMapId = $gameSystem._weatherControlPreviousMapId || -1;
                isMapLoad = (currentMapId === previousMapId && previousMapId !== -1);
                shouldUpdate = true;
            }
        }

        // 変数変更による遅延更新チェック
        if ($gameSystem._weatherControlUpdatePending) {
            $gameSystem._weatherControlUpdateFrame++;
            if ($gameSystem._weatherControlUpdateFrame >= 1) {
                $gameSystem._weatherControlUpdatePending = false;
                $gameSystem._weatherControlUpdateFrame = 0;
                shouldUpdate = true;
            }
        }

        // 1回だけ更新を実行（場所移動と変数変更が同時に発生しても1回のみ）
        if (shouldUpdate) {
            const date = $gameVariables.value(DateVariableId);
            const time = $gameVariables.value(TimeVariableId);
            applyWeather(date, time, isMapLoad, false, null);
        }
    };

    // Scene_Map.prototype.onMapLoadedをフックしてマップ読み込み時に天候を更新
    // ただし、マップIDが変更されていない場合や、場所移動処理中の場合はスキップして二重適用を防ぐ
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);

        // 【修正】ロード時の暗さ復元（Game_Map.setup後に実行されるため正しいタイミング）
        if ($gameSystem._weatherControlPendingDarknessRestore) {
            $gameSystem._weatherControlPendingDarknessRestore = false;
            restoreEventMapDarkness();
        }

        // 【修正】<Event>タグマップ上では天候更新をスキップ
        // ただし、場所移動時は天候エフェクトをリセットする必要がある
        if (isEventMap()) {
            // 【修正】<Event>マップに到達した場合、天候エフェクトを強制リセット
            // removeWeatherは$dataMapがロード済みのこのタイミングで確実に実行される
            removeWeather();
            removeParallax();

            // 【修正】雷スイッチを確実にOFFにする（並列処理のコモンイベントが起動しないように）
            // ※onMapLoadedは並列処理よりも先に実行されるため、ここでOFFにすれば確実
            $gameSwitches.setValue(ThunderSwitchId, false);
            if (ThunderIndoorSwitchId > 0) {
                $gameSwitches.setValue(ThunderIndoorSwitchId, false);
            }
            if (ThunderOutdoorSwitchId > 0) {
                $gameSwitches.setValue(ThunderOutdoorSwitchId, false);
            }
            return;
        }

        // マップIDが実際に変更された場合のみ天候を適用
        // メニューを閉じた時やシーン遷移時にもonMapLoadedが呼ばれるため、
        // マップIDが変更されていない場合は処理をスキップ
        const currentMapId = $gameMap ? $gameMap.mapId() : -1;
        const previousMapId = $gameSystem._weatherControlPreviousMapId || -1;

        // マップIDが変更された場合のみ処理を実行
        // 場所移動の場合はperformTransfer → Scene_Map.update 側で必ず1回だけ適用されるため、
        // ここでは_transferPendingが立っているときは何もしない
        if (currentMapId !== previousMapId && currentMapId !== -1) {
            if ($gameSystem._weatherControlTransferPending) {
                // 場所移動時は二重適用を防ぐためスキップ
                return;
            }
            const date = $gameVariables.value(DateVariableId);
            const time = $gameVariables.value(TimeVariableId);
            applyWeather(date, time, false, false, null);
        }
    };

    // 【修正】カスタムメニューシーンからの復帰対応
    // Scene_Base.prototype.startをフックして、Scene_Mapに戻る際のEvent mapチェックを強化
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);

        // Scene_Mapに戻った時のみ処理
        if (this instanceof Scene_Map) {
            // <Event>マップ上なら天候関連フラグをクリア（リセット防止）
            if (isEventMap()) {
                $gameSystem._weatherControlUpdatePending = false;
                $gameSystem._weatherControlTransferPending = false;
                $gameSystem._weatherControlUpdateFrame = 0;
            }
        }
    };

    // SceneManager.popをフックして、カスタムメニューシーンからの復帰時にも対応
    const _SceneManager_pop = SceneManager.pop;
    SceneManager.pop = function () {
        _SceneManager_pop.call(this);

        // 100ms後に遅延チェック（シーン切り替え完了を待つ）
        setTimeout(function () {
            if (SceneManager._scene instanceof Scene_Map) {
                if (isEventMap()) {
                    $gameSystem._weatherControlUpdatePending = false;
                    $gameSystem._weatherControlTransferPending = false;
                    $gameSystem._weatherControlUpdateFrame = 0;
                }
            }
        }, 100);
    };

    // プラグインコマンドの登録
    PluginManager.registerCommand(pluginName, 'GetWeatherCommonEventId', function (args) {
        const variableId = Number(args.variableId || 0);
        if (variableId > 0) {
            const eventId = currentWeatherCommonEventId();
            $gameVariables.setValue(variableId, eventId);
        }
    });

    // 現在天候のコモンイベントを「コモンイベントの実行」と同様に即時実行するコマンド
    PluginManager.registerCommand(pluginName, 'RunWeatherCommonEvent', function (args) {
        // console.log("[WC Debug] RunWeatherCommonEvent: Clearing all auto-delays and pending states.");

        // 1. 自動更新フラグの完全リセット
        $gameSystem._weatherControlTransferPending = false;
        $gameSystem._weatherControlUpdatePending = false;
        $gameSystem._weatherControlUpdateFrame = 0;

        // 2. 場所移動判定用のIDもリセット
        if ($gameMap) {
            $gameSystem._weatherControlTransferMapId = -1;
        }

        // 予約されているコモンイベントが天候イベントであれば、それをキャンセルする
        // パラメータから直接IDリストを再構築してチェック（WeatherEventMapの同期漏れ防止）
        const tempEventIds = [
            Number(SunnyCommonEventId),
            Number(CloudyCommonEventId),
            Number(FogCommonEventId),
            Number(RainCommonEventId)
        ];

        if ($gameTemp.isCommonEventReserved()) {
            let reservedId = 0;
            if (typeof $gameTemp.reservedCommonEvent === 'function') {
                const reservedCommonEvent = $gameTemp.reservedCommonEvent();
                if (reservedCommonEvent) {
                    reservedId = reservedCommonEvent.id;
                }
            } else {
                reservedId = $gameTemp._commonEventId || 0;
            }

            if (reservedId > 0) {
                if (tempEventIds.includes(Number(reservedId))) {
                    $gameTemp.clearCommonEvent();
                }
            }
        }

        // 強制的に既存の遠景を一度削除して、重複を確実に防ぐ
        // （タイミングによってapplyWeather内のチェックをすり抜けてしまった場合の安全策）
        if (typeof removeParallax === 'function') {
            removeParallax();
        }

        const date = $gameVariables.value(DateVariableId);
        const time = $gameVariables.value(TimeVariableId);
        applyWeather(date, time, false, true, this);
    });

    PluginManager.registerCommand(pluginName, 'SetSpecialWeather', function (args) {
        const weather = String(args.weather || 'なし').trim();
        const location = String(args.location || '屋外').trim();
        const timeOfDay = String(args.timeOfDay || '昼').trim();

        // 制限撤廃: どのマップでも実行可能
        // 特例天気を適用
        // インタプリタ(this)を渡して、即時実行可能にする
        applySpecialWeather(weather, location, timeOfDay, this);
    });

    PluginManager.registerCommand(pluginName, 'GetCurrentWeather', function (args) {
        // 回想モードスイッチがONの場合は保存しない
        if (RecollectionSwitchId > 0 && $gameSwitches.value(RecollectionSwitchId)) {
            return;
        }

        // 特例天気が適用されている場合は、その設定を優先して保存
        // （イベント演出などで一時的に天候を変えている場合、その演出を引き継ぐため）
        if ($gameSystem._weatherControlSpecialWeather) {
            $gameSystem._weatherControlSavedWeather = {
                weather: $gameSystem._weatherControlSpecialWeather.weather,
                timeOfDay: $gameSystem._weatherControlSpecialWeather.timeOfDay
            };
            return;
        }

        const date = $gameVariables.value(DateVariableId);
        const time = $gameVariables.value(TimeVariableId);

        let weather = "Sunny"; // デフォルト

        const dateData = WeatherData[date];
        if (dateData) {
            const timeData = dateData[time];
            if (timeData && Array.isArray(timeData.weathers) && timeData.weathers.length > 0) {
                weather = timeData.weathers[0];
            } else if (timeData && Array.isArray(timeData.weathers) && timeData.weathers.length === 0) {
                weather = null;
            }
        }

        // 保存
        $gameSystem._weatherControlSavedWeather = {
            weather: weather,
            timeOfDay: time
        };
    });

    PluginManager.registerCommand(pluginName, 'ApplySpecialWeather', function (args) {
        const location = String(args.location || '屋外').trim();

        // 回想モードスイッチがONの場合
        if (RecollectionSwitchId > 0 && $gameSwitches.value(RecollectionSwitchId)) {
            // 強制的に晴れ・昼
            // インタプリタ(this)を渡して、即時実行可能にする
            applySpecialWeather("晴れ", location, "昼", this);
            return;
        }

        // 保存された天気がなければ何もしない
        if (!$gameSystem._weatherControlSavedWeather) {
            return;
        }

        const saved = $gameSystem._weatherControlSavedWeather;
        // 保存データのweatherは英語キーまたはnullまたは"なし"の可能性がある
        // applySpecialWeatherは英語キーも対応するように修正した
        // インタプリタ(this)を渡して、即時実行可能にする
        applySpecialWeather(saved.weather, location, saved.timeOfDay, this);
    });

    PluginManager.registerCommand(pluginName, 'SuspendWeatherUpdate', function (args) {
        const enabled = String(args.enabled) === 'true';
        $gameSystem._weatherControlSuspended = enabled;
    });

    // 暗さ上書きコマンド
    PluginManager.registerCommand(pluginName, 'OverrideMapDarkness', function (args) {
        const darkness = Number(args.darkness || 0);
        const color = String(args.color || 'black').trim();

        $gameSystem._weatherControlDarknessOverride = {
            darkness: darkness,
            color: color
        };

        // 即時反映
        if ($gameMap && typeof $gameMap.setDarkness === 'function') {
            $gameMap.setDarkness(darkness);
            if (typeof $gameMap.setDarknessColor === 'function') {
                $gameMap.setDarknessColor(color);
            }
        }
    });

    // 暗さ上書き解除コマンド
    PluginManager.registerCommand(pluginName, 'ResetMapDarknessOverride', function (args) {
        $gameSystem._weatherControlDarknessOverride = null;

        // 即時反映（現在の時間・天候設定に戻す）
        const date = $gameVariables.value(DateVariableId);
        const time = $gameVariables.value(TimeVariableId);
        applyMapDarkness(time);
    });

})();
