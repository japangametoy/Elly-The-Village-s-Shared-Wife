/*:
 * @target MZ
 * @plugindesc ゲームパッドのボタン配置を変更する設定画面を追加します（機能ベース）。
 *
 * @help
 * ゲームパッドのボタン配置を変更するプラグインです。
 * オプション画面に「ゲームパッド設定」という項目が追加されます。
 *
 * 以下の機能に対して、好きなボタンを割り当てることができます。
 * ・決定
 * ・キャンセル/ダッシュ
 * ・メニュー
 * ・待機 (Common Event 4)
 * ・ファストトラベル (Common Event 5)
 *
 * 設定手順:
 * 1. 機能をリストから選択または決定キーで押下
 * 2. 「ボタンを押してください」と表示される
 * 3. 割り当てたいボタンを押す
 * 4. 「ボタンXX を 〇〇 に割り当てますか？」で「はい」を選択
 *
 * ※割り当て時の注意
 * 既に他の機能に割り当てられているボタンを選択した場合、
 * 機能が入れ替わります（スワップ）。
 * これにより、決定やキャンセルボタンが消失するのを防ぎます。
 *
 * 設定はオプション設定として保存されます。
 */

(() => {
    const pluginName = "GamepadConfig";

    //-----------------------------------------------------------------------------
    // ConfigManager
    //-----------------------------------------------------------------------------

    // Default Mapping
    // User Requested:
    // OK=1, Cancel=2, Menu=9, Standby=4, FastTravel=5
    ConfigManager.gamepadConfig = {
        1: "ok",
        2: "cancel",
        9: "menu",
        4: "commonPad4",
        5: "commonPad5",

        // D-Pad defaults usually
        12: "up",
        13: "down",
        14: "left",
        15: "right",

        // Others?
        0: "shift", // Move Shift to 0 as 1,2 are taken
        3: "pageup", // Move others to unused
        6: "pagedown"
    };

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        const config = _ConfigManager_makeData.call(this);
        config.gamepadConfig = this.gamepadConfig;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.call(this, config);
        this.gamepadConfig = config.gamepadConfig || this.defaultGamepadConfig();
        this.applyGamepadConfig();
    };

    ConfigManager.defaultGamepadConfig = function () {
        return {
            1: "ok",
            2: "cancel",
            9: "menu",
            4: "commonPad4",
            5: "commonPad5",
            12: "up",
            13: "down",
            14: "left",
            15: "right",
            0: "shift",
            3: "pageup",
            6: "pagedown"
        };
    };

    ConfigManager.applyGamepadConfig = function () {
        // Clear all standard gamepad mappings first to prevent ghosts
        for (let i = 0; i < 16; i++) {
            delete Input.gamepadMapper[i];
        }

        // Apply new config
        for (const buttonId in this.gamepadConfig) {
            Input.gamepadMapper[buttonId] = this.gamepadConfig[buttonId];
        }
    };

    //-----------------------------------------------------------------------------
    // Window_Options
    //-----------------------------------------------------------------------------

    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand("Gamepad Config", "gamepadConfig");
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "gamepadConfig") {
            SceneManager.push(Scene_GamepadConfig);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        const symbol = this.commandSymbol(index);
        if (symbol === "gamepadConfig") {
            return "";
        }
        return _Window_Options_statusText.call(this, index);
    };

    //-----------------------------------------------------------------------------
    // Scene_GamepadConfig
    //-----------------------------------------------------------------------------

    function Scene_GamepadConfig() {
        this.initialize(...arguments);
    }

    Scene_GamepadConfig.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_GamepadConfig.prototype.constructor = Scene_GamepadConfig;

    Scene_GamepadConfig.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_GamepadConfig.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createFunctionWindow();
        this.createListenWindow();
        this.createConfirmWindow();
    };

    Scene_GamepadConfig.prototype.createFunctionWindow = function () {
        const rect = this.functionWindowRect();
        this._functionWindow = new Window_GamepadFunctionList(rect);
        this._functionWindow.setHandler("ok", this.onFunctionOk.bind(this));
        this._functionWindow.setHandler("cancel", this.popScene.bind(this));
        this._functionWindow.setHandler("reset", this.onReset.bind(this));
        this._functionWindow.setHandler("back", this.popScene.bind(this)); // Handle back command
        this._functionWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._functionWindow);
    };

    Scene_GamepadConfig.prototype.functionWindowRect = function () {
        const ww = 600;
        const wh = this.calcWindowHeight(10, true); // Increased for Reset and Back
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_GamepadConfig.prototype.createListenWindow = function () {
        const rect = this.popupWindowRect();
        this._listenWindow = new Window_GamepadListen(rect);
        this._listenWindow.hide();
        this.addWindow(this._listenWindow);
    };

    Scene_GamepadConfig.prototype.createConfirmWindow = function () {
        const rect = this.popupWindowRect();
        this._confirmWindow = new Window_GamepadConfirm(rect);
        this._confirmWindow.setHandler("yes", this.onConfirmYes.bind(this));
        this._confirmWindow.setHandler("no", this.onConfirmNo.bind(this));
        this._confirmWindow.setHandler("cancel", this.onConfirmNo.bind(this));
        this._confirmWindow.hide();
        this.addWindow(this._confirmWindow);
    };

    Scene_GamepadConfig.prototype.popupWindowRect = function () {
        const ww = 500;
        const wh = 200;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_GamepadConfig.prototype.onFunctionOk = function () {
        const symbol = this._functionWindow.currentSymbol();
        if (symbol === "reset") {
            this.onReset();
            return;
        }
        if (symbol === "back") {
            this.popScene();
            return;
        }

        // Map safe symbols back to proper input symbols
        const mapping = {
            "cfg_ok": "ok",
            "cfg_cancel": "cancel",
            "cfg_menu": "menu",
            "cfg_commonPad4": "commonPad4",
            "cfg_commonPad5": "commonPad5"
        };

        this._targetSymbol = mapping[symbol] || symbol;
        this._targetName = this._functionWindow.currentName();
        this._functionWindow.deactivate();
        this._listenWindow.show();
        this._listenWindow.start();
        this._listenWindow.activate();
        this._waitForRelease = true;
    };

    Scene_GamepadConfig.prototype.onReset = function () {
        ConfigManager.gamepadConfig = ConfigManager.defaultGamepadConfig();
        ConfigManager.applyGamepadConfig();
        ConfigManager.save();
        this._functionWindow.refresh();
        this._functionWindow.activate();
        SoundManager.playOk();
    };

    Scene_GamepadConfig.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._listenWindow.visible) {
            this.updateInputDetection();
        }
    };

    Scene_GamepadConfig.prototype.updateInputDetection = function () {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0];
        if (!gamepad) return;

        const isAnyButtonPressed = gamepad.buttons.some(b => b.pressed);

        if (this._waitForRelease) {
            if (!isAnyButtonPressed) {
                this._waitForRelease = false;
            }
            return;
        }

        for (let i = 0; i < 16; i++) {
            if (gamepad.buttons[i] && gamepad.buttons[i].pressed) {
                this.onButtonDetected(i);
                break;
            }
        }
    };

    Scene_GamepadConfig.prototype.onButtonDetected = function (buttonId) {
        this._listenWindow.hide();
        this._detectedButtonId = buttonId;
        this._confirmWindow.setup(buttonId, this._targetName);
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };

    Scene_GamepadConfig.prototype.onConfirmYes = function () {
        const newButtonId = this._detectedButtonId;
        const targetSymbol = this._targetSymbol;

        const config = ConfigManager.gamepadConfig;

        const currentSymbolOnNewButton = config[newButtonId];
        let oldButtonForTargetSymbol = -1;

        for (const key in config) {
            if (config[key] === targetSymbol) {
                oldButtonForTargetSymbol = key;
                break;
            }
        }

        // Apply Swap
        config[newButtonId] = targetSymbol;

        if (oldButtonForTargetSymbol !== -1 && oldButtonForTargetSymbol != newButtonId) {
            if (currentSymbolOnNewButton) {
                config[oldButtonForTargetSymbol] = currentSymbolOnNewButton;
            } else {
                delete config[oldButtonForTargetSymbol];
            }
        }

        ConfigManager.applyGamepadConfig();
        ConfigManager.save();

        this._confirmWindow.hide();
        this._functionWindow.refresh();
        this._functionWindow.activate();
    };

    Scene_GamepadConfig.prototype.onConfirmNo = function () {
        this._confirmWindow.hide();
        this._functionWindow.activate();
    };

    //-----------------------------------------------------------------------------
    // Window_GamepadFunctionList
    //-----------------------------------------------------------------------------

    function Window_GamepadFunctionList() {
        this.initialize(...arguments);
    }

    Window_GamepadFunctionList.prototype = Object.create(Window_Command.prototype);
    Window_GamepadFunctionList.prototype.constructor = Window_GamepadFunctionList;

    Window_GamepadFunctionList.prototype.initialize = function (rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_GamepadFunctionList.prototype.makeCommandList = function () {
        this.addCommand("Confirm", "cfg_ok");
        this.addCommand("Cancel/Dash", "cfg_cancel");
        this.addCommand("Menu", "cfg_menu");
        this.addCommand("Wait", "cfg_commonPad4");
        this.addCommand("Fast Travel", "cfg_commonPad5");
        this.addCommand("Reset to Default Settings", "reset");
        this.addCommand("Back", "back");
    };

    Window_GamepadFunctionList.prototype.drawItem = function (index) {
        const rect = this.itemLineRect(index);
        const name = this.commandName(index);
        const symbol = this.commandSymbol(index);

        this.changePaintOpacity(true);
        this.drawText(name, rect.x, rect.y, 300, "left");

        if (symbol === "reset" || symbol === "back") {
            return;
        }

        // Map back to real symbols for lookup
        const mapping = {
            "cfg_ok": "ok",
            "cfg_cancel": "cancel",
            "cfg_menu": "menu",
            "cfg_commonPad4": "commonPad4",
            "cfg_commonPad5": "commonPad5"
        };
        const realSymbol = mapping[symbol] || symbol;

        const assignedButton = this.findAssignedButton(realSymbol);
        let buttonText = "なし";
        if (assignedButton !== null) {
            buttonText = this.buttonName(assignedButton);
        }
        this.drawText(buttonText, rect.x + 300, rect.y, rect.width - 300, "right");
    };

    Window_GamepadFunctionList.prototype.findAssignedButton = function (symbol) {
        const config = ConfigManager.gamepadConfig;
        for (const key in config) {
            if (config[key] === symbol) {
                return Number(key);
            }
        }
        return null;
    };

    Window_GamepadFunctionList.prototype.buttonName = function (index) {
        return "Button" + index;
    };

    Window_GamepadFunctionList.prototype.currentName = function () {
        return this.commandName(this.index());
    };

    //-----------------------------------------------------------------------------
    // Window_GamepadListen
    //-----------------------------------------------------------------------------

    function Window_GamepadListen() {
        this.initialize(...arguments);
    }

    Window_GamepadListen.prototype = Object.create(Window_Base.prototype);
    Window_GamepadListen.prototype.constructor = Window_GamepadListen;

    Window_GamepadListen.prototype.start = function () {
        this.refresh();
    };

    Window_GamepadListen.prototype.refresh = function () {
        this.contents.clear();
        this.drawText("ボタンを押してください...", 0, 0, this.innerWidth, "center");
    };

    //-----------------------------------------------------------------------------
    // Window_GamepadConfirm
    //-----------------------------------------------------------------------------

    function Window_GamepadConfirm() {
        this.initialize(...arguments);
    }

    Window_GamepadConfirm.prototype = Object.create(Window_Command.prototype);
    Window_GamepadConfirm.prototype.constructor = Window_GamepadConfirm;

    Window_GamepadConfirm.prototype.initialize = function (rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._buttonId = -1;
        this._targetName = "";
    };

    Window_GamepadConfirm.prototype.setup = function (buttonId, targetName) {
        this._buttonId = buttonId;
        this._targetName = targetName;
        this.refresh();
        this.select(0);
        this.activate();
    };

    Window_GamepadConfirm.prototype.makeCommandList = function () {
        this.addCommand("yes", "yes");
        this.addCommand("No", "no");
    };

    Window_GamepadConfirm.prototype.itemRect = function (index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        rect.y += this.lineHeight() * 2; // Shift commands down
        return rect;
    };

    Window_GamepadConfirm.prototype.refresh = function () {
        Window_Command.prototype.refresh.call(this);
        if (this._buttonId >= 0) {
            const buttonName = this.buttonName(this._buttonId);
            const text = `${buttonName} を\n${this._targetName} に割り当てますか？`;
            this.drawTextEx(text, 0, 0);
        }
    };

    Window_GamepadConfirm.prototype.buttonName = function (index) {
        return "ボタン" + index;
    };

})();
