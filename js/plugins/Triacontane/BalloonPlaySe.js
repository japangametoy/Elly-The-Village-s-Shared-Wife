//=============================================================================
// BalloonPlaySe.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/10/29 MZで動作するよう修正
// 1.0.0 2017/12/13 初版
// [MODIFIED] Added requestSilentBalloon for no SE playback
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フキダシアイコンのSE演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPlaySe.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param SwitchId
 * @text 有効スイッチ番号
 * @desc プラグインの機能を有効にするスイッチ番号です。0にすると無条件で演奏されます。
 * @default 0
 * @type switch
 *
 * @param SeInfo
 * @text 効果音情報
 * @desc フキダシアイコン表示時に演奏される効果音情報です。対象のアイコンおよび対応する効果音を選択してください。
 * @default
 * @type struct<SE>[]
 *
 * @param DebugMode
 * @text デバッグモード
 * @desc ONにするとコンソールにデバッグ情報を出力します。問題解決時に使用します。
 * @default false
 * @type boolean
 *
 * @help BalloonPlaySe.js
 *
 * フキダシアイコンが表示される瞬間に、
 * パラメータで指定した効果音を自動で演奏します。
 *
 * スクリプトコマンド this.requestSilentBalloon(targetCharacter, balloonId);
 * を使用すると、そのフキダシのSEは再生されません。
 * targetCharacterには、this (イベント自身) や $gamePlayer などキャラクターオブジェクトを指定します。
 * balloonIdには、フキダシのID (1:びっくり、2:はてな等) を指定します。
 *
 * 例: イベントの自律移動のスクリプトで、音を鳴らさずに「びっくり」フキダシを出す場合
 * this.requestSilentBalloon(this, 1);
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SE:
 *
 * @param Balloon
 * @text フキダシアイコン
 * @desc SEを演奏する対象のフキダシアイコンです。
 * (1:びっくり 2:はてな 3:音符 4:ハート 5:怒り....)
 * @default 1
 * @type select
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザ定義1
 * @value 11
 * @option ユーザ定義2
 * @value 12
 * @option ユーザ定義3
 * @value 13
 * @option ユーザ定義4
 * @value 14
 * @option ユーザ定義5
 * @value 15
 *
 * @param name
 * @text SEファイル名
 * @desc SEのファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text SEボリューム
 * @desc SEのボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text SEピッチ
 * @desc SEのピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text SEバランス
 * @desc SEの左右バランスです。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 *
 * @param waitFrames
 * @text 開始ウェイトフレーム
 * @desc SE再生を指定したフレーム数だけ遅らせます。0フレームで即時再生。
 * @type number
 * @default 0
 * @min 0
 *
 * @param immediateWaitAfterSeStartFrames
 * @text SE開始直後ウェイトフレーム
 * @desc SE再生が開始された直後に、指定したフレーム数だけイベントの進行を停止（ウェイト）します。0でウェイトなし。
 * @type number
 * @default 0
 * @min 0
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    param.DebugMode = param.DebugMode === true || param.DebugMode === "true";
    if (!param.SeInfo) {
        param.SeInfo = [];
    }
    param.SeInfo.forEach(se => {
        se.waitFrames = parseInt(se.waitFrames, 10) || 0;
        se.immediateWaitAfterSeStartFrames = parseInt(se.immediateWaitAfterSeStartFrames, 10) || 0;
    });

    // デバッグログ関数
    const debugLog = function(message, ...args) {
        if (param.DebugMode) {
            console.log("[BalloonPlaySe] " + message, ...args);
        }
    };
    
    const debugWarn = function(message, ...args) {
        if (param.DebugMode) {
            console.warn("[BalloonPlaySe] " + message, ...args);
        }
    };
    
    const debugError = function(message, ...args) {
        if (param.DebugMode) {
            console.error("[BalloonPlaySe] " + message, ...args);
        }
    };

    //=============================================================================
    // Game_Temp
    //=============================================================================
    const _Game_Temp_initialize_Alias = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize_Alias.apply(this, arguments);
        this._requestedSilentCharacters = new Set();
        this._isConfiguredWaitBalloonRequestCharacters = new Set();
        // Fallback flags (should ideally be deprecated or managed carefully if other plugins interact)
        this._isNextBalloonSilent = false;
        this._isConfiguredWaitBalloonRequest = false;
    };

    Game_Temp.prototype.clearBalloonRequestFlags = function() {
        // Clears only the global fallback flags
        this._isNextBalloonSilent = false;
        this._isConfiguredWaitBalloonRequest = false;
        // Note: Character-specific sets are managed by consumption in Sprite_Balloon.setup
    };

    Game_Temp.prototype.requestSilentBalloon = function(target, balloonId) {
        if (target) {
            this._requestedSilentCharacters.add(target);
            debugLog("Game_Temp.requestSilentBalloon: Added target to _requestedSilentCharacters. Target:", target);
        } else {
            debugWarn("Game_Temp.requestSilentBalloon: Target is invalid, cannot add to _requestedSilentCharacters.");
        }
        this.requestBalloon(target, balloonId); // Core balloon request
    };

    // For the new script command
    Game_Temp.prototype.requestConfiguredWaitBalloon = function(target, balloonId) {
        if (target) {
            this._isConfiguredWaitBalloonRequestCharacters.add(target);
            debugLog("Game_Temp.requestConfiguredWaitBalloon: Added target to _isConfiguredWaitBalloonRequestCharacters. Target:", target);
        } else {
            debugWarn("Game_Temp.requestConfiguredWaitBalloon: Target is invalid, cannot add to _isConfiguredWaitBalloonRequestCharacters.");
        }
        this.requestBalloon(target, balloonId); // Core balloon request
    };
    
    //=============================================================================
    // Game_Interpreter
    //=============================================================================
    // Remove previous updateWait alias if it exists (it's no longer needed for postWaitFrames)
    // Game_Interpreter.prototype.updateWait = Game_Interpreter.prototype.updateWait || function() { return false; }; // Ensure original exists
    // No longer aliasing updateWait as postWaitFrames logic is removed.

    // Script command for silent balloon
    Game_Interpreter.prototype.requestSilentBalloon = function(target, balloonId) {
        let actualTarget = target;
        if (target === this) { 
             actualTarget = this.character(0); 
        }
        if (actualTarget) {
            $gameTemp.requestSilentBalloon(actualTarget, balloonId);
        }
    };

    // New Script Command for Game_Interpreter - Renamed
    Game_Interpreter.prototype.requestBalloonWaits = function(target, balloonId) {
        let actualTarget = target;
        if (target === this) {
            actualTarget = this.character(0);
        }
        if (!actualTarget) {
            debugError("requestBalloonWaits: Invalid target specified.");
            return;
        }

        const balloonSe = param.SeInfo.find(info => info.Balloon === balloonId);

        // 1. Handle pre-SE wait from plugin settings (waitFrames)
        if (balloonSe && balloonSe.waitFrames > 0) {
            debugLog("ScriptCmd (requestBalloonWaits): Applying plugin start waitFrames:", balloonSe.waitFrames);
            this.wait(balloonSe.waitFrames);
        }

        // 2. Request balloon & SE
        debugLog("ScriptCmd (requestBalloonWaits): Requesting balloon. Target:", actualTarget, "ID:", balloonId);
        $gameTemp.requestConfiguredWaitBalloon(actualTarget, balloonId); // Internal Game_Temp call name remains the same

        // 3. Apply immediateWaitAfterSeStartFrames from plugin settings
        if (balloonSe && balloonSe.immediateWaitAfterSeStartFrames > 0) {
            debugLog("ScriptCmd (requestBalloonWaits): Applying immediateWaitAfterSeStartFrames:", balloonSe.immediateWaitAfterSeStartFrames);
            this.wait(balloonSe.immediateWaitAfterSeStartFrames);
        }
    };

    // For script calls like `$gamePlayer.requestSilentBalloon(id)`
    Game_Character.prototype.requestSilentBalloon = function(balloonId) {
        $gameTemp.requestSilentBalloon(this, balloonId);
    };
    
    //=============================================================================
    // Sprite_Balloon
    //=============================================================================
    const _Sprite_Balloon_setup_Alias = Sprite_Balloon.prototype.setup;
    Sprite_Balloon.prototype.setup = function(targetSprite, balloonId) {
        let playSe = true;
        let isFromConfiguredWaitScript = false;
        const character = this.targetObject; // Assuming this.targetObject is set by Spriteset_Map.createBalloon

        // Priority 1: Character-specific silent request
        if (character && $gameTemp._requestedSilentCharacters && $gameTemp._requestedSilentCharacters.has(character)) {
            debugLog("Sprite_Balloon.setup: Silent request for character (Set). playSe=false. Char:", character);
            playSe = false;
            $gameTemp._requestedSilentCharacters.delete(character); // Consume request
        }
        // Priority 2: Character-specific configured wait request (for requestBalloonWaits script command)
        else if (character && $gameTemp._isConfiguredWaitBalloonRequestCharacters && $gameTemp._isConfiguredWaitBalloonRequestCharacters.has(character)) {
            debugLog("Sprite_Balloon.setup: Configured wait request for character (Set). Char:", character);
            isFromConfiguredWaitScript = true; // Skips waitFrames in playBalloonSe, as interpreter handles it
            $gameTemp._isConfiguredWaitBalloonRequestCharacters.delete(character); // Consume request
        }
        // Fallback to global flags (for compatibility or other direct flag manipulations)
        else if ($gameTemp._isNextBalloonSilent) {
            debugLog("Sprite_Balloon.setup: Silent request (global _isNextBalloonSilent fallback). playSe=false.");
            playSe = false;
            $gameTemp._isNextBalloonSilent = false; // Reset global flag
        } else if ($gameTemp._isConfiguredWaitBalloonRequest) {
            debugLog("Sprite_Balloon.setup: Configured wait request (global _isConfiguredWaitBalloonRequest fallback).");
            isFromConfiguredWaitScript = true;
            $gameTemp._isConfiguredWaitBalloonRequest = false; // Reset global flag
        }

        _Sprite_Balloon_setup_Alias.apply(this, arguments); // Call original setup

        if (!playSe) {
            debugLog("Sprite_Balloon.setup: Final decision: playSe is false, SE playback is skipped.");
        } else if (this.isNeedPlayBalloonSe()) {
            debugLog("Sprite_Balloon.setup: Final decision: playSe is true and SE is needed. Calling playBalloonSe.");
            this.playBalloonSe(balloonId, isFromConfiguredWaitScript);
        } else {
            debugLog("Sprite_Balloon.setup: Final decision: playSe is true BUT SE is not needed (e.g. switch off). SE skipped.");
        }
    };

    // Modified to accept a flag to skip its own waitFrames logic
    Sprite_Balloon.prototype.playBalloonSe = function(balloonId, isFromConfiguredWaitScript = false) {
        const balloonSe = param.SeInfo.find(info => info.Balloon === balloonId);
        if (balloonSe) {
            const seToPlay = {
                name: balloonSe.name,
                volume: balloonSe.volume,
                pitch: balloonSe.pitch,
                pan: balloonSe.pan
            };

            const playNow = () => {
                debugLog("playNow: Preparing to play SE. SE info:", JSON.stringify(seToPlay));
                const audio = AudioManager.playSe(seToPlay); 
                debugLog("playNow: SE played, audio object:", audio);
            };

            if (isFromConfiguredWaitScript) {
                debugLog("playBalloonSe: Called from ConfiguredWait script, playing SE immediately (interpreter handled waitFrames).");
                playNow();
                $gameTemp.clearBalloonRequestFlags(); // Clear flag after use
            } else if (balloonSe.waitFrames > 0) {
                debugLog("playBalloonSe: Applying waitFrames (", balloonSe.waitFrames, ") before playing SE.");
                setTimeout(playNow, balloonSe.waitFrames * (1000 / 60));
            } else {
                playNow();
            }
        }
    };

    Sprite_Balloon.prototype.isNeedPlayBalloonSe = function() {
        return (!param.SwitchId || $gameSwitches.value(param.SwitchId));
    };
})();

