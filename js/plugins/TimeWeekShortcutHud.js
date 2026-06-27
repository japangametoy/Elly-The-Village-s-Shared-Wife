/*:
 * @target MZ
 * @plugindesc 時間帯・曜日HUDとSKIP/MAPショートカットボタンを提供します
 *
 * @help TimeWeekShortcutHud.js
 *
 * マップ左上に「時間帯」「曜日」を表すHUDとSKIP/MAPボタンを常駐表示します。
 * ボタン操作は PictureButtonHelper.js を利用し、ホバー演出やSEを統一管理します。
 *
 * 【主な機能】
 * - 指定スイッチON時のみ有効。複数の非表示スイッチを指定可能（最大5つ）。
 * - Time/Day 変数値に応じて画像を切替。ベース画像に乗算レイヤーを重ねて表現。
 * - メッセージ表示中はHUDをフェードアウトして自動的に非操作化。
 * - SKIP(Q)とMAP(E)ボタンで任意のコモンイベントを呼び出す。
 * - ボタン背後に背景画像を配置可能。
 *
 * 【注意点】
 * - 13枚のピクチャID（基点～基点+12）を使用します。競合しないIDを指定してください。
 * - 画像は img/pictures に配置し、プラグインパラメータから選択してください。
 * - PictureButtonHelper.js をこのプラグインより上で有効化してください。
 *
 * @param EnableSwitchId
 * @text 有効化スイッチ
 * @desc ONの間のみHUDを表示します。0なら常に表示。
 * @type switch
 * @default 0
 *
 * @param DisableSwitchId1
 * @text 非表示スイッチ1
 * @desc ONの間はHUDを強制的に非表示にします。0なら無効。
 * @type switch
 * @default 0
 *
 * @param DisableSwitchId2
 * @text 非表示スイッチ2
 * @desc ONの間はHUDを強制的に非表示にします。0なら無効。
 * @type switch
 * @default 0
 *
 * @param DisableSwitchId3
 * @text 非表示スイッチ3
 * @desc ONの間はHUDを強制的に非表示にします。0なら無効。
 * @type switch
 * @default 0
 *
 * @param DisableSwitchId4
 * @text 非表示スイッチ4
 * @desc ONの間はHUDを強制的に非表示にします。0なら無効。
 * @type switch
 * @default 0
 *
 * @param DisableSwitchId5
 * @text 非表示スイッチ5
 * @desc ONの間はHUDを強制的に非表示にします。0なら無効。
 * @type switch
 * @default 0
 *
 * @param TimeVariableId
 * @text 時間帯変数
 * @desc 0～3の値を想定した時間帯管理用変数。
 * @type variable
 * @default 0
 *
 * @param DayVariableId
 * @text 曜日変数
 * @desc 0～3の値を想定した曜日管理用変数。
 * @type variable
 * @default 0
 *
 * @param FadeSpeed
 * @text フェード速度
 * @type number
 * @min 1
 * @default 12
 *
 * @param BasePictureId
 * @text 使用ピクチャID基点
 * @desc 基点～基点+12を占有します。
 * @type number
 * @min 1
 * @default 300
 *
 * @param HoverSeName
 * @text ホバーSE
 * @type file
 * @dir audio/se
 * @default Cursor1
 *
 * @param HoverSeVolume
 * @text ホバーSE音量
 * @type number
 * @default 90
 *
 * @param HoverSePitch
 * @text ホバーSEピッチ
 * @type number
 * @default 100
 *
 * @param ClickSeName
 * @text 決定SE
 * @type file
 * @dir audio/se
 * @default Decision1
 *
 * @param ClickSeVolume
 * @text 決定SE音量
 * @type number
 * @default 90
 *
 * @param ClickSePitch
 * @text 決定SEピッチ
 * @type number
 * @default 100
 *
 * @param TimeBaseImage
 * @text 時間ベース画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TimeBaseX
 * @text 時間ベースX
 * @type number
 * @default 20
 *
 * @param TimeBaseY
 * @text 時間ベースY
 * @type number
 * @default 10
 *
 * @param TimeState0Image
 * @text Time0画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TimeState0X
 * @text Time0 X
 * @type number
 * @default 20
 *
 * @param TimeState0Y
 * @text Time0 Y
 * @type number
 * @default 10
 *
 * @param TimeState1Image
 * @text Time1画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TimeState1X
 * @text Time1 X
 * @type number
 * @default 20
 *
 * @param TimeState1Y
 * @text Time1 Y
 * @type number
 * @default 10
 *
 * @param TimeState2Image
 * @text Time2画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TimeState2X
 * @text Time2 X
 * @type number
 * @default 20
 *
 * @param TimeState2Y
 * @text Time2 Y
 * @type number
 * @default 10
 *
 * @param TimeState3Image
 * @text Time3画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TimeState3X
 * @text Time3 X
 * @type number
 * @default 20
 *
 * @param TimeState3Y
 * @text Time3 Y
 * @type number
 * @default 10
 *
 * @param DayBaseImage
 * @text 曜日ベース画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param DayBaseX
 * @text 曜日ベースX
 * @type number
 * @default 130
 *
 * @param DayBaseY
 * @text 曜日ベースY
 * @type number
 * @default 100
 *
 * @param DayState0Image
 * @text Day0画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param DayState0X
 * @text Day0 X
 * @type number
 * @default 184
 *
 * @param DayState0Y
 * @text Day0 Y
 * @type number
 * @default 104
 *
 * @param DayState1Image
 * @text Day1画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param DayState1X
 * @text Day1 X
 * @type number
 * @default 134
 *
 * @param DayState1Y
 * @text Day1 Y
 * @type number
 * @default 103
 *
 * @param DayState2Image
 * @text Day2画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param DayState2X
 * @text Day2 X
 * @type number
 * @default 134
 *
 * @param DayState2Y
 * @text Day2 Y
 * @type number
 * @default 103
 *
 * @param DayState3Image
 * @text Day3画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param DayState3X
 * @text Day3 X
 * @type number
 * @default 134
 *
 * @param DayState3Y
 * @text Day3 Y
 * @type number
 * @default 154
 *
 * @param ButtonBackgroundImage
 * @text ボタン背景画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param ButtonBackgroundX
 * @text ボタン背景X
 * @type number
 * @default 20
 *
 * @param ButtonBackgroundY
 * @text ボタン背景Y
 * @type number
 * @default 280
 *
 * @param ButtonBackgroundImage
 * @text ボタン背景画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param ButtonBackgroundX
 * @text ボタン背景X
 * @type number
 * @default 20
 *
 * @param ButtonBackgroundY
 * @text ボタン背景Y
 * @type number
 * @default 280
 *
 * @param ButtonBackgroundOpacity
 * @text ボタン背景透明度
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param SkipButtonImage
 * @text SKIPボタン画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param SkipButtonX
 * @text SKIPボタンX
 * @type number
 * @default 40
 *
 * @param SkipButtonY
 * @text SKIPボタンY
 * @type number
 * @default 312
 *
 * @param SkipCommonEventId
 * @text SKIPコモンイベント
 * @type common_event
 * @default 195
 *
 * @param MapButtonImage
 * @text MAPボタン画像
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param MapButtonX
 * @text MAPボタンX
 * @type number
 * @default 150
 *
 * @param MapButtonY
 * @text MAPボタンY
 * @type number
 * @default 312
 *
 * @param MapCommonEventId
 * @text MAPコモンイベント
 * @type common_event
 * @default 194
 *
 * @param SkipKeyName
 * @text SKIPキーバインド
 * @desc 例: pageup（Qキー）
 * @default pageup
 *
 * @param MapKeyName
 * @text MAPキーバインド
 * @desc 例: pagedown（Eキー）
 * @default pagedown
 *
 * @param SkipDisableSwitchId
 * @text SKIP禁止スイッチ
 * @desc ONの間はSKIPボタンが暗く表示され、ホバー効果・SE・押下反応が無効になります。コモンイベント呼び出しは通常通り行われます。0なら無効。
 * @type switch
 * @default 0
 *
 * @param MapDisableSwitchId
 * @text MAP禁止スイッチ
 * @desc ONの間はMAPボタンが暗く表示され、ホバー効果・SE・押下反応が無効になります。コモンイベント呼び出しは通常通り行われます。0なら無効。
 * @type switch
 * @default 0
 *
 * @param HideDelay
 * @text 非表示遅延(フレーム)
 * @desc イベント実行開始からHUDを非表示にするまでの待機フレーム数。短いイベントでのちらつきを防ぎます。
 * @type number
 * @min 0
 * @default 15
 */

(() => {
    'use strict';

    const currentScript = document.currentScript;
    const pluginName = currentScript
        ? decodeURIComponent(currentScript.src.split('/').pop().replace(/\.js$/, ''))
        : 'TimeWeekShortcutHud';
    const params = PluginManager.parameters(pluginName);

    const toNumber = (value, defaultValue = 0) => {
        if (value === undefined || value === null || value === '') return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    };

    const parseSwitchIds = (params) => {
        const switchIds = [];
        // 複数のスイッチパラメータ（DisableSwitchId1, DisableSwitchId2, ...）から取得
        for (let i = 1; i <= 5; i++) {
            const switchId = toNumber(params[`DisableSwitchId${i}`], 0);
            if (switchId > 0) {
                switchIds.push(switchId);
            }
        }
        // 後方互換性: 古いDisableSwitchIdsパラメータ（カンマ区切り）もサポート
        const oldParam = params.DisableSwitchIds || params.DisableSwitchId;
        if (oldParam && oldParam !== '0' && oldParam !== '') {
            const parsed = oldParam.split(',')
                .map(id => toNumber(id.trim(), 0))
                .filter(id => id > 0);
            parsed.forEach(id => {
                if (!switchIds.includes(id)) {
                    switchIds.push(id);
                }
            });
        }
        return switchIds;
    };

    const buildLayerSettings = (prefix, defaults, blendMode = 0) => ({
        image: params[`${prefix}Image`] || '',
        x: toNumber(params[`${prefix}X`], defaults.x),
        y: toNumber(params[`${prefix}Y`], defaults.y),
        blendMode
    });

    const settings = {
        enableSwitchId: toNumber(params.EnableSwitchId, 0),
        disableSwitchIds: parseSwitchIds(params),
        timeVariableId: toNumber(params.TimeVariableId, 0),
        dayVariableId: toNumber(params.DayVariableId, 0),
        fadeSpeed: Math.max(1, toNumber(params.FadeSpeed, 12)),
        hideDelay: Math.max(0, toNumber(params.HideDelay, 15)),
        basePictureId: toNumber(params.BasePictureId, 300),
        se: {
            hover: {
                name: params.HoverSeName || '',
                volume: toNumber(params.HoverSeVolume, 90),
                pitch: toNumber(params.HoverSePitch, 100),
                pan: 0
            },
            click: {
                name: params.ClickSeName || '',
                volume: toNumber(params.ClickSeVolume, 90),
                pitch: toNumber(params.ClickSePitch, 100),
                pan: 0
            }
        },
        timeBase: buildLayerSettings('TimeBase', { x: 20, y: 10 }),
        timeLayers: [
            buildLayerSettings('TimeState0', { x: 20, y: 10 }, 2),
            buildLayerSettings('TimeState1', { x: 20, y: 10 }, 2),
            buildLayerSettings('TimeState2', { x: 20, y: 10 }, 2),
            buildLayerSettings('TimeState3', { x: 20, y: 10 }, 2)
        ],
        dayBase: buildLayerSettings('DayBase', { x: 130, y: 100 }),
        dayLayers: [
            buildLayerSettings('DayState0', { x: 184, y: 104 }, 2),
            buildLayerSettings('DayState1', { x: 134, y: 103 }, 2),
            buildLayerSettings('DayState2', { x: 134, y: 103 }, 2),
            buildLayerSettings('DayState3', { x: 134, y: 154 }, 2)
        ],
        buttonBackground: (() => {
            const background = buildLayerSettings('ButtonBackground', { x: 20, y: 280 });
            background.opacity = Math.max(0, Math.min(255, toNumber(params.ButtonBackgroundOpacity, 255)));
            return background;
        })(),
        buttons: {
            skip: {
                image: params.SkipButtonImage || '',
                x: toNumber(params.SkipButtonX, 40),
                y: toNumber(params.SkipButtonY, 312),
                blendMode: 0,
                commonEventId: toNumber(params.SkipCommonEventId, 195),
                disableSwitchId: toNumber(params.SkipDisableSwitchId, 0)
            },
            map: {
                image: params.MapButtonImage || '',
                x: toNumber(params.MapButtonX, 150),
                y: toNumber(params.MapButtonY, 312),
                blendMode: 0,
                commonEventId: toNumber(params.MapCommonEventId, 194),
                disableSwitchId: toNumber(params.MapDisableSwitchId, 0)
            }
        },
        keys: {
            skip: params.SkipKeyName || 'pageup',
            map: params.MapKeyName || 'pagedown'
        }
    };

    const buildPictureIds = (baseId) => {
        const ids = {
            timeBase: baseId,
            timeStates: [],
            dayBase: baseId + 5,
            dayStates: [],
            buttonBackground: baseId + 10,
            skipButton: baseId + 11,
            mapButton: baseId + 12
        };
        for (let i = 0; i < 4; i++) {
            ids.timeStates.push(baseId + 1 + i);
            ids.dayStates.push(baseId + 6 + i);
        }
        return ids;
    };

    class TimeWeekShortcutHud {
        constructor(config) {
            this._settings = config;
            this._pictureIds = buildPictureIds(config.basePictureId);
            this._activeImages = {};
            this._positions = {};
            this._currentVisibility = 0;
            this._isActive = false;
            this._buttonsPrepared = { skip: false, map: false };
            this._seConfigured = false;
            this._helperWarned = false;
            this._helperWarned = false;
            this._hideDelayCount = 0;
            this._arePicturesHidden = false;
        }

        onSceneStart() {
            this._needsRefresh = true;
        }

        onSceneEnd() {
            this.eraseAllPictures();
            this._isActive = false;
        }

        update() {
            if (!this.shouldDisplayOnMap()) {
                if (this._isActive) {
                    this.eraseAllPictures();
                    this._isActive = false;
                }
                return;
            }
            if (!this._isActive || this._needsRefresh) {
                this.prepareHud();
                this._isActive = true;
                this._needsRefresh = false;
            }
            this.updateVisibility();
            this.updateCoordinatesState();
            this.applyLayerOpacities();
            this.updateButtons();
            this.updateKeyShortcuts();
        }

        shouldDisplayOnMap() {
            if (!(SceneManager._scene instanceof Scene_Map)) {
                return false;
            }
            // 非表示スイッチのいずれかがONなら非表示
            if (this._settings.disableSwitchIds.length > 0) {
                for (const switchId of this._settings.disableSwitchIds) {
                    if ($gameSwitches.value(switchId)) {
                        return false;
                    }
                }
            }
            if (this._settings.enableSwitchId === 0) {
                return true;
            }
            return $gameSwitches.value(this._settings.enableSwitchId);
        }

        prepareHud() {
            this._activeImages = {};
            this._positions = {};
            this._buttonsPrepared = { skip: false, map: false };
            this.applySeConfig();
            this.prepareStaticPictures();
            this._hideDelayCount = 0;
            this._currentVisibility = $gameMessage.isBusy() ? 0 : 255;
            this._arePicturesHidden = false;
            this.updateCoordinatesState();
            this.applyLayerOpacities();
        }

        applySeConfig() {
            if (this._seConfigured) return;
            if (window.PictureButtonUtils && window.PictureButtonUtils.configureSe) {
                window.PictureButtonUtils.configureSe({
                    hover: this._settings.se.hover,
                    click: this._settings.se.click
                });
                this._seConfigured = true;
            }
        }

        prepareStaticPictures() {
            this.showLayer(this._pictureIds.timeBase, this._settings.timeBase);
            this._settings.timeLayers.forEach((layer, index) => {
                this.showLayer(this._pictureIds.timeStates[index], layer);
            });
            this.showLayer(this._pictureIds.dayBase, this._settings.dayBase);
            this._settings.dayLayers.forEach((layer, index) => {
                this.showLayer(this._pictureIds.dayStates[index], layer);
            });
            this.showLayer(this._pictureIds.buttonBackground, this._settings.buttonBackground);
            this.showLayer(this._pictureIds.skipButton, this._settings.buttons.skip);
            this.showLayer(this._pictureIds.mapButton, this._settings.buttons.map);
        }

        showLayer(pictureId, layerSetting) {
            if (!pictureId || !layerSetting || !layerSetting.image) {
                $gameScreen.erasePicture(pictureId);
                delete this._activeImages[pictureId];
                delete this._positions[pictureId];
                return;
            }
            const cachedName = this._activeImages[pictureId];
            const cachedPos = this._positions[pictureId];
            const needsRefresh = cachedName !== layerSetting.image ||
                !cachedPos ||
                cachedPos.x !== layerSetting.x ||
                cachedPos.y !== layerSetting.y;
            if (needsRefresh) {
                this._activeImages[pictureId] = layerSetting.image;
                this._positions[pictureId] = { x: layerSetting.x, y: layerSetting.y };
                $gameScreen.showPicture(
                    pictureId,
                    layerSetting.image,
                    0,
                    layerSetting.x,
                    layerSetting.y,
                    100,
                    100,
                    0,
                    layerSetting.blendMode ?? 0
                );
            }
        }

        updateVisibility() {
            let target = 255;

            if ($gameMessage.isBusy()) {
                target = 0;
                this._hideDelayCount = this._settings.hideDelay; // メッセージ中は即座に隠す扱いにし、カウントも満了させる
            } else if ($gameMap.isEventRunning()) {
                this._hideDelayCount++;
                if (this._hideDelayCount >= this._settings.hideDelay) {
                    target = 0;
                }
            } else {
                this._hideDelayCount = 0;
            }

            if (this._currentVisibility === target) {
                return;
            }
            if (this._currentVisibility < target) {
                this._currentVisibility = Math.min(target, this._currentVisibility + this._settings.fadeSpeed);
            } else {
                this._currentVisibility = Math.max(target, this._currentVisibility - this._settings.fadeSpeed);
            }
        }

        updateCoordinatesState() {
            const isHidden = (this._currentVisibility <= 0);

            if (isHidden && !this._arePicturesHidden) {
                this.moveAllPicturesToOffscreen();
                this._arePicturesHidden = true;
            } else if (!isHidden && this._arePicturesHidden) {
                this.restoreAllPicturesPosition();
                this._arePicturesHidden = false;
            }
        }

        moveAllPicturesToOffscreen() {
            const offX = -2000;
            const offY = -2000;
            this.setPicturePosition(this._pictureIds.timeBase, offX, offY);
            this._pictureIds.timeStates.forEach(id => this.setPicturePosition(id, offX, offY));
            this.setPicturePosition(this._pictureIds.dayBase, offX, offY);
            this._pictureIds.dayStates.forEach(id => this.setPicturePosition(id, offX, offY));
            this.setPicturePosition(this._pictureIds.buttonBackground, offX, offY);
            this.setPicturePosition(this._pictureIds.skipButton, offX, offY);
            this.setPicturePosition(this._pictureIds.mapButton, offX, offY);
        }

        restoreAllPicturesPosition() {
            this.restorePicturePosition(this._pictureIds.timeBase);
            this._pictureIds.timeStates.forEach(id => this.restorePicturePosition(id));
            this.restorePicturePosition(this._pictureIds.dayBase);
            this._pictureIds.dayStates.forEach(id => this.restorePicturePosition(id));
            this.restorePicturePosition(this._pictureIds.buttonBackground);
            this.restorePicturePosition(this._pictureIds.skipButton);
            this.restorePicturePosition(this._pictureIds.mapButton);
        }

        setPicturePosition(pictureId, x, y) {
            const picture = $gameScreen.picture(pictureId);
            if (picture) {
                picture._x = x;
                picture._y = y;
            }
        }

        restorePicturePosition(pictureId) {
            const pos = this._positions[pictureId];
            if (pos) {
                this.setPicturePosition(pictureId, pos.x, pos.y);
            }
        }

        applyLayerOpacities() {
            const v = this._currentVisibility;
            this.setPictureOpacity(this._pictureIds.timeBase, this._settings.timeBase.image ? v : 0);
            const timeIndex = this.currentTimeIndex();
            this._pictureIds.timeStates.forEach((id, index) => {
                const opacity = (index === timeIndex && this._settings.timeLayers[index].image) ? v : 0;
                this.setPictureOpacity(id, opacity);
            });

            this.setPictureOpacity(this._pictureIds.dayBase, this._settings.dayBase.image ? v : 0);
            const dayIndex = this.currentDayIndex();
            this._pictureIds.dayStates.forEach((id, index) => {
                const opacity = (index === dayIndex && this._settings.dayLayers[index].image) ? v : 0;
                this.setPictureOpacity(id, opacity);
            });

            const bgOpacityBase = this._settings.buttonBackground.opacity ?? 255;
            const bgOpacity = this._settings.buttonBackground.image ? Math.round((v * bgOpacityBase) / 255) : 0;
            this.setPictureOpacity(this._pictureIds.buttonBackground, bgOpacity);

            // SKIPボタンの透明度（禁止スイッチがONの時は暗く表示）
            const skipDisableSwitchId = this._settings.buttons.skip.disableSwitchId;
            const skipDisabled = skipDisableSwitchId > 0 && $gameSwitches.value(skipDisableSwitchId);
            const skipOpacity = this._settings.buttons.skip.image
                ? (skipDisabled ? Math.round(v * 0.5) : v)
                : 0;
            this.setPictureOpacity(this._pictureIds.skipButton, skipOpacity);

            // MAPボタンの透明度（禁止スイッチがONの時は暗く表示）
            const mapDisableSwitchId = this._settings.buttons.map.disableSwitchId;
            const mapDisabled = mapDisableSwitchId > 0 && $gameSwitches.value(mapDisableSwitchId);
            const mapOpacity = this._settings.buttons.map.image
                ? (mapDisabled ? Math.round(v * 0.5) : v)
                : 0;
            this.setPictureOpacity(this._pictureIds.mapButton, mapOpacity);
        }

        setPictureOpacity(pictureId, opacity) {
            const picture = $gameScreen.picture(pictureId);
            if (picture) {
                picture.setOpacity(opacity);
            }
        }

        currentTimeIndex() {
            const id = this._settings.timeVariableId;
            if (!id) return -1;
            return this.normalizeIndex($gameVariables.value(id), this._settings.timeLayers.length);
        }

        currentDayIndex() {
            const id = this._settings.dayVariableId;
            if (!id) return -1;
            return this.normalizeIndex($gameVariables.value(id), this._settings.dayLayers.length);
        }

        normalizeIndex(value, length) {
            const num = Number(value);
            if (isNaN(num)) return -1;
            const index = Math.floor(num);
            return index >= 0 && index < length ? index : -1;
        }

        updateButtons() {
            if (!this.ensureHelperReady()) {
                return;
            }
            this.trySetupButton('skip', this._pictureIds.skipButton, this._settings.buttons.skip.commonEventId, this._settings.buttons.skip.disableSwitchId);
            this.trySetupButton('map', this._pictureIds.mapButton, this._settings.buttons.map.commonEventId, this._settings.buttons.map.disableSwitchId);

            // 非表示状態（ターゲットが0）または現在不可視の場合はボタン無効
            const isHiding = ($gameMessage.isBusy() || ($gameMap.isEventRunning() && this._hideDelayCount >= this._settings.hideDelay));
            const baseDisabled = isHiding || this._currentVisibility <= 0;

            // SKIPボタンの無効化状態（禁止スイッチがONの時も無効化）
            const skipDisableSwitchId = this._settings.buttons.skip.disableSwitchId;
            const skipDisabled = baseDisabled || (skipDisableSwitchId > 0 && $gameSwitches.value(skipDisableSwitchId));
            this.updateForceDisable(this._pictureIds.skipButton, skipDisabled);

            // MAPボタンの無効化状態（禁止スイッチがONの時も無効化）
            const mapDisableSwitchId = this._settings.buttons.map.disableSwitchId;
            const mapDisabled = baseDisabled || (mapDisableSwitchId > 0 && $gameSwitches.value(mapDisableSwitchId));
            this.updateForceDisable(this._pictureIds.mapButton, mapDisabled);
        }

        ensureHelperReady() {
            if (typeof $gameScreen.setupPictureButton === 'function' && window.PictureButtonUtils) {
                return true;
            }
            if (!this._helperWarned) {
                console.warn('PictureButtonHelper.js が読み込まれていないため、ボタン機能を利用できません。');
                this._helperWarned = true;
            }
            return false;
        }

        trySetupButton(key, pictureId, commonEventId, disableSwitchId = 0) {
            if (this._buttonsPrepared[key]) {
                return;
            }
            const picture = $gameScreen.picture(pictureId);
            if (!picture) {
                return;
            }
            $gameScreen.setupPictureButton(
                pictureId,
                commonEventId,
                '',
                {
                    enableHoverSe: true,
                    enableHoverTone: true,
                    enablePressEffect: true,
                    enableClickSe: true
                },
                {
                    disableSwitchId: disableSwitchId,
                    cancelSe: this._settings.se.click
                }
            );
            this._buttonsPrepared[key] = true;
        }

        updateForceDisable(pictureId, disabled) {
            if (window.PictureButtonUtils && window.PictureButtonUtils.setForceDisabled) {
                window.PictureButtonUtils.setForceDisabled(pictureId, disabled);
            }
        }

        updateKeyShortcuts() {
            if (!this.canTriggerShortcut()) {
                return;
            }
            if (this._settings.keys.skip && Input.isTriggered(this._settings.keys.skip)) {
                const skipDisableSwitchId = this._settings.buttons.skip.disableSwitchId;
                const skipDisabled = skipDisableSwitchId > 0 && $gameSwitches.value(skipDisableSwitchId);
                this.triggerCommonEvent(this._settings.buttons.skip.commonEventId, skipDisabled);
            }
            if (this._settings.keys.map && Input.isTriggered(this._settings.keys.map)) {
                const mapDisableSwitchId = this._settings.buttons.map.disableSwitchId;
                const mapDisabled = mapDisableSwitchId > 0 && $gameSwitches.value(mapDisableSwitchId);
                this.triggerCommonEvent(this._settings.buttons.map.commonEventId, mapDisabled);
            }
        }

        canTriggerShortcut() {
            if (!$gamePlayer || !$gameMap) return false;
            if ($gameMap.isEventRunning()) return false;
            if ($gameMessage.isBusy()) return false;
            return this._currentVisibility >= 255;
        }

        triggerCommonEvent(commonEventId, skipSe = false) {
            if (!commonEventId) return;
            // 禁止スイッチがONの時はSEを再生しない
            if (!skipSe && window.PictureButtonUtils && window.PictureButtonUtils.playClickSe) {
                window.PictureButtonUtils.playClickSe();
            }
            // コモンイベント呼び出しは通常通り実行（コモンイベント側で禁止スイッチをチェック）
            $gameTemp.reserveCommonEvent(commonEventId);
        }

        eraseAllPictures() {
            const ids = [
                this._pictureIds.timeBase,
                ...this._pictureIds.timeStates,
                this._pictureIds.dayBase,
                ...this._pictureIds.dayStates,
                this._pictureIds.buttonBackground,
                this._pictureIds.skipButton,
                this._pictureIds.mapButton
            ];
            ids.forEach(id => $gameScreen.erasePicture(id));
            this._activeImages = {};
            this._positions = {};
            this._buttonsPrepared = { skip: false, map: false };
        }
    }

    const hudController = new TimeWeekShortcutHud(settings);

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        hudController.onSceneStart();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        hudController.update();
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        hudController.onSceneEnd();
        _Scene_Map_terminate.call(this);
    };
})();
