/*:
 * @target MZ
 * @plugindesc マップ上で時間を経過させる待機機能を追加します。
 *
 * @command startTimeWait
 * @text 時間待機開始
 * @desc 時間待機シーンを開きます。
 *
 * @command skipToNextMorning
 * @text 次の日の朝にする
 * @desc UIを開かずに直接次の日の朝まで時間を進めます。
 *
 * @param TimeVariableId
 * @text 時間管理変数ID
 * @type variable
 * @desc 時間（0:朝, 1:昼, 2:夜, 3:真夜中）を管理している変数のID
 * @default 13
 *
 * @param DayVariableId
 * @text 日付管理変数ID
 * @type variable
 * @desc 日付を管理している変数のID（「次の日まで」選択時に+1され、4になったら0にリセット）
 * @default 0
 *
 * @param ForbiddenSwitches
 * @text 禁止スイッチ設定
 * @type struct<ForbiddenSwitch>[]
 * @desc 待機を禁止するスイッチの設定（複数登録可能）
 *
 * @param ForbiddenMaps
 * @text 禁止マップ設定
 * @type struct<ForbiddenMap>[]
 * @desc 待機できないマップの設定
 *
 * @param ForbiddenRegions
 * @text 禁止リージョン設定
 * @type struct<ForbiddenRegion>[]
 * @desc 待機できないリージョンの設定
 *
 * @param DecideSe
 * @text 決定時SE
 * @type struct<Se>
 * @desc 時間を決定した時に再生するSE
 *
 * @param CancelSe
 * @text キャンセル時SE
 * @type struct<Se>
 * @desc キャンセルした時に再生するSE
 *
 * @param ForbiddenNotifySe
 * @text 禁止通知時SE
 * @type struct<Se>
 * @desc 禁止マップ・禁止リージョンで通知を表示する時に再生するSE
 *
 * @help
 * ■ 概要
 * プラグインコマンド「時間待機開始」を実行すると
 * 時間を経過させるための専用シーンが開きます。
 *
 * ■ 使い方
 * 1. プラグインパラメータで時間管理変数IDを設定
 * 2. 必要に応じて禁止マップ・禁止リージョンを設定
 * 3. イベントでプラグインコマンド「時間待機開始」を実行
 *
 * ■ 時間の設定
 * 時間管理変数の値：
 * 0 = 朝
 * 1 = 昼
 * 2 = 夜
 * 3 = 真夜中
 */

/*~struct~ForbiddenSwitch:
 * @param SwitchId
 * @text スイッチID
 * @type switch
 * @desc 待機を禁止するスイッチID
 * @default 0
 *
 * @param Message
 * @text 禁止メッセージ
 * @type text
 * @desc このスイッチがONの時に表示するメッセージ（空欄の場合は何も表示しない）
 * @default 
 */

/*~struct~ForbiddenMap:
 * @param MapId
 * @text マップID
 * @type number
 * @desc 待機を禁止するマップID
 * @default 0
 *
 * @param Message
 * @text 禁止メッセージ
 * @type text
 * @desc このマップで待機しようとした時に表示するメッセージ
 * @default ここでは待機できません
 *
 * @param ConditionVariable
 * @text 条件変数ID
 * @type variable
 * @desc この変数の値で禁止を有効化する（0=条件なし、常に有効）
 * @default 0
 *
 * @param ConditionVariableValue
 * @text 条件変数の値
 * @type number
 * @desc 比較する値
 * @default 0
 *
 * @param ConditionVariableType
 * @text 条件変数の比較方法
 * @type select
 * @option 以上
 * @value gte
 * @option 以下
 * @value lte
 * @option 等しい
 * @value eq
 * @desc 変数の値をどのように比較するか
 * @default gte
 *
 * @param ConditionSwitch
 * @text 条件スイッチID
 * @type switch
 * @desc このスイッチの状態で禁止を有効化する（0=条件なし）
 * @default 0
 *
 * @param ConditionSwitchState
 * @text 条件スイッチの状態
 * @type select
 * @option ONのとき有効
 * @value on
 * @option OFFのとき有効
 * @value off
 * @desc スイッチがどの状態のとき禁止を有効にするか
 * @default on
 */

/*~struct~ForbiddenRegion:
 * @param RegionId
 * @text リージョンID
 * @type number
 * @desc 待機を禁止するリージョンID
 * @default 0
 *
 * @param Message
 * @text 禁止メッセージ
 * @type text
 * @desc このリージョンで待機しようとした時に表示するメッセージ
 * @default ここでは待機できません
 *
 * @param ConditionVariable
 * @text 条件変数ID
 * @type variable
 * @desc この変数の値で禁止を有効化する（0=条件なし、常に有効）
 * @default 0
 *
 * @param ConditionVariableValue
 * @text 条件変数の値
 * @type number
 * @desc 比較する値
 * @default 0
 *
 * @param ConditionVariableType
 * @text 条件変数の比較方法
 * @type select
 * @option 以上
 * @value gte
 * @option 以下
 * @value lte
 * @option 等しい
 * @value eq
 * @desc 変数の値をどのように比較するか
 * @default gte
 *
 * @param ConditionSwitch
 * @text 条件スイッチID
 * @type switch
 * @desc このスイッチの状態で禁止を有効化する（0=条件なし）
 * @default 0
 *
 * @param ConditionSwitchState
 * @text 条件スイッチの状態
 * @type select
 * @option ONのとき有効
 * @value on
 * @option OFFのとき有効
 * @value off
 * @desc スイッチがどの状態のとき禁止を有効にするか
 * @default on
 */

/*~struct~Se:
 * @param name
 * @text ファイル名
 * @type file
 * @dir audio/se
 * @desc SEファイル名（拡張子なし）
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(() => {
    'use strict';

    const pluginName = "TimeWaitSystem";
    const params = PluginManager.parameters(pluginName);

    // パラメータ解析関数
    function paramNumber(name, defaultValue) {
        const value = Number(params[name]);
        return Number.isNaN(value) ? defaultValue : value;
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

    // 設定オブジェクト
    const CONFIG = {
        timeVariableId: paramNumber("TimeVariableId", 13),
        dayVariableId: paramNumber("DayVariableId", 0),
        forbiddenSwitches: parseStructArray(params.ForbiddenSwitches).map(item => ({
            switchId: Number(item.SwitchId || 0),
            message: String(item.Message || "")
        })).filter(item => item.switchId > 0),
        forbiddenMaps: parseStructArray(params.ForbiddenMaps).map(item => ({
            mapId: Number(item.MapId || 0),
            message: String(item.Message || "ここでは待機できません"),
            conditionVariable: Number(item.ConditionVariable || 0),
            conditionVariableValue: Number(item.ConditionVariableValue || 0),
            conditionVariableType: String(item.ConditionVariableType || "gte"),
            conditionSwitch: Number(item.ConditionSwitch || 0),
            conditionSwitchState: String(item.ConditionSwitchState || "on")
        })),
        forbiddenRegions: parseStructArray(params.ForbiddenRegions).map(item => ({
            regionId: Number(item.RegionId || 0),
            message: String(item.Message || "ここでは待機できません"),
            conditionVariable: Number(item.ConditionVariable || 0),
            conditionVariableValue: Number(item.ConditionVariableValue || 0),
            conditionVariableType: String(item.ConditionVariableType || "gte"),
            conditionSwitch: Number(item.ConditionSwitch || 0),
            conditionSwitchState: String(item.ConditionSwitchState || "on")
        })),
        decideSe: parseSeParam(params.DecideSe),
        cancelSe: parseSeParam(params.CancelSe),
        forbiddenNotifySe: parseSeParam(params.ForbiddenNotifySe)
    };

    // 時間名の定義
    const TIME_NAMES = {
        0: "Morning",
        1: "Afternoon",
        2: "Evening",
        3: "Night"
    };

    // 禁止通知のクールタイム（フレーム数）
    let _waitBanNoticeCoolTime = 0;

    // 通知メッセージのキュー（フェードイン完了待ち用）
    const _pendingNotifyMessages = [];

    // 画面がフェード中かどうかを判定（フェードイン中 or フェードアウト中）
    function isScreenFading() {
        // $gameScreen.brightness() が 255 未満の場合はフェード中と判定
        // また、SceneManagerでフェード処理中かどうかもチェック
        if ($gameScreen && $gameScreen.brightness() < 255) {
            return true;
        }
        // Scene_Mapのフェード処理中かチェック
        const scene = SceneManager._scene;
        if (scene && typeof scene.isFading === 'function' && scene.isFading()) {
            return true;
        }
        return false;
    }

    // 実際に通知メッセージを表示する内部関数
    function _displayNotifyMessage(message) {
        // TorigoyaMZ_NotifyMessageプラグインが利用可能かチェック
        if (window.Torigoya && window.Torigoya.NotifyMessage && window.Torigoya.NotifyMessage.Manager) {
            const NotifyItem = window.Torigoya.NotifyMessage.NotifyItem;
            // プラグイン設定のSEを使用するため、<noSound>を追加してデフォルトSEを無効化
            const note = CONFIG.forbiddenNotifySe && CONFIG.forbiddenNotifySe.name ? "<noSound>" : "";
            const item = new NotifyItem({ message: message, icon: 0, note: note });
            window.Torigoya.NotifyMessage.Manager.notify(item);

            // プラグイン設定のSEを再生
            if (CONFIG.forbiddenNotifySe && CONFIG.forbiddenNotifySe.name) {
                playConfiguredSe(CONFIG.forbiddenNotifySe);
            }
        } else {
            // プラグインが利用できない場合は標準メッセージウィンドウを使用
            $gameMessage.add(message);
        }
    }

    // 通知メッセージを表示する関数（フェードイン完了後に表示）
    function showNotifyMessage(message) {
        // クールタイム中は表示しない
        if (_waitBanNoticeCoolTime > 0) {
            return;
        }

        // クールタイムを設定（約2秒）
        _waitBanNoticeCoolTime = 120;

        // フェード中の場合はキューに追加して後で表示
        if (isScreenFading()) {
            _pendingNotifyMessages.push(message);
        } else {
            // フェード中でなければ即座に表示
            _displayNotifyMessage(message);
        }
    }

    // キューに溜まった通知メッセージを処理する関数
    function processPendingNotifyMessages() {
        // フェード中でなければキューのメッセージを表示
        if (!isScreenFading() && _pendingNotifyMessages.length > 0) {
            while (_pendingNotifyMessages.length > 0) {
                const message = _pendingNotifyMessages.shift();
                _displayNotifyMessage(message);
            }
        }
    }

    // マップ侵入位置を記録する処理
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        // マップ侵入位置を記録（マップが変わった時のみ）
        if (!$gamePlayer._entryMapId || $gamePlayer._entryMapId !== $gameMap.mapId()) {
            $gamePlayer._entryMapId = $gameMap.mapId();
            $gamePlayer._entryMapX = $gamePlayer.x;
            $gamePlayer._entryMapY = $gamePlayer.y;
        }
    };

    // プレイヤーの位置をチェックして調整する処理
    function checkAndAdjustPlayerPosition() {
        // 少し遅延させて、マップのイベントが完全に読み込まれた後にチェック
        if ($gameTemp._timeWaitPositionCheckDelay > 0) {
            $gameTemp._timeWaitPositionCheckDelay--;
            return;
        }

        if (!$gameTemp._timeWaitNeedsPositionCheck) {
            return;
        }

        $gameTemp._timeWaitNeedsPositionCheck = false;
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;

        // プレイヤーの位置にイベントが存在するかチェック
        if (hasEventAtPosition(playerX, playerY)) {
            // 侵入位置が記録されている場合はそこに移動
            if ($gamePlayer._entryMapId === $gameMap.mapId() &&
                $gamePlayer._entryMapX !== undefined &&
                $gamePlayer._entryMapY !== undefined) {
                // 侵入位置にイベントがないか確認
                if (!hasEventAtPosition($gamePlayer._entryMapX, $gamePlayer._entryMapY)) {
                    $gamePlayer.locate($gamePlayer._entryMapX, $gamePlayer._entryMapY);
                    return;
                }
            }

            // 侵入位置にもイベントがある場合、周囲を探索して空いている場所を探す
            const directions = [
                [0, -1],  // 上
                [1, 0],   // 右
                [0, 1],   // 下
                [-1, 0]   // 左
            ];

            for (const [dx, dy] of directions) {
                const newX = playerX + dx;
                const newY = playerY + dy;
                if ($gameMap.isValid(newX, newY) &&
                    $gameMap.isPassable(newX, newY, 0) &&
                    !hasEventAtPosition(newX, newY)) {
                    $gamePlayer.locate(newX, newY);
                    return;
                }
            }
        }
    }

    // Scene_Mapのupdateで位置チェックと通知メッセージ処理を実行
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        // クールタイムの更新
        if (_waitBanNoticeCoolTime > 0) {
            _waitBanNoticeCoolTime--;
        }

        checkAndAdjustPlayerPosition();
        // フェード完了後にキューの通知メッセージを処理
        processPendingNotifyMessages();
    };

    // プレイヤーの位置にイベントが存在するかチェック
    function hasEventAtPosition(x, y) {
        const events = $gameMap.events();
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (event && event.x === x && event.y === y) {
                // イベントのプライオリティをチェック
                const eventPage = event.page();
                if (eventPage) {
                    const priorityType = eventPage.priorityType;
                    // プライオリティがプレイヤーと同じ(1)またはプレイヤーより上(2)の場合
                    if (priorityType === 1 || priorityType === 2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 禁止設定の条件をチェックする関数
    // 条件が設定されていない場合（旧バージョンの設定）は常に有効（後方互換性）
    function isForbiddenConditionMet(setting) {
        // 変数条件のチェック
        if (setting.conditionVariable && setting.conditionVariable > 0) {
            const currentValue = $gameVariables.value(setting.conditionVariable);
            const targetValue = setting.conditionVariableValue || 0;
            const conditionType = setting.conditionVariableType || "gte";

            let variableConditionMet = false;
            switch (conditionType) {
                case "gte": // 以上
                    variableConditionMet = currentValue >= targetValue;
                    break;
                case "lte": // 以下
                    variableConditionMet = currentValue <= targetValue;
                    break;
                case "eq": // 等しい
                    variableConditionMet = currentValue === targetValue;
                    break;
                default:
                    variableConditionMet = currentValue >= targetValue;
            }

            // 変数条件が満たされていない場合は無効
            if (!variableConditionMet) {
                return false;
            }
        }

        // スイッチ条件のチェック
        if (setting.conditionSwitch && setting.conditionSwitch > 0) {
            const switchValue = $gameSwitches.value(setting.conditionSwitch);
            const requiredState = setting.conditionSwitchState || "on";

            let switchConditionMet = false;
            if (requiredState === "on") {
                switchConditionMet = switchValue === true;
            } else if (requiredState === "off") {
                switchConditionMet = switchValue === false;
            }

            // スイッチ条件が満たされていない場合は無効
            if (!switchConditionMet) {
                return false;
            }
        }

        // 条件が設定されていない、または全ての条件を満たした場合は有効
        return true;
    }

    // プラグインコマンド登録
    PluginManager.registerCommand(pluginName, "startTimeWait", args => {
        // 1. 禁止スイッチチェック
        for (const forbiddenSwitch of CONFIG.forbiddenSwitches) {
            if ($gameSwitches.value(forbiddenSwitch.switchId)) {
                // 禁止スイッチがONの場合
                if (forbiddenSwitch.message) {
                    showNotifyMessage(forbiddenSwitch.message);
                }
                return;
            }
        }

        // 2. 禁止マップチェック（条件付き）
        const currentMapId = $gameMap.mapId();
        const forbiddenMap = CONFIG.forbiddenMaps.find(fm =>
            fm.mapId === currentMapId && isForbiddenConditionMet(fm)
        );
        if (forbiddenMap) {
            showNotifyMessage(forbiddenMap.message);
            return;
        }

        // 3. 禁止リージョンチェック（条件付き）
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const currentRegionId = $gameMap.regionId(playerX, playerY);
        const forbiddenRegion = CONFIG.forbiddenRegions.find(fr =>
            fr.regionId === currentRegionId && isForbiddenConditionMet(fr)
        );
        if (forbiddenRegion) {
            showNotifyMessage(forbiddenRegion.message);
            return;
        }

        // 4. 全てクリアならシーン遷移
        SceneManager.snapForBackground();
        SceneManager.push(Scene_TimeWait);
    });

    // プラグインコマンド「次の日の朝にする」
    PluginManager.registerCommand(pluginName, "skipToNextMorning", args => {
        // 1. 禁止スイッチチェック
        for (const forbiddenSwitch of CONFIG.forbiddenSwitches) {
            if ($gameSwitches.value(forbiddenSwitch.switchId)) {
                if (forbiddenSwitch.message) {
                    showNotifyMessage(forbiddenSwitch.message);
                }
                return;
            }
        }

        // 2. 禁止マップチェック（条件付き）
        const currentMapId = $gameMap.mapId();
        const forbiddenMap = CONFIG.forbiddenMaps.find(fm =>
            fm.mapId === currentMapId && isForbiddenConditionMet(fm)
        );
        if (forbiddenMap) {
            showNotifyMessage(forbiddenMap.message);
            return;
        }

        // 3. 禁止リージョンチェック（条件付き）
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const currentRegionId = $gameMap.regionId(playerX, playerY);
        const forbiddenRegion = CONFIG.forbiddenRegions.find(fr =>
            fr.regionId === currentRegionId && isForbiddenConditionMet(fr)
        );
        if (forbiddenRegion) {
            showNotifyMessage(forbiddenRegion.message);
            return;
        }

        // 4. 次の日の朝へ進める処理
        playConfiguredSe(CONFIG.decideSe);

        // VariableAutoUpdaterプラグインの関数を使用して時間を進める
        if (window.VariableAutoUpdater && window.VariableAutoUpdater.advanceTimeToTarget) {
            let targetDate = $gameVariables.value(CONFIG.dayVariableId) || 0;
            targetDate = (targetDate + 1) % 4;
            const targetTime = 0; // 朝
            window.VariableAutoUpdater.advanceTimeToTarget(targetDate, targetTime);
        } else {
            // VariableAutoUpdaterプラグインがない場合は従来の処理
            console.warn('[TimeWaitSystem] VariableAutoUpdaterプラグインが見つかりません。従来の処理を使用します。');

            // 時間変数を更新（朝=0）
            if (CONFIG.timeVariableId > 0) {
                $gameVariables.setValue(CONFIG.timeVariableId, 0);
            }

            // 日付変数を更新（+1して4になったら0にリセット）
            if (CONFIG.dayVariableId > 0) {
                let dayValue = $gameVariables.value(CONFIG.dayVariableId);
                dayValue = (dayValue + 1) % 4;
                $gameVariables.setValue(CONFIG.dayVariableId, dayValue);
            }
        }

        // マップをリロード
        const mapId = $gameMap.mapId();
        const direction = $gamePlayer.direction();
        $gamePlayer.reserveTransfer(mapId, playerX, playerY, direction, 0);

        // リロード後に位置を調整するフラグを設定
        $gameTemp._timeWaitNeedsPositionCheck = true;
        $gameTemp._timeWaitPositionCheckDelay = 2;
    });

    // ======================================================================
    // Scene_TimeWait
    // ======================================================================
    class Scene_TimeWait extends Scene_Base {
        create() {
            super.create();
            this._backgroundSprite = null;
            this._darkOverlay = null;
            this._messageWindow = null;
            this._commandWindow = null;
            this._selectedTime = null;
            this._isProcessing = false;
            this._fadeOutComplete = false;
            this.createWindowLayer();
            this.createBackground();
            this.createMessageWindow();
            this.createCommandWindow();
        }

        start() {
            super.start();
            this._commandWindow.activate();
        }

        createBackground() {
            // 背景スプライトを作成（SceneManager.snapForBackground()で取得したスナップショットを使用）
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            if (!this._backgroundSprite.bitmap) {
                // スナップショットが取得できていない場合は黒背景
                this._backgroundSprite.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
                this._backgroundSprite.bitmap.fillAll("#000000");
            }
            this.addChildAt(this._backgroundSprite, 0);

            // ブラーフィルターを適用
            if (this._backgroundSprite.bitmap) {
                const blurFilter = new PIXI.filters.BlurFilter();
                blurFilter.blur = 6;
                blurFilter.resolution = 2;
                this._backgroundSprite.filters = [blurFilter];
            }

            // 暗転オーバーレイ
            this._darkOverlay = new ScreenSprite();
            this._darkOverlay.setColor(0, 0, 0);
            this._darkOverlay.opacity = 120;
            this.addChildAt(this._darkOverlay, 1);
        }

        createMessageWindow() {
            const rect = this.messageWindowRect();
            // ウィンドウの背後に暗くするスプライトを作成（グラデーション付き）
            this._messageDarkness = new Sprite();
            this._messageDarkness.bitmap = this.createGradientBitmap(rect.width, rect.height);
            this._messageDarkness.x = rect.x;
            this._messageDarkness.y = rect.y;
            // ウィンドウレイヤーの前に配置
            const windowLayerIndex = this.children.indexOf(this._windowLayer);
            if (windowLayerIndex >= 0) {
                this.addChildAt(this._messageDarkness, windowLayerIndex);
            } else {
                this.addChild(this._messageDarkness);
            }

            this._messageWindow = new Window_TimeWaitMessage(rect);
            this.addWindow(this._messageWindow);
            this._messageWindow.open();
        }

        messageWindowRect() {
            const ww = Graphics.boxWidth - 200;
            const wh = 120;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2 - 100;
            return new Rectangle(wx, wy, ww, wh);
        }

        createCommandWindow() {
            const rect = this.commandWindowRect();
            // ウィンドウの背後に暗くするスプライトを作成（グラデーション付き）
            this._commandDarkness = new Sprite();
            this._commandDarkness.bitmap = this.createGradientBitmap(rect.width, rect.height);
            this._commandDarkness.x = rect.x;
            this._commandDarkness.y = rect.y;
            // ウィンドウレイヤーの前に配置
            const windowLayerIndex = this.children.indexOf(this._windowLayer);
            if (windowLayerIndex >= 0) {
                this.addChildAt(this._commandDarkness, windowLayerIndex);
            } else {
                this.addChild(this._commandDarkness);
            }

            this._commandWindow = new Window_TimeWaitCommand(rect);
            this._commandWindow.setHandler("ok", this.onTimeSelected.bind(this));
            this._commandWindow.setHandler("cancel", this.onCancel.bind(this));
            this.addWindow(this._commandWindow);
            this._commandWindow.open();
        }

        commandWindowRect() {
            const ww = 300;
            const maxItems = 5; // 最大選択肢数（時間4つ + キャンセル）
            const wh = this.calcWindowHeight(maxItems, true);
            const wx = Graphics.boxWidth - ww - 20;
            const wy = Graphics.boxHeight - wh - 20;
            return new Rectangle(wx, wy, ww, wh);
        }

        update() {
            super.update();
            // ウィンドウの開閉に合わせて暗くするスプライトも連動
            if (this._messageDarkness && this._messageWindow) {
                this._messageDarkness.visible = this._messageWindow.visible && this._messageWindow.isOpen();
            }
            if (this._commandDarkness && this._commandWindow) {
                this._commandDarkness.visible = this._commandWindow.visible && this._commandWindow.isOpen();
            }
            if (this._isProcessing) {
                this.updateProcessing();
            }
        }

        onTimeSelected() {
            if (this._isProcessing) return;
            const index = this._commandWindow.index();
            const symbol = this._commandWindow.commandSymbol(index);
            if (symbol === "cancel") {
                this.onCancel();
                return;
            }
            const data = this._commandWindow._list[index];
            if (!data || data.ext == null) {
                this.onCancel();
                return;
            }
            this._selectedTime = data.ext;
            this.startTimeChange();
        }

        onCancel() {
            if (this._isProcessing) return;
            playConfiguredSe(CONFIG.cancelSe);
            this.popScene();
        }

        startTimeChange() {
            this._isProcessing = true;
            this._commandWindow.deactivate();
            this._commandWindow.close();
            this._messageWindow.close();
            // 暗くするスプライトも非表示にする
            if (this._messageDarkness) {
                this._messageDarkness.visible = false;
            }
            if (this._commandDarkness) {
                this._commandDarkness.visible = false;
            }
            this.startFadeOut(this.fadeSpeed(), false);
        }

        updateProcessing() {
            if (!this._isProcessing) return;

            // フェードアウトが完了したら処理を実行
            if (!this.isFading() && !this._fadeOutComplete) {
                this._fadeOutComplete = true;
                this.performTimeChange();
            }
        }

        performTimeChange() {
            // SE再生
            playConfiguredSe(CONFIG.decideSe);

            // VariableAutoUpdaterプラグインの関数を使用して時間を進める
            // これにより、間のキーがすべて正しく処理される
            if (window.VariableAutoUpdater && window.VariableAutoUpdater.advanceTimeToTarget) {
                let targetDate = $gameVariables.value(CONFIG.dayVariableId) || 0;
                let targetTime = this._selectedTime;
                const currentTime = $gameVariables.value(CONFIG.timeVariableId) || 0;

                // 「次の日まで」の判定：
                // selectedTime === 0 の場合、それが「今日の朝に戻る」か「次の日の朝に進む」かを判断
                // - 現在時刻が朝（0）以外 → 今日の未来に朝は存在しないので「次の日の朝」
                // - 現在時刻が朝（0） → 「今日の朝」は選択肢に出ないため、selectedTime=0は「次の日の朝」
                if (this._selectedTime === 0) {
                    // 「次の日まで」を選択した場合は常に日付を+1する
                    targetDate = (targetDate + 1) % 4;
                }

                // VariableAutoUpdaterを使って目標時刻まで進める
                window.VariableAutoUpdater.advanceTimeToTarget(targetDate, targetTime);
            } else {
                // VariableAutoUpdaterプラグインがない場合は従来の処理
                console.warn('[TimeWaitSystem] VariableAutoUpdaterプラグインが見つかりません。従来の処理を使用します。');

                // 時間変数を更新
                if (CONFIG.timeVariableId > 0) {
                    $gameVariables.setValue(CONFIG.timeVariableId, this._selectedTime);
                }

                // 「次の日まで」を選択した場合（selectedTime === 0）、DAY変数を更新
                if (this._selectedTime === 0 && CONFIG.dayVariableId > 0) {
                    let dayValue = $gameVariables.value(CONFIG.dayVariableId);
                    dayValue = dayValue + 1;
                    // DAYが4になったら0にリセット
                    if (dayValue >= 4) {
                        dayValue = 0;
                    }
                    $gameVariables.setValue(CONFIG.dayVariableId, dayValue);
                }
            }

            // マップをリロード（同じマップに移動することでリロード）
            const mapId = $gameMap.mapId();
            let playerX = $gamePlayer.x;
            let playerY = $gamePlayer.y;
            const direction = $gamePlayer.direction();

            // プレイヤーの位置にイベントが存在するかチェック
            // 注意: この時点ではまだマップがリロードされていないため、
            // リロード後のイベント配置を予測することは難しい
            // そのため、リロード後にチェックする処理を追加する

            // マップをリロード（同じ位置に移動）
            $gamePlayer.reserveTransfer(mapId, playerX, playerY, direction, 0);

            // リロード後に位置を調整するフラグを設定
            // 少し遅延させて、マップのイベントが完全に読み込まれた後にチェック
            $gameTemp._timeWaitNeedsPositionCheck = true;
            $gameTemp._timeWaitPositionCheckDelay = 2; // 2フレーム待つ

            // シーンを閉じてマップに戻る
            this.popScene();
        }


        createGradientBitmap(width, height) {
            // グラデーション設定
            const DIMMER_ALPHA = 0.65; // 中央部の最大濃さ（0.65 = 65%の濃さ）
            const CORE_WIDTH = Math.min(width * 0.8, 920); // 中央帯の幅（ウィンドウ幅の80%または920pxの小さい方）
            const FALL_OFF_WIDTH = Math.min(width * 0.15, 150); // グラデーション幅（ウィンドウ幅の15%または150pxの小さい方）

            const bitmap = new Bitmap(width, height);
            const centerColor = `rgba(0, 0, 0, ${DIMMER_ALPHA})`;
            const transparent = "rgba(0, 0, 0, 0)";
            const centerX = Math.floor(width / 2);

            // 1) 中央の「濃い」帯：ほぼ一様に濃い
            const coreLeft = Math.max(0, centerX - Math.floor(CORE_WIDTH / 2));
            const coreRight = Math.min(width, centerX + Math.floor(CORE_WIDTH / 2));
            bitmap.fillRect(coreLeft, 0, coreRight - coreLeft, height, centerColor);

            // 2) 左側の急なグラデーション：coreLeft から左端方向へ一気に透明へ
            const leftGradWidth = Math.min(coreLeft, FALL_OFF_WIDTH);
            if (leftGradWidth > 0) {
                bitmap.gradientFillRect(coreLeft - leftGradWidth, 0, leftGradWidth, height, transparent, centerColor, false);
            }

            // 3) 右側の急なグラデーション：coreRight から右端方向へ一気に透明へ
            const rightGradWidth = Math.min(width - coreRight, FALL_OFF_WIDTH);
            if (rightGradWidth > 0) {
                bitmap.gradientFillRect(coreRight, 0, rightGradWidth, height, centerColor, transparent, false);
            }

            return bitmap;
        }

        calcWindowHeight(numLines, includePadding) {
            const lineHeight = this.lineHeight();
            const padding = includePadding ? this.windowPadding() * 2 : 0;
            return numLines * lineHeight + padding;
        }

        lineHeight() {
            return 36;
        }

        windowPadding() {
            return 18;
        }
    }

    // ======================================================================
    // Window_TimeWaitMessage
    // ======================================================================
    class Window_TimeWaitMessage extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            // 背景とフレームを透明にする
            this.backOpacity = 0;
            this.frameOpacity = 0;
            this.refresh();
        }

        _refreshFrame() {
            // フレームを描画しない（親メソッドを呼ばない）
            // 何もしない
        }

        _updateFrame() {
            // フレームの更新を無効化
            if (this._frameSprite) {
                this._frameSprite.visible = false;
            }
        }

        update() {
            super.update();
            // フレームを常に非表示に保つ
            if (this._frameSprite) {
                this._frameSprite.visible = false;
            }
            // フレームの不透明度も0に保つ
            this.frameOpacity = 0;
        }

        refresh() {
            this.contents.clear();
            const text1 = "I'll just space out here for a bit...";
            const text2 = "How long should I wait?";
            const width = this.contentsWidth();
            const lineHeight = this.lineHeight();
            this.drawText(text1, 0, 0, width, "center");
            this.drawText(text2, 0, lineHeight, width, "center");
        }
    }

    // ======================================================================
    // Window_TimeWaitCommand
    // ======================================================================
    class Window_TimeWaitCommand extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
            // 背景とフレームを透明にする
            this.backOpacity = 0;
            this.frameOpacity = 0;
        }

        _refreshFrame() {
            // フレームを描画しない（親メソッドを呼ばない）
            // 何もしない
        }

        _updateFrame() {
            // フレームの更新を無効化
            if (this._frameSprite) {
                this._frameSprite.visible = false;
            }
        }

        update() {
            super.update();
            // フレームを常に非表示に保つ
            if (this._frameSprite) {
                this._frameSprite.visible = false;
            }
            // フレームの不透明度も0に保つ
            this.frameOpacity = 0;
        }

        makeCommandList() {
            const currentTime = this.getCurrentTime();
            const commands = [];

            // 現在の時間より未来の時間を選択肢に追加
            for (let time = currentTime + 1; time <= 3; time++) {
                const timeName = TIME_NAMES[time] || `時間${time}`;
                commands.push({
                    name: `Wait until ${timeName}`,
                    symbol: "time",
                    enabled: true,
                    ext: time
                });
            }

            // 「次の日まで」を追加（時間0に戻る）
            // 常に追加（現在が真夜中(3)の場合は「次の日まで」のみが表示される）
            commands.push({
                name: "Until the next day",
                symbol: "time",
                enabled: true,
                ext: 0
            });

            // キャンセル選択肢を追加
            commands.push({
                name: "Actually, never mind",
                symbol: "cancel",
                enabled: true,
                ext: null
            });

            // コマンドリストに追加
            for (const cmd of commands) {
                this.addCommand(cmd.name, cmd.symbol, cmd.enabled, cmd.ext);
            }
        }

        getCurrentTime() {
            if (CONFIG.timeVariableId <= 0) return 0;
            const time = $gameVariables.value(CONFIG.timeVariableId);
            // 0-3の範囲に制限
            return Math.max(0, Math.min(3, Math.floor(time)));
        }

        drawItemBackground(index) {
            // 選択肢の行ごとの背景を描画しない
            // 何もしない
        }

        drawItem(index) {
            const rect = this.itemRect(index);
            const command = this.commandName(index);
            const enabled = this.isCommandEnabled(index);
            this.changePaintOpacity(enabled);
            this.drawText(command, rect.x, rect.y, rect.width, "left");
        }
    }

})();

