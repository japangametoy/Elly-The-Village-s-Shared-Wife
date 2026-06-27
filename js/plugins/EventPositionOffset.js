/*:
 * @target MZ
 * @plugindesc イベントのキャラチップ表示位置をメモ欄で微調整するプラグイン
 *
 * @help
 * イベントのメモ欄に以下のタグを記述することで、
 * キャラチップの表示位置をピクセル単位で調整できます。
 *
 * <PosY:10>  → Y軸方向に10ピクセル下にずらす
 * <PosY:-5>  → Y軸方向に5ピクセル上にずらす
 * <PosX:10>  → X軸方向に10ピクセル右にずらす
 * <PosX:-5>  → X軸方向に5ピクセル左にずらす
 *
 * X軸とY軸の両方を同時に指定することもできます。
 *
 * 使用例：
 * <PosY:8>
 * <PosX:4>
 * <PosY:16><PosX:-8>
 */

(() => {
    'use strict';

    // イベントのメモ欄からオフセット値を取得
    const getEventPosOffset = (event, axis) => {
        if (!event || !event.event()) return 0;
        const note = event.event().note || '';
        const regex = new RegExp(`<Pos${axis}:\\s*(-?\\d+)>`, 'i');
        const match = note.match(regex);
        return match ? parseInt(match[1], 10) : 0;
    };

    // Game_Event の screenX をオーバーライド
    const _Game_Event_screenX = Game_Event.prototype.screenX;
    Game_Event.prototype.screenX = function () {
        const baseX = _Game_Event_screenX.call(this);
        return baseX + getEventPosOffset(this, 'X');
    };

    // Game_Event の screenY をオーバーライド
    const _Game_Event_screenY = Game_Event.prototype.screenY;
    Game_Event.prototype.screenY = function () {
        const baseY = _Game_Event_screenY.call(this);
        return baseY + getEventPosOffset(this, 'Y');
    };

})();
