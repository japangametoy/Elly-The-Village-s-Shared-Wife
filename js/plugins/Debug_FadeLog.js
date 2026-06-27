/*:
 * @target MZ
 * @plugindesc フェードイン・アウトと場所移動のログをコンソールに出力します。
 * @author Debugger
 *
 * @help
 * F8キーでコンソールを開いてログを確認してください。
 */

(() => {
    const _Game_Screen_startFadeIn = Game_Screen.prototype.startFadeIn;
    Game_Screen.prototype.startFadeIn = function (duration) {
        console.log("【Debug】Game_Screen.startFadeIn 実行: duration=" + duration + " 現在の明るさ=" + this.brightness());
        _Game_Screen_startFadeIn.call(this, duration);
    };

    const _Game_Screen_startFadeOut = Game_Screen.prototype.startFadeOut;
    Game_Screen.prototype.startFadeOut = function (duration) {
        console.log("【Debug】Game_Screen.startFadeOut 実行: duration=" + duration);
        _Game_Screen_startFadeOut.call(this, duration);
    };

    const _Game_Interpreter_command221 = Game_Interpreter.prototype.command221;
    Game_Interpreter.prototype.command221 = function () {
        console.log("【Debug】イベントコマンド: フェードアウト実行 (EventID:" + this.eventId() + ")");
        return _Game_Interpreter_command221.call(this);
    };

    const _Game_Interpreter_command222 = Game_Interpreter.prototype.command222;
    Game_Interpreter.prototype.command222 = function () {
        console.log("【Debug】イベントコマンド: フェードイン実行 (EventID:" + this.eventId() + ")");
        return _Game_Interpreter_command222.call(this);
    };

    const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
        console.log(`【Debug】場所移動予約: MapID=${mapId}, (${x},${y}), FadeType=${fadeType}`);
        _Game_Player_reserveTransfer.apply(this, arguments);
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        if (this.isTransferring()) {
            console.log("【Debug】場所移動実行処理開始");
        }
        _Game_Player_performTransfer.call(this);
    };

    // ScreenFadeController対応
    if (Game_Screen.prototype.startFadeInEx) {
        const _Game_Screen_startFadeInEx = Game_Screen.prototype.startFadeInEx;
        Game_Screen.prototype.startFadeInEx = function (duration, r, g, b) {
            console.log(`【Debug】Game_Screen.startFadeInEx 実行: duration=${duration}, color=${r},${g},${b}`);
            _Game_Screen_startFadeInEx.call(this, duration, r, g, b);
        };
    }

})();
