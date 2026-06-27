/*=============================================================================
 BalloonPosition.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/08/12 プレイヤーやイベントのフキダシ位置を可変にできるパラメータを追加
 1.0.2 2021/01/28 MZで動作するよう修正
 1.0.1 2021/01/28 英語ヘルプを記述
 1.0.0 2021/01/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BalloonPositionPlugin
 * @author triacontane
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPosition.js
 * @target MZ
 * @base PluginCommonBase
 *
 * @param BalloonXNoImage
 * @desc Uniformly adjusts the x of balloon for events where no image is specified.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonYNoImage
 * @desc Uniformly adjusts the y of balloon for events where no image is specified.
 * @default 0
 * @min -2000
 * @max 2000
 *
 * @param BalloonXPlayer
 * @text プレイヤーX座標変数
 * @desc プレイヤーのフキダシX座標を取得する変数です。
 * @default 0
 * @type variable
 *
 * @param BalloonYPlayer
 * @text プレイヤーY座標変数
 * @desc プレイヤーのフキダシY座標を取得する変数です。
 * @default 0
 * @type variable
 *
 * @param BalloonXEvent
 * @text イベントX座標変数
 * @desc イベントのフキダシX座標を取得する変数です。値が入っているとき、メモ欄の指定より優先されます。
 * @default 0
 * @type variable
 *
 * @param BalloonYEvent
 * @text プレイヤーY座標変数
 * @desc イベントのフキダシY座標を取得する変数です。値が入っているとき、メモ欄の指定より優先されます。
 * @default 0
 * @type variable
 *
 * @help BalloonPosition.js
 *
 * Adjusts the display coordinates of balloon
 * <BalloonX:5>
 * <BalloonY:-5>
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フキダシ位置調整プラグイン
 * @author トリアコンタン
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPosition.js
 * @target MZ
 * @base PluginCommonBase
 *
 * @param DefaultBalloonXNoImage
 * @text デフォルト画像なしX座標
 * @desc 画像が指定されていないキャラクターのフキダシX座標のデフォルト値を指定します。メモ欄や変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonYNoImage
 * @text デフォルト画像なしY座標
 * @desc 画像が指定されていないキャラクターのフキダシY座標のデフォルト値を指定します。メモ欄や変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonXPlayer
 * @text デフォルトプレイヤーX座標
 * @desc プレイヤーのフキダシX座標のデフォルト値を指定します。変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonYPlayer
 * @text デフォルトプレイヤーY座標
 * @desc プレイヤーのフキダシY座標のデフォルト値を指定します。変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonYPlayerChildhood
 * @text デフォルト子ども用プレイヤーY座標
 * @desc プレイヤーの画像名に"childhood"が含まれる場合のフキダシY座標のデフォルト値を指定します。通常のデフォルト値より優先され、変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonXEvent
 * @text デフォルトイベントX座標
 * @desc イベントのフキダシX座標のデフォルト値を指定します。メモ欄や変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param DefaultBalloonYEvent
 * @text デフォルトイベントY座標
 * @desc イベントのフキダシY座標のデフォルト値を指定します。メモ欄や変数指定がない場合に適用されます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonXNoImage
 * @text 画像なしX座標調整
 * @desc 画像が指定されていないイベントのフキダシX座標を調整します。デフォルト値より優先され、変数設定によって上書きされます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonYNoImage
 * @text 画像なしY座標調整
 * @desc 画像が指定されていないイベントのフキダシY座標を調整します。デフォルト値より優先され、変数設定によって上書きされます。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonXPlayer
 * @text プレイヤーX座標変数
 * @desc プレイヤーのフキダシX座標を取得する変数です。デフォルト値より優先されます。
 * @default 0
 * @type variable
 *
 * @param BalloonYPlayer
 * @text プレイヤーY座標変数
 * @desc プレイヤーのフキダシY座標を取得する変数です。デフォルト値より優先されます。
 * @default 0
 * @type variable
 *
 * @param BalloonXEvent
 * @text イベントX座標変数
 * @desc イベントのフキダシX座標を取得する変数です。値が入っているとき、メモ欄およびデフォルト値の指定より優先されます。
 * @default 0
 * @type variable
 *
 * @param BalloonYEvent
 * @text イベントY座標変数
 * @desc イベントのフキダシY座標を取得する変数です。値が入っているとき、メモ欄およびデフォルト値の指定より優先されます。
 * @default 0
 * @type variable
 *
 * @help BalloonPosition.js
 *
 * フキダシの表示座標を調整します。
 * イベントのメモ欄に以下の通り入力してください。
 * <BalloonX:5>  # フキダシのX座標を右に[5]ずらします。
 * <BalloonY:-5> # フキダシのY座標を上に[5]ずらします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Game_CharacterBase
     * フキダシの座標を取得可能にします。
     */
    Game_CharacterBase.prototype.isNoImage = function() {
        return !this._tileId && !this._characterName;
    };

    Game_CharacterBase.prototype.findBalloonX = function() {
        return 0;
    };

    Game_CharacterBase.prototype.findBalloonY = function() {
        return 0;
    };

    Game_Player.prototype.findBalloonX = function() {
        // 1. 新しいプラグインパラメータによるデフォルト値
        let x = param.DefaultBalloonXPlayer !== undefined ? Number(param.DefaultBalloonXPlayer) : 0;

        // 2. 変数の値で上書き
        const variableX = $gameVariables.value(param.BalloonXPlayer);
        if (variableX) { // 変数に値が入っていれば最優先
            x = Number(variableX);
        }
        return x;
    };

    Game_Player.prototype.findBalloonY = function() {
        // 1. 新しいプラグインパラメータによるデフォルト値
        let y = param.DefaultBalloonYPlayer !== undefined ? Number(param.DefaultBalloonYPlayer) : 0;

        // 1.5. 画像名に"childhood"が含まれる場合は子ども用のデフォルト値を使用
        const characterName = this._characterName || '';
        if (characterName.toLowerCase().includes('childhood')) {
            y = param.DefaultBalloonYPlayerChildhood !== undefined ? Number(param.DefaultBalloonYPlayerChildhood) : y;
        }

        // 2. 変数の値で上書き
        const variableY = $gameVariables.value(param.BalloonYPlayer);
        if (variableY) { // 変数に値が入っていれば最優先
            y = Number(variableY);
        }
        return y;
    };


    /**
     * Game_Event
     * フキダシの座標をメモ欄から取得します。
     */
    Game_Event.prototype.findBalloonX = function() {
        let x;
        const eventData = this.event();

        if (this.isNoImage()) {
            // 1. 新しいプラグインパラメータによるデフォルト値
            x = param.DefaultBalloonXNoImage !== undefined ? Number(param.DefaultBalloonXNoImage) : 0;

            // 2. 既存の画像なし用調整値 (param.BalloonXNoImage) で上書き (メモ欄の代わり)
            if (param.BalloonXNoImage !== undefined) {
                 x = Number(param.BalloonXNoImage);
            }
        } else {
            // 1. 新しいプラグインパラメータによるデフォルト値
            x = param.DefaultBalloonXEvent !== undefined ? Number(param.DefaultBalloonXEvent) : 0;

            // 2. メモ欄の値で上書き
            const metaX = PluginManagerEx.findMetaValue(eventData, 'BalloonX');
            if (metaX !== undefined && metaX !== null) {
                x = Number(metaX);
            }
        }

        // 3. 変数の値で最終的に上書き (イベント・画像なし共通)
        const variableX = $gameVariables.value(param.BalloonXEvent);
        if (variableX) { // 変数に値が入っていれば最優先
            x = Number(variableX);
        }
        return x;
    };

    Game_Event.prototype.findBalloonY = function() {
        let y;
        const eventData = this.event();

        if (this.isNoImage()) {
            // 1. 新しいプラグインパラメータによるデフォルト値
            y = param.DefaultBalloonYNoImage !== undefined ? Number(param.DefaultBalloonYNoImage) : 0;

            // 2. 既存の画像なし用調整値 (param.BalloonYNoImage) で上書き (メモ欄の代わり)
            if (param.BalloonYNoImage !== undefined) {
                y = Number(param.BalloonYNoImage);
            }
        } else {
            // 1. 新しいプラグインパラメータによるデフォルト値
            y = param.DefaultBalloonYEvent !== undefined ? Number(param.DefaultBalloonYEvent) : 0;

            // 2. メモ欄の値で上書き
            const metaY = PluginManagerEx.findMetaValue(eventData, 'BalloonY');
            if (metaY !== undefined && metaY !== null) {
                y = Number(metaY);
            }
        }

        // 3. 変数の値で最終的に上書き (イベント・画像なし共通)
        const variableY = $gameVariables.value(param.BalloonYEvent);
        if (variableY) { // 変数に値が入っていれば最優先
            y = Number(variableY);
        }
        return y;
    };

    /**
     * Sprite_Balloon
     * フキダシの表示位置を調整します。
     */
    const _Sprite_Balloon_updatePosition = Sprite_Balloon.prototype.updatePosition;
    Sprite_Balloon.prototype.updatePosition = function() {
        _Sprite_Balloon_updatePosition.apply(this, arguments);
        if (this.targetObject && this.targetObject instanceof Game_CharacterBase) {
            this.x += this.targetObject.findBalloonX();
            this.y += this.targetObject.findBalloonY();
        }
    };
})();
