/*:
 * @target MZ
 * @plugindesc 同一マップへの場所移動時にも「イベントの一時消去」をリセットします。
 *
 * @help
 * このプラグインを有効にすると、
 * 「場所移動」を使って同じマップに移動した場合でも
 * マップがリロードされ、一時消去されていたイベントが復活します。
 *
 * 特別なコマンドは不要です。入れるだけで機能します。
 *
 * ※注意
 * マップが完全にリロードされるため、
 * 自動実行イベントなども最初から判定されます。
 *
 * @command respawnInstant
 * @text その場で復活
 * @desc 場所移動をせずに、その場で一時消去イベントを復活させます。
 */

(() => {
    const pluginName = "EventRespawn";

    // 1. 場所移動時に強制的にリロードフラグを立てる処理
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        if (this.isTransferring()) {
            // 移動先が同じマップIDだった場合、リロードフラグを強制的にONにする
            if (this._newMapId === $gameMap.mapId()) {
                this._needsMapReload = true;
            }
        }
        _Game_Player_performTransfer.call(this);
    };

    // 2. プラグインコマンドの登録（その場で復活させたい場合用）
    PluginManager.registerCommand(pluginName, "respawnInstant", args => {
        $gameMap._erasedEvents = [];
        $gameMap.events().forEach(event => event._erased = false);
    });
})();