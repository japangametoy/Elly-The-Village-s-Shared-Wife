//=============================================================================
// SimpleVoice.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.5 2025/02/24 config.rmmzsaveが存在しない状態でゲーム開始したとき、ボイス音量のデフォルト値が反映されない問題を修正
// 2.0.4 2024/11/12 オプションウィンドウの項目数をボイス音量の項目に合わせてひとつ追加
// 2.0.3 2023/07/27 サブフォルダを指定したボイス停止ができていなかった問題を修正
// 2.0.2 2022/02/19 ボイスファイルに制御文字\v[n]が指定できるよう修正
// 2.0.1 2021/05/16 サブフォルダを指定できるよう修正
// 2.0.0 2021/03/17 MZで動作するよう修正し、仕様を見直し
// 1.1.3 2020/04/15 1.1.2の修正で同時再生したボイスの停止が動作しない問題を修正
// 1.1.2 2020/04/08 異なるチャンネルで短い間隔で複数のボイスを再生した場合に、先に再生したボイスが演奏されない問題を修正
// 1.1.1 2019/01/22 イベント高速化で再生したとき、SV_STOP_VOICEが効かなくなる場合がある問題を修正
// 1.1.0 2017/07/16 ボイスのチャンネル指定機能を追加。同一チャンネルのボイスが同時再生されないようになります。
// 1.0.1 2017/06/26 英語表記のプラグインコマンドの指定方法を変更
// 1.0.0 2017/06/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 簡易ボイスプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SimpleVoice.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param optionName
 * @text オプション名称
 * @type string
 * @desc オプション画面に表示されるボイス音量の設定項目名称です。
 * @default ボイス 音量
 *
 * @param optionValue
 * @text オプション初期値
 * @type number
 * @desc ボイス音量の初期値です。
 * @default 100
 *
 * @param decayRate
 * @text 距離減衰率
 * @desc 音源との距離が1マス離れるごとの音量の減衰率(%)。0に近いほど急激に減衰します。
 * @default 85
 * @type number
 * @min 0
 *
 * @param cutoffVolume
 * @text 最小再生音量
 * @desc 距離減衰計算後、この音量(%)未満になった場合に再生を停止します。
 * @default 1
 * @type number
 * @min 0
 * @max 100
 *
 * @command PLAY_VOICE
 * @text ボイスの演奏
 * @desc ボイスを演奏します。
 *
 * @arg name
 * @text ファイル名称
 * @desc ボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc ボイスファイルの音量
 * @default 90
 * @min 0
 * @max 100
 * @type number
 *
 * @arg pitch
 * @text ピッチ
 * @desc ボイスファイルのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 左右バランス
 * @desc ボイスファイルの左右バランス
 * @default 0
 * @min -100
 * @max 100
 * @type number
 *
 * @arg channel
 * @text チャンネル番号
 * @desc チャンネル番号です。同一のチャンネル番号のボイスは重なって演奏されなくなります。
 * @default 0
 * @type number
 *
 * @arg loop
 * @text ループ有無
 * @desc ボイスの再生をループするかどうかです。
 * @default false
 * @type boolean
 *
 * @arg adjustBgmVolume
 * @text BGM音量調整
 * @desc このボイス再生中にBGM音量を調整するか。
 * @default false
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量
 * @desc ボイス再生中のBGM音量をこの値に設定します。adjustBgmVolumeがONの時のみ有効。
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command STOP_VOICE
 * @text ボイスの停止
 * @desc 演奏中のボイスを停止します。ファイルを直接指定するかチャンネル番号を指定して停止します。
 *
 * @arg name
 * @text ファイル名称
 * @desc 停止するボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg channel
 * @text チャンネル番号
 * @desc 停止するボイスのチャンネル番号です。
 * @default 0
 * @type number
 *
 * @arg fadeOut
 * @text フェードアウト
 * @desc 停止時にフェードアウトするかどうか
 * @default false
 * @type boolean
 *
 * @arg duration
 * @text フェードアウト時間
 * @desc フェードアウトにかける時間(秒)
 * @default 2
 * @type number
 *
 * @command PLAY_BGS_FROM_EVENT
 * @text イベント位置からのBGS再生(SE扱い)
 * @desc 指定したSEファイルを、コマンド実行イベント位置を音源として再生します。プレイヤーとの距離で音量が変化し、マップ移動で停止します。
 *
 * @arg name
 * @text ファイル名称
 * @desc ボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc ボイスファイルの音量
 * @default 90
 * @min 0
 * @max 100
 * @type number
 *
 * @arg pitch
 * @text ピッチ
 * @desc ボイスファイルのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 左右バランス
 * @desc ボイスファイルの左右バランス(距離計算により上書きされます)
 * @default 0
 * @min -100
 * @max 100
 * @type number
 *
 * @arg channel
 * @text チャンネル番号
 * @desc チャンネル番号です。同一のチャンネル番号のボイスは重なって演奏されなくなります。
 * @default 0
 * @type number
 *
 * @arg loop
 * @text ループ有無
 * @desc ボイスの再生をループするかどうかです。
 * @default false
 * @type boolean
 *
 * @arg adjustBgmVolume
 * @text BGM音量調整
 * @desc このボイス再生中にBGM音量を調整するか。
 * @default false
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量
 * @desc ボイス再生中のBGM音量をこの値に設定します。adjustBgmVolumeがONの時のみ有効。
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @command PLAY_VOICE_PERSISTENT
 * @text ボイス再生(フェードイン・BGM調整可)
 * @desc 位置調整なしでボイスを再生。フェードインやBGM調整機能が利用可能。セーブデータには保存されません。
 *
 * @arg name
 * @text ファイル名称
 * @desc ボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc ボイスファイルの音量
 * @default 90
 * @min 0
 * @max 100
 * @type number
 *
 * @arg pitch
 * @text ピッチ
 * @desc ボイスファイルのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 左右バランス
 * @desc ボイスファイルの左右バランス
 * @default 0
 * @min -100
 * @max 100
 * @type number
 *
 * @arg channel
 * @text チャンネル番号
 * @desc チャンネル番号です。同一のチャンネル番号のボイスは重なって演奏されなくなります。
 * @default 0
 * @type number
 *
 * @arg loop
 * @text ループ有無
 * @desc ボイスの再生をループするかどうかです。
 * @default false
 * @type boolean
 *
 * @arg adjustBgmVolume
 * @text BGM音量調整
 * @desc このボイス再生中にBGM音量を調整するか。
 * @default false
 * @type boolean
 *
 * @arg bgmTargetVolume
 * @text BGM目標音量
 * @desc ボイス再生中のBGM音量をこの値に設定します。adjustBgmVolumeがONの時のみ有効。
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @arg fadeIn
 * @text フェードイン
 * @desc 再生開始時にフェードインするかどうか
 * @default false
 * @type boolean
 *
 * @arg duration
 * @text フェードイン時間
 * @desc フェードインにかける時間(秒)
 * @default 2
 * @type number
 *
 * @help SimpleVoice.js
 *
 * 簡易的なボイス演奏をサポートします。
 * プラグインコマンドから演奏、ループ演奏、停止ができます。
 * 音量は効果音とは区別され、オプション画面から調整できます。
 * チャンネルの概念があり、同一のチャンネル番号のボイスは
 * 重なって演奏されなくなります。
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

(function () {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    param.decayRate = param.decayRate || 85;
    param.cutoffVolume = param.cutoffVolume || 1;

    PluginManagerEx.registerCommand(script, 'PLAY_VOICE', function (args) {
        // console.log("PLAY_VOICE command called");
        AudioManager.playVoice(args, args.loop, args.channel);
    });

    PluginManagerEx.registerCommand(script, 'PLAY_BGS_FROM_EVENT', function (args) {
        const interpreter = this;
        let eventId = 0;

        if (interpreter && typeof interpreter.eventId === 'function' && interpreter.eventId() > 0) {
            eventId = interpreter.eventId();
            // console.log(`PLAY_BGS_FROM_EVENT: Found event ID ${eventId} via interpreter.eventId()`);
        } else if (interpreter && interpreter._eventId !== undefined && interpreter._eventId > 0) {
            eventId = interpreter._eventId;
            // console.log(`PLAY_BGS_FROM_EVENT: Found event ID ${eventId} via interpreter._eventId`);
        } else {
            // console.warn(`PLAY_BGS_FROM_EVENT: Could not determine a valid event ID (> 0) from the command interpreter. Event ID found: ${interpreter ? interpreter._eventId : 'undefined'}. Positional audio disabled for this sound.`);
            // console.log("Interpreter context ('this'):", interpreter);
        }

        AudioManager.playVoice(args, args.loop, args.channel, eventId);
    });

    PluginManagerEx.registerCommand(script, 'PLAY_VOICE_PERSISTENT', function (args) {
        // console.log("PLAY_VOICE_PERSISTENT command called", args);
        // sourceEventId = 0 (no positional audio), shouldPersist = false (DO NOT save even if looping)
        AudioManager.playVoice(args, args.loop, args.channel, 0, false, args.fadeIn, args.duration);
    });

    PluginManagerEx.registerCommand(script, 'STOP_VOICE', args => {
        const fadeOut = args.fadeOut;
        const duration = args.duration;
        if (args.name) {
            AudioManager.stopVoice(args.name, null, fadeOut, duration);
        } else if (args.channel) {
            AudioManager.stopVoice(null, args.channel, fadeOut, duration);
        } else {
            AudioManager.stopVoice(null, null, fadeOut, duration);
        }
    });

    //=============================================================================
    // ConfigManager
    //  ボイスボリュームの設定機能を追加します。
    //=============================================================================
    Object.defineProperty(ConfigManager, 'voiceVolume', {
        get: function () {
            return AudioManager._voiceVolume;
        },
        set: function (value) {
            AudioManager.voiceVolume = value;
        }
    });

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.voiceVolume = this.voiceVolume;
        return config;
    };

    const _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function () {
        this.voiceVolume = param.optionValue;
        _ConfigManager_load.apply(this, arguments);
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.apply(this, arguments);
        const symbol = 'voiceVolume';
        if (config.hasOwnProperty(symbol)) {
            this.voiceVolume = this.readVolume(config, symbol);
        }
    };

    //=============================================================================
    // Window_Options
    //  ボイスボリュームの設定項目を追加します。
    //=============================================================================
    const _Window_Options_addVolumeOptions = Window_Options.prototype.addVolumeOptions;
    Window_Options.prototype.addVolumeOptions = function () {
        _Window_Options_addVolumeOptions.apply(this, arguments);
        this.addCommand(param.optionName, 'voiceVolume');
    };

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function () {
        return _Scene_Options_maxCommands.apply(this, arguments) + 1;
    };

    //=============================================================================
    // AudioManager
    //  ボイスの演奏機能を追加定義します。
    //=============================================================================
    AudioManager._bgmAdjustmentRequestCount = 0;
    AudioManager._originalBgmVolume = null;

    Object.defineProperty(AudioManager, 'voiceVolume', {
        get: function () {
            return this._voiceVolume;
        },
        set: function (value) {
            const oldVolume = this._voiceVolume;
            // AudioManager._voiceVolume は 0-100 の範囲を期待する
            this._voiceVolume = Math.max(0, Math.min(100, value));

            // 音量に変更がない場合は処理をスキップ (ただし初回undefinedの場合は除く)
            if (oldVolume === this._voiceVolume && typeof oldVolume !== 'undefined') {
                return;
            }

            // _voiceBuffers 内の各バッファに対して音量を更新
            (this._voiceBuffers || []).forEach(buffer => {
                // バッファが再生準備完了かつ再生中であることを確認
                if (buffer && buffer.isReady() && buffer.isPlaying()) {
                    if (buffer._sourceEventId > 0) {
                        // 位置指定ボイスの場合、専用の更新関数を呼ぶ
                        // この関数内で新しい _voiceVolume が参照される
                        this.updatePositionalVoiceVolume(buffer);
                    } else {
                        // 通常のボイスの場合
                        // buffer._originalVolume: 再生時に指定された個別音量 (0-100)
                        // buffer._originalPan: 再生時に指定された個別パン (-100 to 100)
                        // buffer.pitch: WebAudioバッファの現在の再生レート (例: 1.0 for 100 pitch)
                        // これらを元に、updateVoiceParameters に渡す引数オブジェクトを再現
                        const originalPitchValue = Math.round((buffer.pitch || 1.0) * 100); // 100基準のピッチに戻す

                        const voiceArgs = {
                            volume: buffer._originalVolume,
                            pan: buffer._originalPan,
                            pitch: originalPitchValue
                            // name, loopなどは音量更新には不要
                        };

                        // AudioManager.updateVoiceParameters を呼び出して音量を更新
                        // この関数は内部で WebAudio.prototype.updateBufferParameters を呼び出し、
                        // 新しい _voiceVolume と voiceArgs を使ってバッファの音量、パン、ピッチを更新する
                        this.updateVoiceParameters(buffer, voiceArgs);
                    }
                }
            });
        }
    });

    AudioManager.updateVoiceParameters = function (buffer, voice) {
        this.updateBufferParameters(buffer, this._voiceVolume, voice);
    };

    AudioManager._voiceBuffers = [];
    AudioManager._voiceVolume = 100;
    AudioManager.playVoice = function (voice, loop, channel, sourceEventId = 0, shouldPersist = false, fadeIn = false, fadeDuration = 0) {
        // console.log("playVoice: Top - Args received:", JSON.parse(JSON.stringify(voice)), loop, channel, sourceEventId, shouldPersist);
        // チャンネル番号を確実に数値として扱う（undefinedや文字列の場合も正しく処理）
        channel = Number(channel) || 0;
        const voicePath = PluginManagerEx.convertEscapeCharacters(voice.name);
        if (voicePath) {
            // console.log(`playVoice: voicePath resolved to '${voicePath}', channel=${channel}, sourceEventId=${sourceEventId}`);
            const path = ('se/' + voicePath).split('/');
            const name = path.pop();
            const folder = path.join('/') + '/';
            const existingBufferOnChannel = this._voiceBuffers.find(b => b.channel === channel);
            if (existingBufferOnChannel) {
                // console.log(`Stopping existing sound on channel ${channel}`);
                existingBufferOnChannel.stop();
                // --- If the overwritten buffer was adjusting BGM, decrease the request count --- START
                if (existingBufferOnChannel._requestsBgmAdjustment) {
                    this.decreaseBgmAdjustmentRequest();
                }
                // --- If the overwritten buffer was adjusting BGM, decrease the request count --- END
                this._voiceBuffers = this._voiceBuffers.filter(b => b !== existingBufferOnChannel);
            }
            const buffer = this.createBuffer(folder, name);
            if (!buffer) {
                // console.error(`playVoice: Failed to create buffer for folder '${folder}', name '${name}'. voicePath was '${voicePath}'. Aborting playVoice.`);
                return;
            }
            buffer._originalVolume = Number(voice.volume) || 90;
            buffer._originalPan = Number(voice.pan) || 0;
            buffer.pitch = Number(voice.pitch) || 100;

            this.updateBufferParameters(buffer, this._voiceVolume, voice);
            buffer.play(loop || false, 0);
            if (fadeIn && fadeDuration > 0) {
                buffer.fadeIn(fadeDuration);
            }
            buffer.path = voicePath;
            buffer.channel = channel;
            buffer._sourceEventId = sourceEventId;

            // --- Add BGM adjustment info to buffer --- START
            buffer._requestsBgmAdjustment = !!voice.adjustBgmVolume;
            buffer._bgmTargetVolume = Number(voice.bgmTargetVolume);
            if (isNaN(buffer._bgmTargetVolume)) {
                buffer._bgmTargetVolume = 50;
            }
            // --- Add BGM adjustment info to buffer --- END

            this._voiceBuffers.push(buffer);
            // console.log(`Added buffer to channel ${channel}. Total buffers: ${this._voiceBuffers.length}`);

            // --- Adjust BGM Volume if needed --- START
            if (buffer._requestsBgmAdjustment) {
                this.increaseBgmAdjustmentRequest(buffer._bgmTargetVolume);
            }
            // --- Adjust BGM Volume if needed --- END

            if (sourceEventId > 0) {
                // console.log(`Initial positional update for channel ${channel}`);
                this.updatePositionalVoiceVolume(buffer);
            }

            // --- Save state to $gameSystem if it's a positional voice OR a persistent non-positional voice that is looping --- START
            // Positional voices (sourceEventId > 0) are always saved if they are playing.
            // Non-positional voices (sourceEventId === 0) are saved only if shouldPersist is true AND they are looping.
            const isPositional = sourceEventId > 0;
            const shouldSaveThisVoice = isPositional || (shouldPersist && loop);

            if (shouldSaveThisVoice) {
                if (!$gameSystem) return; // Should not happen during gameplay
                if (!$gameSystem._positionalVoices) $gameSystem._positionalVoices = {}; // Safety check
                $gameSystem._positionalVoices[channel] = {
                    name: voice.name,
                    volume: buffer._originalVolume,
                    pitch: Number(voice.pitch) || 100,
                    loop: loop || false,
                    channel: channel,
                    sourceEventId: sourceEventId, // Will be 0 for PLAY_VOICE_PERSISTENT
                    adjustBgmVolume: buffer._requestsBgmAdjustment,
                    bgmTargetVolume: buffer._bgmTargetVolume,
                    isPersistentNonPositional: !isPositional && shouldPersist, // Flag for loader
                    fadeIn: fadeIn, // Save fade settings just in case
                    fadeDuration: fadeDuration
                };
                // console.log(`Saved ${isPositional ? 'positional' : 'persistent non-positional'} voice state for channel ${channel}:`, $gameSystem._positionalVoices[channel]);
            }
            // --- Save state to $gameSystem --- END
        } else {
            // console.warn(`playVoice: voice.name '${voice.name}' resulted in empty voicePath. Aborting playVoice.`);
            return; // Ensure it explicitly returns if voicePath is bad
        }
    };

    AudioManager.stopVoice = function (name, channel, fadeOut = false, fadeDuration = 0) {
        const voicePath = name ? PluginManagerEx.convertEscapeCharacters(name) : null;
        // console.log(`stopVoice called: name=${voicePath}, channel=${channel}`);
        let stoppedCount = 0;
        this._voiceBuffers = this._voiceBuffers.filter(buffer => {
            const shouldStop = (!name && !channel) ||
                (name && buffer.path === voicePath) ||
                (channel && buffer.channel === channel);
            if (shouldStop) {
                // console.log(`Stopping buffer: path=${buffer.path}, channel=${buffer.channel}, sourceId=${buffer._sourceEventId}`);
                // フェードイン中のスケジュールされた音量変更をキャンセル
                if (buffer._gainNode && WebAudio._context) {
                    const currentTime = WebAudio._context.currentTime;
                    buffer._gainNode.gain.cancelScheduledValues(currentTime);
                }
                if (fadeOut && fadeDuration > 0) {
                    buffer.fadeOut(fadeDuration);
                } else {
                    buffer.stop();
                }
                stoppedCount++;
                // --- Clear saved state from $gameSystem if stopped --- START
                // Check if this channel had a saved state (either positional or persistent non-positional)
                if ($gameSystem && $gameSystem._positionalVoices && $gameSystem._positionalVoices[buffer.channel]) {
                    // console.log(`Clearing saved voice state for channel ${buffer.channel}`);
                    delete $gameSystem._positionalVoices[buffer.channel];
                }
                // --- Clear saved state from $gameSystem if stopped --- END
                // --- Decrease BGM adjustment request --- START
                if (buffer._requestsBgmAdjustment) {
                    this.decreaseBgmAdjustmentRequest();
                }
                // --- Decrease BGM adjustment request --- END
                return false;
            }
            return true;
        });
        // console.log(`Stopped ${stoppedCount} buffers. Remaining: ${this._voiceBuffers.length}`);
    };

    AudioManager.filterPlayingVoice = function () {
        const countBefore = this._voiceBuffers.length;
        this._voiceBuffers = this._voiceBuffers.filter(buffer => {
            const playing = buffer.isPlaying() || !buffer.isReady();
            if (!playing && buffer.path) {
                // console.log(`filterPlayingVoice removing finished buffer: path=${buffer.path}, channel=${buffer.channel}`);
                // --- Clear saved state from $gameSystem if finished naturally --- START
                // Check if this channel had a saved state
                if ($gameSystem && $gameSystem._positionalVoices && $gameSystem._positionalVoices[buffer.channel]) {
                    // console.log(`Clearing saved voice state for channel ${buffer.channel} (finished playing)`);
                    delete $gameSystem._positionalVoices[buffer.channel];
                }
                // --- Clear saved state from $gameSystem if finished naturally --- END
                // --- Decrease BGM adjustment request if finished naturally --- START
                if (buffer._requestsBgmAdjustment) {
                    this.decreaseBgmAdjustmentRequest();
                }
                // --- Decrease BGM adjustment request if finished naturally --- END
            }
            if (!playing && buffer._context) {
                buffer.stop();
            }
            return playing;
        });
        const countAfter = this._voiceBuffers.length;
        if (countBefore !== countAfter) {
            // console.log(`filterPlayingVoice removed ${countBefore - countAfter} buffers. Remaining: ${this._voiceBuffers.length}`);
        }
    };

    const _AudioManager_stopAll = AudioManager.stopAll;
    AudioManager.stopAll = function () {
        // console.log("AudioManager.stopAll called");
        _AudioManager_stopAll.apply(this, arguments);
        this.stopVoice(null, null);
    };

    //=============================================================================
    // Scene_Base
    //  フェードアウト時にSEの演奏も停止します。
    //=============================================================================
    const _Scene_Base_fadeOutAll = Scene_Base.prototype.fadeOutAll;
    Scene_Base.prototype.fadeOutAll = function () {
        // console.log("Scene_Base.fadeOutAll called");
        _Scene_Base_fadeOutAll.apply(this, arguments);
        // Temporarily comment out to see if this prevents clearing $gameSystem._positionalVoices before save
        // AudioManager.stopVoice(null, null);
        if ($gameSystem && $gameSystem._positionalVoices && Object.keys($gameSystem._positionalVoices).length > 0) {
            // console.log("Scene_Base.fadeOutAll: _positionalVoices still has data AFTER original fadeOutAll:", JSON.parse(JSON.stringify($gameSystem._positionalVoices)));
        } else if ($gameSystem) {
            // console.log("Scene_Base.fadeOutAll: _positionalVoices is empty or missing AFTER original fadeOutAll.");
        }
    };

    //=============================================================================
    // Game_Map
    // Update positional voice volume every frame
    //=============================================================================
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _Game_Map_update.apply(this, arguments);
        if (sceneActive) {
            AudioManager.updateAllPositionalVoices();
            AudioManager.filterPlayingVoice();
        }
    };

    //=============================================================================
    // Game_Player
    // Stop positional voices on map transfer
    //=============================================================================
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        // console.log("Game_Player.performTransfer called");
        AudioManager.stopAllPositionalVoices();
        _Game_Player_performTransfer.call(this);
    };

    //=============================================================================
    // AudioManager (New methods for positional audio)
    //=============================================================================

    // Calculate distance-based volume and pan, then update buffer
    AudioManager.updatePositionalVoiceVolume = function (buffer) {
        if (!buffer || !buffer.isPlaying() || !buffer._sourceEventId || !$gameMap || !$gamePlayer || !buffer._gainNode || !buffer._pannerNode) {
            return;
        }
        const sourceEvent = $gameMap.event(buffer._sourceEventId);
        if (!sourceEvent) {
            // console.warn(`Positional audio source event ${buffer._sourceEventId} not found on map ${$gameMap.mapId()}. Stopping sound.`);
            buffer.stop();
            return;
        }

        const listenerX = $gamePlayer._realX;
        const listenerY = $gamePlayer._realY;
        const sourceX = sourceEvent._realX;
        const sourceY = sourceEvent._realY;

        const dx = $gameMap.deltaX(sourceX, listenerX);
        const dy = $gameMap.deltaY(sourceY, listenerY);
        const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));

        let volumeRate = 1.0;
        if (distance > 1) {
            const decayFactor = Math.max(0.01, param.decayRate / 100);
            volumeRate = Math.pow(decayFactor, distance - 1);
        }

        const baseVolume = buffer._originalVolume / 100;
        let finalVolume = baseVolume * volumeRate;
        finalVolume *= (this._voiceVolume / 100);

        if (finalVolume * 100 < param.cutoffVolume) {
            finalVolume = 0;
        }

        const panFactor = 10;
        let finalPan = (dx * panFactor).clamp(-100, 100);

        const targetVolume = finalVolume.clamp(0.0, 1.0);
        const targetPanX = finalPan / 100;
        const targetPanZ = 1 - Math.abs(targetPanX);

        if (WebAudio._context && WebAudio._context.state === 'running') {
            try {
                if (buffer._gainNode && buffer._gainNode.context.state === 'running') {
                    buffer._gainNode.gain.setValueAtTime(targetVolume, WebAudio._context.currentTime);
                }
                if (buffer._pannerNode && buffer._pannerNode.context.state === 'running') {
                    buffer._pannerNode.positionX.setValueAtTime(targetPanX, WebAudio._context.currentTime);
                    buffer._pannerNode.positionZ.setValueAtTime(targetPanZ, WebAudio._context.currentTime);
                    buffer._pannerNode.positionY.setValueAtTime(0, WebAudio._context.currentTime);
                }
            } catch (e) {
                // console.error("Error updating WebAudio node:", e);
                buffer.stop();
            }
        }
    };

    // Update all currently playing positional voices
    AudioManager.updateAllPositionalVoices = function () {
        const positionalBuffers = this._voiceBuffers.filter(buffer => buffer._sourceEventId > 0);
        positionalBuffers.forEach(buffer => {
            this.updatePositionalVoiceVolume(buffer);
        });
    };

    // Stop all positional voices specifically
    AudioManager.stopAllPositionalVoices = function () {
        // console.log("stopAllPositionalVoices called");
        const positionalBuffers = this._voiceBuffers.filter(buffer => buffer._sourceEventId > 0);
        // console.log(`Found ${positionalBuffers.length} positional buffers to stop.`);
        positionalBuffers.forEach(buffer => {
            // console.log(`Stopping positional buffer: channel=${buffer.channel}, sourceId=${buffer._sourceEventId}`);
            buffer.stop();
            // --- Clear saved state from $gameSystem when stopped via map transfer --- START
            // Positional voices are cleared on map transfer. Persistent non-positional voices are NOT.
            if (buffer._sourceEventId > 0 && $gameSystem && $gameSystem._positionalVoices && $gameSystem._positionalVoices[buffer.channel]) {
                // console.log(`Clearing saved positional state for channel ${buffer.channel} (map transfer)`);
                delete $gameSystem._positionalVoices[buffer.channel];
            }
            // --- Clear saved state from $gameSystem when stopped via map transfer --- END
            // --- Decrease BGM adjustment request --- START
            if (buffer._requestsBgmAdjustment) {
                this.decreaseBgmAdjustmentRequest();
            }
            // --- Decrease BGM adjustment request --- END
        });
        this.filterPlayingVoice();
        // console.log(`Buffers remaining after stopping positional: ${this._voiceBuffers.length}`);
    };

    //=============================================================================
    // Game_System
    // Add storage for positional voice states
    //=============================================================================
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.apply(this, arguments);
        this._positionalVoices = {}; // { channel: {name, volume, pitch, loop, sourceEventId, adjustBgmVolume, bgmTargetVolume} }
    };

    // Restore positional voices after loading save data
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function () {
        _Game_System_onAfterLoad.apply(this, arguments);
        // Ensure _positionalVoices exists from older saves
        if (!this._positionalVoices) {
            this._positionalVoices = {};
        }
        // console.log("Restoring positional voices after load:", JSON.parse(JSON.stringify(this._positionalVoices)));

        // Explicitly reset AudioManager BGM state. This is crucial.
        // console.log("Explicitly resetting AudioManager BGM state on game load.");
        AudioManager._bgmAdjustmentRequestCount = 0;
        AudioManager._originalBgmVolume = null;

        // --- Revised Voice Restoration Logic --- START
        // 1. Clear internal AudioManager._voiceBuffers. This stops active sounds but keeps $gameSystem state.
        //    We do this to prevent duplicate sound instances if playVoice is called again.
        // console.log("Clearing AudioManager._voiceBuffers before restoring from save.");
        AudioManager._voiceBuffers.forEach(buffer => buffer.stop());
        AudioManager._voiceBuffers = [];

        // 2. Iterate over saved positional voices and replay them.
        //    playVoice will handle BGM adjustment requests and add to the now-empty _voiceBuffers.
        Object.values(this._positionalVoices).forEach(voiceInfo => {
            // console.log(`Attempting to restore voice: ${voiceInfo.name} on channel ${voiceInfo.channel} (sourceEventId: ${voiceInfo.sourceEventId}, persistent: ${voiceInfo.isPersistentNonPositional})`);
            const args = {
                name: voiceInfo.name,
                volume: voiceInfo.volume,
                pitch: voiceInfo.pitch,
                pan: 0,
                adjustBgmVolume: voiceInfo.adjustBgmVolume || false,
                bgmTargetVolume: voiceInfo.bgmTargetVolume !== undefined ? voiceInfo.bgmTargetVolume : 50
            };
            // For persistent non-positional, pass shouldPersist = true
            const shouldPersistOnLoad = !!voiceInfo.isPersistentNonPositional;
            // Restore fadeIn/duration if saved (though typically we don't want to fade in again on load, maybe? 
            // Or maybe we do if it was playing. For now, let's respect the saved args or default to no fade on load to be safe, 
            // OR if user wants it to fade in every time loop restarts... strict persistence says restore it.
            // But usually load game implies instant resume. Let's pass false for fadeIn on load unless we track 'isFadingIn'.
            // For simplicity and standard behavior, loading usually resumes volume naturally.
            // However, the function signature requires arguments.
            AudioManager.playVoice(args, voiceInfo.loop, voiceInfo.channel, voiceInfo.sourceEventId, shouldPersistOnLoad, false, 0);
        });
        // console.log(`Restoration complete. AudioManager._voiceBuffers count: ${AudioManager._voiceBuffers.length}`);
        // --- Revised Voice Restoration Logic --- END
    };

    // --- New Methods for BGM Adjustment --- START
    AudioManager.increaseBgmAdjustmentRequest = function (targetVolume) {
        this._bgmAdjustmentRequestCount++;
        // console.log(`BGM adjustment request count increased to: ${this._bgmAdjustmentRequestCount}`);
        if (this._bgmAdjustmentRequestCount === 1) {
            // First request, set the BGM volume
            const currentBgm = AudioManager._currentBgm;
            if (currentBgm) {
                this._originalBgmVolume = currentBgm.volume;
                // console.log(`Setting BGM volume to ${targetVolume} (was ${this._originalBgmVolume})`);
                currentBgm.volume = targetVolume;
                currentBgm._volume = targetVolume;
                AudioManager.updateBgmParameters(currentBgm);
            }
        } else {
            // Optional: Could implement logic to take the highest reduction if multiple requests exist
            // console.log("BGM already adjusted, new request added.");
        }
    };

    AudioManager.decreaseBgmAdjustmentRequest = function () {
        if (this._bgmAdjustmentRequestCount > 0) {
            this._bgmAdjustmentRequestCount--;
            // console.log(`BGM adjustment request count decreased to: ${this._bgmAdjustmentRequestCount}`);
            if (this._bgmAdjustmentRequestCount === 0) {
                // Last request removed, restore the BGM volume
                const currentBgm = AudioManager._currentBgm;
                if (currentBgm && this._originalBgmVolume !== null) {
                    // console.log(`Restoring BGM volume to ${this._originalBgmVolume}`);
                    currentBgm.volume = this._originalBgmVolume;
                    currentBgm._volume = this._originalBgmVolume;
                    AudioManager.updateBgmParameters(currentBgm);
                    this._originalBgmVolume = null; // Clear the stored volume
                } else {
                    // console.warn("Attempted to restore BGM volume, but original volume was not stored or no BGM is playing.");
                }
            }
        } else {
            // console.warn("Attempted to decrease BGM adjustment request count below zero.");
        }
    };
    // --- New Methods for BGM Adjustment --- END

    //=============================================================================
    // SceneManager
    // Keep track of the previous scene to make better decisions in Scene_Map.start
    //=============================================================================
    SceneManager._previousSceneClass = null;

    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function (sceneClass) {
        this._previousSceneClass = this._scene ? this._scene.constructor : null;
        _SceneManager_goto.call(this, sceneClass);
    };

    const _SceneManager_push = SceneManager.push;
    SceneManager.push = function (sceneClass) {
        this._previousSceneClass = this._scene ? this._scene.constructor : null;
        _SceneManager_push.call(this, sceneClass);
    };

    // const _SceneManager_pop = SceneManager.pop;
    // SceneManager.pop = function() {
    //     // When popping, the previous scene is the one we are returning to,
    //     // but for our purpose, we care about what scene *was* on top before pop.
    //     // This might be complex if multiple pops occur. For now, goto/push tracking is primary.
    //     _SceneManager_pop.call(this);
    // };

    //=============================================================================
    // Scene_Map
    // Reset BGM adjustment state when a map scene starts, to prevent carry-over
    //=============================================================================
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        let shouldResetBgmState = false;
        if (AudioManager._bgmAdjustmentRequestCount !== 0 &&
            !$gamePlayer.isTransferring() &&
            !DataManager.isBattleTest() &&
            !DataManager.isEventTest()) {

            const prevSceneClass = SceneManager._previousSceneClass;
            // Reset if coming from a non-gameplay scene like Title, or if previous scene is unknown (e.g. game start)
            if (!prevSceneClass ||
                prevSceneClass === Scene_Boot ||
                prevSceneClass === Scene_Title ||
                // Compare by class name string to avoid ReferenceError if class is not yet defined globally
                (prevSceneClass.name !== 'Scene_Menu' &&
                    prevSceneClass.name !== 'Scene_Options' &&
                    prevSceneClass.name !== 'Scene_Mymenu' && // Compare string name
                    prevSceneClass.name !== 'Scene_Gameover' &&
                    prevSceneClass.name !== 'Scene_Save' &&
                    prevSceneClass.name !== 'Scene_Load' &&
                    prevSceneClass.name !== 'Scene_Shop' &&
                    prevSceneClass.name !== 'Scene_Name' &&
                    prevSceneClass.name !== 'Scene_GameEnd' &&
                    prevSceneClass.name !== 'Scene_TextLog' &&
                    prevSceneClass.name !== 'Scene_FastTravel' &&
                    prevSceneClass.name !== 'Scene_TimeWait' &&
                    prevSceneClass.name !== 'Scene_Debug' // Add other scenes you might open from map that shouldn't trigger reset
                )) {
                shouldResetBgmState = true;
            }
        }

        if (shouldResetBgmState) {
            const BGMwasPlaying = AudioManager._currentBgm;
            // console.log("Scene_Map.start: Resetting AudioManager BGM state based on previous scene.");
            if (AudioManager._originalBgmVolume !== null && BGMwasPlaying) {
                // console.log(`Scene_Map.start: Restoring BGM volume to ${AudioManager._originalBgmVolume} before reset.`);
                AudioManager.bgmVolume = AudioManager._originalBgmVolume;
                AudioManager.updateBgmParameters(BGMwasPlaying);
            }
            AudioManager._bgmAdjustmentRequestCount = 0;
            AudioManager._originalBgmVolume = null;
        } else if (AudioManager._bgmAdjustmentRequestCount !== 0) {
            // console.log("Scene_Map.start: Not resetting BGM state, likely returning from menu/shop etc. or during map transfer.");
        }

        _Scene_Map_start.apply(this, arguments);
    };

    //=============================================================================
    // DataManager
    // Reset BGM adjustment state when a new game is set up.
    //=============================================================================
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);
        // This is called after $gameSystem is created and initialized.
        // Reset AudioManager BGM state here to ensure it's clean for any new game (including test plays).
        // console.log("DataManager.setupNewGame: Resetting AudioManager BGM state.");
        AudioManager._bgmAdjustmentRequestCount = 0;
        AudioManager._originalBgmVolume = null;
        // No need to directly restore BGM volume here, as a BGM will likely be played by map or event after this.
    };

    //=============================================================================
    // Scene_GameEnd
    // Stop all voices when returning to title from game end screen.
    //=============================================================================
    const _Scene_GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
    Scene_GameEnd.prototype.commandToTitle = function () {
        // console.log("Scene_GameEnd.commandToTitle: Preparing to return to title.");
        // Call AudioManager cleanups just before the original method that performs the actual scene transition.
        AudioManager.stopVoice(null, null); // Stop all voices managed by this plugin
        AudioManager._bgmAdjustmentRequestCount = 0;
        AudioManager._originalBgmVolume = null;
        // console.log("AudioManager state reset for title return.");
        _Scene_GameEnd_commandToTitle.apply(this, arguments);
    };

})();


/**
 * 再生中のボイス音量を変更する
 * @param {number} channel - チャンネル番号（voice.play時のchannel指定）
 * @param {number} volume - 新しい音量（0～100）
 */
AudioManager.setVoiceVolume = function (channel, volume) {
    this._voiceBuffers.forEach(buffer => {
        if (buffer.channel === channel && buffer.isPlaying()) {
            buffer.volume = volume / 100;
            buffer.gainNode.gain.setValueAtTime(buffer.volume, WebAudio._context.currentTime);
        }
    });
};
