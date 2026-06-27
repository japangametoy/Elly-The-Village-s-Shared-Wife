/*:
 * @target MZ
 * @plugindesc キャラチップを半歩分（24px）だけ表示上ずらすプラグイン

 * @command shiftHalfStep
 * @text 半歩ずらす
 * @desc 指定したイベントの表示位置を半歩分だけずらします。
 * 
 * @arg eventId
 * @text イベントID
 * @desc 対象とするイベントのID（0:このイベント、-1:プレイヤー）。
 * @type event
 * @default 0
 * 
 * @arg direction
 * @text ずらす方向
 * @desc ずらす方向を選択します。
 * @type select
 * @option 上
 * @value 8
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @default 2
 *
 * @arg priorityType
 * @text プライオリティ
 * @desc キャラのプライオリティ（重なり順）を変更します。未指定の場合は変更しません。
 * @type select
 * @option 変更しない
 * @value -1
 * @option 通常キャラの下
 * @value 0
 * @option 通常キャラと同じ
 * @value 1
 * @option 通常キャラの上
 * @value 2
 * @default -1
 *
 * @arg moveSpeed
 * @text 移動速度
 * @desc 移動速度を指定します（1-6、0:即座に移動）。未指定の場合は即座に移動します。
 * @type number
 * @min 0
 * @max 6
 * @default 0
 *
 * @arg waitForCompletion
 * @text 完了までウェイト
 * @desc 移動完了まで待機するかどうか。ONにすると移動完了までイベントが停止します。
 * @type boolean
 * @default false
 *
 * @command shiftHalfStepRoundTrip
 * @text 半歩往復
 * @desc 指定した方向に半歩移動し、すぐに元の位置に戻ります。
 * 
 * @arg eventId
 * @text イベントID
 * @desc 対象とするイベントのID（0:このイベント、-1:プレイヤー）。
 * @type event
 * @default -1
 * 
 * @arg direction
 * @text 往路の方向
 * @desc 最初にずらす方向を選択します。復路は逆方向になります。
 * @type select
 * @option 上
 * @value 8
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @default 2
 *
 * @arg moveSpeed
 * @text 移動速度
 * @desc 移動速度を指定します（1-6、0:即座に移動）。未指定の場合は即座に移動します。
 * @type number
 * @min 0
 * @max 6
 * @default 4
 *
 * @arg waitForCompletion
 * @text 完了までウェイト
 * @desc 往復完了まで待機するかどうか。ONにすると往復完了までイベントが停止します。
 * @type boolean
 * @default true
 *
 * @command shiftHalfStepBack
 * @text 半歩戻す
 * @desc 指定したイベントを移動前の座標の表示位置に戻します。向きは変更しません。
 * 
 * @arg eventId
 * @text イベントID
 * @desc 対象とするイベントのID（0:このイベント、-1:プレイヤー）。
 * @type event
 * @default 0
 *
 * @arg moveSpeed
 * @text 移動速度
 * @desc 移動速度を指定します（1-6、0:即座に移動）。未指定の場合は即座に移動します。
 * @type number
 * @min 0
 * @max 6
 * @default 0
 *
 * @arg waitForCompletion
 * @text 完了までウェイト
 * @desc 移動完了まで待機するかどうか。ONにすると移動完了までイベントが停止します。
 * @type boolean
 * @default false
 *
 * @help
 * キャラクターの内部座標は変えずに、見た目だけを半歩分（24px）ずらします。
 * 「接触している」ような演出に便利です。
 * 
 * 【仕様】
 * ・当たり判定（座標）は元の位置のままです。
 * ・移動速度を指定すると、その速度で歩行モーションしながら移動します。
 * ・移動速度0の場合は即座に移動します。
 * ・「完了までウェイト」をONにすると、移動完了までイベントが停止します。
 * ・「半歩戻す」コマンドで、移動前の座標の表示位置に戻すことができます。
 *   この時、キャラクターの向きは変更されません。
 * ・「移動ルートの設定」などでそのキャラクターが実際に移動を開始すると、
 *   このずらし状態は自動的にリセット（0に戻る）されます。
 */

(() => {
    // プラグイン名はファイル名（拡張子なし）と一致させる必要があります
    const pluginName = "ShiftHalfmove";

    PluginManager.registerCommand(pluginName, "shiftHalfStep", function (args) {
        const eventId = Number(args.eventId || 0);
        const direction = Number(args.direction || 2);
        const priorityType = args.priorityType !== undefined ? Number(args.priorityType) : -1;
        const moveSpeed = args.moveSpeed !== undefined ? Number(args.moveSpeed) : 0;
        const waitForCompletion = args.waitForCompletion === "true" || args.waitForCompletion === true;

        // this は Game_Interpreter インスタンスとして呼ばれることを想定
        const currentEventId = (this && this.eventId) ? this.eventId() : 0;
        const realEventId = eventId === 0 ? currentEventId : eventId;
        const event = realEventId === -1 ? $gamePlayer : (realEventId > 0 ? $gameMap.event(realEventId) : null);

        if (event) {
            // 移動前の座標を記録（オフセットが0の時のみ、つまり最初の移動時）
            if ((event._offsetX === 0 || event._offsetX === undefined) &&
                (event._offsetY === 0 || event._offsetY === undefined)) {
                event._originalOffsetX = 0;
                event._originalOffsetY = 0;
            }

            const step = $gameMap.tileWidth() / 2;
            let targetOffsetX = 0;
            let targetOffsetY = 0;

            switch (direction) {
                case 2: targetOffsetY = step; break; // 下
                case 4: targetOffsetX = -step; break; // 左
                case 6: targetOffsetX = step; break; // 右
                case 8: targetOffsetY = -step; break; // 上
            }

            // 移動速度が0の場合は即座に移動
            if (moveSpeed === 0) {
                event._offsetX = targetOffsetX;
                event._offsetY = targetOffsetY;
                // 即座に移動する場合はウェイト不要（既に完了している）
            } else {
                // アニメーション移動を開始
                event._offsetTargetX = targetOffsetX;
                event._offsetTargetY = targetOffsetY;
                event._offsetStartX = event._offsetX || 0;
                event._offsetStartY = event._offsetY || 0;
                event._offsetProgress = 0;
                event._offsetSpeed = moveSpeed;
                event._isOffsetAnimating = true;
                event._waitForOffsetCompletion = waitForCompletion;

                // 歩行モーションを開始（向きは変更しない）
                if (event.isOriginalPattern()) {
                    event.setPattern(1); // 歩行パターン
                }

                // ウェイトが必要な場合、インタープリターを待機状態にする
                if (waitForCompletion && this && this.setWaitMode) {
                    // 対象イベントIDを保存
                    this._waitingOffsetEventId = realEventId;
                    this.setWaitMode("offsetAnimation");
                }
            }

            // プライオリティ変更（未指定の場合は変更しない）
            if (priorityType >= 0) {
                event.setPriorityType(priorityType);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "shiftHalfStepRoundTrip", function (args) {
        const eventId = Number(args.eventId || -1);
        const direction = Number(args.direction || 2);
        const moveSpeed = args.moveSpeed !== undefined ? Number(args.moveSpeed) : 4;
        const waitForCompletion = args.waitForCompletion === "true" || args.waitForCompletion === true;

        // this は Game_Interpreter インスタンスとして呼ばれることを想定
        const currentEventId = (this && this.eventId) ? this.eventId() : 0;
        const realEventId = eventId === 0 ? currentEventId : eventId;
        const event = realEventId === -1 ? $gamePlayer : (realEventId > 0 ? $gameMap.event(realEventId) : null);

        if (event) {
            // 移動前の座標を記録（オフセットが0の時のみ、つまり最初の移動時）
            if ((event._offsetX === 0 || event._offsetX === undefined) &&
                (event._offsetY === 0 || event._offsetY === undefined)) {
                event._originalOffsetX = 0;
                event._originalOffsetY = 0;
            }

            const step = $gameMap.tileWidth() / 2;
            let targetOffsetX = 0;
            let targetOffsetY = 0;

            switch (direction) {
                case 2: targetOffsetY = step; break; // 下
                case 4: targetOffsetX = -step; break; // 左
                case 6: targetOffsetX = step; break; // 右
                case 8: targetOffsetY = -step; break; // 上
            }

            // 移動速度が0の場合は即座に移動（往復なので一瞬だけずらして戻すことになるが、実質変化なし）
            if (moveSpeed === 0) {
                // 何もしない
            } else {
                // アニメーション移動を開始
                event._offsetTargetX = targetOffsetX;
                event._offsetTargetY = targetOffsetY;
                event._offsetStartX = event._offsetX || 0;
                event._offsetStartY = event._offsetY || 0;
                event._offsetProgress = 0;
                event._offsetSpeed = moveSpeed;
                event._isOffsetAnimating = true;
                event._waitForOffsetCompletion = waitForCompletion;
                event._isOffsetRoundTrip = true;

                // 歩行モーションを開始（向きは変更しない）
                if (event.isOriginalPattern()) {
                    event.setPattern(1); // 歩行パターン
                }

                // ウェイトが必要な場合、インタープリターを待機状態にする
                if (waitForCompletion && this && this.setWaitMode) {
                    // 対象イベントIDを保存
                    this._waitingOffsetEventId = realEventId;
                    this.setWaitMode("offsetAnimation");
                }
            }
        }
    });

    PluginManager.registerCommand(pluginName, "shiftHalfStepBack", function (args) {
        const eventId = Number(args.eventId || 0);
        const moveSpeed = args.moveSpeed !== undefined ? Number(args.moveSpeed) : 0;
        const waitForCompletion = args.waitForCompletion === "true" || args.waitForCompletion === true;

        // this は Game_Interpreter インスタンスとして呼ばれることを想定
        const currentEventId = (this && this.eventId) ? this.eventId() : 0;
        const realEventId = eventId === 0 ? currentEventId : eventId;
        const event = realEventId === -1 ? $gamePlayer : (realEventId > 0 ? $gameMap.event(realEventId) : null);

        if (event) {
            // 移動前の座標を取得（記録されていない場合は0に戻す）
            const targetOffsetX = event._originalOffsetX !== undefined ? event._originalOffsetX : 0;
            const targetOffsetY = event._originalOffsetY !== undefined ? event._originalOffsetY : 0;

            // 移動速度が0の場合は即座に移動
            if (moveSpeed === 0) {
                event._offsetX = targetOffsetX;
                event._offsetY = targetOffsetY;
                // 即座に移動する場合はウェイト不要（既に完了している）
            } else {
                // アニメーション移動を開始（向きは変更しない）
                event._offsetTargetX = targetOffsetX;
                event._offsetTargetY = targetOffsetY;
                event._offsetStartX = event._offsetX || 0;
                event._offsetStartY = event._offsetY || 0;
                event._offsetProgress = 0;
                event._offsetSpeed = moveSpeed;
                event._isOffsetAnimating = true;
                event._waitForOffsetCompletion = waitForCompletion;

                // 歩行モーションを開始（向きは変更しない）
                if (event.isOriginalPattern()) {
                    event.setPattern(1); // 歩行パターン
                }

                // ウェイトが必要な場合、インタープリターを待機状態にする
                if (waitForCompletion && this && this.setWaitMode) {
                    // 対象イベントIDを保存
                    this._waitingOffsetEventId = realEventId;
                    this.setWaitMode("offsetAnimation");
                }
            }
        }
    });

    // 初期化時にオフセット用プロパティを用意
    const _Game_CharacterBase_initialize = Game_CharacterBase.prototype.initialize;
    Game_CharacterBase.prototype.initialize = function () {
        _Game_CharacterBase_initialize.call(this);
        this._offsetX = 0;
        this._offsetY = 0;
        this._offsetTargetX = 0;
        this._offsetTargetY = 0;
        this._offsetStartX = 0;
        this._offsetStartY = 0;
        this._offsetProgress = 0;
        this._offsetSpeed = 0;
        this._isOffsetAnimating = false;
        this._waitForOffsetCompletion = false;
        this._isOffsetRoundTrip = false;
        this._originalOffsetX = 0;
        this._originalOffsetY = 0;
    };

    // 移動速度から1フレームあたりの移動距離を計算
    function getDistancePerFrame(speed) {
        // RPGツクールMZの移動速度1-6に対応
        // 速度1: 1/256, 速度2: 1/128, 速度3: 1/64, 速度4: 1/32, 速度5: 1/16, 速度6: 1/8
        const speeds = [1 / 256, 1 / 128, 1 / 64, 1 / 32, 1 / 16, 1 / 8];
        const index = Math.max(0, Math.min(5, speed - 1));
        return speeds[index];
    }

    // オフセットアニメーション更新処理
    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function () {
        _Game_CharacterBase_update.call(this);

        // オフセットアニメーション中の場合
        if (this._isOffsetAnimating) {
            // 移動速度に基づいて進捗を更新
            const distancePerFrame = getDistancePerFrame(this._offsetSpeed);
            const totalDistance = Math.sqrt(
                Math.pow(this._offsetTargetX - this._offsetStartX, 2) +
                Math.pow(this._offsetTargetY - this._offsetStartY, 2)
            );

            if (totalDistance > 0) {
                // 1フレームあたりの進捗率を計算
                const progressPerFrame = (distancePerFrame * $gameMap.tileWidth()) / totalDistance;
                this._offsetProgress += progressPerFrame;

                // 歩行モーションのパターンアニメーション
                if (this.isOriginalPattern() && this._offsetProgress < 1.0) {
                    const patternCycle = Math.floor(this._offsetProgress * 4) % 2; // 0-1を繰り返す
                    this.setPattern(patternCycle === 0 ? 1 : 2); // 歩行パターン1と2を交互に
                }
            }

            if (this._offsetProgress >= 1.0) {
                // アニメーション完了
                this._offsetX = this._offsetTargetX;
                this._offsetY = this._offsetTargetY;
                this._offsetProgress = 0;

                if (this._isOffsetRoundTrip) {
                    this._isOffsetRoundTrip = false;
                    // 復路の設定
                    this._offsetStartX = this._offsetX;
                    this._offsetStartY = this._offsetY;
                    this._offsetTargetX = this._originalOffsetX || 0;
                    this._offsetTargetY = this._originalOffsetY || 0;
                    // アニメーション継続
                    this._isOffsetAnimating = true;
                } else {
                    this._isOffsetAnimating = false;

                    // 歩行モーションを停止（元のパターンに戻す）
                    if (this.isOriginalPattern()) {
                        this.setPattern(0); // 停止パターン
                    }
                }
            } else {
                // 線形補間でオフセットを更新
                this._offsetX = this._offsetStartX + (this._offsetTargetX - this._offsetStartX) * this._offsetProgress;
                this._offsetY = this._offsetStartY + (this._offsetTargetY - this._offsetStartY) * this._offsetProgress;
            }
        }
    };

    // 描画位置をオフセットする
    const _Game_CharacterBase_screenX = Game_CharacterBase.prototype.screenX;
    Game_CharacterBase.prototype.screenX = function () {
        const baseX = _Game_CharacterBase_screenX.call(this);
        const offsetX = this._offsetX || 0;
        return baseX + offsetX;
    };

    const _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function () {
        const baseY = _Game_CharacterBase_screenY.call(this);
        const offsetY = this._offsetY || 0;
        return baseY + offsetY;
    };

    // 移動が始まったらオフセットをリセットする処理
    const _Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
    Game_CharacterBase.prototype.updateMove = function () {
        // 実際の移動が始まった場合、オフセットアニメーションをキャンセル
        if (this._isOffsetAnimating || this._offsetX !== 0 || this._offsetY !== 0) {
            this._offsetX = 0;
            this._offsetY = 0;
            this._offsetTargetX = 0;
            this._offsetTargetY = 0;
            this._offsetStartX = 0;
            this._offsetStartY = 0;
            this._offsetProgress = 0;
            this._isOffsetAnimating = false;
            this._waitForOffsetCompletion = false;
            this._isOffsetRoundTrip = false;
        }
        _Game_CharacterBase_updateMove.call(this);
    };

    // インタープリターの待機処理をオーバーライド
    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        const waiting = this._waitMode === "offsetAnimation";
        if (waiting) {
            // 保存された対象イベントIDを使用してアニメーション状態をチェック
            const eventId = this._waitingOffsetEventId !== undefined ? this._waitingOffsetEventId : 0;
            const event = eventId === -1 ? $gamePlayer : (eventId > 0 && $gameMap ? $gameMap.event(eventId) : null);

            if (event && !event._isOffsetAnimating) {
                // アニメーション完了：待機を解除
                this._waitMode = "";
                this._waitingOffsetEventId = undefined;
                return false;
            }
            // アニメーション中：待機を継続
            return true;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

})();