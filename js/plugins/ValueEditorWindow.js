/*:
 * @target MZ
 * @plugindesc NW.jsを利用した変数・スイッチ編集ウィンドウを表示します
 *
 * @help ValueEditorWindow.js
 *
 * このプラグインは、NW.js環境でのみ動作する開発者向けツールです。
 * 実行中のゲームの変数やスイッチを外部ウィンドウで確認・編集できます。
 * 
 * 使用方法:
 * F7キーでウィンドウを開くことができます。
 * プラグインパラメータでゲーム起動時の自動起動を設定できます。
 *
 * 注意:
 * このプラグインはNW.js環境でのみ動作します。
 * ブラウザでの動作は保証されません。
 *
 * @param AutoOpenOnStart
 * @text ゲーム起動時に自動で開く
 * @type boolean
 * @on 自動で開く
 * @off 自動で開かない
 * @desc ゲーム起動時にエディタウィンドウを自動で開くかどうか
 * @default false
 */

(function () {
    'use strict';

    // プラグインパラメータの取得
    const pluginName = 'ValueEditorWindow';
    const parameters = PluginManager.parameters(pluginName);
    const autoOpenOnStart = parameters['AutoOpenOnStart'] === 'true';

    // NW.js環境かどうかをチェック
    const isNwjs = Utils.isNwjs();

    // グローバル変数としてウィンドウの参照を保持
    window.debugEditorWindow = null;
    let syncIntervalId = null;
    let editorWindowInitialized = false;
    window.expectedEditorToken = null; // エディタから期待されるトークンを保持

    // RPGMZ_DebugValues は updateLocalStorage で使われているので残すか検討
    // window.RPGMZ_DebugValues = {}; // 初期化は updateLocalStorage 内で行うのでここでは不要かも

    // デバッグモード
    const DEBUG = true;
    function debugLog(message) {
        if (DEBUG) {
            // console.log('[ValueEditorWindow] ' + message);
        }
    }

    // ゲーム開始時の処理
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        // プラグインパラメータで自動起動が有効な場合、エディタウィンドウを開く
        if (autoOpenOnStart && isNwjs) {
            // 少し遅延させて、ゲームの初期化が完了してから開く
            setTimeout(function () {
                if (!window.debugEditorWindow) {
                    // debugLog('ゲーム起動時の自動起動: エディタウィンドウを開きます');
                    openDebugWindow();
                }
            }, 1000);
        }
    };

    // シーン終了時の処理（ウィンドウを閉じないよう変更）
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function () {
        _Scene_Base_terminate.call(this);
        // ウィンドウは閉じずに維持する
    };

    // ゲーム完全終了時の処理 - SceneManagerの終了処理にフック
    const _SceneManager_exit = SceneManager.exit;
    SceneManager.exit = function () {
        if (window.debugEditorWindow) {
            try {
                debugLog('ゲーム終了によりメインデバッグウィンドウを閉じます');
                window.debugEditorWindow.close(true);
                window.debugEditorWindow = null;
            } catch (e) { // console.error('メインデバッグウィンドウ終了エラー:', e);
            }
        }

        if (syncIntervalId) {
            clearInterval(syncIntervalId);
            syncIntervalId = null;
        }

        _SceneManager_exit.call(this);
    };

    // デバッグウィンドウを開く
    function openDebugWindow() {
        if (window.debugEditorWindow) {
            // このケースは Scene_Base.update 側で処理されるため、ここでは基本的に何もしない
            // ウィンドウ参照が存在するが、実体が死んでいる場合などは Scene_Base.update で null 化され、
            // その後ここが呼ばれる際には window.debugEditorWindow は null になっている想定
            // debugLog("openDebugWindow: 既存のウィンドウ参照があるが、呼び出し元のロジックで処理されるべき。");
            return;
        }

        try {
            const path = require('path');
            // const fs = require('fs'); // fsは不要になる
            const gamePath = path.dirname(process.mainModule.filename);
            // editor.htmlのパスをjs/plugins/editor.htmlに修正
            const editorHtmlPath = path.join(gamePath, 'js', 'plugins', 'editor.html');

            // editor.htmlが存在しない場合または強制更新の場合は作成
            // HTMLファイルは静的に配置するため、以下の生成処理は不要
            // if (!fs.existsSync(editorPath) || true) { // 常に更新
            //     createEditorHtml(editorPath);
            //     debugLog('editor.htmlファイルを更新しました: ' + editorPath);
            // }

            // エディタウィンドウ用のユニークなトークンを生成
            window.expectedEditorToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
            // debugLog(`Generated editor token: ${window.expectedEditorToken}`);

            // NW.jsのウィンドウを開く
            try {
                // nw.guiの取得を試みる
                let nw;
                if (process.versions['node-webkit']) {
                    nw = window.nw || require('nw.gui');
                } else if (process.versions.nw) {
                    nw = window.nw || require('nw.gui');
                }

                if (!nw || !nw.Window) {
                    // console.error('NW.js Window APIが見つかりません');
                    return;
                }

                // 絶対パスを使用
                const absolutePath = 'file:///' + editorHtmlPath.replace(/\\/g, '/');
                // debugLog('ウィンドウを開きます: ' + absolutePath);

                // 親ウィンドウ（ゲームウィンドウ）の参照を取得
                const gameNwWindow = nw.Window.get();
                const gameX = gameNwWindow.x;
                const gameY = gameNwWindow.y;
                const gameWidth = gameNwWindow.width;
                // const gameHeight = gameNwWindow.height; // 必要であれば

                // ウィンドウを開く
                const windowOptions = {
                    width: 360, // 420から60ピクセル小さく
                    height: 600, // 高さを少し広げることも検討
                    // position: 'center', // 'center' から変更
                    x: gameX + gameWidth + 10, // ゲームウィンドウの右側に10pxオフセット
                    y: gameY, // Y座標はゲームウィンドウと同じ
                    focus: false, // ゲームウィンドウからフォーカスを奪わない
                    title: '変数・スイッチエディタ',
                    show_in_taskbar: true,
                    frame: true,             // ウィンドウフレームを表示
                    resizable: true,         // リサイズ可能に
                    new_instance: false      // 新しいインスタンスを作らない
                };

                // Windows環境では always_on_top を避ける（問題を引き起こす場合がある）
                if (process.platform !== 'win32') {
                    windowOptions.always_on_top = true;
                }

                nw.Window.open(absolutePath, windowOptions, function (win) {
                    if (win) {
                        // グローバル変数に保存して参照を維持
                        window.debugEditorWindow = win;

                        // エディタウィンドウにトークンを設定
                        if (win.window) {
                            win.window.editorToken = window.expectedEditorToken;
                            // debugLog('Editor token set on editor window object.');

                            // エディタ初期化情報を送信 (エディタからのREQUEST_INITIAL_DATAを待つため、ここでは送信しない)
                            /*
                            try {
                                const initialData = {
                                    type: 'INITIAL_EDITOR_DATA', // 新しいメッセージタイプ
                                    variables: $dataSystem.variables, // 変数名リスト (0番目は空文字)
                                    switches: $dataSystem.switches,   // スイッチ名リスト (0番目は空文字)
                                    maxVariableId: $dataSystem.variables.length > 0 ? $dataSystem.variables.length - 1 : 0,
                                    maxSwitchId: $dataSystem.switches.length > 0 ? $dataSystem.switches.length - 1 : 0,
                                    gameTitle: $dataSystem.gameTitle
                                };
                                win.window.postMessage(initialData, '*');
                                debugLog(`Sent INITIAL_EDITOR_DATA to editor. MaxVarId: ${initialData.maxVariableId}, MaxSwId: ${initialData.maxSwitchId}`);
                            } catch (e) {
                                console.error('[ValueEditorWindow] Failed to send initial data to editor:', e);
                            }
                            */
                        } else {
                            // console.error('Failed to set token: Editor window object not accessible immediately.');
                            // ここでエラーになっても、後でエディタ側がlocalStorageなどから取得するフォールバックも考えられるが、まずは直接設定を試みる
                        }

                        // ウィンドウが閉じられそうになったときに隠すだけにする
                        win.on('close', function () {
                            // 閉じる代わりに隠す
                            this.hide();

                            // 再表示するためのメッセージ
                            // debugLog('ウィンドウは隠れています。F8キーで再表示できます');
                        });

                        // 閉じるボタンでウィンドウを閉じないよう処理
                        win.on('closed', function () {
                            // window.debugEditorWindowは維持する
                            // debugLog('デバッグウィンドウが完全に閉じられました。参照と状態をリセットします。');
                            window.debugEditorWindow = null; // 参照をクリア
                            editorWindowInitialized = false; // 初期化フラグをリセット
                            if (syncIntervalId) { // 同期も停止
                                clearInterval(syncIntervalId);
                                syncIntervalId = null;
                                // debugLog('データ同期を停止しました。');
                            }
                        });

                        // debugLog('デバッグウィンドウを開きました');

                        // ゲームウィンドウにフォーカスを戻す（エディタウィンドウがアクティブにならないように）
                        try {
                            gameNwWindow.focus();
                            // debugLog('ゲームウィンドウにフォーカスを戻しました');
                        } catch (e) {
                            // debugLog('ゲームウィンドウへのフォーカス戻しに失敗: ' + e.message);
                        }

                        // ウィンドウが正常に開いた後、まだ初期化されていなければ同期を開始
                        if (!editorWindowInitialized) {
                            startDataSync();
                            editorWindowInitialized = true; // 初期化済みフラグを立てる
                        }

                    } else {
                        // console.error('デバッグウィンドウを開けませんでした');
                        window.debugEditorWindow = null; // 失敗時はクリア
                        editorWindowInitialized = false; // 初期化状態もリセット
                    }
                });
            } catch (e) {
                // console.error('NW.jsエラー:', e);
            }
        } catch (e) {
            // console.error('ウィンドウ作成エラー:', e);
            window.debugEditorWindow = null; // エラー時もクリア
            editorWindowInitialized = false; // 初期化状態もリセット
        }
    }

    // F7キーでウィンドウを再表示する機能を追加
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        _Scene_Base_update.call(this);
        // F7キーが押されたらウィンドウを表示
        if (Input.isTriggered('F7')) { // F7キーに変更
            if (isNwjs) {
                if (window.debugEditorWindow) {
                    // ウィンドウ参照が既にある場合 (隠れているか、表示されている)
                    try {
                        // NW.jsのWindowオブジェクトが実際に存在し、内部の 'window' オブジェクトもアクセス可能か確認
                        // win.close(true) で完全に閉じられた場合、参照は残っていてもアクセスエラーになることがある
                        if (window.debugEditorWindow.window && !window.debugEditorWindow.window.closed) {
                            window.debugEditorWindow.show(); // 表示する (既に表示されていても問題ない)
                            window.debugEditorWindow.focus(); // フォーカスを当てる
                            // debugLog('既存のデバッグウィンドウを表示・フォーカスしました。');
                        } else {
                            // ウィンドウオブジェクトはあるが、内部ウィンドウが閉じている (またはアクセス不能)
                            // この状態は win.on('closed') で処理されるはずだが、念のため
                            // debugLog('デバッグウィンドウ参照はありますが、実体は閉じられています。再生成を試みます。');
                            window.debugEditorWindow = null; // 古い参照をクリア (closedイベントで処理済みのはず)
                            // editorWindowInitialized は closed ハンドラで false になっている想定
                            openDebugWindow(); // 新規作成と同じフローへ (参照がnullなので新規作成になる)
                        }
                    } catch (e) {
                        // アクセスエラーが起きた場合も、ウィンドウが死んでいる可能性が高い
                        // debugLog('ウィンドウアクセスエラー。再生成を試みます。エラー: ' + e);
                        window.debugEditorWindow = null; // 古い参照をクリア
                        // editorWindowInitialized もリセットされている想定 (または openDebugWindow 内で処理)
                        openDebugWindow(); // 新規作成と同じフローへ
                    }
                } else {
                    // ウィンドウ参照がない場合 (初回起動または完全に閉じられた後)
                    // debugLog('デバッグウィンドウを新規作成します。');
                    openDebugWindow();
                }
            }
        }
    };

    // F7キーをInputに登録
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function (event) {
        _Input_onKeyDown.call(this, event);
        if (event.keyCode === 118) { // F7キー (keyCode 118)
            this._currentState['F7'] = true;
        }
    };

    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function (event) {
        _Input_onKeyUp.call(this, event);
        if (event.keyCode === 118) { // F7キー
            this._currentState['F7'] = false;
        }
    };

    // 監視データの初期化と同期開始
    function startDataSync() {
        if (syncIntervalId) { // 既に同期処理が実行中の場合は新たに開始しない
            // debugLog('データ同期は既に開始されています。');
            return;
        }
        try {
            // debugLog('データ同期を開始します');

            // 初期データをlocalStorageに保存 (この処理はpostMessageで行うため不要)
            // updateLocalStorage(); 

            // 編集フラグをリセット (localStorageを使わないので不要)
            // localStorage.setItem('values_edited', 'false');
            // localStorage.setItem('save_completed', 'false');

            // グローバル関数として登録 (postMessageに移行したので不要)
            /* window.RPGMZ_DebugEditor = {
                updateVariables: function(data) { ... }
            }; */

            // 定期的に同期をチェック（より短い間隔で更新）
            // updateLocalStorage (改め sendGameValuesToEditor) を定期実行する役割は維持
            syncIntervalId = setInterval(function () {
                try {
                    // ゲーム内の最新値をエディタに送信
                    updateLocalStorage(); // 関数名は後で変更検討 (例: sendGameValuesToEditor)

                    // エディタからの保存リクエストをチェック (postMessageで行うため不要)
                    // checkSaveRequest();
                } catch (e) {
                    // console.error('データ同期エラー:', e);
                }
            }, 200);  // 200msごとに送信 (負荷に応じて調整)
        } catch (e) {
            // console.error('同期開始エラー:', e);
        }
    }

    // ゲーム内変数・スイッチをlocalStorageに保存（一方向：ゲーム→ローカルストレージ）
    function updateLocalStorage() {
        try {
            if (!$gameVariables || !$gameSwitches || !$dataSystem) {
                return;
            }

            // 変数の現在値を取得
            const currentVariables = {};
            const maxVarId = $dataSystem.variables.length - 1;
            for (let i = 1; i <= maxVarId; i++) {
                currentVariables[i] = $gameVariables.value(i);
            }

            // スイッチの現在値を取得
            const currentSwitches = {};
            const maxSwId = $dataSystem.switches.length - 1;
            for (let i = 1; i <= maxSwId; i++) {
                currentSwitches[i] = $gameSwitches.value(i);
            }

            // グローバル変数への保存 (この部分は将来的に不要になるかも)
            window.RPGMZ_DebugValues = window.RPGMZ_DebugValues || { variables: {}, switches: {} };
            window.RPGMZ_DebugValues.variables = currentVariables;
            window.RPGMZ_DebugValues.switches = currentSwitches;

            // localStorageへの保存処理はコメントアウトまたは削除 (postMessageメインのため)
            /*
            let gameValuesChanged = false;
            if (localStorage.getItem('gameVar1') !== var1.toString()) gameValuesChanged = true;
            if (localStorage.getItem('gameVar2') !== var2.toString()) gameValuesChanged = true;
            if (localStorage.getItem('gameVar3') !== var3.toString()) gameValuesChanged = true;
            if (localStorage.getItem('gameSwitch1') !== (switch1 ? '1' : '0')) gameValuesChanged = true;
            if (localStorage.getItem('gameSwitch2') !== (switch2 ? '1' : '0')) gameValuesChanged = true;
 
            if (gameValuesChanged) {
                debugLog(`[Game] updateLocalStorage: Game values changed. Saving to localStorage. V1=${var1}, V2=${var2}, V3=${var3}, S1=${switch1}, S2=${switch2}`);
                localStorage.setItem('gameVar1', var1.toString());
                localStorage.setItem('gameVar2', var2.toString());
                localStorage.setItem('gameVar3', var3.toString());
                localStorage.setItem('gameSwitch1', switch1 ? '1' : '0');
                localStorage.setItem('gameSwitch2', switch2 ? '1' : '0');
            }
            */

            // ウィンドウが存在する場合、直接データを送信
            if (window.debugEditorWindow && window.debugEditorWindow.window) {
                try {
                    window.debugEditorWindow.window.postMessage({
                        type: 'UPDATE_VALUES',
                        variables: currentVariables, // 全変数を送信
                        switches: currentSwitches,   // 全スイッチを送信
                        token: window.expectedEditorToken // トークンも念のため付与
                    }, '*');
                } catch (e) {
                    // console.error('ウィンドウ通信エラー:', e); // 頻繁なエラー表示を避ける
                }
            }
        } catch (e) {
            // console.error('ゲーム値の送信エラー:', e); // 関数名に合わせてエラーメッセージ変更
        }
    }

    // 保存リクエストチェック関数をグローバルスコープに公開 (postMessageに移行したので不要)
    /* window.checkEditorSaveRequest = function() {
        // debugLog('[Game] checkEditorSaveRequest: Function called (now largely obsolete due to postMessage).');
        // localStorageの'values_edited'のチェックは不要
        return false; // 何も処理しない
    }; */

    // 保存ボタンが押されたかチェックする処理（内部用） (postMessageに移行したので不要)
    /* function checkSaveRequest() {
        return window.checkEditorSaveRequest();
    } */

    // メインウィンドウでのメッセージ処理 (ゲーム側)
    window.addEventListener('message', function (event) {
        try {
            const data = event.data;
            if (!data || !data.type) return;

            // メインデバッグエディタからのメッセージ (トークンはメインエディタのもの)
            if (data.token && data.token === window.expectedEditorToken) {
                // debugLog(`[Game] Message from Main Editor: Type=${data.type}, Origin=${event.origin}`);

                if (data.type === 'REQUEST_INITIAL_DATA') {
                    // debugLog('[Game] REQUEST_INITIAL_DATA received from editor.');
                    if (window.debugEditorWindow && window.debugEditorWindow.window) {
                        try {
                            const initialData = {
                                type: 'INITIAL_EDITOR_DATA',
                                variables: $dataSystem.variables,
                                switches: $dataSystem.switches,
                                maxVariableId: $dataSystem.variables.length > 0 ? $dataSystem.variables.length - 1 : 0,
                                maxSwitchId: $dataSystem.switches.length > 0 ? $dataSystem.switches.length - 1 : 0,
                                gameTitle: $dataSystem.gameTitle,
                                token: window.expectedEditorToken // エディタ側での検証用にトークンを含める
                            };
                            window.debugEditorWindow.window.postMessage(initialData, '*');
                            // debugLog(`[Game] Sent INITIAL_EDITOR_DATA to editor. MaxVarId: ${initialData.maxVariableId}, MaxSwId: ${initialData.maxSwitchId}`);
                        } catch (e) {
                            // console.error('[Game] Failed to send INITIAL_EDITOR_DATA to editor:', e);
                        }
                    } else {
                        // debugLog('[Game] Cannot send INITIAL_EDITOR_DATA, debugEditorWindow not available.');
                    }
                } else if (data.type === 'SAVE_DEBUG_VALUES_REQUEST') {
                    // debugLog(`[Game] SAVE_DEBUG_VALUES_REQUEST received with data: ${JSON.stringify(data.data)} (Editor Timestamp: ${data.editorTimestamp})`);
                    let success = false;
                    let changesApplied = [];
                    try {
                        const receivedData = data.data; // dataフィールド全体を指すように変更
                        if (receivedData) {
                            // 変数を更新
                            if (receivedData.variables) {
                                for (const idStr in receivedData.variables) {
                                    const id = parseInt(idStr, 10);
                                    if (id > 0 && id < $dataSystem.variables.length) { // IDの妥当性チェック
                                        const oldValue = $gameVariables.value(id);
                                        const newValue = Number(receivedData.variables[idStr]);
                                        if (oldValue !== newValue) {
                                            $gameVariables.setValue(id, newValue);
                                            changesApplied.push(`V[${id}]: ${oldValue} -> ${newValue}`);
                                        }
                                    }
                                }
                            }
                            // スイッチを更新
                            if (receivedData.switches) {
                                for (const idStr in receivedData.switches) {
                                    const id = parseInt(idStr, 10);
                                    if (id > 0 && id < $dataSystem.switches.length) { // IDの妥当性チェック
                                        const oldValue = $gameSwitches.value(id);
                                        const newValue = receivedData.switches[idStr] === true || receivedData.switches[idStr] === 'true';
                                        if (oldValue !== newValue) {
                                            $gameSwitches.setValue(id, newValue);
                                            changesApplied.push(`S[${id}]: ${oldValue} -> ${newValue}`);
                                        }
                                    }
                                }
                            }
                            success = true;
                            if (changesApplied.length > 0) {
                                // debugLog(`[Game] Applied changes from editor: ${changesApplied.join(', ')}`);
                            } else {
                                // debugLog("[Game] No actual value changes were made from editor's request (values might be the same).");
                            }
                        } else {
                            // debugLog("[Game] SAVE_DEBUG_VALUES_REQUEST did not contain 'data' field or data was empty.");
                        }
                    } catch (e) {
                        // console.error('[Game] Error processing SAVE_DEBUG_VALUES_REQUEST:', e);
                        success = false; // エラー時は success false
                    }

                    // 処理結果をエディタウィンドウに通知する
                    if (window.debugEditorWindow && window.debugEditorWindow.window) {
                        try {
                            const responsePayload = {
                                type: 'SAVE_COMPLETED',
                                timestamp: Date.now(),
                                success: success
                            };
                            window.debugEditorWindow.window.postMessage(responsePayload, '*');
                            // debugLog(`[Game] Sent SAVE_COMPLETED (success: ${success}) message back to editor window. Payload: ${JSON.stringify(responsePayload)}`);
                        } catch (e) {
                            // debugLog(`[Game] Failed to send SAVE_COMPLETED message to editor window: ${e.message}`);
                        }
                    }
                    // ゲーム内の状態もlocalStorageに反映（エディタの表示同期のため）
                    updateLocalStorage();
                } else if (data.type === 'FORCE_REFRESH_VALUES') {
                    // debugLog('[Game] FORCE_REFRESH_VALUES received from editor.');
                    // 現在の全値をエディタに送信する
                    updateLocalStorage(); // この関数が全値送信の役割を担う
                } else {
                    // debugLog(`[Game] Received unknown message type from main editor: ${data.type}`);
                }

            } else {
                let originType = "Unknown or Game Window";
                if (event.source === window.debugEditorWindow) originType = "Main Debug Editor";

                const messageType = data ? data.type : '';
                if (messageType !== 'webpackOk' && messageType !== 'webpackClose') { // webpack関連のメッセージは無視
                    let logMessage = `[Game] Message with invalid/missing token or unexpected source. Type=${messageType}, Origin=${event.origin}, SourceType=${originType}`;
                    if (data.token) logMessage += `, ReceivedToken=${data.token}`; // 受信トークンもログに含める
                    // debugLog(logMessage);
                }
            }
        } catch (e) {
            // console.error('[Game] Error in main message listener:', e);
        }
    });

})();