/*:
 * @target MZ
 * @plugindesc 特定の文字（罫線など）の文字間隔（字詰め）を調整します。
 * @help
 * バージョン: 1.1.0
 *
 * メッセージウィンドウ等で、罫線文字（─や━など）を表示する際、
 * 通常の文字間隔では隙間が空いてしまう場合などに、
 * ピクセル単位で間隔を詰めて表示するためのプラグインです。
 *
 * 【仕様】
 * - Window_Base.prototype.processCharacter をフックし、
 *   描画対象の文字が「対象文字」に含まれている場合、
 *   描画直後に文字間隔（X座標の進み具合）を指定ピクセル分補正します。
 * - 対象文字以外には影響しません。
 * - 制御文字などは考慮せず、通常のテキスト描画処理において動作します。
 *
 * 【縁取り（アウトライン）について】
 * 罫線などを重ねて描画する際、文字の縁取り（黒枠など）が
 * 隣り合う文字の塗りを消してしまい、隙間が見える原因になることがあります。
 * その場合、「Disable Outline」を true に設定すると、
 * 対象文字のみ縁取りなしで描画され、綺麗に繋がって見えるようになります。
 *
 * @param Target Characters
 * @text 対象文字
 * @desc 間隔調整を行う対象の文字を列挙した文字列です。
 * @default ─━│┃
 * @type string
 *
 * @param Offset X
 * @text 補正値 X
 * @desc 文字描画後のX座標の補正値（ピクセル）。マイナスで詰めます。
 * @default -2
 * @type number
 * @min -100
 * @max 100
 *
 * @param Disable Outline
 * @text 縁取り無効化
 * @desc 対象文字を描画する際、アウトライン（縁取り）を表示しないようにします。隙間対策に有効です。
 * @default true
 * @type boolean
 */

(() => {
    'use strict';

    const pluginName = 'FixLineSpacing';
    const parameters = PluginManager.parameters(pluginName);
    const targetCharacters = String(parameters['Target Characters'] || "─━│┃");
    const offsetX = Number(parameters['Offset X'] || -2);
    const disableOutline = (parameters['Disable Outline'] === 'true');

    const targetCharSet = new Set(targetCharacters.split(''));

    const _Window_Base_processCharacter = Window_Base.prototype.processCharacter;
    Window_Base.prototype.processCharacter = function (textState) {
        const c = textState.text[textState.index];
        const isTarget = c && targetCharSet.has(c);

        if (isTarget) {
            this.flushTextState(textState);
        }

        _Window_Base_processCharacter.apply(this, arguments);

        if (isTarget) {
            // 縁取り無効化処理
            const originalOutlineWidth = this.contents.outlineWidth;
            if (disableOutline) {
                this.contents.outlineWidth = 0;
            }

            this.flushTextState(textState);

            // 縁取り設定を戻す
            if (disableOutline) {
                this.contents.outlineWidth = originalOutlineWidth;
            }

            textState.x += offsetX;
        }
    };

})();
