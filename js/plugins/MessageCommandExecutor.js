/*:
 * @plugindesc 文章表示中に制御文字でコマンドを実行するプラグイン
 * @target MZ
 *
 * @param CommandList
 * @text コマンドリスト
 * @desc 制御文字で実行するコマンドを登録します。
 * @type struct<CommandEntry>[]
 * @default []
 *
 * @param ComboCommandList
 * @text まとめコマンドリスト
 * @desc 複数のコマンドを組み合わせて実行するまとめコマンドを登録します。
 * @type struct<ComboCommandEntry>[]
 * @default []
 *
 * @param CellPictureNumber
 * @text セル操作：ピクチャ番号
 * @desc \COM[cell0]等で操作するピクチャ番号
 * @type number
 * @min 1
 * @default 11
 *
 * @param CellWait
 * @text セル操作：ウェイト有無
 * @desc セル変更時にクロスフェード完了まで待機するか
 * @type boolean
 * @default false
 *
 * @param CellFadeDuration
 * @text セル操作：フェード時間上書き
 * @desc フェード時間を上書きする場合の値（-1=上書きなし）
 * @type number
 * @min -1
 * @default -1
 *
 * @param CellCompleteSwitchId
 * @text セル操作：完了スイッチ番号
 * @desc 存在しないセルにアクセスした場合ONにするスイッチ（0=無効）
 * @type switch
 * @default 0
 *
 * @param BgsVolume
 * @text BGS再生：音量
 * @desc \COM[bgs]で再生する際の音量（0-100）
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param VoiceVolume
 * @text ボイス再生：音量
 * @desc \COM[voice]で再生する際の音量（0-100）
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @help MessageCommandExecutor.js
 *
 * 文章の表示中に制御文字 \COM[コマンド名] を使用することで、
 * 文章ウィンドウを閉じずに様々なコマンドを実行できます。
 *
 * 【使い方】
 * 1. プラグイン設定でコマンドを登録します
 * 2. 文章の表示で \COM[コマンド名] と記述します
 * 3. その制御文字が処理される時点でコマンドが実行されます
 *
 * 【設定例】
 * コマンド名: Shake
 * コマンド種別: 画面のシェイク
 * 強さ: 5
 * 速さ: 5
 * 時間: 60
 * ウェイト: true
 *
 * 文章例: ああああ\COM[Shake]いいいい
 * → 「ああああ」が表示された後、画面がシェイクし、
 *   その後「いいいい」が表示されます。
 *
 * 【対応コマンド】
 * ・画面のシェイク
 * ・画面のフラッシュ
 * ・SE（効果音）の再生
 * ・ウェイト
 * ・スイッチ操作
 * ・変数操作
 * ・プラグインコマンド
 *
 * 【PictureAnimationセル操作】
 * \COM[cell0]  → 現在のセルから1つ進める
 * \COM[cell11] → セル11番に移動
 * ※PictureAnimation.jsと連携してセルを変更します
 *
 * 【まとめコマンド】
 * 複数のコマンドを組み合わせて一つの名前で呼び出せます。
 * 例: "Explosion" = cell0 + Shake + Flash + BoomSE
 * \COM[Explosion] と記述すると、登録した4つのコマンドが順番に実行されます。
 * ※cell形式のコマンドもまとめコマンド内で使用可能です。
 *
 * 【BGS/ボイス再生コマンド】
 * 事前に音量0でBGSやボイスを設定しておき、
 * 文章表示中に再生を開始できます。
 * \COM[bgs]   → 現在設定中のBGSを再生（設定から音量を復元）
 * \COM[voice] → 現在設定中のボイスを再生（設定から音量を復元）
 */

/*~struct~CommandEntry:
 * @param Name
 * @text コマンド名
 * @desc \COM[ここに指定した名前] で呼び出します。
 * @type string
 * @default 
 *
 * @param CommandType
 * @text コマンド種別
 * @desc 実行するコマンドの種類を選択します。
 * @type select
 * @option 画面のシェイク
 * @value shake
 * @option 画面のフラッシュ
 * @value flash
 * @option SEの再生
 * @value se
 * @option ウェイト
 * @value wait
 * @option スイッチ操作
 * @value switch
 * @option 変数操作
 * @value variable
 * @option コモンイベント
 * @value commonEvent
 * @option プラグインコマンド
 * @value pluginCommand
 * @default shake
 *
 * @param DelayFrames
 * @text 遅延フレーム
 * @desc コマンド実行までの遅延フレーム数（0で即時実行）
 * @type number
 * @min 0
 * @default 0
 *
 * @param ShakePower
 * @text シェイク：強さ
 * @desc 画面シェイクの強さ（1-9）
 * @type number
 * @min 1
 * @max 9
 * @default 5
 *
 * @param ShakeSpeed
 * @text シェイク：速さ
 * @desc 画面シェイクの速さ（1-9）
 * @type number
 * @min 1
 * @max 9
 * @default 5
 *
 * @param ShakeDuration
 * @text シェイク：時間
 * @desc 画面シェイクの継続フレーム数
 * @type number
 * @min 1
 * @default 60
 *
 * @param ShakeWait
 * @text シェイク：ウェイト
 * @desc シェイク完了まで待機するか
 * @type boolean
 * @default true
 *
 * @param FlashRed
 * @text フラッシュ：赤
 * @desc フラッシュの赤成分（0-255）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param FlashGreen
 * @text フラッシュ：緑
 * @desc フラッシュの緑成分（0-255）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param FlashBlue
 * @text フラッシュ：青
 * @desc フラッシュの青成分（0-255）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param FlashIntensity
 * @text フラッシュ：強度
 * @desc フラッシュの強度（0-255）
 * @type number
 * @min 0
 * @max 255
 * @default 170
 *
 * @param FlashDuration
 * @text フラッシュ：時間
 * @desc フラッシュの継続フレーム数
 * @type number
 * @min 1
 * @default 60
 *
 * @param FlashWait
 * @text フラッシュ：ウェイト
 * @desc フラッシュ完了まで待機するか
 * @type boolean
 * @default true
 *
 * @param SeName
 * @text SE：ファイル名
 * @desc 再生するSEのファイル名
 * @type file
 * @dir audio/se
 * @default 
 *
 * @param SeVolume
 * @text SE：音量
 * @desc SEの音量（0-100）
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param SePitch
 * @text SE：ピッチ
 * @desc SEのピッチ（50-150）
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param SePan
 * @text SE：位相
 * @desc SEの位相（-100 - 100）
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param WaitFrames
 * @text ウェイト：フレーム数
 * @desc ウェイトするフレーム数
 * @type number
 * @min 1
 * @default 60
 *
 * @param SwitchId
 * @text スイッチ：ID
 * @desc 操作するスイッチのID
 * @type switch
 * @default 1
 *
 * @param SwitchValue
 * @text スイッチ：値
 * @desc スイッチをONにするかOFFにするか
 * @type boolean
 * @default true
 *
 * @param VariableId
 * @text 変数：ID
 * @desc 操作する変数のID
 * @type variable
 * @default 1
 *
 * @param VariableOperation
 * @text 変数：操作
 * @desc 変数に対する操作
 * @type select
 * @option 代入
 * @value set
 * @option 加算
 * @value add
 * @option 減算
 * @value sub
 * @option 乗算
 * @value mul
 * @option 除算
 * @value div
 * @option 剰余
 * @value mod
 * @default set
 *
 * @param VariableValue
 * @text 変数：値
 * @desc 変数に設定/演算する値
 * @type number
 * @default 0
 *
 * @param PluginName
 * @text プラグインコマンド：プラグイン名
 * @desc 実行するプラグインのファイル名（拡張子なし）
 * @type string
 * @default 
 *
 * @param PluginCommandName
 * @text プラグインコマンド：コマンド名
 * @desc 実行するプラグインコマンドの名前
 * @type string
 * @default 
 *
 * @param PluginCommandArgs
 * @text プラグインコマンド：引数
 * @desc プラグインコマンドの引数（JSON形式）
 * @type string
 * @default {}
 *
 * @param CommonEventId
 * @text コモンイベント：ID
 * @desc 実行するコモンイベントのID
 * @type common_event
 * @default 1
 */

/*~struct~ComboCommandEntry:
 * @param Name
 * @text まとめコマンド名
 * @desc \COM[ここに指定した名前] で呼び出します。
 * @type string
 * @default 
 *
 * @param SubCommands
 * @text サブコマンドリスト
 * @desc 順番に実行するコマンド名をカンマ区切りで入力（例: cell0,Shake,Flash）
 * @type string
 * @default 
 */

(() => {
    'use strict';

    const pluginName = 'MessageCommandExecutor';
    const parameters = PluginManager.parameters(pluginName);

    // コマンドリストをパース
    const commandListRaw = parameters['CommandList'] || '[]';
    let commandList = [];
    try {
        const parsed = JSON.parse(commandListRaw);
        commandList = parsed.map(item => {
            const entry = JSON.parse(item);
            return {
                name: String(entry.Name || ''),
                commandType: String(entry.CommandType || 'shake'),
                delayFrames: Number(entry.DelayFrames) || 0,
                // シェイク
                shakePower: Number(entry.ShakePower) || 5,
                shakeSpeed: Number(entry.ShakeSpeed) || 5,
                shakeDuration: Number(entry.ShakeDuration) || 60,
                shakeWait: entry.ShakeWait === 'true' || entry.ShakeWait === true,
                // フラッシュ
                flashRed: Number(entry.FlashRed) || 255,
                flashGreen: Number(entry.FlashGreen) || 255,
                flashBlue: Number(entry.FlashBlue) || 255,
                flashIntensity: Number(entry.FlashIntensity) || 170,
                flashDuration: Number(entry.FlashDuration) || 60,
                flashWait: entry.FlashWait === 'true' || entry.FlashWait === true,
                // SE
                seName: String(entry.SeName || ''),
                seVolume: Number(entry.SeVolume) || 90,
                sePitch: Number(entry.SePitch) || 100,
                sePan: Number(entry.SePan) || 0,
                // ウェイト
                waitFrames: Number(entry.WaitFrames) || 60,
                // スイッチ
                switchId: Number(entry.SwitchId) || 1,
                switchValue: entry.SwitchValue === 'true' || entry.SwitchValue === true,
                // 変数
                variableId: Number(entry.VariableId) || 1,
                variableOperation: String(entry.VariableOperation || 'set'),
                variableValue: Number(entry.VariableValue) || 0,
                // プラグインコマンド
                pluginName: String(entry.PluginName || ''),
                pluginCommandName: String(entry.PluginCommandName || ''),
                pluginCommandArgs: String(entry.PluginCommandArgs || '{}'),
                // コモンイベント
                commonEventId: Number(entry.CommonEventId) || 1
            };
        });
    } catch (e) {
        console.error('MessageCommandExecutor: コマンドリストのパースに失敗しました', e);
    }

    // まとめコマンドリストをパース
    const comboCommandListRaw = parameters['ComboCommandList'] || '[]';
    let comboCommandList = [];
    try {
        const parsed = JSON.parse(comboCommandListRaw);
        comboCommandList = parsed.map(item => {
            const entry = JSON.parse(item);
            // サブコマンドをカンマ区切りで分割し、空白をトリム
            const subCommandsStr = String(entry.SubCommands || '');
            const subCommands = subCommandsStr.split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            return {
                name: String(entry.Name || ''),
                subCommands: subCommands
            };
        });
    } catch (e) {
        console.error('MessageCommandExecutor: まとめコマンドリストのパースに失敗しました', e);
    }

    // セル操作用パラメータ
    const cellPictureNumber = Number(parameters['CellPictureNumber']) || 11;
    const cellWait = parameters['CellWait'] === 'true';
    const cellFadeDuration = Number(parameters['CellFadeDuration']);
    const cellCompleteSwitchId = Number(parameters['CellCompleteSwitchId']) || 0;

    // BGS/ボイス再生用パラメータ
    const bgsVolume = Number(parameters['BgsVolume']) || 100;
    const voiceVolume = Number(parameters['VoiceVolume']) || 90;

    // コマンドを名前で検索
    function findCommand(name) {
        return commandList.find(cmd => cmd.name === name);
    }

    // まとめコマンドを名前で検索
    function findComboCommand(name) {
        return comboCommandList.find(cmd => cmd.name === name);
    }

    // BGSコマンドを実行（現在再生中のBGSを指定音量で再生）
    function executeBgsCommand() {
        const currentBgs = $gameSystem._bgsBuffer || AudioManager._currentBgs;
        if (currentBgs && currentBgs.name) {
            // 現在のBGS設定をコピーして音量を変更
            const newBgs = {
                name: currentBgs.name,
                volume: bgsVolume,
                pitch: currentBgs.pitch || 100,
                pan: currentBgs.pan || 0,
                pos: currentBgs.pos || 0
            };
            AudioManager.playBgs(newBgs);
        } else {
            // $dataMap.bgsStoredなどから取得を試みる
            const mapBgs = $dataMap && $dataMap.bgs;
            if (mapBgs && mapBgs.name) {
                const newBgs = {
                    name: mapBgs.name,
                    volume: bgsVolume,
                    pitch: mapBgs.pitch || 100,
                    pan: mapBgs.pan || 0
                };
                AudioManager.playBgs(newBgs);
            }
        }
    }

    // ボイスコマンドを実行（SimpleVoice系のボイスを再生）
    function executeVoiceCommand() {
        // AudioManager._voiceBuffers が存在する場合（SimpleVoice_modified使用時）
        if (AudioManager._voiceBuffers && AudioManager._voiceBuffers.length > 0) {
            for (const buffer of AudioManager._voiceBuffers) {
                if (buffer) {
                    // 既存のボイスバッファの音量を変更
                    // _originalVolume を更新して、音量を設定
                    buffer._originalVolume = voiceVolume;

                    // WebAudio APIで直接音量を設定
                    if (buffer._gainNode && buffer._gainNode.gain) {
                        const masterVolume = (AudioManager._voiceVolume || 100) / 100;
                        const finalVolume = (voiceVolume / 100) * masterVolume;
                        const audioParam = buffer._gainNode.gain;
                        const currentTime = buffer._gainNode.context.currentTime;

                        try {
                            // 既存のスケジュールされたパラメータ変更をキャンセル
                            // （フェードイン等との競合を防ぐ）
                            audioParam.cancelScheduledValues(currentTime);
                            // 現在の値を即座に設定
                            audioParam.setValueAtTime(finalVolume, currentTime);
                        } catch (e) {
                            // フォールバック：直接値を設定
                            audioParam.value = finalVolume;
                        }
                    }
                }
            }
        }
    }

    // cell形式のコマンドかチェック（cell0, cell11など）
    function parseCellCommand(commandName) {
        const match = commandName.match(/^cell(\d+)$/i);
        if (match) {
            return {
                isCellCommand: true,
                cellNumber: parseInt(match[1], 10)
            };
        }
        return { isCellCommand: false };
    }

    // PictureAnimationのSET_CELLコマンドを実行
    function executeCellCommand(cellNumber, messageWindow) {
        // PictureAnimationと同じ処理を直接実行
        const picture = $gameScreen.picture(cellPictureNumber);
        if (!picture) {
            console.error('MessageCommandExecutor: ピクチャ番号', cellPictureNumber, 'が見つかりません');
            return;
        }

        // 完了スイッチ番号を設定
        if (cellCompleteSwitchId > 0 && picture.setCompleteSwitchId) {
            picture.setCompleteSwitchId(cellCompleteSwitchId);
        }

        // フェード時間の一時的な上書き処理
        const fadeDurationOverride = cellFadeDuration;
        const originalFadeDuration = picture._fadeDuration;
        const shouldOverrideFade = fadeDurationOverride >= 0;

        if (shouldOverrideFade) {
            picture._fadeDuration = fadeDurationOverride;
        }

        // セル番号を設定
        if (cellNumber > 0) {
            // 指定されたセル番号に移動（1ベース → 0ベース）
            const targetCell = cellNumber - 1;
            picture.cell = targetCell;
        } else {
            // 次のセルに進める
            if (picture.canAdvanceToNextCell && picture.canAdvanceToNextCell()) {
                picture.addCellCount();
            } else if (picture.addCellCount) {
                // canAdvanceToNextCellがない場合は直接進める
                picture.addCellCount();
            }
        }

        // ウェイト処理
        if (cellWait && messageWindow) {
            const waitDuration = shouldOverrideFade ? fadeDurationOverride : (picture._fadeDuration || 0);
            messageWindow._waitCount = waitDuration;
        }

        // フェード時間を元に戻す設定
        if (shouldOverrideFade) {
            picture._restoreFadeDuration = originalFadeDuration;
            picture._restoreFadeDurationAfter = fadeDurationOverride;
        }
    }

    // 遅延実行用キュー
    const delayedCommands = [];

    // 遅延コマンドを更新（毎フレーム呼び出し）
    const _SceneManager_update = SceneManager.update;
    SceneManager.update = function (deltaTime) {
        _SceneManager_update.call(this, deltaTime);
        updateDelayedCommands();
    };

    function updateDelayedCommands() {
        for (let i = delayedCommands.length - 1; i >= 0; i--) {
            const item = delayedCommands[i];
            item.delay--;
            if (item.delay <= 0) {
                executeCommandImmediate(item.command, item.messageWindow);
                delayedCommands.splice(i, 1);
            }
        }
    }

    // コマンドを実行
    function executeCommand(command, messageWindow) {
        if (command.delayFrames > 0) {
            delayedCommands.push({
                command: command,
                delay: command.delayFrames,
                messageWindow: messageWindow
            });
        } else {
            executeCommandImmediate(command, messageWindow);
        }
    }

    // コマンドを即時実行
    function executeCommandImmediate(command, messageWindow) {
        switch (command.commandType) {
            case 'shake':
                executeShake(command, messageWindow);
                break;
            case 'flash':
                executeFlash(command, messageWindow);
                break;
            case 'se':
                executeSE(command);
                break;
            case 'wait':
                executeWait(command, messageWindow);
                break;
            case 'switch':
                executeSwitch(command);
                break;
            case 'variable':
                executeVariable(command);
                break;
            case 'commonEvent':
                executeCommonEvent(command);
                break;
            case 'pluginCommand':
                executePluginCommand(command);
                break;
        }
    }

    // 画面のシェイク
    function executeShake(command, messageWindow) {
        $gameScreen.startShake(command.shakePower, command.shakeSpeed, command.shakeDuration);
        if (command.shakeWait && messageWindow) {
            messageWindow._waitCount = command.shakeDuration;
        }
    }

    // 画面のフラッシュ
    function executeFlash(command, messageWindow) {
        const color = [command.flashRed, command.flashGreen, command.flashBlue, command.flashIntensity];
        $gameScreen.startFlash(color, command.flashDuration);
        if (command.flashWait && messageWindow) {
            messageWindow._waitCount = command.flashDuration;
        }
    }

    // SEの再生
    function executeSE(command) {
        if (command.seName) {
            const se = {
                name: command.seName,
                volume: command.seVolume,
                pitch: command.sePitch,
                pan: command.sePan
            };
            AudioManager.playSe(se);
        }
    }

    // ウェイト
    function executeWait(command, messageWindow) {
        if (messageWindow) {
            messageWindow._waitCount = command.waitFrames;
        }
    }

    // スイッチ操作
    function executeSwitch(command) {
        $gameSwitches.setValue(command.switchId, command.switchValue);
    }

    // 変数操作
    function executeVariable(command) {
        const currentValue = $gameVariables.value(command.variableId);
        let newValue = currentValue;

        switch (command.variableOperation) {
            case 'set':
                newValue = command.variableValue;
                break;
            case 'add':
                newValue = currentValue + command.variableValue;
                break;
            case 'sub':
                newValue = currentValue - command.variableValue;
                break;
            case 'mul':
                newValue = currentValue * command.variableValue;
                break;
            case 'div':
                if (command.variableValue !== 0) {
                    newValue = Math.floor(currentValue / command.variableValue);
                }
                break;
            case 'mod':
                if (command.variableValue !== 0) {
                    newValue = currentValue % command.variableValue;
                }
                break;
        }

        $gameVariables.setValue(command.variableId, newValue);
    }

    // コモンイベント実行（即時実行）
    function executeCommonEvent(command) {
        if (command.commonEventId > 0) {
            const commonEvent = $dataCommonEvents[command.commonEventId];
            if (commonEvent && commonEvent.list) {
                // 並行実行用のインタプリタを作成して即時実行
                const interpreter = new Game_Interpreter();
                interpreter.setup(commonEvent.list, 0);
                // 現在のマップに並行インタプリタとして追加
                if ($gameMap && $gameMap._interpreter) {
                    // 子インタプリタとして実行（現在のイベントと並行）
                    if (!$gameMap._parallelCommonEventInterpreters) {
                        $gameMap._parallelCommonEventInterpreters = [];
                    }
                    $gameMap._parallelCommonEventInterpreters.push(interpreter);
                }
            }
        }
    }

    // 並行コモンイベントの更新処理を追加
    const _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
    Game_Map.prototype.updateInterpreter = function () {
        _Game_Map_updateInterpreter.call(this);
        // 並行コモンイベントの更新
        if (this._parallelCommonEventInterpreters) {
            this._parallelCommonEventInterpreters = this._parallelCommonEventInterpreters.filter(interpreter => {
                interpreter.update();
                return interpreter.isRunning();
            });
        }
    };

    // プラグインコマンド実行
    function executePluginCommand(command) {
        if (!command.pluginName || !command.pluginCommandName) {
            return;
        }

        try {
            const args = JSON.parse(command.pluginCommandArgs);
            // ダミーのインタプリタを作成してプラグインコマンドを実行
            const dummyInterpreter = new Game_Interpreter();
            PluginManager.callCommand(dummyInterpreter, command.pluginName, command.pluginCommandName, args);
        } catch (e) {
            console.error('MessageCommandExecutor: プラグインコマンドの実行に失敗しました', e);
        }
    }

    // Window_Messageの制御文字処理を拡張
    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function (code, textState) {
        if (code === 'COM') {
            const commandName = this.obtainEscapeParamString(textState);
            processCommandByName(commandName, this);
        } else {
            _Window_Message_processEscapeCharacter.call(this, code, textState);
        }
    };

    // コマンド名からコマンドを処理する共通関数
    function processCommandByName(commandName, messageWindow) {
        // bgs/voiceコマンドをチェック（大文字小文字を区別しない）
        const lowerName = commandName.toLowerCase();
        if (lowerName === 'bgs') {
            executeBgsCommand();
            return;
        }
        if (lowerName === 'voice') {
            executeVoiceCommand();
            return;
        }

        // まずcell形式のコマンドかチェック
        const cellInfo = parseCellCommand(commandName);
        if (cellInfo.isCellCommand) {
            executeCellCommand(cellInfo.cellNumber, messageWindow);
            return;
        }

        // まとめコマンドを検索
        const comboCommand = findComboCommand(commandName);
        if (comboCommand) {
            // サブコマンドを順番に実行
            for (const subCommandName of comboCommand.subCommands) {
                processCommandByName(subCommandName, messageWindow);
            }
            return;
        }

        // 通常のコマンドを検索
        const command = findCommand(commandName);
        if (command) {
            executeCommand(command, messageWindow);
        } else {
            console.warn(`MessageCommandExecutor: コマンド「${commandName}」が見つかりません`);
        }
    }

    // []内の文字列を取得するヘルパー関数
    Window_Message.prototype.obtainEscapeParamString = function (textState) {
        const regExp = /^\[([^\]]+)\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[1];
        } else {
            return '';
        }
    };

    // convertEscapeCharacters で \COM を大文字に変換
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = text.replace(/\x1bCOM/gi, '\x1bCOM');
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        return text;
    };

})();
