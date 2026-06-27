/*:
 * @target MZ
 * @plugindesc マップを任意座標やキャラにスクロールするスクリプトを追加します。v1.1
 * 
 * @command holdmap
 * @text マップスクロール固定
 * @desc プレイヤー移動によるマップスクロールを固定します。
 *
 * @command releaseholdmap
 * @text マップスクロール固定解除
 * @desc マップスクロールの固定を解除します。
 *
 * @help
 * === 使用方法 ===
 *
 * ▼ マップ座標へスクロール
 *   MoveMap(x, y, speed, wait)
 *
 *   x, y   : タイル座標
 *   speed  : スクロール速度（1～8）
 *   wait   : true ならスクロール完了までウェイト
 *
 *
 * ▼ キャラの中心へスクロール
 *   MoveToChara(eventId)
 *
 *   eventId : イベントID
 *             0 または省略 → プレイヤー
 *
 * ▼ マップスクロール固定
 *   HoldMap(enable)
 *   enable : true で固定、false で解除（省略時は true）
 *            スクロール固定中はプレイヤーが移動しても画面が動きません。
 *            場所移動、MoveMap実行、標準のマップスクロール実行時に
 *            自動的に解除されます。
 */

(() => {
    const pluginName = "Movemap";

    //--------------------------------------------------------
    // ▼ 座標へスクロール
    //--------------------------------------------------------
    window.MoveMap = function (targetX, targetY, speed = 4, wait = false) {
        const map = $gameMap;
        const i = $gameMap._interpreter;

        // スクロール固定を解除
        map._holdMap = false;

        // 現在の表示位置（画面左上角の座標）
        const currentX = map._displayX;
        const currentY = map._displayY;

        // 画面サイズを取得
        const screenTileX = map.screenTileX();
        const screenTileY = map.screenTileY();

        // 目標座標を画面中心にするための表示座標を計算
        // _displayXと_displayYは画面左上角のタイル座標
        // 画面中心が目標座標になるように、画面サイズの半分を引く
        // タイルの中心を考慮するため、0.5を加算（タイル座標の中心は0.5オフセット）
        let targetDisplayX = targetX - (screenTileX / 2) + 0.5;
        let targetDisplayY = targetY - (screenTileY / 2) + 0.5;

        // RPGツクールMZの標準スクロール制限を適用
        // マップがループしていない場合、端を超えてスクロールしないようにクランプ
        if (!map.isLoopHorizontal()) {
            // マップ幅が画面幅以下の場合は中央固定
            if (map.width() <= screenTileX) {
                targetDisplayX = (map.width() - screenTileX) / 2;
            } else {
                // 通常のクランプ（0 ≤ displayX ≤ width - screenTileX）
                const maxDisplayX = map.width() - screenTileX;
                targetDisplayX = Math.max(0, Math.min(targetDisplayX, maxDisplayX));
            }
        }
        if (!map.isLoopVertical()) {
            // マップ高さが画面高さ以下の場合は中央固定
            if (map.height() <= screenTileY) {
                targetDisplayY = (map.height() - screenTileY) / 2;
            } else {
                // 通常のクランプ（0 ≤ displayY ≤ height - screenTileY）
                const maxDisplayY = map.height() - screenTileY;
                targetDisplayY = Math.max(0, Math.min(targetDisplayY, maxDisplayY));
            }
        }

        // 差分
        const distX = targetDisplayX - currentX;
        const distY = targetDisplayY - currentY;

        // スクロール距離が非常に小さい場合は処理しない
        if (Math.abs(distX) < 0.01 && Math.abs(distY) < 0.01) {
            return;
        }

        // ツクールMZ標準のスクロール速度計算式を適用: Math.pow(2, speed) / 256
        const tilesPerFrame = Math.pow(2, speed) / 256;
        const totalFrames = Math.max(Math.abs(distX), Math.abs(distY)) / tilesPerFrame;

        // 1フレームあたりの移動量
        const stepX = distX / totalFrames;
        const stepY = distY / totalFrames;

        // スクロールアニメーション用の変数を設定
        if (!map._moveMapData) {
            map._moveMapData = {};
        }
        map._moveMapData.active = true;
        map._moveMapData.targetX = targetDisplayX;
        map._moveMapData.targetY = targetDisplayY;
        map._moveMapData.stepX = stepX;
        map._moveMapData.stepY = stepY;
        map._moveMapData.remainingFrames = Math.ceil(totalFrames);
        map._moveMapData.wait = wait;
        map._moveMapData.interpreter = i;

        // Game_Mapのupdateをフックしてスクロールを更新
        // （updateMainの呼び出し回数に追従させることで、
        // 　NRP_EventFastForwardなどの高速化プラグイン使用時も
        // 　ウェイトとスクロール進行がズレないようにする）
        if (!Game_Map.prototype._moveMapUpdateHooked) {
            const _Game_Map_update = Game_Map.prototype.update;
            Game_Map.prototype.update = function (sceneActive) {
                _Game_Map_update.call(this, sceneActive);
                const map = this;
                if (map && map._moveMapData && map._moveMapData.active) {
                    const data = map._moveMapData;
                    if (data.remainingFrames > 0) {
                        map._displayX += data.stepX;
                        map._displayY += data.stepY;
                        data.remainingFrames--;

                        // ウェイトが必要な場合、スクロール中は毎フレームウェイトを維持
                        if (data.wait && data.interpreter) {
                            // スクロールが完了するまでウェイトを継続
                            // _waitCount を直接操作してウェイトを維持
                            if (data.interpreter._waitCount !== undefined) {
                                data.interpreter._waitCount = Math.max(data.interpreter._waitCount || 0, 1);
                            } else {
                                // _waitCount が存在しない場合は wait() を呼び出す
                                data.interpreter.wait(1);
                            }
                        }
                    } else {
                        // 最終位置を正確に設定
                        map._displayX = data.targetX;
                        map._displayY = data.targetY;
                        data.active = false;
                    }
                }
            };
            Game_Map.prototype._moveMapUpdateHooked = true;
        }

        // ウェイト（スクロール終了待ち）
        // 最初の1フレーム分のウェイトを設定
        // 以降は Game_Map.update の中で remainingFrames > 0 の間、毎フレームウェイトを維持
        if (wait && i) {
            i.wait(1);
        }
    };

    //--------------------------------------------------------
    // ▼ キャラを中心にスクロール（ウェイトあり）
    //--------------------------------------------------------
    window.MoveToChara = function (eventId = 0, speed = 4, wait = true) {
        // 対象キャラクター取得
        let target;
        if (eventId === 0 || eventId === undefined) {
            target = $gamePlayer;
        } else {
            target = $gameMap.event(eventId);
        }

        if (!target) return;

        // キャラクターのタイル座標を取得
        // RPGツクールMZでは、xとyはタイル座標（整数）
        // 正確な位置を取得するため、実際の座標を使用
        let charX = target.x;
        let charY = target.y;

        // キャラクターが移動中の場合、実際の位置を考慮
        // _realXと_realYが存在する場合はそれを使用（小数点を含む）
        if (target._realX !== undefined) {
            charX = target._realX;
        }
        if (target._realY !== undefined) {
            charY = target._realY;
        }

        // キャラクターの座標をMoveMapに渡す
        // MoveMap内部で画面サイズの半分を引いて画面中心にする処理があるため
        MoveMap(charX, charY, speed, wait);
    };

    //--------------------------------------------------------
    // ▼ キャラを中心にスクロール（ウェイトなし）
    //--------------------------------------------------------
    window.MoveToCharaNoW = function (eventId = 0, speed = 4) {
        // 第3引数に false を渡してウェイトなしで呼び出す
        MoveToChara(eventId, speed, false);
    };

    //--------------------------------------------------------
    // ▼ 現在位置から相対スクロール（Y方向）
    //--------------------------------------------------------
    // 例）ShiftMap('p', 0, 3, 3, true)
    //   第1引数 : 'p' なら +（下へ） / 'n' なら -（上へ）
    //   第2引数 : 予約（現状未使用）
    //   第3引数 : Y方向に移動するタイル数
    //   第4引数 : スクロール速度（1～8）
    //   第5引数 : true ならスクロール完了までウェイト
    window.ShiftMap = function (sign = 'p', _dummy = 0, offsetY = 0, speed = 4, wait = false) {
        const map = $gameMap;
        if (!map) return;

        // スクロール固定を解除
        map._holdMap = false;

        const i = $gameMap._interpreter;

        // 現在の表示位置（画面左上角の座標）
        const currentX = map._displayX;
        const currentY = map._displayY;

        // 符号判定
        const s = String(sign || 'p').toLowerCase();
        const dirY = s === 'n' ? -1 : 1; // 'n' のときだけマイナス、それ以外はプラス

        const yTiles = Number(offsetY || 0);
        const targetDisplayX = currentX;
        const targetDisplayY = currentY + yTiles * dirY;

        // 差分
        const distX = targetDisplayX - currentX;
        const distY = targetDisplayY - currentY;

        // スクロール距離が非常に小さい場合は処理しない
        if (Math.abs(distX) < 0.01 && Math.abs(distY) < 0.01) {
            return;
        }

        // ツクールMZ標準のスクロール速度計算式を適用: Math.pow(2, speed) / 256
        const tilesPerFrame = Math.pow(2, speed) / 256;
        const totalFrames = Math.max(Math.abs(distX), Math.abs(distY)) / tilesPerFrame;

        // 1フレームあたりの移動量
        const stepX = distX / totalFrames;
        const stepY = distY / totalFrames;

        // スクロールアニメーション用の変数を設定
        if (!map._moveMapData) {
            map._moveMapData = {};
        }
        map._moveMapData.active = true;
        map._moveMapData.targetX = targetDisplayX;
        map._moveMapData.targetY = targetDisplayY;
        map._moveMapData.stepX = stepX;
        map._moveMapData.stepY = stepY;
        map._moveMapData.remainingFrames = Math.ceil(totalFrames);
        map._moveMapData.wait = wait;
        map._moveMapData.interpreter = i;

        // Game_Mapのupdateをフックしてスクロールを更新
        if (!Game_Map.prototype._moveMapUpdateHooked) {
            const _Game_Map_update = Game_Map.prototype.update;
            Game_Map.prototype.update = function (sceneActive) {
                _Game_Map_update.call(this, sceneActive);
                const map = this;
                if (map && map._moveMapData && map._moveMapData.active) {
                    const data = map._moveMapData;
                    if (data.remainingFrames > 0) {
                        map._displayX += data.stepX;
                        map._displayY += data.stepY;
                        data.remainingFrames--;

                        // ウェイトが必要な場合、スクロール中は毎フレームウェイトを維持
                        if (data.wait && data.interpreter) {
                            // スクロールが完了するまでウェイトを継続
                            // _waitCount を直接操作してウェイトを維持
                            if (data.interpreter._waitCount !== undefined) {
                                data.interpreter._waitCount = Math.max(data.interpreter._waitCount || 0, 1);
                            } else {
                                // _waitCount が存在しない場合は wait() を呼び出す
                                data.interpreter.wait(1);
                            }
                        }
                    } else {
                        // 最終位置を正確に設定
                        map._displayX = data.targetX;
                        map._displayY = data.targetY;
                        data.active = false;
                    }
                }
            };
            Game_Map.prototype._moveMapUpdateHooked = true;
        }

        // ウェイト（スクロール終了待ち）
        if (wait && i) {
            i.wait(1);
        }
    };

    //--------------------------------------------------------
    // ▼ マップスクロール固定
    //--------------------------------------------------------
    window.HoldMap = function (enable = true) {
        $gameMap._holdMap = enable;
    };

    // プラグインコマンド登録
    PluginManager.registerCommand(pluginName, "holdmap", args => {
        HoldMap(true);
    });

    PluginManager.registerCommand(pluginName, "releaseholdmap", args => {
        HoldMap(false);
    });

    //--------------------------------------------------------
    // ▼ Game_Map 拡張
    //--------------------------------------------------------

    // 場所移動時にフラグをリセット
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);
        this._holdMap = false;
    };

    // スクロール更新の抑制
    // updateScroll はプレイヤーの更新(Game_Player.update) -> Game_Map.updateScroll から呼ばれる
    const _Game_Map_updateScroll = Game_Map.prototype.updateScroll;
    Game_Map.prototype.updateScroll = function () {
        if (this._holdMap) return;
        _Game_Map_updateScroll.call(this);
    };

    // 標準のマップスクロール開始時にフラグをリセット
    const _Game_Map_startScroll = Game_Map.prototype.startScroll;
    Game_Map.prototype.startScroll = function (direction, distance, speed) {
        this._holdMap = false;
        _Game_Map_startScroll.call(this, direction, distance, speed);
    };

    //--------------------------------------------------------
    // ▼ Game_Player 拡張
    //--------------------------------------------------------

    // プレイヤー移動によるスクロール追従の抑制
    const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
        if ($gameMap._holdMap) return;
        _Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
    };

})();
