/*:ja
 * @target MZ
 * @plugindesc マップBGMを進行度・日付・時間・場所タイプに応じて変化させるプラグイン
 * @help MapBgmManager.js
 *
 * 【機能概要】
 * 変数（進行度、日付、時間）とマップのメモ欄タグに応じてBGMを自動再生します。
 *
 * 【マップのメモ欄の設定】
 * 以下のタグを記述して場所のタイプを判定します。
 * <Event>     : プラグイン機能を無効化し、ツクールの通常機能に従います
 * <Room>      : 屋内として扱います
 * <Basement>  : 地下として扱います
 * 記述なし    : 屋外として扱います
 *
 * 【特定マップでの指定】
 * 特定のマップで専用のBGMパターンを使いたい場合は、
 * 作成した「BGMパレット」のIDを指定します。
 * <BgmPalette: 2>  : パレットID 2番を使用します
 *
 * 【優先順位】
 * 1. 無効化スイッチがONの場合 -> 通常のツクール機能（イベント等）に従う
 * 2. マップメモ欄に <Event> がある -> 通常のツクール機能に従う
 * 3. マップメモ欄に <BgmPalette: x> がある -> そのパレットを使用
 * 4. <Room>タグがある -> 屋内設定を使用
 * 5. <Basement>タグがある -> 地下設定を使用
 * 6. 上記以外 -> 屋外設定を使用
 *
 * 【BGMパレットの条件判定について】
 * パレット内の設定はリストの上から順に評価されるのではなく、
 * **「リストの下にある設定が優先（後勝ち）」**となります。
 * 条件に合致する設定の中で、リストの一番下にあるものが採用されます。
 *
 * -----------------------------------------------------------
 * @param VariableSettings
 * @text 変数設定
 *
 * @param DateVarId
 * @parent VariableSettings
 * @text 日付変数ID
 * @type variable
 * @default 1
 * @desc 0以上の値をとる変数を指定
 *
 * @param TimeVarId
 * @parent VariableSettings
 * @text 時間変数ID
 * @type variable
 * @default 2
 * @desc 0以上の値をとる変数を指定
 *
 * @param ProgressVarId
 * @parent VariableSettings
 * @text 進行度変数ID
 * @type variable
 * @default 3
 * @desc 物語の進行度を管理する変数
 *
 * @param DisableSwitchIds
 * @text 無効化スイッチIDリスト
 * @type switch[]
 * @default []
 * @desc これらのスイッチのいずれかがONの時、プラグインは機能を停止します。
 *
 * @param BgmPalettes
 * @text BGMパレット登録
 * @type struct<BgmPalette>[]
 * @desc 変数条件に応じたBGMセットを登録します。IDはリストの並び順(1始まり)です。
 *
 * @param DefaultAssignments
 * @text デフォルト割当設定
 *
 * @param ProgressThreshold
 * @parent DefaultAssignments
 * @text 進行度の変化閾値
 * @type number
 * @default 10
 * @desc 進行度変数がこの値以上になると「後半」の設定が適用されます。
 *
 * @param OutdoorPaletteId
 * @parent DefaultAssignments
 * @text 【屋外】前半パレットID
 * @type number
 * @default 1
 *
 * @param OutdoorPaletteIdPost
 * @parent DefaultAssignments
 * @text 【屋外】後半パレットID
 * @type number
 * @default 1
 *
 * @param RoomPaletteId
 * @parent DefaultAssignments
 * @text 【屋内】前半パレットID
 * @type number
 * @default 1
 *
 * @param RoomPaletteIdPost
 * @parent DefaultAssignments
 * @text 【屋内】後半パレットID
 * @type number
 * @default 1
 *
 * @param BasementPaletteId
 * @parent DefaultAssignments
 * @text 【地下】前半パレットID
 * @type number
 * @default 1
 *
 * @param BasementPaletteIdPost
 * @parent DefaultAssignments
 * @text 【地下】後半パレットID
 * @type number
 * @default 1
 *
 *
 * @command SetTempPalette
 * @text 一時BGMパレット変更
 * @desc 一時的に使用するBGMパレットを指定します。マップ移動やセーブ後も維持されます。
 *
 * @arg PaletteId
 * @text パレットID
 * @type number
 * @default 0
 * @desc 適用するBGMパレットのID。0の場合はパレット指定なし（消音設定のみ有効）。
 *
 * @arg MuteBgm
 * @text BGM消音
 * @type boolean
 * @default false
 * @desc ONにするとBGMを消音します。
 *
 * @arg MuteBgs
 * @text BGS消音
 * @type boolean
 * @default false
 * @desc ONにするとBGSを消音します。
 *
 * @arg MuteBoth
 * @text 両方消音
 * @type boolean
 * @default false
 * @desc ONにするとBGMとBGSの両方を消音します。（上記設定より優先）
 *
 * @arg MemorizeCurrent
 * @text 現在のBGM/BGSを記憶
 * @type boolean
 * @default false
 * @desc ONにすると、現在再生中のBGMとBGSを一時設定として記憶します。これがONの場合、他の設定は無視されます。
 *
 * @command ClearTempPalette
 * @text 一時パレット解除
 * @desc 一時的なBGMパレット設定を解除し、通常の判定に戻します。
 */

/*~struct~BgmPalette:ja
 * @param Name
 * @text パレット名
 * @desc 管理用の名前です（ゲームには影響しません）
 *
 * @param BgmList
 * @text 特別BGM/BGSリスト
 * @type struct<BgmSetting>[]
 * @desc 条件と再生するBGM/BGSを登録します。条件に合うものの中で**リストの一番下の設定**が適用されます。
 */

/*~struct~BgmSetting:ja
 * @param DateCondition
 * @text 日付の条件
 * @type select
 * @option = (等しい)
 * @value =
 * @option >= (以上)
 * @value >=
 * @option <= (以下)
 * @value <=
 * @option > (より大きい)
 * @value >
 * @option < (より小さい)
 * @value <
 * @option != (等しくない)
 * @value !=
 * @default =
 * @desc 日付変数の比較条件です。
 *
 * @param DateValue
 * @text 日付の値
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 日付変数の比較対象値です。
 *
 * @param TimeCondition
 * @text 時間の条件
 * @type select
 * @option = (等しい)
 * @value =
 * @option >= (以上)
 * @value >=
 * @option <= (以下)
 * @value <=
 * @option > (より大きい)
 * @value >
 * @option < (より小さい)
 * @value <
 * @option != (等しくない)
 * @value !=
 * @default =
 * @desc 時間変数の比較条件です。
 *
 * @param TimeValue
 * @text 時間の値
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 時間変数の比較対象値です。
 *
 * @param AudioType
 * @text 種別
 * @type select
 * @option BGM
 * @value bgm
 * @option BGS
 * @value bgs
 * @default bgm
 * @desc 再生するのがBGMかBGSかを指定します。Nameを空欄にすると、その種別を「無音」にします。
 *
 * @param Name
 * @text ファイル名
 * @type file
 * @dir audio
 * @desc 選択した種別に応じて「audio/bgm」または「audio/bgs」内のファイルを指定してください。
 *
 * @param Volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param Pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param Pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(() => {
    'use strict';
    const pluginName = 'MapBgmManager';
    const parameters = PluginManager.parameters(pluginName);

    // パラメータのパース処理
    const dateVarId = Number(parameters['DateVarId'] || 1);
    const timeVarId = Number(parameters['TimeVarId'] || 2);
    const progressVarId = Number(parameters['ProgressVarId'] || 3);

    const disableSwitchIds = JSON.parse(parameters['DisableSwitchIds'] || '[]').map(Number);

    const progressThreshold = Number(parameters['ProgressThreshold'] || 0);

    // デフォルト割当
    const assignData = {
        outdoor: { pre: Number(parameters['OutdoorPaletteId']), post: Number(parameters['OutdoorPaletteIdPost']) },
        room: { pre: Number(parameters['RoomPaletteId']), post: Number(parameters['RoomPaletteIdPost']) },
        basement: { pre: Number(parameters['BasementPaletteId']), post: Number(parameters['BasementPaletteIdPost']) }
    };

    // ファイル名正規化
    function normalizeAudioName(audioType, name) {
        let n = String(name || '');
        // 先頭の "audio/bgm/" や "audio/bgs/" を削除
        n = n.replace(/^audio[\/\\](bgm|bgs)[\/\\]/i, '');
        // 先頭の "bgm/" や "bgs/" も削除
        n = n.replace(/^(bgm|bgs)[\/\\]/i, '');
        return n;
    }

    // パレットデータのロードと整形
    const rawPalettes = JSON.parse(parameters['BgmPalettes'] || '[]');
    const bgmPalettes = [null]; // IDを1始まりにするためダミーを入れる

    rawPalettes.forEach(rawJson => {
        const paletteData = JSON.parse(rawJson);
        const bgmListRaw = JSON.parse(paletteData.BgmList || '[]');

        // リスト構造のまま保持する
        const entries = [];

        bgmListRaw.forEach(bgmJson => {
            const bgm = JSON.parse(bgmJson);

            // 条件パラメータの取得
            const dateCond = String(bgm.DateCondition || '=');
            const dateVal = Number(bgm.DateValue || 0);
            const timeCond = String(bgm.TimeCondition || '=');
            const timeVal = Number(bgm.TimeValue || 0);

            const audioType = String(bgm.AudioType || 'bgm');

            const baseData = {
                name: normalizeAudioName(audioType, bgm.Name),
                volume: Number(bgm.Volume || 90),
                pitch: Number(bgm.Pitch || 100),
                pan: Number(bgm.Pan || 0)
            };

            const entry = {
                dateCond: dateCond,
                dateVal: dateVal,
                timeCond: timeCond,
                timeVal: timeVal,
                audioType: audioType,
                audioData: null,
                isMute: false
            };

            // Name が空欄なら「無音指定」
            if (!baseData.name) {
                entry.isMute = true;
            } else {
                entry.audioData = baseData;
            }

            entries.push(entry);
        });

        bgmPalettes.push({ entries: entries });
    });

    // -------------------------------------------------------------------------
    // Game_System 拡張
    // -------------------------------------------------------------------------
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._mapBgmTempPalette = null;
    };

    // -------------------------------------------------------------------------
    // コアロジック
    // -------------------------------------------------------------------------

    // 条件判定関数
    function checkCondition(currentValue, condition, targetValue) {
        switch (condition) {
            case '=': return currentValue === targetValue;
            case '>=': return currentValue >= targetValue;
            case '<=': return currentValue <= targetValue;
            case '>': return currentValue > targetValue;
            case '<': return currentValue < targetValue;
            case '!=': return currentValue !== targetValue;
            default: return currentValue === targetValue;
        }
    }


    // 現在の状況に応じたBGM/BGSオブジェクトを取得する関数
    function resolvePalette(paletteId, dateVal, timeVal) {
        if (paletteId > 0 && paletteId < bgmPalettes.length) {
            const palette = bgmPalettes[paletteId];
            if (palette && palette.entries && palette.entries.length > 0) {
                const result = {};
                let bgmFound = false;
                let bgsFound = false;

                for (let i = palette.entries.length - 1; i >= 0; i--) {
                    const entry = palette.entries[i];
                    if (bgmFound && bgsFound) break;

                    const isDateMatch = checkCondition(dateVal, entry.dateCond, entry.dateVal);
                    const isTimeMatch = checkCondition(timeVal, entry.timeCond, entry.timeVal);

                    if (isDateMatch && isTimeMatch) {
                        if (entry.audioType === 'bgm' && !bgmFound) {
                            bgmFound = true;
                            if (entry.isMute) {
                                result.muteBgm = true;
                            } else {
                                result.bgm = entry.audioData;
                            }
                        } else if (entry.audioType === 'bgs' && !bgsFound) {
                            bgsFound = true;
                            if (entry.isMute) {
                                result.muteBgs = true;
                            } else {
                                result.bgs = entry.audioData;
                            }
                        }
                    }
                }
                if (result.bgm || result.bgs || result.muteBgm || result.muteBgs) {
                    return result;
                }
            }
        }
        return null;
    }

    // 現在の状況に応じたBGM/BGSオブジェクトを取得する関数
    function getCurrentContextAudio() {
        // マップデータがまだ読み込まれていない場合（テスト移動直後など）は何もしない
        if (!$dataMap || !$dataMap.meta) {
            return null;
        }

        // 1. 無効化スイッチチェック
        if (disableSwitchIds.some(id => $gameSwitches.value(id))) {
            return null; // Plugin無効時は制御しない（nullを返す）
        }

        // 1.5 一時パレットチェック ($gameSystem拡張)
        if ($gameSystem && $gameSystem._mapBgmTempPalette) {
            const temp = $gameSystem._mapBgmTempPalette;
            // 変数取得（パレット判定用）
            const dateVal = $gameVariables.value(dateVarId);
            const timeVal = $gameVariables.value(timeVarId);



            const result = {};

            // 0. 強制BGM/BGS (MemorizeCurrentで保存されたもの)
            if (temp.forcedBgm || temp.forcedBgs) {
                if (temp.forcedBgm) {
                    result.bgm = temp.forcedBgm;
                }
                if (temp.forcedBgs) {
                    result.bgs = temp.forcedBgs;
                }
                // forcedBgmだけあり、forcedBgsがない場合(Stop状態記憶)、undefinedになる。
                // undefinedだとMap設定が適用される可能性があるか？
                // getCurrentContextAudioの呼び出し元では:
                // hasOverrideBgm = targetAudio.bgm
                // muteBgm = targetAudio.muteBgm (undefinedならfalse)
                // 記憶したのが「停止」の場合、forcedBgmは {name: ""} であり、hasOverrideBgmはtrue。
                // playBgm("") -> stop。

                // 問題は「片方だけ変更」に対応するかだが、MemorizeCurrentは両方スナップショットする。
                // だから両方セットされているはず（saveBgmは常にオブジェクトを返す）。
                return result;
            }

            if (temp.muteBoth) {
                return { muteBgm: true, muteBgs: true };
            }

            // パレット指定があれば取得
            if (temp.paletteId > 0) {
                const paletteResult = resolvePalette(temp.paletteId, dateVal, timeVal);
                if (paletteResult) {
                    Object.assign(result, paletteResult);
                }
            }

            // 個別消音設定の上書き
            if (temp.muteBgm) {
                result.muteBgm = true;
                delete result.bgm;
            }
            if (temp.muteBgs) {
                result.muteBgs = true;
                delete result.bgs;
            }

            // 設定が何かあればそれを返す
            if (result.bgm || result.bgs || result.muteBgm || result.muteBgs || temp.paletteId > 0) {
                return result;
            }
            // パレットID指定があっても結果が空（条件不一致）の場合や、
            // ID=0 かつ 消音無効 の場合は、ここを抜けて通常処理（<Event>チェック等）には行かず...
            // いや、「優先度: 1と2の間」なので、ここで有効な指示があれば優先。
            // 指示が無効（条件不一致など）なら、フォールバックするか？
            // ユーザー要望「このコマンドで指定したBGMパレットからBGMを流す」
            // 条件不一致なら流さない(=維持 or デフォルト)？
            // ここで return result すれば、<Event>より優先される。

            // もし「無操作」を意図しているならnullを返すべきだが、
            // TempPaletteがセットされている以上、何らかの意図があるはず。
            // 条件不一致で音が無いのも一つの結果。
            return result;
        }

        // 2. <Event>タグチェック（プラグイン機能を無効化）
        const mapMeta = $dataMap.meta;
        if (mapMeta.Event) {
            return null; // <Event>タグがある場合は通常のツクール機能に従う
        }

        // 3. 変数取得
        const dateVal = $gameVariables.value(dateVarId);
        const timeVal = $gameVariables.value(timeVarId);
        const progressVal = $gameVariables.value(progressVarId);

        // 4. パレットIDの決定
        let paletteId = 0;
        const isPostProgress = progressVal >= progressThreshold;

        // 特定マップ指定チェック (<BgmPalette: X>)
        if (mapMeta.BgmPalette) {
            paletteId = Number(mapMeta.BgmPalette);
        } else {
            // タグ判定
            if (mapMeta.Room) {
                paletteId = isPostProgress ? assignData.room.post : assignData.room.pre;
            } else if (mapMeta.Basement) {
                paletteId = isPostProgress ? assignData.basement.post : assignData.basement.pre;
            } else {
                // 屋外（デフォルト）
                paletteId = isPostProgress ? assignData.outdoor.post : assignData.outdoor.pre;
            }
        }

        // 5. BGM/BGSデータの取得
        return resolvePalette(paletteId, dateVal, timeVal);

        // パレットが無い、またはBGM/BGS設定が空の場合は
        // 「制御しない」= マップ設定のBGM/BGSが流れるようにする
        return null;
    }

    // -------------------------------------------------------------------------
    // シーン復帰時の記憶オーディオ復元
    // -------------------------------------------------------------------------
    // メニューなどから戻った際に、記憶したBGM/BGSを再生する
    // カスタムメニュー等にも対応するため、Scene_Baseをフック
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);

        // マップシーンへの復帰時のみ処理（Scene_Mapまたはその派生クラス）
        if (!(this instanceof Scene_Map)) {
            return;
        }

        // 一時パレットの強制オーディオがある場合、復元を試みる
        restoreForcedAudio();
    };

    // SceneManagerのpopでシーンスタックから戻るときにも対応
    const _SceneManager_pop = SceneManager.pop;
    SceneManager.pop = function () {
        _SceneManager_pop.call(this);
        // ポップ後に少し遅延を入れて復元（シーン遷移完了後に実行）
        setTimeout(() => {
            if (SceneManager._scene instanceof Scene_Map) {
                restoreForcedAudio();
            }
        }, 100);
    };

    // 強制オーディオ復元用の共通関数
    function restoreForcedAudio() {
        if (!$gameSystem || !$gameSystem._mapBgmTempPalette) {
            return;
        }

        // BGSラインを1に戻す (ParallelBgs対策)
        if ($gameSystem && typeof $gameSystem.setBgsLine === 'function') {
            $gameSystem.setBgsLine(1);
        }

        const temp = $gameSystem._mapBgmTempPalette;

        if (temp.forcedBgm) {
            const currentBgm = AudioManager.saveBgm();
            if (currentBgm.name !== temp.forcedBgm.name) {
                if (temp.forcedBgm.name) {
                    AudioManager.playBgm(temp.forcedBgm);
                } else {
                    AudioManager.stopBgm();
                }
            }
        }

        if (temp.forcedBgs) {
            const currentBgs = AudioManager.saveBgs();
            if (currentBgs.name !== temp.forcedBgs.name) {
                if (temp.forcedBgs.name) {
                    AudioManager.playBgs(temp.forcedBgs);
                } else {
                    AudioManager.stopBgs();
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // マップBGM自動再生のオーバーライド
    // -------------------------------------------------------------------------

    const _Game_Map_autoplay = Game_Map.prototype.autoplay;
    Game_Map.prototype.autoplay = function () {
        if (!$dataMap) return;

        // プラグインで計算したBGM/BGSを取得
        const targetAudio = getCurrentContextAudio();

        // BGSラインを1に戻す (ParallelBgs対策)
        // 通常のautoplayはParallelBgs側で制御されるが、このプラグインで上書きしているため自前で行う
        if ($gameSystem && typeof $gameSystem.setBgsLine === 'function') {
            $gameSystem.setBgsLine(1);
        }

        const hasOverrideBgm = targetAudio && targetAudio.bgm;
        const hasOverrideBgs = targetAudio && targetAudio.bgs;
        const muteBgm = targetAudio && targetAudio.muteBgm;
        const muteBgs = targetAudio && targetAudio.muteBgs;

        // BGM処理（乗り物BGMを優先）
        if ($gamePlayer && $gamePlayer.isInVehicle()) {
            $gamePlayer.vehicle().autoplay();
        } else {
            if (hasOverrideBgm) {
                AudioManager.playBgm(targetAudio.bgm);
            } else if (muteBgm) {
                AudioManager.stopBgm();
            } else if ($dataMap.autoplayBgm) {
                AudioManager.playBgm($dataMap.bgm);
            }
        }

        // BGS処理
        if (hasOverrideBgs) {
            AudioManager.playBgs(targetAudio.bgs);
        } else if (muteBgs) {
            AudioManager.stopBgs();
        } else if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
        // その後、マップ内イベントで設定されたBGSがあれば通常通り上書きされる。
    };

    // -------------------------------------------------------------------------
    // 変数変更時のBGM更新 (マップ移動せずに時間が変わった場合など)
    // -------------------------------------------------------------------------

    // 変数が更新されたらBGMを再チェックする仕組み
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        _Game_Variables_setValue.call(this, variableId, value);

        // 関連する変数が変わった場合（マップ移動中や戦闘中以外）
        if ([dateVarId, timeVarId, progressVarId].includes(variableId)) {
            // $dataMapが存在し、かつ戦闘中でない場合のみ処理
            if (!$dataMap || !$dataMap.meta || ($gameParty && $gameParty.inBattle())) {
                return;
            }

            // 現在の状況に応じたオーディオ設定を取得
            const targetAudio = getCurrentContextAudio();

            // BGSラインを1に戻す (ParallelBgs対策)
            if ($gameSystem && typeof $gameSystem.setBgsLine === 'function') {
                $gameSystem.setBgsLine(1);
            }

            const hasOverrideBgm = targetAudio && targetAudio.bgm;
            const hasOverrideBgs = targetAudio && targetAudio.bgs;
            const muteBgm = targetAudio && targetAudio.muteBgm;
            const muteBgs = targetAudio && targetAudio.muteBgs;

            // BGM更新処理
            if (hasOverrideBgm) {
                AudioManager.playBgm(targetAudio.bgm);
            } else if (muteBgm) {
                AudioManager.stopBgm();
            } else if ($dataMap.autoplayBgm) {
                // パレット指定がなくなった場合はマップのデフォルトBGMに戻す
                AudioManager.playBgm($dataMap.bgm);
            }

            // BGS更新処理
            if (hasOverrideBgs) {
                AudioManager.playBgs(targetAudio.bgs);
            } else if (muteBgs) {
                AudioManager.stopBgs();
            } else if ($dataMap.autoplayBgs) {
                // パレット指定がなくなった場合はマップのデフォルトBGSに戻す
                AudioManager.playBgs($dataMap.bgs);
            }
        }
    };

    // -------------------------------------------------------------------------
    // プラグインコマンド
    // -------------------------------------------------------------------------
    PluginManager.registerCommand(pluginName, "SetTempPalette", args => {
        const paletteId = Number(args.PaletteId || 0);
        const muteBgm = args.MuteBgm === 'true';
        const muteBgs = args.MuteBgs === 'true';
        const muteBoth = args.MuteBoth === 'true';
        const memorizeCurrent = args.MemorizeCurrent === 'true';

        const setting = {
            paletteId: paletteId,
            muteBgm: muteBgm,
            muteBgs: muteBgs,
            muteBoth: muteBoth
        };

        if (memorizeCurrent) {
            // 現在のBGM/BGSを保存
            setting.forcedBgm = AudioManager.saveBgm();
            setting.forcedBgs = AudioManager.saveBgs();
        }

        $gameSystem._mapBgmTempPalette = setting;
    });

    PluginManager.registerCommand(pluginName, "ClearTempPalette", args => {
        $gameSystem._mapBgmTempPalette = null;
    });

})();