/*:
 * @plugindesc タイトル画面をカスタム画像コマンドに置き換えます。
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @command SetTitleProgressFlag
 * @text 進行状況フラグ設定
 * @desc タイトル画面切り替え用の進行状況フラグを設定します。
 *
 * @arg ProgressState
 * @text 進行状況フラグの状態
 * @desc タイトル画面の進行状況フラグをONにするかOFFにするか。 (true/false)
 * @type boolean
 * @default false
 *
 * @orderAfter PluginCommonBase
 *
 * @param newGameX
 * @text ニューゲーム X座標
 * @desc 「ニューゲーム」コマンド画像の左上のX座標を指定します。
 * @type number
 * @default 690
 *
 * @param newGameY
 * @text ニューゲーム Y座標
 * @desc 「ニューゲーム」コマンド画像の左上のY座標を指定します。
 * @type number
 * @default 545
 *
 * @param progressFlagKey
 * @text 進行状況フラグキー
 * @desc DataManagerで進行状況を保存する際のキー名。
 * @type string
 * @default titleProgressFlag
 *
 * @param progressTitleBackground
 * @text 切り替え後 タイトル背景画像
 * @desc 進行状況フラグがONの時に表示する背景画像 (img/pictures/)。
 * @type file
 * @dir img/pictures/
 * @require 1
 * @parent progressFlagKey
 *
 * @param titleBackground
 * @text タイトル背景画像
 * @desc タイトル画面の背景画像ファイル名 (img/titles1/ に配置)。
 * @type file
 * @dir img/titles1/
 * @require 1
 *
 * @param progressTitleBgm
 * @text 切り替え後 タイトルBGM
 * @desc 進行状況フラグがONの時に再生するBGM。
 * @type file
 * @dir audio/bgm/
 * @require 1
 * @parent progressFlagKey
 *
 * @param progressNewGameX
 * @text 切り替え後 ニューゲーム X座標
 * @desc 進行状況フラグがONの時の「ニューゲーム」コマンド画像の左上のX座標。
 * @type number
 * @default 690
 * @parent progressFlagKey
 *
 * @param progressNewGameY
 * @text 切り替え後 ニューゲーム Y座標
 * @desc 進行状況フラグがONの時の「ニューゲーム」コマンド画像の左上のY座標。
 * @type number
 * @default 545
 * @parent progressFlagKey
 *
 * @param progressNewGameX
 * @text 切り替え後 ニューゲーム X座標
 * @desc 進行状況フラグがONの時の「ニューゲーム」コマンド画像の左上のX座標。
 * @type number
 * @default 690
 * @parent progressFlagKey
 *
 * @param progressNewGameY
 * @text 切り替え後 ニューゲーム Y座標
 * @desc 進行状況フラグがONの時の「ニューゲーム」コマンド画像の左上のY座標。
 * @type number
 * @default 545
 * @parent progressFlagKey
 *
 * @param titleBgm
 * @text タイトルBGM
 * @desc タイトル画面で再生するBGMファイルを選択します。
 * @type file
 * @dir audio/bgm/
 * @require 1
 *
 * @param cursorImage
 * @text カーソル画像
 * @desc 選択項目を示すカーソル画像ファイル名 (img/pictures/ に配置)。
 * @type file
 * @dir img/pictures/
 * @default Title_Cursor
 *
 * @help Titlereplace.js
 *
 * このプラグインは、RPGツクールMZのタイトル画面を、
 * 画像を使用したカスタムコマンドに置き換えます。
 *
 * プラグインパラメータで、「ニューゲーム」コマンドの表示位置や
 * タイトルBGM、カーソル画像を指定できます。
 *
 * 「コンティニュー」「オプション」コマンドは、
 * 「ニューゲーム」からの相対位置で自動的に配置されます。
 *
 * カーソル画像ファイルは img/pictures/ フォルダに配置してください。
 * (デフォルト: Title_Cursor.png)
 *
 * 利用規約:
 *  特にありません。自由にお使いください。
 */

(() => {
  const script = document.currentScript;
  const params = PluginManagerEx.createParameter(script);
  const pluginName = script.src.split('/').pop().replace(/\.js$/, '');



  const TITLE_COMMANDS_DATA = [
    { name: "newGame", image: "Title_NewGame", handler: commandNewGame, enabled: () => true },
    { name: "continue", image: "Title_Continue", handler: commandContinue, enabled: () => DataManager.isGlobalInfoLoaded() && DataManager.isAnySavefileExists() },
    { name: "options", image: "Title_Options", handler: commandOptions, enabled: () => true }
  ];

  const NEW_GAME_X = params.newGameX || 690;
  const NEW_GAME_Y = params.newGameY || 545;
  const PROGRESS_NEW_GAME_X = params.progressNewGameX !== undefined ? params.progressNewGameX : 690;
  const PROGRESS_NEW_GAME_Y = params.progressNewGameY !== undefined ? params.progressNewGameY : 545;

  const OFFSET_X = 100;
  const OFFSET_Y = 60;
  const CURSOR_OFFSET_X = -30;
  const FADE_IN_FRAMES = 60;
  const BG_FADE_IN_FRAMES = FADE_IN_FRAMES - 5;
  const FADE_IN_OFFSET_X = 50;
  const CURSOR_FADE_FRAMES = 24;
  const NON_SELECT_TONE = [-80, -80, -80, 0]; // グレーアウトの色調
  const SELECT_TONE = [0, 0, 0, 0];       // 通常の色調
  const CURSOR_IMAGE_NAME = params.cursorImage || "Title_Cursor";
  const PROGRESS_FLAG_KEY = params.progressFlagKey || "titleProgressFlag";
  // カーソルアニメーション設定
  const CURSOR_ANIMATION_SPEED = 0.05; // アニメーションの速度
  const CURSOR_ANIMATION_RANGE = 5;    // 左右に振れる幅(px)

  //=============================================================================
  // LocalStorage functions for Progress Flag
  //=============================================================================
  function getTitleProgressFlag() {
    // localStorageから値を取得し、booleanに変換 (存在しない場合はfalse)
    const value = localStorage.getItem(PROGRESS_FLAG_KEY);
    return value === 'true';
  }

  function setTitleProgressFlagLocalStorage(value) {
    // boolean値を文字列としてlocalStorageに保存
    try {
      const stringValue = value ? 'true' : 'false';
      // console.log(`[${pluginName}] Attempting to save progress flag to localStorage (${PROGRESS_FLAG_KEY}): ${stringValue}`);
      localStorage.setItem(PROGRESS_FLAG_KEY, stringValue);
      // console.log(`[${pluginName}] Progress flag saved to localStorage.`);
    } catch (e) {
      // console.error(`[${pluginName}] Error saving progress flag to localStorage:`, e);
    }
  }
  //=============================================================================
  // SceneManager modifications (for fade-in control)
  //=============================================================================

  // Scene_Boot からの初回起動時
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    // ★ Scene_Boot 内での globalInfo の明示的なロード処理は削除。
    // コアスクリプトの DataManager.loadDatabase -> loadGlobalInfo に任せる。
    // isReady() で待機するようにする。

    _Scene_Boot_start.apply(this, arguments);
    // 通常起動時はタイトルフェードインフラグを立てる (テストプレイなどは除く)
    if (!Utils.isOptionValid("test") && !DataManager.isBattleTest() && !DataManager.isEventTest()) {
      SceneManager._performFadeIn = true;
    }

    // ★ セーブデータが一つも存在しない場合、進行状況フラグをリセットする
    if (!DataManager.isAnySavefileExists()) {
      // console.log(`[${pluginName}] No save files found. Resetting progress flag.`);
      localStorage.removeItem(PROGRESS_FLAG_KEY);
    }
  };

  // Scene_Map からタイトルへ戻る場合
  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    _Scene_Map_terminate.apply(this, arguments);
    // 次のシーンがタイトルならフェードインフラグを立てる
    if (SceneManager.isNextScene(Scene_Title)) {
      SceneManager._performFadeIn = true;
    }
  };

  // ゲーム終了からタイトルへ戻る場合
  const _Scene_GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
  Scene_GameEnd.prototype.commandToTitle = function () {
    SceneManager._performFadeIn = true; // フェードインフラグを立てる
    _Scene_GameEnd_commandToTitle.apply(this, arguments);
    // ※ Scene_GameOver.prototype.gotoTitle も同様にフックが必要な場合があるが、
    //   通常は Scene_GameEnd を経由するため、多くの場合これでカバーできる。
  };

  //=============================================================================
  // Plugin Command
  //=============================================================================
  PluginManager.registerCommand(pluginName, "SetTitleProgressFlag", args => {
    const state = PluginManagerEx.convertVariables(args.ProgressState);
    setTitleProgressFlagLocalStorage(!!state); // booleanに変換して設定
  });

  // プラグインコマンドの引数定義
  /*~struct~SetTitleProgressFlag:
  @param ProgressState
  @text 進行状況フラグの状態
  @desc タイトル画面の進行状況フラグをONにするかOFFにするか。 (true/false)
  @type boolean
  @default false
  */

  //=============================================================================
  // Scene_CustomTitle
  //=============================================================================
  class Scene_CustomTitle extends Scene_Base {
    static _lastSelectedIndex = 0; // ★ 最後に選択されたインデックスを記憶

    create() {
      super.create();
      this._sprites = [];
      this._commandEnabled = []; // 各コマンドが有効かどうかのフラグ
      this._selectedIndex = 0;
      this._ready = false;
      this._cursorSprite = null; // カーソルスプライト
      this._processingCommand = false; // コマンド処理中フラグを追加
      this._cursorFadeCount = 0; // ★ カーソルフェードカウンター追加
      this._cursorFadeStarted = false; // ★ カーソルフェード開始フラグ
      this._isMouseCursorVisible = true; // ★ マウスカーソル表示状態フラグ
      this._lastTouchX = -1; // ★ 前回のマウスX座標
      this._lastTouchY = -1; // ★ 前回のマウスY座標
      this._mouseMoved = false; // ★ マウス移動フラグ
      this.createBackground();
      this.createCommands();
      this.createCursor(); // カーソルを作成
      this.playTitleMusic(); // BGM再生
    }

    start() {
      // タイトルに入ったタイミングでボイス(SE扱い)を全停止し、
      // SimpleVoice側で保持しているBGM調整状態をリセットする。
      // 自動処理経由で PLAY_VOICE_PERSISTENT / PLAY_BGS_FROM_EVENT を流したまま
      // タイトルに戻った場合にBGSが鳴り続ける問題への対策。
      if (AudioManager.stopVoice) {
        AudioManager.stopVoice(null, null);
      }
      if (AudioManager.stopAllPositionalVoices) {
        AudioManager.stopAllPositionalVoices();
      }
      if (AudioManager.decreaseBgmAdjustmentRequest) {
        // 全リクエストを強制的に0に戻す
        AudioManager._bgmAdjustmentRequestCount = 0;
        AudioManager._originalBgmVolume = null;
      }

      this._processingCommand = false; // コマンド処理中フラグをリセット
      this._lastTouchX = TouchInput.x; // ★ シーン開始時の座標を記録
      this._lastTouchY = TouchInput.y;
      this._mouseMoved = false; // ★ シーン開始時に移動フラグをリセット
      this._isMouseCursorVisible = true; // ★ シーン開始時にカーソル表示をリセット
      // console.log("[Titlereplace] start() called.");
      // console.log("[Titlereplace] SceneManager._performFadeIn:", SceneManager._performFadeIn);

      // 「タイトル演出をスキップする」判定
      // オプション(Scene_Options)やロード(Scene_Load)から戻ってきた場合のみスキップする。
      // それ以外（初回起動、マップやコンフィグなどから戻る）はフェードイン演出を入れる。
      const prevClass = SceneManager._previousClass;
      // Scene_Load や Scene_Options からの戻りかどうかを判定
      const isReturnFromMenu = (prevClass === Scene_Options || prevClass === Scene_Load);

      const shouldFadeIn = isReturnFromMenu ? false : (SceneManager._performFadeIn ?? true);
      if (shouldFadeIn) {
        // 初回起動またはマップから戻ってきた場合 -> フェードイン実行
        // console.log("[Titlereplace] Starting with fade-in.");
        SceneManager.clearStack(); // スタッククリア
        // 初期化処理を遅延実行 (コマンド有効化、初期選択など)
        // console.log("[Titlereplace] Setting timeout for deferInitialization().");
        setTimeout(this.deferInitialization.bind(this), 0);
        // フェードインアニメーション開始
        // console.log("[Titlereplace] Calling super.start() for fade-in animation.");
        super.start(); // Scene_Base.start (フェードイン処理を含む)
      } else {
        // オプション画面やロード画面から戻ってきた場合 -> フェードインスキップ
        // console.log("[Titlereplace] Returning from Options/Load. Skipping fade-in.");
        super.start(); // Scene_Base.start (シーンアクティブ化など)
        this.skipFadeInAndSetup(); // 要素を即時表示・操作可能に
      }
      this.playTitleMusic(); // BGMは常に再生/再開

      // フラグをリセット（未定義に戻すことで次回はデフォルト挙動=フェードイン）
      SceneManager._performFadeIn = undefined;

      // console.log("[Titlereplace] start() finished.");
    }

    // フェードインをスキップして即座に表示・操作可能にする
    skipFadeInAndSetup() {
      // console.log("[Titlereplace] skipFadeInAndSetup() called.");
      // 背景を即表示
      // console.log(`[${pluginName}][skipFadeInAndSetup] Checking flag (${PROGRESS_FLAG_KEY}):`, getTitleProgressFlag());
      if (this._backSprite) {
        this._backSprite.alpha = 1;
      }

      // ★ 座標情報の取得
      const pos = this.getNewGamePosition();
      const baseX = pos.x;
      const baseY = pos.y;

      // コマンドを最終位置・アルファに設定
      this._sprites.forEach((sprite, i) => {
        const targetX = baseX + OFFSET_X * i;
        const targetY = baseY + OFFSET_Y * i;
        // ★ 背景より先にコマンドの位置を設定しないと、依存関係がある場合に問題が起きうるため、背景設定後に移動
        sprite.x = targetX;
        sprite.y = targetY; // Y座標も更新が必要（もしYも変わるなら）
        sprite.alpha = 1;
      });

      // コマンド有効状態を即時更新 (deferInitializationから移植)
      this._commandEnabled = [];
      this._sprites.forEach(sprite => {
        if (sprite.enabledFunc) {
          try {
            this._commandEnabled[sprite.index] = sprite.enabledFunc();
          } catch (e) {
            // console.error("Error checking command enablement for index", sprite.index, e);
            this._commandEnabled[sprite.index] = false;
          }
        } else {
          this._commandEnabled[sprite.index] = true;
        }
      });

      // 最後に選択されたインデックスを復元 (deferInitializationから移植)
      let initialIndex = Scene_CustomTitle._lastSelectedIndex;
      const continueCommandIndex = TITLE_COMMANDS_DATA.findIndex(cmd => cmd.name === "continue");

      // ★ オプション画面からの戻り時は、強制的にコンティニューを選択しないようにする
      const isReturnFromOptions = SceneManager._previousClass === Scene_Options;

      if (!isReturnFromOptions && DataManager.isAnySavefileExists() && continueCommandIndex !== -1 && this._commandEnabled[continueCommandIndex]) {
        initialIndex = continueCommandIndex;
        // console.log(`[${pluginName}][skipFadeInAndSetup] Save data exists, setting initial index to Continue: ${initialIndex}`);
      } else {
        // セーブがない、またはコンティニューが無効な場合、前回選択か最初の有効なものを探す
        if (initialIndex < 0 || initialIndex >= this._commandEnabled.length || !this._commandEnabled[initialIndex]) {
          initialIndex = this.findFirstEnabledCommand(0);
          if (initialIndex < 0) initialIndex = 0; // 有効なものがなければ0番目
          // console.log(`[${pluginName}][skipFadeInAndSetup] No save or Continue disabled, finding first enabled: ${initialIndex}`);
        } else {
          // console.log(`[${pluginName}][skipFadeInAndSetup] Using last selected index: ${initialIndex}`);
        }
      }
      this._selectedIndex = initialIndex;
      this.selectCommand(this._selectedIndex, true); // SEなしで選択状態更新

      // カーソルを即時表示・位置更新
      if (this._cursorSprite) {
        this.updateCursorPosition();
        this._cursorSprite.alpha = 1;
        this._cursorFadeCount = CURSOR_FADE_FRAMES; // フェード完了状態
        this._cursorFadeStarted = true; // フェード開始済み状態
      }

      // 状態を即時完了に
      this._fadeCount = FADE_IN_FRAMES; // アニメーション完了状態
      this._ready = true; // 操作可能状態
      this._processingCommand = false; // コマンド受付可能に
      // console.log("[Titlereplace] skipFadeInAndSetup - Setting _cursorFadeStarted = true.");
    }

    // 初期化処理（有効状態チェック、初期選択など）を遅延実行
    deferInitialization() {
      // console.log(`[${pluginName}][deferInitialization] Checking flag (${PROGRESS_FLAG_KEY}):`, getTitleProgressFlag());
      // console.log("[Titlereplace] deferInitialization() called (for fade-in).");
      // コマンドの有効状態を確定させる
      this._commandEnabled = [];
      this._sprites.forEach(sprite => {
        if (sprite.enabledFunc) {
          try {
            this._commandEnabled[sprite.index] = sprite.enabledFunc();
          } catch (e) {
            // console.error("Error checking command enablement for index", sprite.index, e);
            this._commandEnabled[sprite.index] = false;
          }
        } else {
          this._commandEnabled[sprite.index] = true;
        }
      });

      // 最後に選択されたインデックスを復元 (deferInitializationから移植)
      let initialIndex = Scene_CustomTitle._lastSelectedIndex;
      const continueCommandIndex = TITLE_COMMANDS_DATA.findIndex(cmd => cmd.name === "continue");

      // ★ オプション画面からの戻り時は、強制的にコンティニューを選択しないようにする
      const isReturnFromOptions = SceneManager._previousClass === Scene_Options;

      if (!isReturnFromOptions && DataManager.isAnySavefileExists() && continueCommandIndex !== -1 && this._commandEnabled[continueCommandIndex]) {
        initialIndex = continueCommandIndex;
        // console.log(`[${pluginName}][deferInitialization] Save data exists, setting initial index to Continue: ${initialIndex}`);
      } else {
        // セーブがない、またはコンティニューが無効な場合、前回選択か最初の有効なものを探す
        if (initialIndex < 0 || initialIndex >= this._commandEnabled.length || !this._commandEnabled[initialIndex]) {
          initialIndex = this.findFirstEnabledCommand(0);
          if (initialIndex < 0) initialIndex = 0; // 有効なものがなければ0番目
          // console.log(`[${pluginName}][deferInitialization] No save or Continue disabled, finding first enabled: ${initialIndex}`);
        } else {
          // console.log(`[${pluginName}][deferInitialization] Using last selected index: ${initialIndex}`);
        }
      }
      this._selectedIndex = initialIndex;
      this.selectCommand(this._selectedIndex, true); // SEなしで選択状態更新

      // カーソルを即時表示・位置更新
      if (this._cursorSprite) {
        this.updateCursorPosition();
        this._cursorSprite.alpha = 1;
        this._cursorFadeCount = CURSOR_FADE_FRAMES; // フェード完了状態
        this._cursorFadeStarted = true; // フェード開始済み状態
      }

      // ★ フェードインの場合、カーソルは update でフェードインさせるのでここではalpha=0のまま
      this._cursorFadeStarted = false;
      this._cursorFadeCount = 0;
      if (this._cursorSprite) this._cursorSprite.alpha = 0;
    }

    terminate() {
      super.terminate();
      SceneManager.snapForBackground(); // Title -> Map 遷移時のスナップショット
      // ★ シーン終了時にカーソルを必ず表示状態に戻す
      document.body.style.cursor = "auto";
      // console.log(`[${pluginName}] Cursor restored to auto on terminate.`);
      // ★ BGMフェードアウトは commandNewGame で行うため削除
      // SoundManager.playCancel(); // 不要な場合があるためコメントアウト
    }

    createBackground() {
      // タイトル画像1を使用 (パラメータで指定されたものを使う)
      // console.log(`[${pluginName}][createBackground] Checking flag (${PROGRESS_FLAG_KEY}):`, getTitleProgressFlag());
      const useProgressVersion = getTitleProgressFlag();
      let bgName = "";
      let isPicture = false;

      if (useProgressVersion && params.progressTitleBackground) {
        bgName = params.progressTitleBackground;
        isPicture = true;
        // console.log(`[${pluginName}] Using progress title background:`, bgName);
      } else {
        bgName = params.titleBackground;
        // console.log(`[${pluginName}] Using default title background:`, bgName);
      }

      if (bgName) {
        let bitmap;
        if (isPicture) {
          bitmap = ImageManager.loadPicture(bgName);
        } else {
          bitmap = ImageManager.loadTitle1(bgName);
        }

        this._backSprite = new Sprite(bitmap);
        // ★ 標準の Scene_Title に合わせて位置を設定
        this._backSprite.x = Graphics.width / 2;
        this._backSprite.y = Graphics.height / 2;
        this._backSprite.anchor.x = 0.5;
        this._backSprite.anchor.y = 0.5;
        this._backSprite.alpha = 0; // ★ 初期透明度を0に
        this.addChild(this._backSprite); // ★ addChild
      } else {
        // console.error("Title background image parameter is not set!");
        // パラメータが設定されていない場合、背景なしになる
        this._backSprite = null; // または new Sprite(); など
      }
    }

    centerSprite(sprite) {
      sprite.x = Graphics.width / 2;
      sprite.y = Graphics.height / 2;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
    }

    createCommands() {
      // ★ 座標情報の取得
      const pos = this.getNewGamePosition();
      let currentX = pos.x;
      let currentY = pos.y;
      const initialX = currentX + FADE_IN_OFFSET_X; // 右からのフェードイン開始位置

      TITLE_COMMANDS_DATA.forEach((cmdData, i) => {
        const sprite = new Sprite(ImageManager.loadPicture(cmdData.image));
        sprite.x = initialX; // 初期位置は右側
        sprite.y = currentY;
        sprite.anchor.set(0, 0); // アンカーを左上に変更
        sprite.alpha = 0; // 最初は透明
        sprite.cmdHandler = cmdData.handler;
        sprite.index = i;
        sprite.enabledFunc = cmdData.enabled; // ★ 有効判定関数を一時保存
        this._sprites.push(sprite);
        this.addChild(sprite);

        // 次のコマンドの位置を計算
        currentX += OFFSET_X;
        currentY += OFFSET_Y;
      });

      this.startCommandFadeIn(); // コマンドのフェードイン開始 (これは create のまま)
    }

    // カーソルスプライトを作成
    createCursor() {
      this._cursorSprite = new Sprite(ImageManager.loadPicture(CURSOR_IMAGE_NAME));
      this._cursorSprite.anchor.set(0.5, 0.5); // カーソルは中央基準が良い場合が多い
      this._cursorSprite.alpha = 0; // 最初は非表示

      // ★ アニメーション用変数初期化
      this._cursorAnimeCount = 0;
      this._cursorBaseX = 0;

      this.updateCursorPosition(); // 初期位置設定
      this.addChild(this._cursorSprite);
    }

    startCommandFadeIn() {
      this._fadeCount = 0;
      this._ready = false;
    }

    update() {
      // ★ Scene_Base.update を呼ぶ (フェード処理などを含む)
      super.update();

      // ★ マウスカーソルの表示/非表示を更新
      this.updateMouseCursorVisibility();

      // ★ シーンが完全に準備できるまで待機
      if (!this.isReady()) {
        // console.log("Waiting for scene ready..."); // デバッグ用
        return; // 準備ができていなければ以下の処理はスキップ
      }

      // ★ isReady() が true になった後の処理 ★

      // フェードインアニメーション処理 (コマンドと背景)
      // isReady() に super.isReady() が含まれるため、ここに来る時点である程度フェードインは進んでいるはず
      // だが、アニメーション完了前に isReady が true になる可能性もあるので _fadeCount で制御
      if (this._fadeCount < FADE_IN_FRAMES) {
        // console.log("[Titlereplace] update() - Entering animation block. _ready(internal):", this._ready, "_fadeCount:", this._fadeCount);
        this._fadeCount++;

        // 背景フェードイン
        if (this._backSprite && this._fadeCount <= BG_FADE_IN_FRAMES) {
          const bgRate = this._fadeCount / BG_FADE_IN_FRAMES;
          this._backSprite.alpha = Math.min(1, bgRate);
        }

        const rate = this._fadeCount / FADE_IN_FRAMES;
        const easeRate = Math.sin(rate * Math.PI / 2); // EaseOutSine

        // コマンドフェードイン・移動
        // ★ 座標情報の取得
        const pos = this.getNewGamePosition();
        const baseX = pos.x;

        this._sprites.forEach((sprite, i) => {
          const targetX = baseX + OFFSET_X * i;
          sprite.alpha = Math.min(1, easeRate);
          sprite.x = (targetX + FADE_IN_OFFSET_X) - (FADE_IN_OFFSET_X * easeRate);
          if (i === 0 && this._fadeCount % 10 === 0) { // ログ軽減
            // console.log(`[Titlereplace] update() - Animating sprite ${i}: rate=${rate.toFixed(2)}, easeRate=${easeRate.toFixed(2)}, x=${sprite.x.toFixed(1)}`);
          }
        });
      }

      // アニメーションとデータロードが完了したら内部的な準備完了フラグを立てる
      if (this._fadeCount >= FADE_IN_FRAMES && !this._ready) {
        // console.log("[Titlereplace] update() - Animation finished & scene ready. Setting internal _ready = true.");
        this._ready = true; // これで入力受付などが開始される
      }

      // カーソルフェードイン開始判定 (アニメーション完了少し前から)
      const CURSOR_START_FRAME = FADE_IN_FRAMES - CURSOR_FADE_FRAMES;
      if (!this._cursorFadeStarted && this._fadeCount >= CURSOR_START_FRAME) {
        // console.log(`[Titlereplace] update() - Starting cursor fade-in at frame ${this._fadeCount}.`);
        this._cursorFadeStarted = true;
      }

      // カーソルフェードイン処理
      if (this._cursorFadeStarted && this._cursorSprite && this._cursorFadeCount < CURSOR_FADE_FRAMES) {
        this._cursorFadeCount++;
        const cursorRate = this._cursorFadeCount / CURSOR_FADE_FRAMES;
        this._cursorSprite.alpha = Math.min(1, cursorRate);
      }

      // ★ 内部的な準備完了フラグが立ったら入力を受け付ける
      if (this._ready) {
        this.updateInput();
      }

      // ★ カーソルアニメーション更新
      if (this._cursorSprite) {
        this._cursorAnimeCount++;
        const animOffset = Math.sin(this._cursorAnimeCount * CURSOR_ANIMATION_SPEED) * CURSOR_ANIMATION_RANGE;
        // 基準位置(BaseX)にアニメーションオフセットを加算
        this._cursorSprite.x = this._cursorBaseX + animOffset;
      }
    }

    updateInput() {
      // ★ コマンド処理中は入力を受け付けない
      if (this._processingCommand) return;
      let selectionChangedByKey = false;

      // 十字キー入力
      if (Input.isRepeated("down")) {
        this.changeSelection(1);
        selectionChangedByKey = true;
      }
      if (Input.isRepeated("up")) {
        this.changeSelection(-1);
        selectionChangedByKey = true;
      }

      // 決定キー入力
      if (Input.isTriggered("ok")) {
        this.processOk();
      }
      this.processTouch(selectionChangedByKey); // ★ キー入力による変更があったかどうかの情報を渡す
    }

    processOk() {
      const sprite = this._sprites[this._selectedIndex];
      if (this._commandEnabled[this._selectedIndex]) { // 有効なコマンドのみ実行
        SoundManager.playOk();
        this._processingCommand = true; // ★ 入力ブロック開始
        Scene_CustomTitle._lastSelectedIndex = this._selectedIndex; // ★ 離れる前にインデックスを保存
        sprite.cmdHandler.call(this); // ハンドラーを呼び出す
      } else {
        SoundManager.playBuzzer(); // 無効な場合はブザー
      }
    }

    processTouch(selectionChangedByKey = false) {
      // ★ コマンド処理中はタッチを受け付けない
      if (this._processingCommand) return;
      // キー入力があったフレームでは、全てのマウス/タッチ処理をスキップ
      if (selectionChangedByKey) {
        // console.log(`[${pluginName}] Key input detected this frame, skipping touch processing.`);
        return;
      }
      // マウスカーソルが非表示の場合も、全てのマウス/タッチ処理をスキップ
      if (!this._isMouseCursorVisible) {
        // console.log(`[${pluginName}] Mouse cursor is not visible, skipping touch processing.`); // デバッグ用
        return;
      }

      const x = TouchInput.x;
      const y = TouchInput.y;
      let hoveredIndex = -1;

      this._sprites.forEach((sprite, i) => {
        // マウスオーバー判定 (アンカー(0,0)基準)
        if (this._commandEnabled[i]) { // 有効なコマンドのみ反応
          const left = sprite.x;
          const top = sprite.y;
          const right = left + sprite.width;
          const bottom = top + sprite.height;

          if (x >= left && x < right && y >= top && y < bottom) {
            hoveredIndex = i;
          }
        }
      });

      // マウスオーバーによる選択変更 (マウスが動いた場合のみ)
      if (this._mouseMoved && hoveredIndex !== -1 && this._selectedIndex !== hoveredIndex) {
        this.selectCommand(hoveredIndex);
      }

      // クリック/タッチによる決定
      if (TouchInput.isTriggered() && hoveredIndex !== -1) {
        if (this._selectedIndex !== hoveredIndex) this.selectCommand(hoveredIndex);
        this.updateCursorPosition(); // カーソル位置も更新
        this.processOk(); // 決定処理を実行
      }
    }

    changeSelection(delta) {
      if (this._sprites.length === 0) return;

      const loop = true; // ループ選択を有効にするか
      let current = this._selectedIndex;
      let newIndex = current;
      const lastIndex = this._sprites.length - 1;

      // 有効な次のコマンドを探す
      do {
        if (loop) {
          newIndex = (newIndex + delta + this._sprites.length) % this._sprites.length;
        } else {
          newIndex = newIndex + delta;
          if (newIndex < 0 || newIndex > lastIndex) {
            return; // ループしない場合は範囲外なら何もしない
          }
        }
        // １周しても有効なものが見つからない場合はループを抜ける
        if (newIndex === current && !this._commandEnabled[newIndex]) {
          break;
        }
      } while (!this._commandEnabled[newIndex]);


      if (this._commandEnabled[newIndex]) {
        this.selectCommand(newIndex);
      } else {
        // 有効なコマンドがない場合（コンティニューがない時など）
        // Buzzerを鳴らすか、何もしないかなど
        // SoundManager.playBuzzer();
      }
    }

    // index のコマンドを選択状態にする (skipSound: SEを鳴らさないフラグ)
    selectCommand(index, skipSound = false) {
      if (this._selectedIndex !== index && !skipSound) {
        SoundManager.playCursor(); // インデックスが変わった時だけSE再生
      }
      this._selectedIndex = index;

      this._sprites.forEach((sprite, i) => {
        if (!this._commandEnabled[i]) {
          // 無効なコマンドは常にグレーアウト＆少し暗く＆小さく
          sprite.setColorTone(NON_SELECT_TONE);
          sprite.opacity = 192; // 少し透明に
          sprite.scale.set(0.8, 0.8); // ★ 無効なコマンドも小さくする
        } else if (i === index) {
          // 選択中の有効なコマンド
          sprite.setColorTone(SELECT_TONE); // 通常色
          sprite.opacity = 255;
          sprite.scale.set(1.0, 1.0); // ★ 選択中は通常サイズ
        } else {
          // 選択されていない有効なコマンド
          sprite.setColorTone(NON_SELECT_TONE); // グレーアウト
          sprite.opacity = 255;
          sprite.scale.set(0.8, 0.8); // ★ 選択されていない有効なコマンドも小さくする
        }
        // スケール変更は削除
        // sprite.scale.set(i === index ? 1.1 : 1.0);
      });
      this.updateCursorPosition(); // カーソル位置を更新
    }

    // 最初の有効なコマンドのインデックスを探す
    findFirstEnabledCommand(startIndex = 0) {
      for (let i = 0; i < this._sprites.length; i++) {
        const index = (startIndex + i) % this._sprites.length;
        if (this._commandEnabled[index]) {
          return index;
        }
      }
      return -1; // 有効なコマンドがない場合
    }

    // カーソルスプライトの位置を更新
    updateCursorPosition() {
      if (!this._cursorSprite || this._sprites.length === 0) return;

      const selectedSprite = this._sprites[this._selectedIndex];
      if (selectedSprite) {
        // スプライトの最終的な左端から指定オフセット分離れた中央Y座標にカーソルを合わせる
        // ★ 座標情報の取得
        const pos = this.getNewGamePosition();
        const baseX = pos.x;
        const targetX = baseX + OFFSET_X * this._selectedIndex;

        // ★ アニメーションの基準位置を更新 (直接 x に代入しない)
        this._cursorBaseX = targetX + CURSOR_OFFSET_X;
        // 初期位置合わせのため一度セット（アニメーション計算時に上書きされるがチラつき防止）
        this._cursorSprite.x = this._cursorBaseX;

        this._cursorSprite.y = selectedSprite.y + selectedSprite.height / 2;
      }
    }

    // タイトルBGMを再生 (Scene_Titleから移植・改変)
    playTitleMusic() {
      // console.log("Attempting to play title BGM...");
      // console.log(`[${pluginName}][playTitleMusic] Checking flag (${PROGRESS_FLAG_KEY}):`, getTitleProgressFlag());
      // console.log("Plugin Parameter (titleBgm):", params.titleBgm, "(Type:", typeof params.titleBgm, ")"); // ★ 型情報もログに
      // console.log("Plugin Parameter (progressTitleBgm):", params.progressTitleBgm, "(Type:", typeof params.progressTitleBgm, ")");
      // console.log(`Progress Flag (${PROGRESS_FLAG_KEY}):`, getTitleProgressFlag());

      let bgmToPlay = null;
      const useProgressVersion = getTitleProgressFlag();
      const targetBgmParam = useProgressVersion && params.progressTitleBgm ? params.progressTitleBgm : params.titleBgm;

      if (useProgressVersion && params.progressTitleBgm) {
        // console.log(`[${pluginName}] Using progress title BGM parameter.`);
      } else {
        // console.log(`[${pluginName}] Using default title BGM parameter.`);
      }

      // パラメータがオブジェクト形式か文字列形式かチェック
      if (targetBgmParam && typeof targetBgmParam === 'object' && targetBgmParam.name) {
        // オブジェクト形式の場合 (標準的なファイルパラメータ)
        bgmToPlay = {
          name: targetBgmParam.name,
          volume: targetBgmParam.volume !== undefined ? targetBgmParam.volume : 90,
          pitch: targetBgmParam.pitch !== undefined ? targetBgmParam.pitch : 100,
          pan: targetBgmParam.pan !== undefined ? targetBgmParam.pan : 0
        };
        // console.log("Playing BGM from parameter (object):", bgmToPlay);
      } else if (targetBgmParam && typeof targetBgmParam === 'string') {
        // 文字列形式の場合 (ファイル名のみが取得された場合)
        bgmToPlay = {
          name: targetBgmParam,
          volume: 90, // デフォルト値
          pitch: 100,
          pan: 0
        };
        // console.log("Playing BGM from parameter (string):", bgmToPlay);
      } else {
        // デフォルトのタイトルBGMを再生
        bgmToPlay = $dataSystem.titleBgm;
        // console.log("Playing default title BGM:", bgmToPlay);
      }

      if (bgmToPlay && bgmToPlay.name) {
        AudioManager.playBgm(bgmToPlay);
        AudioManager.stopBgs();
        AudioManager.stopMe();
      } else {
        // console.warn("No valid BGM found to play.");
        // BGMなしの場合の処理 (現状維持)
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.stopMe();
      }
    }

    // シーンが操作可能になる準備ができているか？
    isReady() {
      return super.isReady();
    }

    // ★ 現在の進行フラグに基づいてニューゲームの座標を返すヘルパーメソッド
    getNewGamePosition() {
      const useProgress = getTitleProgressFlag();
      // 進行状況フラグがONなら専用座標、そうでなければデフォルト座標
      if (useProgress) {
        return { x: PROGRESS_NEW_GAME_X, y: PROGRESS_NEW_GAME_Y };
      } else {
        return { x: NEW_GAME_X, y: NEW_GAME_Y };
      }
    }

    // マウスカーソルの表示/非表示を管理
    updateMouseCursorVisibility() {
      const currentX = TouchInput.x;
      const currentY = TouchInput.y;
      let mouseMoved = false;

      // Check if mouse position actually changed since last frame
      if (this._lastTouchX !== -1 && (currentX !== this._lastTouchX || currentY !== this._lastTouchY)) {
        // Consider it moved only if the change is not excessively large (e.g., window focus change)
        // and not just tiny jitter if needed (though usually not necessary)
        // Let's assume any change means movement for simplicity now.
        this._mouseMoved = true;
      } else {
        this._mouseMoved = false;
      }
      // Update last known position for the next frame
      this._lastTouchX = currentX;
      this._lastTouchY = currentY;

      // 主要なキーボード入力をチェック
      const anyKeyPressed = ['ok', 'cancel', 'menu', 'shift', 'down', 'left', 'right', 'up', 'pageup', 'pagedown']
        .some(key => Input.isTriggered(key) || Input.isRepeated(key));

      if (anyKeyPressed) {
        // キー入力があれば、表示状態に関わらず非表示フラグを立てる
        if (this._isMouseCursorVisible) {
          console.log(`[${pluginName}] Keyboard input triggered/repeated, hiding cursor.`);
          this._isMouseCursorVisible = false;
        }
      } else if (this._mouseMoved) { // キー入力がなく、マウスが動いた場合
        if (!this._isMouseCursorVisible) { // 非表示の場合のみ表示処理
          console.log(`[${pluginName}] Mouse moved, showing cursor.`);
          this._isMouseCursorVisible = true;
        }
      }

      // カーソルスタイルを適用
      const newCursorStyle = this._isMouseCursorVisible ? "auto" : "none";
      if (document.body.style.cursor !== newCursorStyle) {
        document.body.style.cursor = newCursorStyle;
      }
    }
  }

  //=============================================================================
  // Command Handlers (Scene_Titleにあったものを移植・調整)
  //=============================================================================
  function commandNewGame() {
    DataManager.setupNewGame();
    // ★ マップ遷移前にBGMをフェードアウト
    AudioManager.fadeOutBgm(2.0);
    this.startFadeOut(120); // 画面をフェードアウト (120フレーム = 2秒)
    SceneManager.goto(Scene_Map);
  }

  function commandContinue() {
    // this.fadeOutAll(); // ★ フェードアウトを削除
    SceneManager.push(Scene_Load);
  }

  function commandOptions() {
    // this.fadeOutAll(); // ★ フェードアウトを削除
    SceneManager.push(Scene_Options);
  }

  //=============================================================================
  // Scene_Boot からタイトルへ遷移する処理をフック (エイリアス方式)
  //=============================================================================
  // const _Scene_Boot_gotoTitle = Scene_Boot.prototype.gotoTitle; // このフックは削除
  // Scene_Boot.prototype.gotoTitle = function() { ... }; // このブロック全体を削除


  // PluginCommonBase.js がない場合のためのフォールバック
  if (typeof PluginManagerEx === 'undefined') {
    window.PluginManagerEx = {
      createParameter: function (script) {
        const parameters = PluginManager.parameters(script.getAttribute('src').split('/').pop().replace('.js', ''));
        const result = {};
        for (const key in parameters) {
          try {
            result[key] = JSON.parse(parameters[key]);
          } catch (e) {
            result[key] = parameters[key];
          }
        }
        return result;
      }
    };
  }

  // 標準の Scene_Title をカスタムシーンで上書き
  Scene_Title = Scene_CustomTitle;

})();
