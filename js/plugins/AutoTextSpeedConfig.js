/*:
 * @target MZ
 * @plugindesc オート文字送り速度を調整する画面を追加します。（レイアウト刷新版）

 * @param validVariableId
 * @text 保存する変数ID
 * @desc 設定値を保存する変数のIDです。
 * @default 99
 * @type variable
 *
 * @param sampleText
 * @text サンプルテキスト
 * @desc プレビューに表示するテキストです。制御文字も使用可能です。
 * @default この速さで文字が送られます。\nサンプルを表示中…
 * @type note
 *
 * @param minSpeedValue
 * @text 最小値
 * @desc 速度変数の最小値です。
 * @default 0
 * @type number
 *
 * @param maxSpeedValue
 * @text 最大値
 * @desc 速度変数の最大値です。
 * @default 10
 * @type number
 *
 * @param upButtonImage
 * @text 上ボタン画像
 * @desc 速度アップボタンの画像ファイル名です(img/system)。拡張子不要。
 * @default AutoText_Up
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param downButtonImage
 * @text 下ボタン画像
 * @desc 速度ダウンボタンの画像ファイル名です(img/system)。拡張子不要。
 * @default AutoText_Down
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param buttonClickSE
 * @text ボタンクリックSE
 * @desc ボタンクリック時の効果音ファイル名です(audio/se)。
 * @default Cursor1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param buttonHoverSE
 * @text ボタンホバーSE
 * @desc ボタンホバー時の効果音ファイル名です(audio/se)。
 * @default Cursor2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @command OpenAutoTextConfig
 * @text 設定画面を開く
 * @desc オート文字送り速度調整画面を開きます。
 *
 * @help
 * オート待機時間を調整する専用画面を提供します。
 *
 * 【仕様】
 * ・変数ID（デフォルト99）に 0～10 の値を保存。
 * ・設定変更は矢印キーまたは画面上のボタンで行います。
 * ・戻るボタン（標準キャンセルキー）で保存して終了します。
 *
 * 【画像の準備】
 * img/system フォルダに以下の画像を用意してください。
 * ・AutoText_Up.png (上矢印)
 * ・AutoText_Down.png (下矢印)
 */

(() => {
    'use strict';

    const pluginName = 'AutoTextSpeedConfig';
    const parameters = PluginManager.parameters(pluginName);
    const validVariableId = Number(parameters['validVariableId'] || 99);
    const rawSampleText = String(parameters['sampleText'] || "この速さで文字が送られます。\\nサンプルを表示中…");
    const minSpeedValue = Number(parameters['minSpeedValue'] || 0);
    const maxSpeedValue = Number(parameters['maxSpeedValue'] || 10);

    const upButtonImage = String(parameters['upButtonImage'] || "AutoText_Up");
    const downButtonImage = String(parameters['downButtonImage'] || "AutoText_Down");
    const buttonClickSE = String(parameters['buttonClickSE'] || "Cursor1");
    const buttonHoverSE = String(parameters['buttonHoverSE'] || "Cursor2");

    //-----------------------------------------------------------------------------
    // Plugin Command
    //-----------------------------------------------------------------------------
    PluginManager.registerCommand(pluginName, 'OpenAutoTextConfig', () => {
        SceneManager.push(Scene_AutoTextConfig);
    });

    //-----------------------------------------------------------------------------
    // Helper: Play SE
    //-----------------------------------------------------------------------------
    function playClickSE() {
        if (buttonClickSE) {
            AudioManager.playSe({ name: buttonClickSE, volume: 90, pitch: 100, pan: 0 });
        } else {
            SoundManager.playCursor();
        }
    }

    //-----------------------------------------------------------------------------
    // Sprite_ConfigButton
    //-----------------------------------------------------------------------------
    class Sprite_ConfigButton extends Sprite_Clickable {
        initialize(imageName, clickHandler) {
            super.initialize();
            this._imageName = imageName;
            this._clickHandler = clickHandler;
            this._hovered = false;
            this._pressed = false;
            this._baseScale = 0.45; // 少し小さく
            this._originalScale = new Point(this._baseScale, this._baseScale);
            this.loadButtonImage();
        }

        loadButtonImage() {
            this.bitmap = ImageManager.loadSystem(this._imageName);
        }

        update() {
            super.update();
            this.updateHover();
            this.updateScale();
        }

        updateHover() {
            if (this.isBeingTouched()) {
                if (!this._hovered) {
                    this._hovered = true;
                    this.onMouseEnter();
                }
            } else {
                if (this._hovered) {
                    this._hovered = false;
                    this.onMouseExit();
                }
            }
        }

        onMouseEnter() {
            if (buttonHoverSE) {
                AudioManager.playSe({ name: buttonHoverSE, volume: 90, pitch: 100, pan: 0 });
            }
            this.setBlendColor([255, 255, 255, 64]);
        }

        onMouseExit() {
            this.setBlendColor([0, 0, 0, 0]);
        }

        onPress() {
            this._pressed = true;
        }

        onClick() {
            playClickSE();
            if (this._clickHandler) {
                this._clickHandler();
            }
            this._pressed = false;
        }

        updateScale() {
            const targetScale = this._baseScale * (this.isPressed() ? 0.90 : 1.0);
            this.scale.x = targetScale;
            this.scale.y = targetScale;
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_AutoTextConfig
    //-----------------------------------------------------------------------------
    class Scene_AutoTextConfig extends Scene_MenuBase {
        create() {
            super.create();
            // createHelpWindowは削除
            this.createPreviewWindow();
            this.createSettingsWindow();
            this.createGaugeWindow();
            this.createInfoWindow();
            this.createCustomButtons();
        }

        update() {
            super.update();
            if (this._previewWindow && this._infoWindow) {
                const timerInfo = this._previewWindow.getTimerInfo();
                this._infoWindow.updateCountdown(timerInfo.current, timerInfo.total, timerInfo.showing);
            }
        }

        createPreviewWindow() {
            const rect = this.previewWindowRect();
            this._previewWindow = new Window_AutoTextPreview(rect);
            this.addWindow(this._previewWindow);
        }

        previewWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            // 高さ: 4行分確保
            const wh = this.calcWindowHeight(4, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createSettingsWindow() {
            const rect = this.settingsWindowRect();
            this._settingsWindow = new Window_AutoTextSettings(rect);
            this._settingsWindow.setHandler('ok', this.popScene.bind(this));
            this._settingsWindow.setHandler('cancel', this.popScene.bind(this));
            this._settingsWindow.setChangeHandler(this.onSettingChange.bind(this));
            this.addWindow(this._settingsWindow);
        }

        settingsWindowRect() {
            // ヘルプテキストを含むため大型化
            const ww = 500;
            const wh = 300; // 画面内に収めるため高さを少し減らす

            const wx = (Graphics.boxWidth - ww) / 2; // 中央揃え

            // Previewの下、スペース (30pxさらに下に移動: 80->110)
            const gap = 110;
            const wy = this._previewWindow.y + this._previewWindow.height + gap;

            return new Rectangle(wx, wy, ww, wh);
        }

        createGaugeWindow() {
            const rect = this.gaugeWindowRect();
            this._gaugeWindow = new Window_AutoTextGauge(rect);
            this.addWindow(this._gaugeWindow);
        }

        gaugeWindowRect() {
            // Settingsの左側 150pxの位置
            const ww = 60;
            // Settingsの左端から150px
            const gap = 150;
            const wx = this._settingsWindow.x - gap;

            // ただしこれだと画面外に出る可能性があるため、
            // Settings.x (158) - 150 = 8. ギリギリ入る。

            const wy = this._settingsWindow.y;
            const wh = this._settingsWindow.height;
            return new Rectangle(wx, wy, ww, wh);
        }

        createInfoWindow() {
            const rect = this.infoWindowRect();
            this._infoWindow = new Window_AutoTextInfo(rect);
            this.addWindow(this._infoWindow);
            this.refreshInfo();
        }

        infoWindowRect() {
            // Settingsの右側
            const gap = 20;
            const wx = this._settingsWindow.x + this._settingsWindow.width + gap;

            // 前回の修正前の位置に戻す (垂直中央揃え・高さ拡張)
            const heightDiff = 60;
            const wy = this._settingsWindow.y - (heightDiff / 2);

            const availableWidth = Graphics.boxWidth - wx - 20;
            const ww = Math.min(320, availableWidth);
            const wh = this._settingsWindow.height + heightDiff;

            return new Rectangle(wx, wy, ww, wh);
        }

        createCustomButtons() {
            // ボタンは設定ウィンドウの中央に配置
            // ただしテキストと重ならないよう、ウィンドウの外側上下に配置するのが良いか？
            // 「上下キーを押す...」とあるので、視覚的にも上下にある方が自然。

            const blockCenterX = this._settingsWindow.x + (this._settingsWindow.width / 2);

            // 上ボタン (Settingsの上)
            this._upButton = new Sprite_ConfigButton(upButtonImage, () => {
                this._settingsWindow.cursorUp();
            });
            this._upButton.anchor.x = 0.5;
            this._upButton.anchor.y = 1.0;

            this._upButton.x = blockCenterX;
            this._upButton.y = this._settingsWindow.y - 15;
            this.addChild(this._upButton);

            // 下ボタン (Settingsの下)
            this._downButton = new Sprite_ConfigButton(downButtonImage, () => {
                this._settingsWindow.cursorDown();
            });
            this._downButton.anchor.x = 0.5;
            this._downButton.anchor.y = 0;
            this._downButton.x = blockCenterX;
            this._downButton.y = this._settingsWindow.y + this._settingsWindow.height + 15;
            this.addChild(this._downButton);
        }

        onSettingChange() {
            this.refreshInfo();
            this._gaugeWindow.refresh();
            this._previewWindow.updateSpeed();
        }

        refreshInfo() {
            this._infoWindow.refreshStaticInfo();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_AutoTextSettings
    //-----------------------------------------------------------------------------
    class Window_AutoTextSettings extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this.setBackgroundType(1); // Dimmer (暗い背景、枠なし)
            this.activate();
            this.select(0);
            this._changeHandler = null;
            this.refresh();
        }

        setChangeHandler(method) {
            this._changeHandler = method;
        }

        maxItems() {
            return 1;
        }

        itemHeight() {
            return this.innerHeight;
        }

        drawItemBackground(index) {
            // なし
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            const value = $gameVariables.value(validVariableId);

            this.contents.clear();

            const lh = this.lineHeight();
            let y = 20; // 30 -> 20 (高さを減らした分調整)

            // 1行目: "現在の速度"
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Current Speed", rect.x, y, rect.width, 'center');
            this.resetTextColor();

            // 2行目までのギャップを広げる (5 -> 15) 重なり防止
            y += lh + 15;

            // 2行目: 変数数値 (大きく)
            this.contents.fontSize = 80;
            const numberHeight = 84;
            this.drawText(`${value}`, rect.x, y, rect.width, 'center');

            // 3行目以降へのギャップ
            y += numberHeight + 10;

            // 3行目以降: 操作説明 (トーンダウン)
            this.contents.fontSize = 22;
            this.changeTextColor(ColorManager.textColor(7));

            const instructionText = "Please press the up/down keys, or\nclick the cursor buttons to\nadjust the speed.";
            const lines = instructionText.split('\n');

            for (const line of lines) {
                this.drawText(line, rect.x, y, rect.width, 'center');
                y += 26;
            }
            this.resetFontSettings();
        }

        cursorDown(wrap) {
            const value = $gameVariables.value(validVariableId);
            if (value > minSpeedValue) {
                $gameVariables.setValue(validVariableId, value - 1);
                this.refresh();
                playClickSE();
                if (this._changeHandler) this._changeHandler();
            }
        }

        cursorUp(wrap) {
            const value = $gameVariables.value(validVariableId);
            if (value < maxSpeedValue) {
                $gameVariables.setValue(validVariableId, value + 1);
                this.refresh();
                playClickSE();
                if (this._changeHandler) this._changeHandler();
            }
        }

        processCursorMove() {
            if (this.isCursorMovable()) {
                if (Input.isRepeated('down') || Input.isRepeated('left')) {
                    this.cursorDown();
                }
                if (Input.isRepeated('up') || Input.isRepeated('right')) {
                    this.cursorUp();
                }
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_AutoTextGauge
    //-----------------------------------------------------------------------------
    class Window_AutoTextGauge extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.setBackgroundType(1); // Dimmer (Settingsに合わせてDim)
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const value = $gameVariables.value(validVariableId);
            const rect = new Rectangle(0, 0, this.innerWidth, this.innerHeight);

            // ゲージ背景
            const gaugeX = (rect.width - 24) / 2;
            const gaugeY = 10;
            const gaugeWidth = 24;
            const gaugeHeight = rect.height - 20;

            this.contents.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight, ColorManager.gaugeBackColor());

            // ゲージ中身
            const range = maxSpeedValue - minSpeedValue;
            const current = value - minSpeedValue;
            const rate = range > 0 ? current / range : 0;

            const fillH = Math.floor(gaugeHeight * rate);
            const fillY = gaugeY + gaugeHeight - fillH;

            this.contents.fillRect(gaugeX, fillY, gaugeWidth, fillH, ColorManager.normalColor());
        }
    }

    //-----------------------------------------------------------------------------
    // Window_AutoTextInfo
    //-----------------------------------------------------------------------------
    class Window_AutoTextInfo extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.setBackgroundType(1); // Dimmer
            this._staticSeconds = "0.0";
            this._textLength = 0;
        }

        refreshStaticInfo() {
            const value = $gameVariables.value(validVariableId);
            const sampleText = rawSampleText.replace(/\\n/g, '\n');
            const length = sampleText.replace(/\n/g, '').length;
            const frames = Math.floor(length * (Math.abs(maxSpeedValue - value) * 2 + 1) * 0.5);

            this._staticSeconds = (frames / 60).toFixed(1);
            this._textLength = length;
        }

        updateCountdown(currentFrames, totalFrames, showing) {
            this.contents.clear();

            const lh = this.lineHeight();

            const h1 = lh;
            const h2 = 40;
            const h3 = 35;
            const h4 = lh;

            const totalContentHeight = h1 + h2 + h3 + h4;
            let y = (this.innerHeight - totalContentHeight) / 2;

            // 静的情報の描画
            this.drawText("Current wait time", 0, y, this.innerWidth, 'center');
            y += h1;

            this.contents.fontSize = 32;
            this.drawText(`Approx. ${this._staticSeconds} sec`, 0, y, this.innerWidth, 'center');
            this.contents.fontSize = $gameSystem.mainFontSize();
            y += h2;

            // 文字数
            this.contents.fontSize = 20;
            this.drawText(`(Text Length: ${this._textLength} characters)`, 0, y, this.innerWidth, 'center');
            this.contents.fontSize = $gameSystem.mainFontSize();
            y += h3;

            // カウントダウン
            if (showing && totalFrames > 0) {
                const remaining = Math.max(0, totalFrames - currentFrames);
                const remainSec = (remaining / 60).toFixed(1);

                this.changeTextColor(ColorManager.systemColor());
                this.drawText("Next:", 0, y, this.innerWidth / 2, 'right');
                this.resetTextColor();
                this.drawText(` ${remainSec}s`, this.innerWidth / 2, y, this.innerWidth / 2, 'left');
            } else {
                this.changeTextColor(ColorManager.textColor(7));
                this.drawText("Displaying...", 0, y, this.innerWidth, 'center');
                this.resetTextColor();
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_AutoTextPreview
    //-----------------------------------------------------------------------------
    class Window_AutoTextPreview extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._timer = 0;
            this._showing = true;
            this._waitFrames = 0;
            this.calculateWaitFrames();
            this.refresh();
        }

        getTimerInfo() {
            return {
                current: this._timer,
                total: this._waitFrames,
                showing: this._showing
            };
        }

        calculateWaitFrames() {
            const value = $gameVariables.value(validVariableId);
            const sampleText = rawSampleText.replace(/\\n/g, '\n');
            const length = sampleText.replace(/\n/g, '').length;
            this._waitFrames = Math.floor(length * (Math.abs(maxSpeedValue - value) * 2 + 1) * 0.5);
        }

        updateSpeed() {
            this.calculateWaitFrames();
            this._showing = true;
            this._timer = 0;
            this.refresh();
        }

        update() {
            super.update();
            this._timer++;

            if (this._showing) {
                if (this._timer >= this._waitFrames) {
                    this._showing = false;
                    this._timer = 0;
                    this.refresh();
                }
            } else {
                if (this._timer >= 30) {
                    this._showing = true;
                    this._timer = 0;
                    this.refresh();
                }
            }
        }

        refresh() {
            this.contents.clear();
            if (this._showing) {
                const sampleText = rawSampleText.replace(/\\n/g, '\n');
                this.drawTextEx(sampleText, 0, 0, this.innerWidth);
            }
        }
    }

})();
