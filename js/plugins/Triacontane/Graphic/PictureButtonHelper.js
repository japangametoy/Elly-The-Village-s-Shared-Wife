/*:
 * @target MZ
 * @plugindesc ピクチャボタン構築プラグイン（コマンド対応・スクリプト実行可）
 * 
 * @help PictureButtonConfig.js
 * 
 * トリアコンタン様の「PictureCallCommon.js」の補助プラグインです。
 * 並列処理でピクチャを更新してもホバー演出が消えない強力なボタンを作成します。
 * 
 * 【必須プラグイン】
 * PictureCallCommon.js
 * 
 * 【使い方】
 * 1. プラグインパラメータで「ホバー色」「効果音」を設定します。
 * 2. イベントコマンド「プラグインコマンド」から「ボタン化設定」を選びます。
 * 3. ピクチャ番号、コモンイベント、(任意で)スクリプトを指定します。
 * 
 * ※解除したい場合は、PictureCallCommon側のコマンド「ピクチャイベント解除」
 *   またはスクリプト $gameScreen.removePictureEvent(ピクチャID) を使ってください。
 * 
 * ==========================================
 * @command SETUP_BUTTON
 * @text ボタン化設定
 * @desc 指定したピクチャをボタン化します（ホバー演出・クリック演出付き）。
 * 
 * @arg pictureId
 * @text ピクチャ番号
 * @desc ボタン化するピクチャの番号です。
 * @type number
 * @min 1
 * @default 1
 * 
 * @arg commonEventId
 * @text コモンイベント
 * @desc クリック時に実行するコモンイベントです（なし＝0）。
 * @type common_event
 * @default 0
 * 
 * @arg script
 * @text 実行スクリプト
 * @desc クリック時に実行するJavaScriptコードです（任意）。
 * @type multiline_string
 * 
 * @arg enableHoverSe
 * @text ホバーSEを鳴らす
 * @desc ホバー時にプラグインパラメータで指定したSEを再生します。
 * @type boolean
 * @default true
 * 
 * @arg enableHoverTone
 * @text ホバー光を出す
 * @desc ホバー時に色調変化（発光演出）を行います。
 * @type boolean
 * @default true
 * 
 * @arg enablePressEffect
 * @text 押し込み演出を行う
 * @desc クリック中に縮小＋座標移動による押し込み演出を適用します。
 * @type boolean
 * @default true
 * 
 * @arg enableClickSe
 * @text クリックSEを鳴らす
 * @desc クリック時にプラグインパラメータで指定したSEを再生します。
 * @type boolean
 * @default true
 * 
 * @arg disableSwitchId
 * @text 無効化スイッチ
 * @desc ONの間はボタンを暗くしてホバーとクリックを無効化します。
 * @type switch
 * @default 0
 * 
 * @arg cancelSeName
 * @text 無効時クリックSE
 * @desc 無効状態でクリックした際に再生するSE（拡張子なし）。
 * @type file
 * @dir audio/se
 * @default Buzzer1
 * 
 * @arg cancelSeVolume
 * @text 無効時クリック音量
 * @desc 無効状態でクリックした際のSE音量です。
 * @type number
 * @default 90
 * 
 * @arg cancelSePitch
 * @text 無効時クリックピッチ
 * @desc 無効状態でクリックした際のSEピッチです。
 * @type number
 * @default 100
 * 
 * @param --- ホバー設定 ---
 * 
 * @param HoverTone
 * @text ホバー時の色調
 * @desc マウスが乗った時の明るさの変化です。赤,緑,青,グレー の順で指定。
 * @default 60, 60, 60, 0
 * 
 * @param HoverSeName
 * @text ホバーSEファイル名
 * @desc マウスが乗った時の効果音ファイル名です（拡張子なし）。空欄なら鳴りません。
 * @default Cursor1
 * @type file
 * @dir audio/se
 * 
 * @param HoverSeVolume
 * @text ホバーSE音量
 * @desc ホバーSEの音量です。
 * @default 90
 * @type number
 * 
 * @param HoverSePitch
 * @text ホバーSEピッチ
 * @desc ホバーSEのピッチです。
 * @default 100
 * @type number
 * 
 * @param DisabledTone
 * @text 無効時の色調
 * @desc 無効状態でピクチャを暗くする際の色調です。赤,緑,青,グレー。
 * @default -68, -68, -68, 0
 * 
 * @param --- クリック設定 ---
 * 
 * @param ClickSeName
 * @text クリックSEファイル名
 * @desc クリックした時の効果音ファイル名です（拡張子なし）。空欄なら鳴りません。
 * @default Decision1
 * @type file
 * @dir audio/se
 * 
 * @param ClickSeVolume
 * @text クリックSE音量
 * @desc クリックSEの音量です。
 * @default 90
 * @type number
 * 
 * @param ClickSePitch
 * @text クリックSEピッチ
 * @desc クリックSEのピッチです。
 * @default 100
 * @type number
 */

(() => {
    'use strict';

    const fallbackPluginName = 'PictureButtonConfig';
    const currentScript = document.currentScript;
    const derivedPluginName = currentScript
        ? decodeURIComponent(currentScript.src.split('/').pop().replace(/\.js$/, ''))
        : 'PictureButtonHelper';
    const pluginName = derivedPluginName || fallbackPluginName;
    let parameters = PluginManager.parameters(pluginName);
    if (!Object.keys(parameters).length && pluginName !== fallbackPluginName) {
        // 旧プラグイン名と互換を取るためにフォールバックする
        parameters = PluginManager.parameters(fallbackPluginName);
    }

    // --- パラメータの取得と整形 ---
    const parseTone = (str) => {
        const tone = str.split(',').map(Number);
        return tone.length === 4 ? tone : [60, 60, 60, 0];
    };

    const config = {
        hoverTone: parseTone(parameters['HoverTone'] || '60, 60, 60, 0'),
        disabledTone: parseTone(parameters['DisabledTone'] || '-68, -68, -68, 0'),
        hoverSe: {
            name: parameters['HoverSeName'] || '',
            volume: Number(parameters['HoverSeVolume'] || 90),
            pitch: Number(parameters['HoverSePitch'] || 100),
            pan: 0
        },
        clickSe: {
            name: parameters['ClickSeName'] || '',
            volume: Number(parameters['ClickSeVolume'] || 90),
            pitch: Number(parameters['ClickSePitch'] || 100),
            pan: 0
        }
    };
    const defaultButtonOptions = {
        enableHoverSe: true,
        enableHoverTone: true,
        enablePressEffect: true,
        enableClickSe: true
    };
    const parseBoolean = (value, defaultValue = true) => {
        if (value === undefined || value === null || value === '') return defaultValue;
        return value === true || value === 'true';
    };

    // SE再生用のヘルパー（外部アクセス可能にしておく）
    window.PictureButtonUtils = window.PictureButtonUtils || {};
    const buttonStateStore = {};
    window.PictureButtonUtils.playHoverSe = function () {
        if (config.hoverSe.name) AudioManager.playSe(config.hoverSe);
    };
    window.PictureButtonUtils.playClickSe = function () {
        if (config.clickSe.name) AudioManager.playSe(config.clickSe);
    };
    window.PictureButtonUtils.configureSe = function (seConfig = {}) {
        if (seConfig.hover) {
            Object.assign(config.hoverSe, seConfig.hover);
        }
        if (seConfig.click) {
            Object.assign(config.clickSe, seConfig.click);
        }
    };
    window.PictureButtonUtils.setButtonState = function (pictureId, state) {
        if (!pictureId) return;
        const currentState = buttonStateStore[pictureId] || {};
        buttonStateStore[pictureId] = Object.assign({}, currentState, state);
    };
    window.PictureButtonUtils.clearButtonState = function (pictureId) {
        if (!pictureId) return;
        delete buttonStateStore[pictureId];
    };
    window.PictureButtonUtils.getButtonState = function (pictureId) {
        return buttonStateStore[pictureId];
    };
    window.PictureButtonUtils.isButtonDisabled = function (pictureId) {
        const state = buttonStateStore[pictureId];
        if (!state) return false;
        if (state.forceDisabled) return true;
        if (!state.disableSwitchId) return false;
        return $gameSwitches.value(state.disableSwitchId);
    };
    window.PictureButtonUtils.setForceDisabled = function (pictureId, disabled) {
        if (!pictureId || !buttonStateStore[pictureId]) return;
        buttonStateStore[pictureId].forceDisabled = !!disabled;
    };
    window.PictureButtonUtils.handleDisabledClick = function (pictureId) {
        if (!this.isButtonDisabled(pictureId)) {
            return false;
        }
        const state = buttonStateStore[pictureId];
        if (state && state.cancelSe && state.cancelSe.name) {
            AudioManager.playSe(state.cancelSe);
        }
        return true;
    };

    // --- Mouse Movement Tracking ---
    let lastTouchX = -1;
    let lastTouchY = -1;
    let isMouseMoved = false;

    const _TouchInput_update = TouchInput.update;
    TouchInput.update = function () {
        _TouchInput_update.apply(this, arguments);
        const x = TouchInput.x;
        const y = TouchInput.y;
        if (lastTouchX !== -1 && (x !== lastTouchX || y !== lastTouchY)) {
            isMouseMoved = true;
        } else {
            isMouseMoved = false;
        }
        lastTouchX = x;
        lastTouchY = y;
    };

    window.PictureButtonUtils.hasMouseMoved = function () {
        return isMouseMoved;
    };

    // -------------------------------------------------------------------------
    // 1. プラグインコマンドの登録
    // -------------------------------------------------------------------------
    const registerButtonCommand = (name) => {
        if (!name) return;
        PluginManager.registerCommand(name, 'SETUP_BUTTON', args => {
            const picId = Number(args.pictureId);
            const ceId = Number(args.commonEventId);
            const scriptCode = args.script || '';
            const options = {
                enableHoverSe: parseBoolean(args.enableHoverSe, true),
                enableHoverTone: parseBoolean(args.enableHoverTone, true),
                enablePressEffect: parseBoolean(args.enablePressEffect, true),
                enableClickSe: parseBoolean(args.enableClickSe, true)
            };
            const disableSettings = {
                disableSwitchId: Number(args.disableSwitchId || 0),
                cancelSe: {
                    name: args.cancelSeName || '',
                    volume: Number(args.cancelSeVolume || 90),
                    pitch: Number(args.cancelSePitch || 100),
                    pan: 0
                }
            };

            $gameScreen.setupPictureButton(picId, ceId, scriptCode, options, disableSettings);
        });
    };
    registerButtonCommand(pluginName);
    if (pluginName !== fallbackPluginName) {
        registerButtonCommand(fallbackPluginName);
    }

    // -------------------------------------------------------------------------
    // 2. スプライトの描画処理を拡張 (並列処理対策)
    // -------------------------------------------------------------------------
    const _Sprite_Picture_updateTone = Sprite_Picture.prototype.updateTone;
    Sprite_Picture.prototype.updateTone = function () {
        // 通常の更新（イベントコマンド等によるリセット含む）
        _Sprite_Picture_updateTone.call(this);

        if (window.PictureButtonUtils && window.PictureButtonUtils.isButtonDisabled && window.PictureButtonUtils.isButtonDisabled(this._pictureId)) {
            this._isHoveredForButton = false;
            this.setColorTone(config.disabledTone);
            return;
        }

        // ボタンとしてホバー中なら、パラメータで設定した色で強制上書き
        if (this._isHoveredForButton) {
            this.setColorTone(config.hoverTone);
        }
    };

    // -------------------------------------------------------------------------
    // 3. 設定関数の定義
    // -------------------------------------------------------------------------
    Game_Screen.prototype.setupPictureButton = function (pictureId, commonEventId, userScript, buttonOptions, extraSettings) {
        // PictureCallCommon.js チェック
        if (typeof this.addPictureEvent !== 'function') {
            console.error('PictureCallCommon.js が導入されていないか、無効になっています。');
            return;
        }
        const options = Object.assign({}, defaultButtonOptions, buttonOptions);
        const disableSettings = Object.assign({
            disableSwitchId: 0,
            cancelSe: { name: '', volume: 90, pitch: 100, pan: 0 }
        }, extraSettings || {});
        if (!disableSettings.cancelSe) {
            disableSettings.cancelSe = { name: '', volume: 90, pitch: 100, pan: 0 };
        }
        window.PictureButtonUtils.setButtonState(pictureId, {
            disableSwitchId: disableSettings.disableSwitchId,
            cancelSe: disableSettings.cancelSe
        });
        const hasDisableSwitch = disableSettings.disableSwitchId > 0;
        const disabledCheckExpr = hasDisableSwitch
            ? `window.PictureButtonUtils.isButtonDisabled(${pictureId})`
            : '';
        const wrapWithDisabledCheck = (bodyScript) => {
            if (!hasDisableSwitch) return bodyScript;
            return `if (!${disabledCheckExpr}) { ${bodyScript} }`;
        };
        const wrapClickScript = (bodyScript) => {
            if (!hasDisableSwitch) return bodyScript;
            return `if (!window.PictureButtonUtils.handleDisabledClick(${pictureId})) { ${bodyScript} }`;
        };

        // 透明な部分も当たり判定に含める
        this.setPicturePreference(pictureId, { includeOpacityZero: true });

        // --- A. クリック時の動作 (トリガー: 1) ---
        // SE再生 + ユーザースクリプト + コモンイベント
        let clickScript = '';
        if (options.enableClickSe) {
            clickScript += "window.PictureButtonUtils.playClickSe(); ";
        }
        if (userScript) {
            clickScript += userScript;
        }
        clickScript = wrapClickScript(clickScript || '');

        this.addPictureEvent(pictureId, 1, {
            script: clickScript,
            commonEventId: commonEventId
        });

        // --- B. ホバー時の動作 (トリガー: 4 入った瞬間) ---
        if (options.enableHoverSe || options.enableHoverTone) {
            let hoverEnterScript = '';
            // ★ マウスが動いているときのみホバー処理を実行する
            hoverEnterScript += "if (window.PictureButtonUtils.hasMouseMoved()) { ";

            if (options.enableHoverSe) {
                hoverEnterScript += "window.PictureButtonUtils.playHoverSe(); ";
            }
            if (options.enableHoverTone) {
                hoverEnterScript += "this._picture._isHoveredForButton = true;";
            }

            hoverEnterScript += " }";
            hoverEnterScript = wrapWithDisabledCheck(hoverEnterScript || '');
            this.addPictureEvent(pictureId, 4, {
                script: hoverEnterScript
            });
        }

        // --- C. ホバー解除時の動作 (トリガー: 5 出た瞬間) ---
        if (options.enableHoverTone) {
            this.addPictureEvent(pictureId, 5, {
                script: "this._picture._isHoveredForButton = false;"
            });
        }

        // --- D. 押し込み演出 (トリガー: 8 押している間ずっと) ---
        if (options.enablePressEffect) {
            this.addPictureEvent(pictureId, 8, {
                script: wrapWithDisabledCheck("this._picture.scale.x *= 0.96; this._picture.scale.y *= 0.96; this._picture.x += 2; this._picture.y += 2;")
            });
        }
    };

    const _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function (pictureId) {
        if (window.PictureButtonUtils && window.PictureButtonUtils.clearButtonState) {
            window.PictureButtonUtils.clearButtonState(pictureId);
        }
        _Game_Screen_erasePicture.call(this, pictureId);
    };

})();