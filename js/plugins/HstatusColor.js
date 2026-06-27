/*:
 * @target MZ
 * @plugindesc Scene_Hstatus/Scene_Hs2で変数の色変更を行う + \VC[]制御文字
 * @help
 * ■ 機能1: シーン限定の色変更
 * 識別子「Scene_Hstatus」または「Scene_Hs2」の画面が開かれたときのみ、
 * 変数の内容変更を検知して色付けを行います。
 * 
 * Scene_Hstatus: 変数47, 48, 49, 50を監視
 * Scene_Hs2: 変数57, 58, 59, 60, 69を監視（文字列変数のみ）
 * 
 * ■ 機能2: \VC[n] 制御文字
 * \V[n]の代わりに\VC[n]を使うと、変数の値が更新されていた場合に
 * 黄色（\C[27]）で表示し、既読なら白（\C[0]）で表示します。
 * 
 * 対象変数: 52, 53, 54, 55, 56, 61, 62, 63, 64, 65, 66, 67, 68, 70
 * 
 * 使用例: Village Uncles ：\VC[56]
 * 
 * Scene_Hs2を開くと、対象変数の既読フラグがセットされます。
 */

(() => {
    // ========================================
    // 設定
    // ========================================

    // Scene_Hstatus用の監視対象変数
    const HSTATUS_VAR_IDS = [47, 48, 49, 50];

    // Scene_Hs2用の文字列変数（従来の色コード付加方式）
    const HS2_STRING_VAR_IDS = [57, 58, 59, 60, 69];

    // Scene_Hs2用の数値変数（\VC[]制御文字で色変更）
    const HS2_NUMERIC_VAR_IDS = [52, 53, 54, 55, 56, 61, 62, 63, 64, 65, 66, 67, 68, 70];

    // ========================================
    // 変数変更の監視（数値変数用）
    // ========================================

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        const oldValue = this.value(variableId);
        _Game_Variables_setValue.call(this, variableId, value);

        // 対象の数値変数が変更された場合、更新フラグを立てる
        if (HS2_NUMERIC_VAR_IDS.includes(variableId)) {
            const newValue = this.value(variableId);
            if (oldValue !== newValue) {
                if (!$gameSystem._updatedHs2NumericVars) {
                    $gameSystem._updatedHs2NumericVars = {};
                }
                $gameSystem._updatedHs2NumericVars[variableId] = true;
            }
        }
    };

    // ========================================
    // \VC[n] 制御文字の実装
    // PluginManagerEx経由とWindow_Base経由の両方をサポート
    // ========================================

    // デバッグ: プラグイン読み込み確認
    console.log('[HstatusColor] プラグインが読み込まれました');

    // \VC処理の共通関数
    function processVCEscape(text) {
        // デバッグ: 入力テキストを確認
        if (text && text.includes('VC')) {
            console.log('[HstatusColor] processVCEscape 入力:', text);
        }
        // \VC[n] を処理（\x1b形式に統一されている前提）
        // 注意: 大文字のVCのみを対象とする（小文字の\vcはMessageAlignCenterの縦中央揃えと競合するため）
        return text.replace(/\x1bVC\[(\d+)\]/g, (_, p1) => {
            const varId = parseInt(p1);
            const value = $gameVariables.value(varId);

            // 更新フラグをチェック
            const flagObj = $gameSystem._updatedHs2NumericVars;
            const isUpdated = flagObj && flagObj[varId];

            // デバッグ: フラグ状態を確認
            console.log('[HstatusColor] VC[' + varId + '] value=' + value + ', isUpdated=' + isUpdated + ', flagObj=', flagObj);

            let result;
            if (isUpdated) {
                // 更新されている → 黄色
                result = "\x1bC[27]" + value + "\x1bC[0]";
            } else {
                // 既読 → 白
                result = "\x1bC[0]" + value + "\x1bC[0]";
            }
            console.log('[HstatusColor] 変換結果:', result);
            return result;
        });
    }

    // PluginManagerExが存在する場合、convertEscapeCharactersExをフック
    // （SceneCustomMenuはこちらを経由する）
    if (typeof PluginManagerEx !== 'undefined') {
        const _PluginManagerEx_convertEscapeCharactersEx = PluginManagerEx.convertEscapeCharactersEx;
        PluginManagerEx.convertEscapeCharactersEx = function (text, data) {
            text = processVCEscape(text);
            return _PluginManagerEx_convertEscapeCharactersEx.call(this, text, data);
        };
    }

    // Window_Base経由のフックも残す（通常のメッセージウィンドウ用）
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        // 標準の変換を先に実行（\ → \x1b に変換される）
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        // その後で \VC を処理
        text = processVCEscape(text);
        return text;
    };

    // ========================================
    // シーン処理
    // ========================================

    // 多重登録防止
    if (Scene_MenuBase.prototype._customColorVarHookInstalled) return;
    Scene_MenuBase.prototype._customColorVarHookInstalled = true;

    // メニュー系画面の生成処理をフック
    const _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function () {
        const sceneName = this.constructor.name;

        // Scene_Hstatus: 変数47-50を監視（文字列変数、従来方式）
        if (sceneName === 'Scene_Hstatus') {
            this.updateVariableColorsHstatus();
        }
        // Scene_Hs2: 文字列変数の色更新のみ（数値変数の既読フラグはterminateでクリア）
        if (sceneName === 'Scene_Hs2') {
            this.updateVariableColorsHs2();
            // 注意: clearHs2NumericUpdateFlagsはterminateで呼ぶ（開く時点では未読状態を維持）
        }

        // 本来の処理を実行
        _Scene_MenuBase_create.call(this);
    };

    // Scene_Hs2終了時に数値変数の更新フラグをクリア（既読にする）
    const _Scene_MenuBase_terminate = Scene_MenuBase.prototype.terminate;
    Scene_MenuBase.prototype.terminate = function () {
        const sceneName = this.constructor.name;

        // Scene_Hs2終了時にフラグをクリア
        if (sceneName === 'Scene_Hs2') {
            this.clearHs2NumericUpdateFlags();
            console.log('[HstatusColor] Scene_Hs2終了: 数値変数の更新フラグをクリア');
        }

        _Scene_MenuBase_terminate.call(this);
    };

    // Scene_Hstatus用：変数47-50の色更新ロジック
    Scene_MenuBase.prototype.updateVariableColorsHstatus = function () {
        if (!$gameSystem._lastSeenHstatusVars) {
            $gameSystem._lastSeenHstatusVars = {};
        }
        this.processVariableColors(HSTATUS_VAR_IDS, $gameSystem._lastSeenHstatusVars);
    };

    // Scene_Hs2用：文字列変数の色更新ロジック
    Scene_MenuBase.prototype.updateVariableColorsHs2 = function () {
        if (!$gameSystem._lastSeenHs2Vars) {
            $gameSystem._lastSeenHs2Vars = {};
        }
        this.processVariableColors(HS2_STRING_VAR_IDS, $gameSystem._lastSeenHs2Vars);
    };

    // Scene_Hs2用：数値変数の更新フラグをクリア（既読にする）
    Scene_MenuBase.prototype.clearHs2NumericUpdateFlags = function () {
        if ($gameSystem._updatedHs2NumericVars) {
            HS2_NUMERIC_VAR_IDS.forEach(id => {
                $gameSystem._updatedHs2NumericVars[id] = false;
            });
        }
    };

    // 共通の色処理ロジック（文字列変数用）
    Scene_MenuBase.prototype.processVariableColors = function (targetIds, lastSeenStore) {
        targetIds.forEach(id => {
            let rawVal = $gameVariables.value(id);
            if (rawVal === null || rawVal === undefined) rawVal = "";
            const currentStr = String(rawVal);

            // \C[n] などの制御文字を除去してプレーンなテキストを取得
            const plain = currentStr.replace(/(\\{1,2}|\x1b)C\[\d+\]/gi, "");

            const lastSeen = lastSeenStore[id];

            // 比較判定
            if (plain !== lastSeen) {
                // 【NEW】内容が変わっている → 黄色(\C[27])
                const coloredText = "\\C[27]" + plain + "\\C[0]";
                if (currentStr !== coloredText) {
                    $gameVariables.setValue(id, coloredText);
                }
                // この画面を開いたので「見た」として保存
                lastSeenStore[id] = plain;
            } else {
                // 【OLD】前回と同じ → 白(\C[0])
                const normalText = "\\C[0]" + plain;
                if (currentStr !== normalText) {
                    $gameVariables.setValue(id, normalText);
                }
            }
        });
    };
})();