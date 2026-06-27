/*:
 * @target MZ
 * @plugindesc コモンイベントを台本としてヘルプ画面(画像+文章)を再生します。
 *
 * @command start
 * @text ヘルプシーン開始
 * @desc 指定したIDのヘルプを開始します。
 *
 * @arg helpId
 * @text ヘルプID
 * @desc 実行するヘルプのID（文字列など）。プラグインパラメータの設定と一致させてください。
 * @type string
 * @default 1
 *
 * @param helpList
 * @text ヘルプ設定リスト
 * @desc ヘルプIDとコモンイベントの紐付け設定です。
 * @type struct<HelpSetting>[]
 * @default []
 *
 * @param pageTurnSe
 * @text ページ送りSE
 * @desc ページ送り時に再生するSEの設定です。
 * @type struct<SE>
 * @default {"name":"Cursor2","volume":"90","pitch":"100","pan":"0"}
 *
 * @param openSe
 * @text 開始時SE
 * @desc シーン開始時に再生するSEの設定です。
 * @type struct<SE>
 * @default {"name":"Decision2","volume":"90","pitch":"100","pan":"0"}
 *
 * @param closeSe
 * @text 終了時SE
 * @desc シーン終了時に再生するSEの設定です。
 * @type struct<SE>
 * @default {"name":"Cancel2","volume":"90","pitch":"100","pan":"0"}
 *
 * @param helpWindowSettings
 * @text ウィンドウ設定
 * @desc メッセージウィンドウの表示設定です。
 * @type struct<WindowSettings>
 * @default {"fontSize":"26","lineCount":"5","width":"850","x":"-1","y":"-1","backOpacity":"240","frameOpacity":"0","backgroundType":"0","textOffsetX":"0"}
 *
 *
 * @help
 * ■ 概要
 * コモンイベントを「台本」として読み込み、画像付きのヘルプ画面を表示します。
 * マップ、メニューのどちらから呼び出しても、終了後は元の画面に戻ります。
 *
 * ■ 準備
 * 1. プロジェクトフォルダの img/pictures/ の中に「Help」というフォルダを作ってください。
 * (パス: img/pictures/Help/ )
 * 2. その中にヘルプ用の画像を入れます。
 *
 * ■ コモンイベントの書き方
 * コモンイベントに以下のコマンドを並べることで演出を作ります。
 *
 * 1. 【注釈】 @Img:ファイル名
 * 表示する画像を指定します。拡張子は不要です。
 * 例: @Img:Help1_001
 * ※画像は img/pictures/Help/ から読み込まれます。
 *
 * 2. 【文章の表示】
 * ヘルプのテキストを表示します。
 * 制御文字（\C[0]や\I[123]など）も使用可能です。
 * 文章が表示されている間、キー入力待ちになります。
 *
 * ■ 動作の流れ
 * コモンイベントの上から順に実行されます。
 * 画像指定(注釈) → 文章表示 → 決定キーで次の文章へ
 * イベントの最後まで到達する、またはキャンセルキーでシーンを閉じます。
 *
 *
 */

/*~struct~HelpSetting:
 * @param id
 * @text ヘルプID
 * @desc 呼び出し時に指定するIDです（例: 1, chapter1, tutorial など）
 * @type string
 * @default 1
 *
 * @param commonEventId
 * @text コモンイベント
 * @desc このヘルプで使用する台本となるコモンイベントを選択します。
 * @type common_event
 * @default 1
 */

/*~struct~SE:
 * @param name
 * @text ファイル名
 * @desc SEのファイル名です。
 * @type file
 * @dir audio/se
 * @default Cursor2
 *
 * @param volume
 * @text 音量
 * @desc SEの音量です。
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @desc SEのピッチです。
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text 位相
 * @desc SEの位相です。
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param textOffsetX
 * @text テキストX座標オフセット
 * @desc 左揃えテキストの開始X座標のオフセットです。
 * @type number
 * @min -9999
 * @default 0
 */

/*~struct~WindowSettings:
 * @param fontSize
 * @text フォントサイズ
 * @desc フォントサイズを指定します。
 * @type number
 * @default 26
 *
 * @param lineCount
 * @text 行数
 * @desc ウィンドウの行数を指定します。
 * @type number
 * @default 5
 *
 * @param width
 * @text 幅
 * @desc ウィンドウの幅を指定します。
 * @type number
 * @default 850
 *
 * @param x
 * @text X座標
 * @desc ウィンドウのX座標です。-1で中央揃えになります。
 * @type number
 * @min -1
 * @default -1
 *
 * @param y
 * @text Y座標
 * @desc ウィンドウのY座標です。-1で画面下部になります。
 * @type number
 * @min -1
 * @default -1
 *
 * @param backOpacity
 * @text 背景不透明度
 * @desc ウィンドウ背景の不透明度です(0-255)。
 * @type number
 * @min 0
 * @max 255
 * @default 240
 *
 * @param frameOpacity
 * @text 枠の不透明度
 * @desc ウィンドウ枠の不透明度です(0-255)。背景タイプが「ウィンドウ」の場合のみ有効です。
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param backgroundType
 * @text 背景タイプ
 * @desc ウィンドウの背景タイプです。
 * @type select
 * @option ウィンドウ
 * @value 0
 * @option 暗くする
 * @value 1
 * @option 透明
 * @value 2
 * @default 0
 *
 * @param textOffsetX
 * @text テキストX座標オフセット
 * @desc 左揃えテキストの開始X座標のオフセットです。
 * @type number
 * @min -9999
 * @default 0
 */

(() => {
    'use strict';


    const pluginName = 'ScenarioHelp';
    const parameters = PluginManager.parameters(pluginName);

    // パラメータのパース処理
    const parseStructList = (json) => {
        if (!json) return [];
        try {
            return JSON.parse(json).map(str => JSON.parse(str));
        } catch (e) {
            return [];
        }
    };
    const helpList = parseStructList(parameters['helpList']);

    const parseParamSe = (json) => {
        if (!json) return null;
        try {
            const data = JSON.parse(json);
            return {
                name: data.name || "",
                volume: Number(data.volume || 90),
                pitch: Number(data.pitch || 100),
                pan: Number(data.pan || 0)
            };
        } catch (e) {
            return null;
        }
    };
    const pageTurnSe = parseParamSe(parameters['pageTurnSe']);
    const openSe = parseParamSe(parameters['openSe']);
    const closeSe = parseParamSe(parameters['closeSe']);

    const parseParamWindow = (json) => {
        const defaults = { fontSize: 26, lineCount: 5, width: 850, x: -1, y: -1, backOpacity: 240, frameOpacity: 0, backgroundType: 0, textOffsetX: 0 };
        if (!json) return defaults;
        try {
            const data = JSON.parse(json);
            return {
                fontSize: Number(data.fontSize || 26),
                lineCount: Number(data.lineCount || 5),
                width: Number(data.width || 850),
                x: Number(data.x !== undefined ? data.x : -1),
                y: Number(data.y !== undefined ? data.y : -1),
                backOpacity: Number(data.backOpacity !== undefined ? data.backOpacity : 240),
                frameOpacity: Number(data.frameOpacity !== undefined ? data.frameOpacity : 0),
                backgroundType: Number(data.backgroundType !== undefined ? data.backgroundType : 0),
                textOffsetX: Number(data.textOffsetX || 0)
            };
        } catch (e) {
            return defaults;
        }
    };
    const windowSettings = parseParamWindow(parameters['helpWindowSettings']);

    //-----------------------------------------------------------------------------
    // Plugin Command
    //-----------------------------------------------------------------------------
    PluginManager.registerCommand(pluginName, 'start', args => {
        const helpId = args.helpId;
        const setting = helpList.find(item => item.id === helpId);

        if (setting) {
            const commonEventId = Number(setting.commonEventId);
            if (commonEventId > 0) {
                SceneManager.push(Scene_ScenarioHelp);
                SceneManager.prepareNextScene(commonEventId);
            } else {
                console.warn(`ScenarioHelp: Common Event ID is not set for HelpID ${helpId}.`);
            }
        } else {
            console.warn(`ScenarioHelp: HelpID ${helpId} not found in plugin parameters.`);
        }
    });

    //-----------------------------------------------------------------------------
    // Data Parser
    // コモンイベントを解析して「ページ（画像+文章）」のリストに変換するクラス
    //-----------------------------------------------------------------------------
    class ScenarioParser {
        constructor(commonEventId) {
            this._commonEventId = commonEventId;
            this._pages = [];
            this.parse();
        }

        parse() {
            const commonEvent = $dataCommonEvents[this._commonEventId];
            if (!commonEvent) return;

            const list = commonEvent.list;
            let currentImage = "";
            let currentText = "";
            let hasPendingText = false;

            for (const command of list) {
                // 注釈 (コード 108, 408)
                if (command.code === 108 || command.code === 408) {
                    const comment = command.parameters[0];
                    if (comment.startsWith("@Img:")) {
                        // 画像変更指示があった場合
                        // すでにテキストが溜まっていたら、前のページを確定させる
                        if (hasPendingText) {
                            this._pages.push({ image: currentImage, text: currentText });
                            currentText = "";
                            hasPendingText = false;
                        }
                        // 画像名を更新 (@Img:の後ろを取得してトリム)
                        currentImage = comment.substring(5).trim();
                    }
                }
                // 文章の表示 (コード 401)
                else if (command.code === 401) {
                    if (currentText !== "") {
                        currentText += "\n";
                    }
                    currentText += command.parameters[0];
                    hasPendingText = true;
                }
                // 文章の表示設定などは今回は無視（ウィンドウ位置等は固定またはデフォルト）
            }

            // 最後に残ったテキストがあればページとして追加
            if (hasPendingText) {
                this._pages.push({ image: currentImage, text: currentText });
            }
            // テキストはないが画像指定だけが最後にあった場合の考慮（一枚絵を見せて終わる場合）
            // 仕様として「決定キーで進む」が必要なので、空文字テキストのページとして追加しても良いが、
            // ここでは「文章がある場所＝止まる場所」として定義する。
        }

        getPages() {
            return this._pages;
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_ScenarioHelp
    //-----------------------------------------------------------------------------
    class Scene_ScenarioHelp extends Scene_MenuBase {
        prepare(commonEventId) {
            this._commonEventId = commonEventId;
        }

        create() {
            super.create();
            this.createHelpSprite();
            this.createMessageWindow();
            this.loadScenario();
            this.refreshPage();

            if (openSe && openSe.name) {
                AudioManager.playSe(openSe);
            }
        }

        // 背景などを隠さないよう不透明度調整（お好みで）
        createBackground() {
            super.createBackground();
            this._backgroundSprite.opacity = 255;
        }

        createHelpSprite() {
            this._helpSprite = new Sprite();
            this._helpSprite.anchor.x = 0.5;
            this._helpSprite.anchor.y = 0.5;
            this._helpSprite.x = Graphics.boxWidth / 2;
            this._helpSprite.y = Graphics.boxHeight / 2; // 画面中央
            this.addChild(this._helpSprite);
        }

        createMessageWindow() {
            // Rectの定義 (画面下部に表示)
            const rect = this.messageWindowRect();
            this._messageWindow = new Window_HelpMessage(rect);
            this._messageWindow.setHandler("ok", this.onPageOk.bind(this));
            this._messageWindow.setHandler("previous", this.onPagePrevious.bind(this));
            this._messageWindow.setHandler("cancel", this.popScene.bind(this)); // キャンセルで閉じる
            this.addChild(this._messageWindow);
        }

        messageWindowRect() {
            const ww = windowSettings.width;
            // 高さ計算: パディング上下 + (フォントサイズ + 行間) * 行数
            // Window_Base.prototype.lineHeight = fontSize + 8 が標準的だが、ここでは独自計算またはインスタンス生成後に調整
            // 簡易的に Window_Base の計算式を模倣
            const lineHeight = windowSettings.fontSize + 8; // 行間8pxと仮定
            const wh = (windowSettings.lineCount * lineHeight) + ($gameSystem.windowPadding() * 2);

            const wx = (windowSettings.x === -1) ? (Graphics.boxWidth - ww) / 2 : windowSettings.x;
            const wy = (windowSettings.y === -1) ? (Graphics.boxHeight - wh - 24) : windowSettings.y; // 下部マージン少し確保

            return new Rectangle(wx, wy, ww, wh);
        }

        loadScenario() {
            const parser = new ScenarioParser(this._commonEventId);
            this._pages = parser.getPages();
            this._pageIndex = 0;
        }

        refreshPage() {
            if (this._pageIndex < this._pages.length) {
                const page = this._pages[this._pageIndex];

                // 画像の更新
                if (page.image) {
                    // img/pictures/Help/ フォルダから読み込む独自仕様
                    const folder = "img/pictures/Help/";
                    const bitmap = ImageManager.loadBitmap(folder, page.image);
                    this._helpSprite.bitmap = bitmap;
                } else {
                    this._helpSprite.bitmap = null;
                }

                // テキストの表示
                this._messageWindow.setText(page.text);
                this._messageWindow.activate();
                this._messageWindow.visible = true; // ページ切り替え時に必ず表示する
            } else {
                // 全ページ終了したら閉じる
                this.popScene();
            }
        }

        onPagePrevious() {
            if (this._pageIndex > 0) {
                if (pageTurnSe && pageTurnSe.name) {
                    AudioManager.playSe(pageTurnSe);
                }
                this._pageIndex--;
                this.refreshPage();
            }
        }

        onPageOk() {
            if (this._pageIndex + 1 < this._pages.length) {
                if (pageTurnSe && pageTurnSe.name) {
                    AudioManager.playSe(pageTurnSe);
                }
                this._pageIndex++;
                this.refreshPage();
            } else {
                this.popScene();
            }
        }

        popScene() {
            if (closeSe && closeSe.name) {
                AudioManager.playSe(closeSe);
            }
            super.popScene();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_HelpMessage
    // Window_Baseを継承して、シンプルなテキスト表示と入力待ちを行うウィンドウ
    //-----------------------------------------------------------------------------
    class Window_HelpMessage extends Window_Base {
        constructor(rect) {
            super(rect);
            this._text = "";
            this._handlers = {};
            this._inputWait = 15;
            this.setBackgroundType(windowSettings.backgroundType);
            if (windowSettings.backgroundType === 0) {
                this.opacity = 255;
                this.backOpacity = windowSettings.backOpacity;
                this.frameOpacity = windowSettings.frameOpacity;
            }
        }

        standardFontSize() {
            return windowSettings.fontSize;
        }

        lineHeight() {
            return this.standardFontSize() + 8;
        }

        // フォント設定のリセット（サイズ適用のためオーバーライド推奨、またはdrawTextExが使う）
        resetFontSettings() {
            super.resetFontSettings();
            this.contents.fontSize = this.standardFontSize();
        }

        setHandler(symbol, method) {
            this._handlers[symbol] = method;
        }

        callHandler(symbol) {
            if (this._handlers[symbol]) {
                this._handlers[symbol]();
            }
        }

        setText(text) {
            this._text = text;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const x = windowSettings.textOffsetX || 0;
            // 行数から高さを計算して中央揃え
            const textState = this.createTextState(this._text, x, 0, 0);
            // 改行を含むため、行数をカウント
            const lines = this._text.split('\n').length;
            const textHeight = lines * this.lineHeight();
            const startY = Math.max(0, (this.contentsHeight() - textHeight) / 2);
            this.drawTextEx(this._text, x, startY);
        }

        update() {
            super.update();
            if (this._inputWait > 0) {
                this._inputWait--;
            }
            this.processHandling();
        }

        processHandling() {
            if (this.isOpen() && this.active && this._inputWait === 0) {
                if (Input.isTriggered("ok") || TouchInput.isTriggered() || Input.isTriggered("right") || Input.isTriggered("down")) {
                    this.callHandler("ok");
                } else if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
                    this.callHandler("cancel");
                } else if (Input.isTriggered("left") || Input.isTriggered("up")) {
                    this.callHandler("previous");
                } else if (Input.isTriggered("shift")) {
                    this.visible = !this.visible;
                }
            }
        }
    }

})();