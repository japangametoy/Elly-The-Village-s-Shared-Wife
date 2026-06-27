/*:
 * @target MZ
 * @plugindesc 画面のフェードイン・フェードアウト時間を調整し、色指定も可能なプラグインです。

 * @help ScreenFadeController.js
 *
 * 画面のフェードイン・フェードアウトの時間をカスタマイズできます。
 * また、プラグインコマンドやスクリプトコマンドを使用して、
 * 時間や色（RGB）を指定してフェードを行うことができます。
 *
 * ■ プラグインコマンド
 * 1. フェードアウト (StartFadeOut)
 *    時間と色(赤,緑,青)を指定して画面をフェードアウト（暗転）させます。
 *    ※色が指定されない場合は黒(0,0,0)となります。
 * 
 * 2. フェードイン (StartFadeIn)
 *    時間を指定して画面をフェードイン（明転）させます。
 *    ※色が指定されない場合は黒(0,0,0)からフェードインします。
 *
 * ■ スクリプトコマンド
 * $gameScreen.startFadeOutEx(duration, r, g, b);
 *   duration: フレーム数 (例: 60)
 *   r, g, b: 色成分 0~255 (例: 255, 0, 0 で赤)
 *   ※色は省略可能。省略時は黒(0,0,0)になります。
 * 
 * $gameScreen.startFadeInEx(duration, r, g, b);
 *   ※色は省略可能。省略時は黒(0,0,0)になります。
 *
 * @param defaultFadeOutDuration
 * @text デフォルト・フェードアウト時間
 * @desc イベントコマンド「画面のフェードアウト」のデフォルト時間（フレーム数）です。
 * @type number
 * @default 24
 *
 * @param defaultFadeInDuration
 * @text デフォルト・フェードイン時間
 * @desc イベントコマンド「画面のフェードイン」のデフォルト時間（フレーム数）です。
 * @type number
 * @default 24
 *
 * @command StartFadeOut
 * @text フェードアウト開始
 * @desc 指定した時間と色でフェードアウトを行います。
 *
 * @arg duration
 * @text 時間(フレーム)
 * @desc フェードアウトにかける時間です。
 * @type number
 * @default 60
 *
 * @arg colorR
 * @text 色(赤)
 * @desc RGBの赤成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 *
 * @arg colorG
 * @text 色(緑)
 * @desc RGBの緑成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 *
 * @arg colorB
 * @text 色(青)
 * @desc RGBの青成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 * 
 * @arg wait
 * @text 完了までウェイト
 * @desc フェードアウトが完了するまでイベント実行を待ちます。
 * @type boolean
 * @default true
 *
 * @command StartFadeIn
 * @text フェードイン開始
 * @desc 指定した時間でフェードインを行います。
 *
 * @arg duration
 * @text 時間(フレーム)
 * @desc フェードインにかける時間です。
 * @type number
 * @default 60
 *
 * @arg colorR
 * @text 色(赤)
 * @desc RGBの赤成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 *
 * @arg colorG
 * @text 色(緑)
 * @desc RGBの緑成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 *
 * @arg colorB
 * @text 色(青)
 * @desc RGBの青成分(0-255)。指定なしで0(黒)。
 * @type number
 * @min 0
 * @max 255
 * 
 * @arg wait
 * @text 完了までウェイト
 * @desc フェードインが完了するまでイベント実行を待ちます。
 * @type boolean
 * @default true
 */

(() => {
    'use strict';

    const pluginName = "ScreenFadeController";
    const parameters = PluginManager.parameters(pluginName);
    const defaultFadeOutDuration = Number(parameters['defaultFadeOutDuration'] || 24);
    const defaultFadeInDuration = Number(parameters['defaultFadeInDuration'] || 24);

    //-----------------------------------------------------------------------------
    // Game_Screen
    //-----------------------------------------------------------------------------

    const _Game_Screen_initialize = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function () {
        _Game_Screen_initialize.call(this);
        this._fadeColor = [0, 0, 0];
    };

    Game_Screen.prototype.setFadeColor = function (r, g, b) {
        this._fadeColor = [r, g, b];
    };

    Game_Screen.prototype.fadeColor = function () {
        return this._fadeColor;
    };

    // 拡張フェードアウト
    Game_Screen.prototype.startFadeOutEx = function (duration, r, g, b) {
        if (r !== undefined && g !== undefined && b !== undefined) {
            this.setFadeColor(r, g, b);
        } else {
            // 色指定がない場合は黒(0,0,0)
            this.setFadeColor(0, 0, 0);
        }
        this.startFadeOut(duration);
    };

    // 拡張フェードイン
    Game_Screen.prototype.startFadeInEx = function (duration, r, g, b) {
        if (r !== undefined && g !== undefined && b !== undefined) {
            this.setFadeColor(r, g, b);
        }
        // 引数が省略された場合、既存動作では色を変えないが、
        // ユーザー要望「省略時は黒(0,0,0)」に沿うため、呼び出し側で制御するか、
        // ここで強制的に変えるか。
        // startFadeInEx は引数が省略されたら変えないほうがライブラリとしては自然だが、
        // PluginCommand側で制御されているのでここでは引数チェック通りにする。
        this.startFadeIn(duration);
    };

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //-----------------------------------------------------------------------------

    // コマンド221: 画面のフェードアウト
    const _Game_Interpreter_command221 = Game_Interpreter.prototype.command221;
    Game_Interpreter.prototype.command221 = function () {
        if (!$gameMessage.isBusy()) {
            $gameScreen.setFadeColor(0, 0, 0);
            $gameScreen.startFadeOut(defaultFadeOutDuration);
            this.wait(defaultFadeOutDuration);
            return true;
        }
        return false;
    };

    // コマンド222: 画面のフェードイン
    const _Game_Interpreter_command222 = Game_Interpreter.prototype.command222;
    Game_Interpreter.prototype.command222 = function () {
        if (!$gameMessage.isBusy()) {
            $gameScreen.startFadeIn(defaultFadeInDuration);
            this.wait(defaultFadeInDuration);
            return true;
        }
        return false;
    };

    //-----------------------------------------------------------------------------
    // Spriteset_Base
    //-----------------------------------------------------------------------------

    const _Spriteset_Base_updateFade = Spriteset_Base.prototype.updateFade;
    Spriteset_Base.prototype.updateFade = function () {
        if (this._fadeSprite) {
            const color = $gameScreen.fadeColor();
            if (color) {
                // ScreenSprite.prototype.setColor(r, g, b)
                // setWhite(0)などの不要な呼び出しを除去し、正しく色を設定する
                this._fadeSprite.setColor(color[0], color[1], color[2]);
            }
        }
        _Spriteset_Base_updateFade.call(this);
    };

    //-----------------------------------------------------------------------------
    // Plugin Commands
    //-----------------------------------------------------------------------------

    PluginManager.registerCommand(pluginName, "StartFadeOut", function (args) {
        const duration = Number(args.duration || 60);
        // 空文字やundefinedの場合は0(黒)になるように変換
        const r = (args.colorR === undefined || args.colorR === "") ? 0 : Number(args.colorR);
        const g = (args.colorG === undefined || args.colorG === "") ? 0 : Number(args.colorG);
        const b = (args.colorB === undefined || args.colorB === "") ? 0 : Number(args.colorB);
        const wait = args.wait === "true";

        $gameScreen.startFadeOutEx(duration, r, g, b);
        if (wait) {
            this.wait(duration);
        }
    });

    PluginManager.registerCommand(pluginName, "StartFadeIn", function (args) {
        const duration = Number(args.duration || 60);
        const wait = args.wait === "true";

        let r, g, b;

        // 入力なし(undefined/空文字)の場合は0(黒)とする
        if (args.colorR === undefined || args.colorR === "") r = 0;
        else r = Number(args.colorR);

        if (args.colorG === undefined || args.colorG === "") g = 0;
        else g = Number(args.colorG);

        if (args.colorB === undefined || args.colorB === "") b = 0;
        else b = Number(args.colorB);

        // 数値として有効であれば指定色を使用してフェードイン開始
        // (デフォルトロジックにより、入力なしは0,0,0になる)
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            $gameScreen.startFadeInEx(duration, r, g, b);
        } else {
            // 万が一NaNの場合は色変更なし(安全策)
            $gameScreen.startFadeIn(duration);
        }

        if (wait) {
            this.wait(duration);
        }
    });

})();
