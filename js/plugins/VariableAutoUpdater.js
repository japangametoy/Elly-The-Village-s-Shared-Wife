/*:
 * @target MZ
 * @plugindesc 変数監視による自動更新プラグイン
 * @help
 * 進行度・時間・日付・目標変数を監視し、変化時に自動的に
 * 身体部位テキスト、数値ステータス、関係性テキスト、目標テキストを更新します。
 * 
 * 【使い方】
 * プラグインパラメータで各変数IDを設定してください。
 * 監視対象の変数が変更されると、自動的に該当する変数が更新されます。
 * 
 * 【データ構造】
 * データは "進行度_日付_時間" 形式のキーで管理されます。
 * 例: "1_0_0" = 進行度1、日付0、時間0
 * 
 * @command updateAll
 * @text 全更新実行
 * @desc 現在の値に基づいて全変数を更新します。
 * 
 * @command updateProgress
 * @text 進行度系更新
 * @desc 進行度・時間・日付に基づいて更新します。
 * 
 * @command updateGoal
 * @text 目標更新
 * @desc 目標変数に基づいて目標テキストを更新します。
 * 
 * @command advanceTime
 * @text 時間を1進める
 * @desc 時間を1進め、4になったら0に戻して日付を1進めます。日付と時間の繰り上がりを正しく処理します。
 * 
 * @command resetTimeAndDateSilent
 * @text 時間・日付をリセット（自動更新なし）
 * @desc 時間変数と日付変数を0にし、このときは文字上書き・数値加算を行いません。

 * 
 * @command setProgressAndReset
 * @text 進行度を設定してリセット
 * @desc 進行度を指定した数値に設定し、時間・日付を0にリセットします。自動更新は行いませんが、RELATION_DATAの"進行度_9_9"が存在する場合は適用します。
 *
 * @arg progress
 * @text 進行度
 * @type number
 * @desc 設定する進行度の値
 * @default 1
 * @min 0
 *
 * @arg time
 * @text 時間
 * @type number
 * @desc 設定する時間の値
 * @default 0
 * @min 0
 * 
 * @command exportData
 * @text データエクスポート
 * @desc 現在のデータ（BODY_DATA、STATUS_DATA等）をJSON形式で変数に保存します。
 *
 * @arg outputVariableId
 * @text 出力先変数ID
 * @type variable
 * @desc JSON文字列を保存する変数ID（文字変数）
 * @default 1
 *
 * @command importData
 * @text データインポート
 * @desc 変数からJSON文字列を読み込んで、データ（BODY_DATA、STATUS_DATA等）を上書きします。
 *
 * @arg inputVariableId
 * @text 入力元変数ID
 * @type variable
 * @desc JSON文字列が保存されている変数ID（文字変数）
 * @default 1
 * 
 * @command manualSetText
 * @text 手動テキスト代入
 * @desc プラグインパラメータで登録した文字変数にテキストを代入します。
 *
 * @arg targetTextParam
 * @text 対象文字パラメータ
 * @type select
 * @option Lip変数ID
 * @value lip
 * @option Bust変数ID
 * @value bust
 * @option Pussy変数ID
 * @value pussy
 * @option Hip変数ID
 * @value hip
 * @option 好きな人変数ID
 * @value favorite
 * @option 初体験変数ID
 * @value first
 * @option 一番上手変数ID
 * @value best
 * @option 一番下手変数ID
 * @value worst
 * @option ページ2タイトル変数ID
 * @value page2Title
 * @option 目標表示用変数ID
 * @value goalText
 * @default lip
 *
 * @arg text
 * @text 代入テキスト
 * @type multiline_string
 * @desc 代入するテキストです。\\nで改行できます。
 *
 * @arg notify
 * @text 通知を表示する
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc 通知メッセージを表示するかどうか
 * @default true
 * 
 * @command manualChangeNumber
 * @text 手動数値操作
 * @desc プラグインパラメータで登録した数値変数を加算・減算・代入します。
 *
 * @arg targetNumberParam
 * @text 対象数値パラメータ
 * @type select
 * @option 主人公回数変数ID
 * @value countHero
 * @option 友人回数変数ID
 * @value countFriend
 * @option 村長回数変数ID
 * @value countMayor
 * @option ガキ回数変数ID
 * @value countKid
 * @option おじさん達回数変数ID
 * @value countUncle
 * @option ゴム回数変数ID
 * @value countCondom
 * @option 生回数変数ID
 * @value countRaw
 * @option 尻回数変数ID
 * @value countAss
 * @option 乳回数変数ID
 * @value countBreast
 * @option 手回数変数ID
 * @value countHand
 * @option 液体量変数ID
 * @value countLiquid
 * @option 妊娠数変数ID
 * @value countPregnant
 * @option 総回数変数ID
 * @value countTotal
 * @option 口回数変数ID
 * @value countMouth
 * @default countHero
 *
 * @arg operation
 * @text 操作種別
 * @type select
 * @option 加算
 * @value add
 * @option 減算
 * @value sub
 * @option 代入
 * @value set
 * @default add
 *
 * @arg value
 * @text 値
 * @type number
 * @desc 操作に使用する値です。
 * @default 0
 *
 * @arg notify
 * @text 通知を表示する
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc 通知メッセージを表示するかどうか
 * @default true
 * 
 * @command setTextFromTemplate
 * @text テンプレテキスト代入
 * @desc テンプレートIDで指定した構文を、選択した文字パラメータに代入します。
 *
 * @arg targetTextParam
 * @text 対象文字パラメータ
 * @type select
 * @option Lip変数ID
 * @value lip
 * @option Bust変数ID
 * @value bust
 * @option Pussy変数ID
 * @value pussy
 * @option Hip変数ID
 * @value hip
 * @option 好きな人変数ID
 * @value favorite
 * @option 初体験変数ID
 * @value first
 * @option 一番上手変数ID
 * @value best
 * @option 一番下手変数ID
 * @value worst
 * @option ページ2タイトル変数ID
 * @value page2Title
 * @option 目標表示用変数ID
 * @value goalText
 * @default lip
 *
 * @arg templateId
 * @text テンプレートID
 * @type string
 * @desc JS内のTEMPLATE_LISTで定義したidを指定します。
 *
 * @arg notify
 * @text 通知を表示する
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc 通知メッセージを表示するかどうか
 * @default true
 * 
 * @command showNotify
 * @text 通知メッセージ表示
 * @desc 指定したメッセージを通知として表示します。
 *
 * @arg message
 * @text メッセージ
 * @type string
 * @desc 表示する通知メッセージ
 * @default 
 *
 * @param NotifySeName
 * @text 通知SE ファイル名
 * @type file
 * @dir audio/se
 * @desc tweenメッセージ表示時に再生するSE。空欄の場合は再生しません。
 * @default 
 * 
 * @param NotifySeVolume
 * @text 通知SE 音量
 * @type number
 * @min 0
 * @max 100
 * @desc 通知SEの音量（%）
 * @default 90
 * 
 * @param NotifySePitch
 * @text 通知SE ピッチ
 * @type number
 * @min 50
 * @max 150
 * @desc 通知SEのピッチ（%）
 * @default 100
 * 
 * @param NotifySePan
 * @text 通知SE 位相
 * @type number
 * @min -100
 * @max 100
 * @desc 通知SEの位相
 * @default 0
 * 
 * @param ProgressVariableId
 * @text 進行度変数ID
 * @type variable
 * @desc 進行度を表す変数のID
 * @default 11
 * 
 * @param TimeVariableId
 * @text 時間変数ID
 * @type variable
 * @desc 時間帯を表す変数のID
 * @default 13
 * 
 * @param DateVariableId
 * @text 日付変数ID
 * @type variable
 * @desc 日付を表す変数のID
 * @default 12
 * 
 * @param GoalVariableId
 * @text 目標変数ID
 * @type variable
 * @desc 目標を表す変数のID
 * @default 14
 * 
 * @param LipVariableId
 * @text Lip変数ID
 * @type variable
 * @desc くちびる状態を表す文字変数のID
 * @default 100
 * 
 * @param BustVariableId
 * @text Bust変数ID
 * @type variable
 * @desc バスト状態を表す文字変数のID
 * @default 101
 * 
 * @param PussyVariableId
 * @text Pussy変数ID
 * @type variable
 * @desc おまんこ状態を表す文字変数のID
 * @default 102
 * 
 * @param HipVariableId
 * @text Hip変数ID
 * @type variable
 * @desc お尻状態を表す文字変数のID
 * @default 103
 * 
 * @param LipIconVariableId
 * @text Lipアイコン変数ID
 * @type variable
 * @desc くちびるアイコン名を表す文字変数のID
 * @default 150
 * 
 * @param BustIconVariableId
 * @text Bustアイコン変数ID
 * @type variable
 * @desc バストアイコン名を表す文字変数のID
 * @default 151
 * 
 * @param PussyIconVariableId
 * @text Pussyアイコン変数ID
 * @type variable
 * @desc おまんこアイコン名を表す文字変数のID
 * @default 152
 * 
 * @param HipIconVariableId
 * @text Hipアイコン変数ID
 * @type variable
 * @desc お尻アイコン名を表す文字変数のID
 * @default 153
 * 
 * @param CountHeroVariableId
 * @text 主人公回数変数ID
 * @type variable
 * @desc 主人公回数を表す数値変数のID
 * @default 201
 * 
 * @param CountFriendVariableId
 * @text 友人回数変数ID
 * @type variable
 * @desc 友人回数を表す数値変数のID
 * @default 202
 * 
 * @param CountMayorVariableId
 * @text 村長回数変数ID
 * @type variable
 * @desc 村長回数を表す数値変数のID
 * @default 203
 * 
 * @param CountKidVariableId
 * @text ガキ回数変数ID
 * @type variable
 * @desc ガキ回数を表す数値変数のID
 * @default 204
 * 
 * @param CountUncleVariableId
 * @text おじさん達回数変数ID
 * @type variable
 * @desc おじさん達回数を表す数値変数のID
 * @default 205
 * 
 * @param CountCondomVariableId
 * @text ゴム回数変数ID
 * @type variable
 * @desc ゴム回数を表す数値変数のID
 * @default 206
 * 
 * @param CountRawVariableId
 * @text 生回数変数ID
 * @type variable
 * @desc 生回数を表す数値変数のID
 * @default 207
 * 
 * @param CountAssVariableId
 * @text 尻回数変数ID
 * @type variable
 * @desc 尻回数を表す数値変数のID
 * @default 208
 * 
 * @param CountBreastVariableId
 * @text 乳回数変数ID
 * @type variable
 * @desc 乳回数を表す数値変数のID
 * @default 209
 * 
 * @param CountHandVariableId
 * @text 手回数変数ID
 * @type variable
 * @desc 手回数を表す数値変数のID
 * @default 210
 * 
 * @param CountLiquidVariableId
 * @text 液体量変数ID
 * @type variable
 * @desc 液体量を表す数値変数のID
 * @default 211
 * 
 * @param CountPregnantVariableId
 * @text 妊娠数変数ID
 * @type variable
 * @desc 妊娠数を表す数値変数のID
 * @default 212
 * 
 * @param CountTotalVariableId
 * @text 総回数変数ID
 * @type variable
 * @desc 総回数を表す数値変数のID
 * @default 213
 * 
 * @param CountMouthVariableId
 * @text 口回数変数ID
 * @type variable
 * @desc 口回数を表す数値変数のID
 * @default 214
 * 
 * @param FavoriteVariableId
 * @text 好きな人変数ID
 * @type variable
 * @desc 好きな人を表す文字変数のID
 * @default 300
 * 
 * @param FirstVariableId
 * @text 初体験変数ID
 * @type variable
 * @desc 初体験を表す文字変数のID
 * @default 301
 * 
 * @param BestVariableId
 * @text 一番上手変数ID
 * @type variable
 * @desc 一番上手を表す文字変数のID
 * @default 302
 * 
 * @param WorstVariableId
 * @text 一番下手変数ID
 * @type variable
 * @desc 一番下手を表す文字変数のID
 * @default 303
 * 
 * @param Page2TitleVariableId
 * @text ページ2タイトル変数ID
 * @type variable
 * @desc ページ2タイトルを表す文字変数のID
 * @default 304
 * 
 * @param GoalTextVariableId
 * @text 目標表示用変数ID
 * @type variable
 * @desc 目標テキストを表す文字変数のID
 * @default 400
 * 
 * @param DisableNotifySwitchId
 * @text 通知無効化スイッチID
 * @type switch
 * @desc このスイッチがONの場合は通知メッセージを表示しません
 * @default 0
 * 
 * @param CycleVarIdRange
 * @text 周回数変数ID範囲
 * @type text
 * @desc 周回数を管理する変数のID範囲（例: 101-150 または 101,102,103）
 * @default 
 * 
 * @param TimeVarIdRange
 * @text 時間判定変数ID範囲
 * @type text
 * @desc 時間経過を判定する変数のID範囲（例: 101-150 または 101,102,103）
 * @default 
 * 
 * @param DayEventTag
 * @text 日付リセット用イベントタグ
 * @type text
 * @desc メモ欄にこのタグがあるイベントのセルフスイッチを日付変更時にOFFにします
 * @default Day
 * 
 * @param DayResetVariables
 * @text 日付変更時リセット変数
 * @type struct<DayResetVariable>[]
 * @desc 日付が変化した時に0にリセットする変数を設定します。変数リストから選択できます。
 * @default []
 * 
 * @param DateChangeAddVariables
 * @text 日付変更時加算変数
 * @type struct<DateChangeAddVariable>[]
 * @desc 日付が変化した時に、条件に応じて加算する変数を設定します。
 * @default []
 * 
 * @param StatusAddConditions
 * @text 数値加算条件設定
 * @type struct<StatusAddCondition>[]
 * @desc 特定の進行度・日付・時間の組み合わせで数値加算を行う際の条件を設定します。
 * 
 * @param LiquidAddRangeConditions
 * @text 液体量加算範囲条件設定
 * @type struct<LiquidAddRangeCondition>[]
 * @desc 特定の進行度・日付・時間の組み合わせで液体量加算の範囲を変更します。
 * 
 * @command manualAddTotalWithLiquid
 * @text 手動トータル変数加算（液体量変更）
 * @desc countTotalに加算し、液体量も指定した範囲で加算します。
 *
 * @arg totalAddAmount
 * @text トータル加算値
 * @type number
 * @desc countTotalに加算する値
 * @default 1
 * @min 0
 *
 * @arg liquidMin
 * @text 液体量最小値
 * @type number
 * @desc 液体量加算の最小値
 * @default 8
 * @min 0
 *
 * @arg liquidMax
 * @text 液体量最大値
 * @type number
 * @desc 液体量加算の最大値
 * @default 15
 * @min 0
 *
 * @arg notify
 * @text 通知を表示する
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc 通知メッセージを表示するかどうか
 * @default true
 * 
 * @param CommonEventConditions
 * @text コモンイベント実行条件
 * @type struct<CommonEventCondition>[]
 * @desc 特定の進行度・日付・時間になった時にコモンイベントを実行します。
 * @default []
 * 
 * @param DebugMode
 * @text デバッグモード
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc コンソールにデバッグログを出力するかどうか
 * @default false
 */

/*~struct~StatusAddCondition:
 * @param progress
 * @text 進行度
 * @type number
 * @desc 条件を適用する進行度
 * @default 0
 * @min 0
 *
 * @param date
 * @text 日付
 * @type number
 * @desc 条件を適用する日付
 * @default 0
 * @min 0
 *
 * @param time
 * @text 時間
 * @type number
 * @desc 条件を適用する時間
 * @default 0
 * @min 0
 *
 * @param conditionType
 * @text 条件タイプ
 * @type select
 * @option 変数（値が閾値以上）
 * @value variable
 * @option スイッチ（ON）
 * @value switch
 * @desc 条件のタイプを選択します
 * @default variable
 *
 * @param variableId
 * @text 判定変数ID
 * @type variable
 * @desc 条件タイプが「変数」の場合に使用する変数ID
 * @default 0
 *
 * @param switchId
 * @text 判定スイッチID
 * @type switch
 * @desc 条件タイプが「スイッチ」の場合に使用するスイッチID
 * @default 0
 *
 * @param threshold
 * @text 閾値
 * @type number
 * @desc 条件タイプが「変数」の場合、この値以上で条件を満たします
 * @default 0
 * @min 0
 *
 * @param skipBodyData
 * @text 条件未満時に身体部位テキスト更新をスキップ
 * @type boolean
 * @on スキップする
 * @off スキップしない
 * @desc 条件を満たしていない場合、身体部位テキスト（BODY_DATA）の更新も行わないようにします
 * @default false
 */

/*~struct~LiquidAddRangeCondition:
 * @param progress
 * @text 進行度
 * @type number
 * @desc 条件を適用する進行度
 * @default 0
 * @min 0
 *
 * @param date
 * @text 日付
 * @type number
 * @desc 条件を適用する日付
 * @default 0
 * @min 0
 *
 * @param time
 * @text 時間
 * @type number
 * @desc 条件を適用する時間
 * @default 0
 * @min 0
 *
 * @param min
 * @text 最小値
 * @type number
 * @desc 液体量加算の最小値
 * @default 8
 * @min 0
 *
 * @param max
 * @text 最大値
 * @type number
 * @desc 液体量加算の最大値
 * @default 15
 * @min 0
 */

/*~struct~DayResetVariable:
 * @param variableId
 * @text 変数
 * @type variable
 * @desc 日付変更時に0にリセットする変数
 * @default 0
 */

/*~struct~DateChangeAddVariable:
 * @param variableId
 * @text 変数
 * @type variable
 * @desc 変化対象の変数
 * @default 0
 *
 * @param addValueIfOdd
 * @text 奇数時の加算値
 * @type number
 * @min -999999
 * @desc 現在値が奇数の時に加算する値（負数も可）
 * @default 0
 *
 * @param addValueIfEven
 * @text 偶数時の加算値
 * @type number
 * @min -999999
 * @desc 現在値が偶数（0含む）の時に加算する値（負数も可）
 * @default 0
 */

/*~struct~CommonEventCondition:
 * @param progress
 * @text 進行度
 * @type number
 * @desc 条件となる進行度
 * @default 0
 * @min 0
 *
 * @param date
 * @text 日付
 * @type number
 * @desc 条件となる日付
 * @default 0
 * @min 0
 *
 * @param time
 * @text 時間
 * @type number
 * @desc 条件となる時間
 * @default 0
 * @min 0
 *
 * @param commonEventId
 * @text コモンイベントID
 * @type common_event
 * @desc 実行するコモンイベント
 * @default 0
 *
 * @param repeat
 * @text 繰り返し実行
 * @type boolean
 * @on する
 * @off しない
 * @desc 条件を満たすたびに実行するか。OFFの場合は一度実行するとセーブデータ内で「実行済み」として記録され、次回以降実行されません。
 * @default false
 */

(() => {
    'use strict';

    // ============================================================================
    // プラグインパラメータ定義
    // ============================================================================
    const pluginName = "VariableAutoUpdater";
    const parameters = PluginManager.parameters(pluginName);

    // 監視用変数ID
    const PROGRESS_VAR_ID = Number(parameters['ProgressVariableId'] || 11);
    const TIME_VAR_ID = Number(parameters['TimeVariableId'] || 13);
    const DATE_VAR_ID = Number(parameters['DateVariableId'] || 12);
    const GOAL_VAR_ID = Number(parameters['GoalVariableId'] || 14);

    // グループA: 身体部位テキスト（文字変数ID）
    const VAR_ID_LIP = Number(parameters['LipVariableId'] || 100);
    const VAR_ID_BUST = Number(parameters['BustVariableId'] || 101);
    const VAR_ID_PUSSY = Number(parameters['PussyVariableId'] || 102);
    const VAR_ID_HIP = Number(parameters['HipVariableId'] || 103);

    // グループA-ICON: 身体部位アイコン（文字変数ID）
    const VAR_ID_LIP_ICON = Number(parameters['LipIconVariableId'] || 150);
    const VAR_ID_BUST_ICON = Number(parameters['BustIconVariableId'] || 151);
    const VAR_ID_PUSSY_ICON = Number(parameters['PussyIconVariableId'] || 152);
    const VAR_ID_HIP_ICON = Number(parameters['HipIconVariableId'] || 153);

    // グループB: 数値ステータス（数値変数ID）
    const VAR_ID_COUNT_HERO = Number(parameters['CountHeroVariableId'] || 201);
    const VAR_ID_COUNT_FRIEND = Number(parameters['CountFriendVariableId'] || 202);
    const VAR_ID_COUNT_MAYOR = Number(parameters['CountMayorVariableId'] || 203);
    const VAR_ID_COUNT_KID = Number(parameters['CountKidVariableId'] || 204);
    const VAR_ID_COUNT_UNCLE = Number(parameters['CountUncleVariableId'] || 205);
    const VAR_ID_COUNT_CONDOM = Number(parameters['CountCondomVariableId'] || 206);
    const VAR_ID_COUNT_RAW = Number(parameters['CountRawVariableId'] || 207);
    const VAR_ID_COUNT_ASS = Number(parameters['CountAssVariableId'] || 208);
    const VAR_ID_COUNT_BREAST = Number(parameters['CountBreastVariableId'] || 209);
    const VAR_ID_COUNT_HAND = Number(parameters['CountHandVariableId'] || 210);
    const VAR_ID_COUNT_LIQUID = Number(parameters['CountLiquidVariableId'] || 211);
    const VAR_ID_COUNT_PREGNANT = Number(parameters['CountPregnantVariableId'] || 212);
    const VAR_ID_COUNT_TOTAL = Number(parameters['CountTotalVariableId'] || 213);
    const VAR_ID_COUNT_MOUTH = Number(parameters['CountMouthVariableId'] || 214);

    // グループC: 関係性テキスト（文字変数ID）
    const VAR_ID_FAVORITE = Number(parameters['FavoriteVariableId'] || 300);
    const VAR_ID_FIRST = Number(parameters['FirstVariableId'] || 301);
    const VAR_ID_BEST = Number(parameters['BestVariableId'] || 302);
    const VAR_ID_WORST = Number(parameters['WorstVariableId'] || 303);
    const VAR_ID_PAGE2_TITLE = Number(parameters['Page2TitleVariableId'] || 304);

    // グループD: 目標テキスト（文字変数ID）
    const VAR_ID_GOAL_TEXT = Number(parameters['GoalTextVariableId'] || 400);

    // 通知設定
    const DISABLE_NOTIFY_SWITCH_ID = Number(parameters['DisableNotifySwitchId'] || 0);
    const NOTIFY_SE_NAME = String(parameters['NotifySeName'] || '');
    const NOTIFY_SE_VOLUME = Number(parameters['NotifySeVolume'] || 90);
    const NOTIFY_SE_PITCH = Number(parameters['NotifySePitch'] || 100);
    const NOTIFY_SE_PAN = Number(parameters['NotifySePan'] || 0);

    // 新機能: 周回数・時間判定変数範囲
    const CYCLE_VAR_ID_RANGE = String(parameters['CycleVarIdRange'] || '').trim();
    const TIME_VAR_ID_RANGE = String(parameters['TimeVarIdRange'] || '').trim();
    const DAY_EVENT_TAG = String(parameters['DayEventTag'] || 'Day').trim();

    /**
     * struct配列をパースする（FastTravelSystem.jsのparseStructArrayを参考）
     */
    function parseStructArray(raw) {
        if (!raw) return [];
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            return [];
        }
        if (!Array.isArray(data)) return [];
        return data
            .map(item => {
                try {
                    return JSON.parse(item);
                } catch (e) {
                    return null;
                }
            })
            .filter(item => item);
    }

    // 新機能: 数値加算条件設定（struct形式をパース）
    const STATUS_ADD_CONDITIONS_RAW = parseStructArray(parameters['StatusAddConditions']);
    const STATUS_ADD_CONDITIONS = STATUS_ADD_CONDITIONS_RAW.map(entry => {
        const progress = Number(entry.progress || 0);
        const date = Number(entry.date || 0);
        const time = Number(entry.time || 0);
        const conditionType = String(entry.conditionType || 'variable').toLowerCase();
        const variableId = Number(entry.variableId || 0);
        const switchId = Number(entry.switchId || 0);
        const threshold = Number(entry.threshold || 0);

        const condition = {
            progress: progress,
            date: date,
            time: time,
            conditionType: conditionType,
            threshold: threshold,
            skipBodyData: entry.skipBodyData === 'true' || entry.skipBodyData === true
        };

        if (conditionType === 'variable') {
            condition.variableId = variableId;
        } else if (conditionType === 'switch') {
            condition.switchId = switchId;
        }

        return condition;
    });

    // 新機能: 液体量加算範囲条件設定（struct形式をパース）
    const LIQUID_ADD_RANGE_CONDITIONS_RAW = parseStructArray(parameters['LiquidAddRangeConditions']);
    const LIQUID_ADD_RANGE_CONDITIONS = LIQUID_ADD_RANGE_CONDITIONS_RAW.map(entry => {
        return {
            progress: Number(entry.progress || 0),
            date: Number(entry.date || 0),
            time: Number(entry.time || 0),
            min: Number(entry.min || 8),
            max: Number(entry.max || 15)
        };
    });

    // 新機能: 日付変更時リセット変数（struct形式をパース）
    const DAY_RESET_VARIABLES_RAW = parseStructArray(parameters['DayResetVariables']);
    const DAY_RESET_VARIABLES = DAY_RESET_VARIABLES_RAW.map(entry => {
        return Number(entry.variableId || 0);
    }).filter(varId => varId > 0);

    // 新機能: 日付変更時加算変数（struct形式をパース）
    const DATE_CHANGE_ADD_VARIABLES_RAW = parseStructArray(parameters['DateChangeAddVariables']);
    const DATE_CHANGE_ADD_VARIABLES = DATE_CHANGE_ADD_VARIABLES_RAW.map(entry => {
        return {
            variableId: Number(entry.variableId || 0),
            addValueIfOdd: Number(entry.addValueIfOdd || 0),
            addValueIfEven: Number(entry.addValueIfEven || 0)
        };
    }).filter(data => data.variableId > 0);

    // 新機能: コモンイベント実行条件（struct形式をパース）
    const COMMON_EVENT_CONDITIONS_RAW = parseStructArray(parameters['CommonEventConditions']);
    const COMMON_EVENT_CONDITIONS = COMMON_EVENT_CONDITIONS_RAW.map(entry => {
        return {
            progress: Number(entry.progress || 0),
            date: Number(entry.date || 0),
            time: Number(entry.time || 0),
            commonEventId: Number(entry.commonEventId || 0),
            repeat: entry.repeat === 'true' || entry.repeat === true
        };
    }).filter(c => c.commonEventId > 0);

    // デバッグモード
    const DEBUG_MODE = parameters['DebugMode'] === 'true';

    // ============================================================================
    // データ定義（外部JSONファイルから読み込む）
    // ============================================================================

    /**
     * グループA: 身体部位テキストデータ
     * データは data/Hstatus.json から読み込まれます。
     * キー形式: "進行度_日付_時間"
     * 各部位には最大3つまで文章を登録できます。
     * - 文字列1つ         : 常にその文章を使用（従来互換）
     * - 配列[1〜3要素]    : 複数文章を順番にローテーション表示
     * - null / undefined : 更新しない（元の値を維持）
     * 
     * アイコン指定:
     * - icon : 共通アイコン名を指定（推奨）
     *   - 文字列1つ         : 常にそのアイコンを使用
     *   - 配列[1〜3要素]    : テキストと同じインデックスでローテーション表示
     *   例: 
     *   { "lip": "テキスト", "icon": "Hero" }  // 単一アイコン（lipのデータなので、自動的にLipIcon変数に代入）
     *   { "lip": ["テキスト1", "テキスト2"], "icon": ["Hero", "Friend"] }  // 配列（テキストと対応）
     * - lipIcon, bustIcon, pussyIcon, hipIcon : 部位別アイコン名を指定（後方互換・iconより優先度低）
     *   指定されたアイコン名は、その部位のアイコン変数に代入されます。
     * 
     * ※ 実行時に変更可能（エクスポート/インポート機能で使用）
     */
    let BODY_DATA = {};

    /**
     * グループB: 数値ステータスデータ（加算値）
     * データは data/Hstatus.json から読み込まれます。
     * キー形式: "進行度_日付_時間"
     * null または undefined の場合は加算しない
     * 
     * ※ 実行時に変更可能（エクスポート/インポート機能で使用）
     */
    let STATUS_DATA = {};

    /**
     * グループC: 関係性テキストデータ（疎なデータ）
     * データは data/Hstatus.json から読み込まれます。
     * キー形式: "進行度_日付_時間"
     * データが存在しない場合は更新しない（元の値を維持）
     * 
     * "0_0_0" の場合、以下の初期値も設定できます：
     * - 身体部位テキスト（lip, bust, pussy, hip）: ゲーム開始時にその変数が未設定の場合、その文字列が代入されます
     * - 関係性テキスト（favorite, first, best, worst, page2Title）: 通常通り代入されます
     * - 数値変数の初期値: countHero, countFriend, countMayor などの数値変数に設定できます
     *   - 数値: 代入されます
     *   - 文字列（通常）: 代入されます
     *   - 文字列（"+10"）: 現在値に加算されます
     *   - 文字列（"-10"）: 現在値から減算されます
     *   ゲーム開始時にその変数が未設定（null/undefined/0/空文字）の場合のみ適用されます
     * 
     * "進行度_9_9" の場合（例: "1_9_9", "2_9_9"）:
     * - プラグインコマンド「進行度を設定してリセット」実行時に適用されます
     * - 身体部位テキスト、関係性テキスト、数値変数を設定できます
     * - 数値変数の指定方法:
     *   - 数値: 代入されます
     *   - 文字列（通常）: 代入されます
     *   - 文字列（"+10"）: 現在値に加算されます
     *   - 文字列（"-10"）: 現在値から減算されます
     * - countTotalが数値で代入された場合、その値に12を乗算してcountLiquidに代入されます
     * - countLiquidが直接指定されている場合は、その値が優先されます
     * 
     * アイコン指定:
     * - icon : 共通アイコン名を指定（推奨）
     *   - 文字列1つ         : 常にそのアイコンを使用
     *   例: 
     *   { "lip": "テキスト", "icon": "Hero" }  // lipのデータなので、自動的にLipIcon変数に代入
     * - lipIcon, bustIcon, pussyIcon, hipIcon : 部位別アイコン名を指定（後方互換・iconより優先度低）
     *   指定されたアイコン名は、その部位のアイコン変数に代入されます。
     * 
     * ※ 実行時に変更可能（エクスポート/インポート機能で使用）
     */
    let RELATION_DATA = {};

    /**
     * グループD: 目標テキストデータ
     * データは data/Hstatus.json から読み込まれます。
     * キー: Goal変数の値（数値）
     * 目標変数が変化した時に、対応するテキストを代入
     * 
     * ※ 実行時に変更可能（エクスポート/インポート機能で使用）
     */
    let GOAL_DATA = {};

    /**
     * テンプレートテキストリスト
     * データは data/Hstatus.json から読み込まれます。
     * 
     * id   : イベント側から指定する一意なID（英数字推奨）
     * part : 対象部位を示すキー（'lip' | 'bust' | 'pussy' | 'hip' | 'favorite' | 'first' | 'best' | 'worst' | 'page2Title' | 'goalText' など）
     * text : 実際に代入されるテキスト
     *       - 文字列1つ         : 常にその文章を使用（従来互換）
     *       - 配列[1〜3要素]    : 複数文章を順番にローテーション表示
     *                             1回目に呼ばれたとき: 配列の0番目
     *                             2回目に呼ばれたとき: 配列の1番目
     *                             3回目に呼ばれたとき: 配列の2番目
     *                             4回目以降: 0番目に戻る
     * 
     * アイコン指定:
     * - icon : 共通アイコン名を指定（推奨）
     *   - 文字列1つ         : 常にそのアイコンを使用
     *   - 配列[1〜3要素]    : テキストと同じインデックスでローテーション表示
     *   例: 
     *   { "id": "lip_01", "part": "lip", "text": "テキスト", "icon": "Hero" }  // partがlipなので、自動的にLipIcon変数に代入
     *   { "id": "lip_01", "part": "lip", "text": ["テキスト1", "テキスト2"], "icon": ["Hero", "Friend"] }  // 配列（テキストと対応）
     * - lipIcon, bustIcon, pussyIcon, hipIcon : 部位別アイコン名を指定（後方互換・iconより優先度低）
     *   指定されたアイコン名は、その部位のアイコン変数に代入されます。
     * 
     * ▼ 記載例（JSON形式）
     * {
     *   "templateList": [
     *     {
     *       "id": "lip_01",
     *       "part": "lip",
     *       "text": "くちびるが\n少し赤くなっている。"
     *     },
     *     {
     *       "id": "bust_01",
     *       "part": "bust",
     *       "text": [
     *         "胸ばっかり見て･･･\n見てんのバレバレだって･･･！",
     *         "バストは\nまだ控えめなまま。",
     *         "胸が\n大きくなってきた･･･"
     *       ]
     *     },
     *     {
     *       "id": "bust_02",
     *       "part": "bust",
     *       "text": [
     *         "バストの\n状態1",
     *         "バストの\n状態2"
     *       ]
     *     }
     *   ]
     * }
     * 
     * ※ 実行時に変更可能（エクスポート/インポート機能で使用）
     */
    let TEMPLATE_LIST = [];

    /**
     * テンプレートテキストのローテーションインデックス管理
     * キー: templateId（例) "lip_01"）
     * 値: 次回使用するインデックス（0〜）
     */
    const TEMPLATE_TEXT_INDEX = {};

    /**
     * 外部JSONファイル（data/Hstatus.json）からデータを読み込む
     */
    function loadDataFromJson() {
        try {
            // Hstatus.jsonを読み込む（HttpRequestを使用）
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/Hstatus.json', false); // 同期読み込み
            xhr.send();

            if (xhr.status !== 200) {
                console.warn(`[${pluginName}] Hstatus.jsonが見つかりません（ステータス: ${xhr.status}）。デフォルトの空データを使用します。`);
                return;
            }

            const jsonData = JSON.parse(xhr.responseText);

            if (!jsonData) {
                console.warn(`[${pluginName}] Hstatus.jsonの解析に失敗しました。デフォルトの空データを使用します。`);
                return;
            }

            // データを読み込む（存在するものだけ）
            if (jsonData.bodyData !== undefined) {
                BODY_DATA = jsonData.bodyData;
            }
            if (jsonData.statusData !== undefined) {
                STATUS_DATA = jsonData.statusData;
            }
            if (jsonData.relationData !== undefined) {
                RELATION_DATA = jsonData.relationData;
            }
            if (jsonData.goalData !== undefined) {
                GOAL_DATA = jsonData.goalData;
            }
            if (jsonData.templateList !== undefined) {
                TEMPLATE_LIST = jsonData.templateList;
            }

            if (DEBUG_MODE) {
                console.log(`[${pluginName}] Hstatus.jsonからデータを読み込みました`);
            }
        } catch (e) {
            console.error(`[${pluginName}] Hstatus.jsonの読み込み中にエラーが発生しました:`, e);
            console.warn(`[${pluginName}] デフォルトの空データを使用します。`);
        }
    }


    // ============================================================================
    // ユーティリティ関数
    // ============================================================================

    /**
     * 変数IDからパラメータ名を取得（ログ用）
     * @param {number} variableId - 変数ID
     * @returns {string} パラメータ名（不明な場合は "Unknown(ID)" 形式）
     */
    function getVariableParamName(variableId) {
        // テキスト系変数
        if (variableId === VAR_ID_LIP) return 'Lip変数ID';
        if (variableId === VAR_ID_BUST) return 'Bust変数ID';
        if (variableId === VAR_ID_PUSSY) return 'Pussy変数ID';
        if (variableId === VAR_ID_HIP) return 'Hip変数ID';
        if (variableId === VAR_ID_LIP_ICON) return 'Lipアイコン変数ID';
        if (variableId === VAR_ID_BUST_ICON) return 'Bustアイコン変数ID';
        if (variableId === VAR_ID_PUSSY_ICON) return 'Pussyアイコン変数ID';
        if (variableId === VAR_ID_HIP_ICON) return 'Hipアイコン変数ID';
        if (variableId === VAR_ID_FAVORITE) return '好きな人変数ID';
        if (variableId === VAR_ID_FIRST) return '初体験変数ID';
        if (variableId === VAR_ID_BEST) return '一番上手変数ID';
        if (variableId === VAR_ID_WORST) return '一番下手変数ID';
        if (variableId === VAR_ID_PAGE2_TITLE) return 'ページ2タイトル変数ID';
        if (variableId === VAR_ID_GOAL_TEXT) return '目標表示用変数ID';
        // 数値系変数
        if (variableId === VAR_ID_COUNT_HERO) return '主人公回数変数ID';
        if (variableId === VAR_ID_COUNT_FRIEND) return '友人回数変数ID';
        if (variableId === VAR_ID_COUNT_MAYOR) return '村長回数変数ID';
        if (variableId === VAR_ID_COUNT_KID) return 'ガキ回数変数ID';
        if (variableId === VAR_ID_COUNT_UNCLE) return 'おじさん達回数変数ID';
        if (variableId === VAR_ID_COUNT_CONDOM) return 'ゴム回数変数ID';
        if (variableId === VAR_ID_COUNT_RAW) return '生回数変数ID';
        if (variableId === VAR_ID_COUNT_ASS) return '尻回数変数ID';
        if (variableId === VAR_ID_COUNT_BREAST) return '乳回数変数ID';
        if (variableId === VAR_ID_COUNT_HAND) return '手回数変数ID';
        if (variableId === VAR_ID_COUNT_LIQUID) return '液体量変数ID';
        if (variableId === VAR_ID_COUNT_PREGNANT) return '妊娠数変数ID';
        if (variableId === VAR_ID_COUNT_TOTAL) return '総回数変数ID';
        if (variableId === VAR_ID_COUNT_MOUTH) return '口回数変数ID';
        // 不明
        return `Unknown(${variableId})`;
    }

    /**
     * 変数更新ログを出力
     * @param {string} key - 進行度キー（例: "1_0_0"）
     * @param {number} variableId - 変数ID
     * @param {string} operation - 操作種別（"代入" | "加算"）
     * @param {*} value - 設定する値
     * @param {*} oldValue - 変更前の値（省略可能）
     */
    function logVariableUpdate(key, variableId, operation, value, oldValue) {
        const paramName = getVariableParamName(variableId);
        let logMessage = `[${pluginName}] [${key}] ${paramName}(ID:${variableId}) に ${operation}: `;

        // 値の表示形式を調整
        if (typeof value === 'string') {
            // 長い文字列は省略して表示
            const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
            logMessage += `"${displayValue.replace(/\n/g, '\\n')}"`;
        } else {
            logMessage += value;
        }

        // 変更前の値があれば追記
        if (oldValue !== undefined) {
            if (typeof oldValue === 'string') {
                const displayOld = oldValue.length > 30 ? oldValue.substring(0, 30) + '...' : oldValue;
                logMessage += ` (変更前: "${displayOld.replace(/\n/g, '\\n')}")`;
            } else {
                logMessage += ` (変更前: ${oldValue})`;
            }
        }

        if (DEBUG_MODE) {
            console.log(logMessage);
        }
    }

    /**
     * 改行コードをツクールで表示可能な \n に置換
     * @param {string} text - 変換するテキスト
     * @returns {string} 変換後のテキスト
     */
    function normalizeNewline(text) {
        if (typeof text !== 'string') return text;
        // 実際の改行コード（\r\n, \n, \r）を \n に統一
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    /**
     * 目標テキスト用の改行コード置換（\n + 全角スペース3つ）
     * @param {string} text - 変換するテキスト
     * @returns {string} 変換後のテキスト
     */
    function normalizeGoalNewline(text) {
        if (typeof text !== 'string') return text;
        // まず全ての改行コードを \n に統一
        let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        // その後、\n を \n　　　に置換（バックスラッシュn + 全角スペース3つ）
        return normalized.replace(/\n/g, '\n　　　');
    }

    /**
     * 進行度・日付・時間からキーを生成
     * @param {number} progress - 進行度
     * @param {number} date - 日付
     * @param {number} time - 時間
     * @returns {string} キー文字列（例: "1_0_0"）
     */
    function generateKey(progress, date, time) {
        return `${progress}_${date}_${time}`;
    }

    /**
     * 現在の進行度・日付・時間を取得
     * @returns {Object} { progress, date, time }
     */
    function getCurrentProgressData() {
        return {
            progress: $gameVariables.value(PROGRESS_VAR_ID) || 0,
            date: $gameVariables.value(DATE_VAR_ID) || 0,
            time: $gameVariables.value(TIME_VAR_ID) || 0
        };
    }

    /**
     * 変数ID範囲文字列を解析して配列に変換
     * @param {string} rangeStr - "101-150" または "101,102,103" 形式
     * @returns {number[]} 変数IDの配列
     */
    function parseVariableIdRange(rangeStr) {
        if (!rangeStr || rangeStr.trim() === '') return [];

        const ids = [];
        const parts = rangeStr.split(',');

        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
                // 範囲指定（例: "101-150"）
                const [start, end] = trimmed.split('-').map(s => Number(s.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    const min = Math.min(start, end);
                    const max = Math.max(start, end);
                    for (let i = min; i <= max; i++) {
                        ids.push(i);
                    }
                }
            } else {
                // 単一ID（例: "101"）
                const id = Number(trimmed);
                if (!isNaN(id)) {
                    ids.push(id);
                }
            }
        }

        return ids;
    }

    /**
     * 日付変更時の処理
     * - アイテムリスポーン処理（<Day>タグのイベントのセルフスイッチを全てOFF）
     *   - 現在のマップおよび訪問済みの全マップが対象
     * - 周回判定処理（CycleVarIDが奇数の場合、+1を加算）
     * - 日付変更時リセット変数を0にリセット
     */
    function onDateChanged() {
        try {
            // アイテムリスポーン処理（現在のマップ）
            const currentMapId = $gameMap ? $gameMap.mapId() : 0;
            if (DAY_EVENT_TAG && typeof $gameTemp !== 'undefined' && typeof $gameTemp.eventIdList === 'function') {
                // KRD_MZ_SelfSwitchesプラグインの機能を使用
                // セルフスイッチA, B, C, Dを全てOFFにする
                const eventIdList = $gameTemp.eventIdList(DAY_EVENT_TAG);

                for (const eventId of eventIdList) {
                    for (const alpha of ['A', 'B', 'C', 'D']) {
                        const key = [currentMapId, eventId, alpha];
                        $gameSelfSwitches.setValue(key, false);
                    }
                }
            }

            // アイテムリスポーン処理（訪問済みの他マップ）
            // KRD_MZ_SelfSwitchesが記録した $gameSystem._eventIdObjectList を利用
            if (DAY_EVENT_TAG && $gameSystem && $gameSystem._eventIdObjectList) {
                for (const data of $gameSystem._eventIdObjectList) {
                    // 現在のマップは上で処理済みなのでスキップ
                    if (data.mapId === currentMapId) continue;
                    // タグが一致する場合のみ処理
                    if (data.tag !== DAY_EVENT_TAG) continue;

                    for (const eventId of data.eventIdList) {
                        for (const alpha of ['A', 'B', 'C', 'D']) {
                            const key = [data.mapId, eventId, alpha];
                            $gameSelfSwitches.setValue(key, false);
                        }
                    }
                }
            }

            // 周回判定処理
            if (CYCLE_VAR_ID_RANGE) {
                const cycleVarIds = parseVariableIdRange(CYCLE_VAR_ID_RANGE);
                for (const varId of cycleVarIds) {
                    const currentValue = Number($gameVariables.value(varId) || 0);
                    // 値が奇数の場合、+1を加算
                    if (currentValue % 2 === 1) {
                        $gameVariables.setValue(varId, currentValue + 1);
                    }
                }
            }

            // 日付変更時加算変数の処理
            if (DATE_CHANGE_ADD_VARIABLES.length > 0) {
                for (const data of DATE_CHANGE_ADD_VARIABLES) {
                    const currentVal = $gameVariables.value(data.variableId);
                    // 奇数の場合
                    if (currentVal % 2 !== 0) {
                        $gameVariables.setValue(data.variableId, currentVal + data.addValueIfOdd);
                    }
                    // 偶数の場合（0含む）
                    else {
                        $gameVariables.setValue(data.variableId, currentVal + data.addValueIfEven);
                    }
                }
            }

            // 日付変更時リセット変数を0にリセット
            if (DAY_RESET_VARIABLES.length > 0) {
                for (const varId of DAY_RESET_VARIABLES) {
                    $gameVariables.setValue(varId, 0);
                }
            }
        } catch (e) {
            console.error(`[${pluginName}] 日付変更時の処理でエラーが発生しました:`, e);
        }
    }

    /**
     * 時間変更時の処理
     * - TimeVarIDの変数に+1を加算
     * - 加算後の値が3以上になった場合、0にリセット
     */
    function onTimeChanged() {
        try {
            if (TIME_VAR_ID_RANGE) {
                const timeVarIds = parseVariableIdRange(TIME_VAR_ID_RANGE);
                for (const varId of timeVarIds) {
                    const currentValue = Number($gameVariables.value(varId) || 0);
                    // 0のときは動作させない
                    if (currentValue <= 0) {
                        continue;
                    }
                    const newValue = currentValue + 1;
                    // 3以上になった場合、0にリセット
                    if (newValue >= 3) {
                        $gameVariables.setValue(varId, 0);
                    } else {
                        $gameVariables.setValue(varId, newValue);
                    }
                }
            }
        } catch (e) {
            console.error(`[${pluginName}] 時間変更時の処理でエラーが発生しました:`, e);
        }
    }

    /**
     * 新規追加した変数・スイッチを全て0/OFFにリセット
     */
    function resetNewVariablesAndSwitches() {
        try {
            // CycleVarIDの変数を0にリセット
            if (CYCLE_VAR_ID_RANGE) {
                const cycleVarIds = parseVariableIdRange(CYCLE_VAR_ID_RANGE);
                for (const varId of cycleVarIds) {
                    $gameVariables.setValue(varId, 0);
                }
            }

            // TimeVarIDの変数を0にリセット
            if (TIME_VAR_ID_RANGE) {
                const timeVarIds = parseVariableIdRange(TIME_VAR_ID_RANGE);
                for (const varId of timeVarIds) {
                    $gameVariables.setValue(varId, 0);
                }
            }

            // <Day>タグのイベントのセルフスイッチを全てOFF
            if (DAY_EVENT_TAG && typeof $gameTemp !== 'undefined' && typeof $gameTemp.eventIdList === 'function') {
                const mapId = $gameMap.mapId();
                const eventIdList = $gameTemp.eventIdList(DAY_EVENT_TAG);

                for (const eventId of eventIdList) {
                    for (const alpha of ['A', 'B', 'C', 'D']) {
                        const key = [mapId, eventId, alpha];
                        $gameSelfSwitches.setValue(key, false);
                    }
                }
            }
        } catch (e) {
            console.error(`[${pluginName}] 新規変数・スイッチのリセットでエラーが発生しました:`, e);
        }
    }

    // ============================================================================
    // 身体テキスト用ローテーション管理
    // ============================================================================

    /**
     * 身体テキストのローテーションインデックス
     * キー: `${progressKey}:${part}` 例) "1_0_0:lip"
     * 値: 次回使用するインデックス（0〜）
     */
    const BODY_TEXT_INDEX = {};

    /**
     * 指定部位の次のテキストを取得（最大3文ローテーション）
     * @param {string} progressKey - "進行度_日付_時間"
     * @param {string} part - 'lip' | 'bust' | 'pussy' | 'hip'
     * @param {string|string[]|null|undefined} config - BODY_DATAで定義された値
     * @returns {string|null} 次に使用するテキスト（存在しない場合はnull）
     */
    function getNextBodyText(progressKey, part, config) {
        if (config === null || config === undefined) return null;

        // 文字列1つの場合：そのまま固定表示（従来仕様互換）
        if (typeof config === 'string') {
            return config;
        }

        // 配列の場合：最大3件をローテーション
        if (Array.isArray(config)) {
            const list = config.filter(text => text !== null && text !== undefined);
            if (list.length === 0) return null;

            const key = `${progressKey}:${part}`;
            const currentIndex = BODY_TEXT_INDEX[key] || 0;
            const nextText = list[currentIndex % list.length];

            BODY_TEXT_INDEX[key] = (currentIndex + 1) % list.length;

            return nextText;
        }

        // それ以外の型は無視
        return null;
    }

    // ============================================================================
    // 初期値適用処理
    // ============================================================================


    /**
     * 文字パラメータ名から実際の変数IDを取得
     * @param {string} key
     * @returns {number}
     */
    function resolveTextParamVariableId(key) {
        switch (key) {
            case 'lip':
                return VAR_ID_LIP;
            case 'bust':
                return VAR_ID_BUST;
            case 'pussy':
                return VAR_ID_PUSSY;
            case 'hip':
                return VAR_ID_HIP;
            case 'favorite':
                return VAR_ID_FAVORITE;
            case 'first':
                return VAR_ID_FIRST;
            case 'best':
                return VAR_ID_BEST;
            case 'worst':
                return VAR_ID_WORST;
            case 'page2Title':
                return VAR_ID_PAGE2_TITLE;
            case 'goalText':
                return VAR_ID_GOAL_TEXT;
            default:
                return 0;
        }
    }

    /**
     * 数値パラメータ名から実際の変数IDを取得
     * @param {string} key
     * @returns {number}
     */
    function resolveNumberParamVariableId(key) {
        switch (key) {
            case 'countHero':
                return VAR_ID_COUNT_HERO;
            case 'countFriend':
                return VAR_ID_COUNT_FRIEND;
            case 'countMayor':
                return VAR_ID_COUNT_MAYOR;
            case 'countKid':
                return VAR_ID_COUNT_KID;
            case 'countUncle':
                return VAR_ID_COUNT_UNCLE;
            case 'countCondom':
                return VAR_ID_COUNT_CONDOM;
            case 'countRaw':
                return VAR_ID_COUNT_RAW;
            case 'countAss':
                return VAR_ID_COUNT_ASS;
            case 'countBreast':
                return VAR_ID_COUNT_BREAST;
            case 'countHand':
                return VAR_ID_COUNT_HAND;
            case 'countLiquid':
                return VAR_ID_COUNT_LIQUID;
            case 'countPregnant':
                return VAR_ID_COUNT_PREGNANT;
            case 'countTotal':
                return VAR_ID_COUNT_TOTAL;
            case 'countMouth':
                return VAR_ID_COUNT_MOUTH;
            default:
                return 0;
        }
    }

    /**
     * 数値変数の値を処理（加算・減算・代入を判定）
     * @param {number|string} value - 処理する値（数値または文字列）
     * @param {number} currentValue - 現在の変数の値
     * @returns {{type: "set"|"add"|"sub", value: number}} 処理タイプと値
     */
    function processNumberValue(value, currentValue) {
        // 数値の場合は代入
        if (typeof value === 'number') {
            return { type: 'set', value: value };
        }

        // 文字列の場合
        const strValue = String(value || '').trim();

        // "+10" のような形式 → 加算
        if (strValue.startsWith('+')) {
            const numValue = Number(strValue.substring(1));
            if (!isNaN(numValue)) {
                return { type: 'add', value: numValue };
            }
        }

        // "-10" のような形式 → 減算
        if (strValue.startsWith('-')) {
            const numValue = Number(strValue.substring(1));
            if (!isNaN(numValue)) {
                return { type: 'sub', value: numValue };
            }
        }

        // 通常の数値文字列 → 代入
        const numValue = Number(strValue);
        if (!isNaN(numValue)) {
            return { type: 'set', value: numValue };
        }

        // 数値として解釈できない場合は、文字列として代入（従来互換）
        return { type: 'set', value: strValue };
    }

    /**
     * 通知が無効化されているかチェック
     * @returns {boolean} 通知が無効化されている場合true
     */
    function isNotifyDisabled() {
        if (DISABLE_NOTIFY_SWITCH_ID === 0) return false;
        return $gameSwitches.value(DISABLE_NOTIFY_SWITCH_ID);
    }

    /**
     * 通知メッセージのキュー（フェードイン完了待ち用）
     */
    const _pendingNotifyMessages = [];

    /**
     * 現在の更新処理中に表示済みのメッセージを追跡（重複防止用）
     * 更新処理の開始時にクリアされる
     */
    const _displayedNotifyMessages = new Set();

    /**
     * 画面がフェード中かどうかを判定
     * @returns {boolean} フェード中の場合true
     */
    function isScreenFading() {
        // 現在のシーンがScene_Mapでない場合は常にキューに追加
        // （別シーンから呼ばれた場合、Scene_Mapに戻ってから表示する）
        const scene = SceneManager._scene;
        if (!scene || !(scene instanceof Scene_Map)) {
            return true;
        }

        // プレイヤーが場所移動中かチェック
        if ($gamePlayer && $gamePlayer.isTransferring()) {
            return true;
        }

        // $gameScreen.brightness() が 255 未満の場合はフェード中と判定
        if ($gameScreen && $gameScreen.brightness() < 255) {
            return true;
        }

        // Scene_Baseのフェード処理中かチェック（_fadeDuration > 0）
        if (typeof scene.isFading === 'function' && scene.isFading()) {
            return true;
        }

        // フェードスプライトのopacityをチェック（黒い画面）
        if (scene._fadeSprite && scene._fadeSprite.opacity > 0) {
            return true;
        }

        return false;
    }

    /**
     * 実際に通知メッセージを表示する内部関数
     * @param {string} message - 表示するメッセージ
     */
    function _displayNotifyMessageInternal(message) {
        // Torigoya.NotifyMessageが利用可能かチェック
        if (typeof Torigoya === 'undefined' ||
            !Torigoya.NotifyMessage ||
            !Torigoya.NotifyMessage.Manager) {
            console.warn(`[${pluginName}] TorigoyaMZ_NotifyMessageプラグインが見つかりません`);
            return;
        }

        try {
            // ピンク色のメッセージを作成
            const coloredMessage = `\\c[27]${message}\\c[0]`;

            // NotifyItemを作成して通知（Torigoya側のSEは抑制するため <noSound> を付与）
            const NotifyItem = Torigoya.NotifyMessage.NotifyItem;
            const notifyItem = new NotifyItem({
                message: coloredMessage,
                icon: 0,
                note: '<noSound>'
            });

            Torigoya.NotifyMessage.Manager.notify(notifyItem);

            // このプラグイン側で指定されたSEを再生
            if (NOTIFY_SE_NAME) {
                const se = {
                    name: NOTIFY_SE_NAME,
                    volume: NOTIFY_SE_VOLUME,
                    pitch: NOTIFY_SE_PITCH,
                    pan: NOTIFY_SE_PAN
                };
                AudioManager.playSe(se);
            }
        } catch (e) {
            console.error(`[${pluginName}] 通知表示でエラーが発生しました:`, e);
        }
    }

    /**
     * 通知メッセージを表示（フェードイン完了後に表示）
     * 同じ内容のメッセージは1回の更新処理中に1度だけ表示される（重複防止）
     * @param {string} message - 表示するメッセージ
     */
    function showNotifyMessage(message) {
        // 通知が無効化されている場合は何もしない
        if (isNotifyDisabled()) return;

        // 既に表示済み（またはキュー追加済み）のメッセージはスキップ
        if (_displayedNotifyMessages.has(message)) {
            return;
        }

        // フェード中の場合はキューに追加して後で表示
        if (isScreenFading()) {
            // 同じメッセージが既にキューにある場合は追加しない（重複防止）
            if (!_pendingNotifyMessages.includes(message)) {
                _pendingNotifyMessages.push(message);
                _displayedNotifyMessages.add(message);
            }
        } else {
            // フェード中でなければ即座に表示
            _displayNotifyMessageInternal(message);
            _displayedNotifyMessages.add(message);
        }
    }

    /**
     * キューに溜まった通知メッセージを処理する関数
     */
    function processPendingNotifyMessages() {
        // 通知が無効化されている場合はキューと表示済みセットをクリア
        if (isNotifyDisabled()) {
            _pendingNotifyMessages.length = 0;
            _displayedNotifyMessages.clear();
            return;
        }

        // フェード中でなければキューのメッセージを表示
        if (!isScreenFading()) {
            // キューにメッセージがあれば処理
            if (_pendingNotifyMessages.length > 0) {
                while (_pendingNotifyMessages.length > 0) {
                    const message = _pendingNotifyMessages.shift();
                    _displayNotifyMessageInternal(message);
                }
            }
            // フェード完了後は常に表示済みセットをクリア
            // （キューが空でもクリアすることで、次回の更新処理で新しいメッセージを受け付けられるようにする）
            _displayedNotifyMessages.clear();
        }
    }

    // Scene_Mapのupdateにキュー処理を追加
    const _VAU_Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _VAU_Scene_Map_update.call(this);
        // フェード完了後にキューの通知メッセージを処理
        processPendingNotifyMessages();
    };

    /**
     * 手動テキスト代入用ヘルパー
     * @param {number} variableId - 対象文字変数ID
     * @param {string} text - 代入テキスト
     * @param {boolean} notify - 通知を出すか
     */
    function manualSetTextValue(variableId, text, notify) {
        if (!variableId) return;
        const normalized = normalizeNewline(String(text || ''));
        $gameVariables.setValue(variableId, normalized);

        if (!notify) return;

        // テキスト系はすべて「新しい噂」扱い
        showNotifyMessage('I heard a new rumor about Elly...');
    }

    /**
     * 手動数値操作用ヘルパー
     * @param {number} variableId - 対象数値変数ID
     * @param {"add"|"sub"|"set"} operation - 操作種別
     * @param {number} value - 操作値
     * @param {boolean} notify - 通知を出すか
     */
    function manualChangeNumberValue(variableId, operation, value, notify) {
        if (!variableId) return;

        const current = Number($gameVariables.value(variableId) || 0);
        const amount = Number(value || 0);
        let next = current;

        if (operation === 'set') {
            next = amount;
        } else if (operation === 'add') {
            next = current + amount;
        } else if (operation === 'sub') {
            next = current - amount;
        } else {
            // 不正な操作種別
            return;
        }

        if (current === next) return;

        // countLiquidはcountTotalから自動計算されるため、直接変更を禁止
        if (variableId === VAR_ID_COUNT_LIQUID) {
            console.warn(`[${pluginName}] countLiquidはcountTotalから自動計算されます。直接変更はできません。`);
            return;
        }

        $gameVariables.setValue(variableId, next);

        // countTotalが変更された場合、countLiquidを自動更新
        if (variableId === VAR_ID_COUNT_TOTAL) {
            const addAmount = next - current;
            if (addAmount > 0) {
                updateLiquidFromTotal(addAmount);
            }
        }

        if (!notify) return;

        // 主人公回数なら「関係が深まった」
        if (variableId === VAR_ID_COUNT_HERO) {
            showNotifyMessage('Your relationship with Elly has deepened!');
            return;
        }

        // それ以外のカウント系なら「新しい噂」
        const countVars = [
            VAR_ID_COUNT_FRIEND,
            VAR_ID_COUNT_MAYOR,
            VAR_ID_COUNT_KID,
            VAR_ID_COUNT_UNCLE,
            VAR_ID_COUNT_CONDOM,
            VAR_ID_COUNT_RAW,
            VAR_ID_COUNT_ASS,
            VAR_ID_COUNT_BREAST,
            VAR_ID_COUNT_HAND,
            VAR_ID_COUNT_MOUTH,
            VAR_ID_COUNT_PREGNANT
        ];

        if (countVars.includes(variableId)) {
            showNotifyMessage('I heard a new rumor about Elly...');
        }
    }

    /**
     * テンプレートIDからテンプレデータを取得
     * @param {string} templateId
     * @returns {{id:string, part:string, text:string|string[]}|null}
     */
    function findTemplateById(templateId) {
        if (!templateId) return null;
        return TEMPLATE_LIST.find(t => t.id === templateId) || null;
    }

    /**
     * テンプレートの次のテキストを取得（最大3文ローテーション）
     * @param {string} templateId - テンプレートID
     * @param {string|string[]|null|undefined} textConfig - TEMPLATE_LISTで定義されたtext値
     * @returns {string|null} 次に使用するテキスト（存在しない場合はnull）
     */
    function getNextTemplateText(templateId, textConfig) {
        if (textConfig === null || textConfig === undefined) return null;

        // 文字列1つの場合：そのまま固定表示（従来仕様互換）
        if (typeof textConfig === 'string') {
            return textConfig;
        }

        // 配列の場合：最大3件をローテーション
        if (Array.isArray(textConfig)) {
            const list = textConfig.filter(text => text !== null && text !== undefined);
            if (list.length === 0) return null;

            const currentIndex = TEMPLATE_TEXT_INDEX[templateId] || 0;
            const nextText = list[currentIndex % list.length];

            TEMPLATE_TEXT_INDEX[templateId] = (currentIndex + 1) % list.length;

            return nextText;
        }

        // それ以外の型は無視
        return null;
    }

    /**
     * テンプレートの次のアイコンを取得（ローテーション対応）
     * @param {string} templateId - テンプレートID
     * @param {string|string[]|null|undefined} iconConfig - アイコン設定
     * @returns {string|null} 次に使用するアイコン名（存在しない場合はnull）
     */
    function getNextTemplateIcon(templateId, iconConfig) {
        if (iconConfig === null || iconConfig === undefined || iconConfig === '') {
            return null;
        }

        // 文字列1つの場合：そのまま固定表示（従来仕様互換）
        if (typeof iconConfig === 'string') {
            return iconConfig;
        }

        // 配列の場合：テキストと同じインデックスでローテーション
        if (Array.isArray(iconConfig)) {
            const list = iconConfig.filter(icon => icon !== null && icon !== undefined && icon !== '');
            if (list.length === 0) return null;

            // テキストと同じインデックスを使用（テキストのインデックスは既に更新されているため、-1して現在表示中のテキストに対応するアイコンを取得）
            const currentIndex = TEMPLATE_TEXT_INDEX[templateId] || 0;
            const iconIndex = (currentIndex - 1 + list.length) % list.length;
            const nextIcon = list[iconIndex % list.length];

            return nextIcon;
        }

        // それ以外の型は無視
        return null;
    }

    // ============================================================================
    // 更新処理
    // ============================================================================

    /**
     * 指定部位の次のアイコンを取得（ローテーション対応）
     * @param {string} progressKey - "進行度_日付_時間"
     * @param {string} part - 'lip' | 'bust' | 'pussy' | 'hip'
     * @param {string|string[]|null|undefined} iconConfig - アイコン設定
     * @returns {string|null} 次に使用するアイコン名（存在しない場合はnull）
     */
    function getNextBodyIcon(progressKey, part, iconConfig) {
        if (iconConfig === null || iconConfig === undefined || iconConfig === '') {
            return null;
        }

        // 文字列1つの場合：そのまま固定表示（従来仕様互換）
        if (typeof iconConfig === 'string') {
            return iconConfig;
        }

        // 配列の場合：テキストと同じインデックスでローテーション
        if (Array.isArray(iconConfig)) {
            const list = iconConfig.filter(icon => icon !== null && icon !== undefined && icon !== '');
            if (list.length === 0) return null;

            // テキストと同じインデックスを使用
            const key = `${progressKey}:${part}`;
            const currentIndex = BODY_TEXT_INDEX[key] || 0;
            // テキストのインデックスは既に更新されているため、-1して現在表示中のテキストに対応するアイコンを取得
            const iconIndex = (currentIndex - 1 + list.length) % list.length;
            const nextIcon = list[iconIndex % list.length];

            return nextIcon;
        }

        // それ以外の型は無視
        return null;
    }

    /**
     * 身体部位アイコンを更新
     * @param {string} progressKey - "進行度_日付_時間"
     * @param {string} part - 'lip' | 'bust' | 'pussy' | 'hip'
     * @param {string|string[]|null|undefined} iconConfig - アイコン設定（文字列または配列）
     */
    function updateBodyIcon(progressKey, part, iconConfig) {
        const iconName = getNextBodyIcon(progressKey, part, iconConfig);
        if (iconName === null || iconName === undefined || iconName === '') {
            return;
        }

        let iconVarId = 0;
        switch (part) {
            case 'lip':
                iconVarId = VAR_ID_LIP_ICON;
                break;
            case 'bust':
                iconVarId = VAR_ID_BUST_ICON;
                break;
            case 'pussy':
                iconVarId = VAR_ID_PUSSY_ICON;
                break;
            case 'hip':
                iconVarId = VAR_ID_HIP_ICON;
                break;
            default:
                return;
        }

        if (iconVarId > 0) {
            $gameVariables.setValue(iconVarId, String(iconName));
        }
    }

    /**
     * グループA: 身体部位テキストを更新（代入）
     * @param {string} key - データキー（例: "1_0_0"）
     */
    function updateBodyTexts(key) {
        const data = BODY_DATA[key];
        if (!data) return;

        let bodyChanged = false;

        // Lip
        const nextLip = getNextBodyText(key, 'lip', data.lip);
        if (nextLip !== null && nextLip !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_LIP);
            const newValue = normalizeNewline(nextLip);
            if (oldValue !== newValue) {
                logVariableUpdate(key, VAR_ID_LIP, '代入', newValue, oldValue);
                $gameVariables.setValue(VAR_ID_LIP, newValue);
                bodyChanged = true;
            }
            // アイコン更新（iconプロパティを優先、なければlipIconをチェック）
            const iconConfig = data.icon !== null && data.icon !== undefined ? data.icon : data.lipIcon;
            if (iconConfig !== null && iconConfig !== undefined) {
                updateBodyIcon(key, 'lip', iconConfig);
            }
        }
        // Bust
        const nextBust = getNextBodyText(key, 'bust', data.bust);
        if (nextBust !== null && nextBust !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_BUST);
            const newValue = normalizeNewline(nextBust);
            if (oldValue !== newValue) {
                logVariableUpdate(key, VAR_ID_BUST, '代入', newValue, oldValue);
                $gameVariables.setValue(VAR_ID_BUST, newValue);
                bodyChanged = true;
            }
            // アイコン更新（iconプロパティを優先、なければbustIconをチェック）
            const iconConfig = data.icon !== null && data.icon !== undefined ? data.icon : data.bustIcon;
            if (iconConfig !== null && iconConfig !== undefined) {
                updateBodyIcon(key, 'bust', iconConfig);
            }
        }
        // Pussy
        const nextPussy = getNextBodyText(key, 'pussy', data.pussy);
        if (nextPussy !== null && nextPussy !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_PUSSY);
            const newValue = normalizeNewline(nextPussy);
            if (oldValue !== newValue) {
                logVariableUpdate(key, VAR_ID_PUSSY, '代入', newValue, oldValue);
                $gameVariables.setValue(VAR_ID_PUSSY, newValue);
                bodyChanged = true;
            }
            // アイコン更新（iconプロパティを優先、なければpussyIconをチェック）
            const iconConfig = data.icon !== null && data.icon !== undefined ? data.icon : data.pussyIcon;
            if (iconConfig !== null && iconConfig !== undefined) {
                updateBodyIcon(key, 'pussy', iconConfig);
            }
        }
        // Hip
        const nextHip = getNextBodyText(key, 'hip', data.hip);
        if (nextHip !== null && nextHip !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_HIP);
            const newValue = normalizeNewline(nextHip);
            if (oldValue !== newValue) {
                logVariableUpdate(key, VAR_ID_HIP, '代入', newValue, oldValue);
                $gameVariables.setValue(VAR_ID_HIP, newValue);
                bodyChanged = true;
            }
            // アイコン更新（iconプロパティを優先、なければhipIconをチェック）
            const iconConfig = data.icon !== null && data.icon !== undefined ? data.icon : data.hipIcon;
            if (iconConfig !== null && iconConfig !== undefined) {
                updateBodyIcon(key, 'hip', iconConfig);
            }
        }

        // 身体部位が変更された場合は通知を表示
        if (bodyChanged) {
            showNotifyMessage('I heard a new rumor about Elly...');
        }
    }


    /**
     * countLiquidの現在値を数値として取得
     * @returns {number} 現在の液体量（数値のみ、単位は除く）
     */
    function getCurrentLiquidValue() {
        const current = String($gameVariables.value(VAR_ID_COUNT_LIQUID) || '');
        // "123 mL" のような形式から数値を抽出
        const match = current.match(/^(\d+(?:\.\d+)?)\s*mL$/i);
        if (match) {
            return Number(match[1]) || 0;
        }
        // 数値のみの場合はそのまま返す
        const num = Number(current);
        return isNaN(num) ? 0 : num;
    }

    /**
     * countLiquidに値を設定（単位付き）
     * @param {number} value - 液体量の数値
     */
    function setLiquidValue(value) {
        const formatted = `${Math.floor(value)} mL`;
        // 直接設定して、Game_Variables.prototype.setValueのフックを回避
        // （updateLiquidFromTotal内で呼ばれるため、重複更新を防ぐ）
        $gameVariables._data[VAR_ID_COUNT_LIQUID] = formatted;
    }

    /**
     * 現在の進行度・日付・時間に応じた液体量加算範囲を取得
     * @param {number} progress - 進行度（省略時は現在値を取得）
     * @param {number} date - 日付（省略時は現在値を取得）
     * @param {number} time - 時間（省略時は現在値を取得）
     * @returns {{min: number, max: number}} 加算範囲の最小値と最大値
     */
    function getLiquidAddRange(progress = null, date = null, time = null) {
        // デフォルト値
        let min = 8;
        let max = 15;

        // 現在値を取得（省略時）
        if (progress === null || date === null || time === null) {
            const current = getCurrentProgressData();
            progress = progress !== null ? progress : current.progress;
            date = date !== null ? date : current.date;
            time = time !== null ? time : current.time;
        }

        // 条件に一致する範囲設定を探す
        if (LIQUID_ADD_RANGE_CONDITIONS && LIQUID_ADD_RANGE_CONDITIONS.length > 0) {
            const matchingCondition = LIQUID_ADD_RANGE_CONDITIONS.find(condition => {
                return condition.progress === progress &&
                    condition.date === date &&
                    condition.time === time;
            });

            if (matchingCondition) {
                min = Number(matchingCondition.min) || 8;
                max = Number(matchingCondition.max) || 15;
            }
        }

        return { min, max };
    }

    /**
     * countTotalの加算値に基づいてcountLiquidを更新
     * @param {number} totalAddAmount - countTotalの加算値（複数の場合は累積値）
     * @param {number} customMin - カスタム最小値（省略時は条件に応じた範囲を使用）
     * @param {number} customMax - カスタム最大値（省略時は条件に応じた範囲を使用）
     * @param {boolean} notify - 通知を表示するか（デフォルト: true）
     */
    function updateLiquidFromTotal(totalAddAmount, customMin = null, customMax = null, notify = true) {
        if (totalAddAmount <= 0) return;

        const currentLiquid = getCurrentLiquidValue();

        // 加算範囲を取得
        let min, max;
        if (customMin !== null && customMax !== null) {
            // カスタム範囲が指定されている場合
            min = customMin;
            max = customMax;
        } else {
            // 条件に応じた範囲を使用
            const range = getLiquidAddRange();
            min = range.min;
            max = range.max;
        }

        // 加算値分だけランダム値を加算
        let randomSum = 0;
        for (let i = 0; i < totalAddAmount; i++) {
            const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
            randomSum += randomValue;
        }

        const newLiquid = currentLiquid + randomSum;
        setLiquidValue(newLiquid);

        // 通知を表示
        if (notify) {
            showNotifyMessage('I heard a new rumor about Elly...');
        }
    }

    /**
     * 数値加算条件をチェック
     * @param {number} progress - 進行度
     * @param {number} date - 日付
     * @param {number} time - 時間
     * @returns {{satisfied: boolean, skipBodyData: boolean}} 条件を満たしているか、BODY_DATA更新をスキップするか
     */
    function checkStatusAddCondition(progress, date, time) {
        // 条件が設定されていない場合は常にtrue（加算を許可）
        if (!STATUS_ADD_CONDITIONS || STATUS_ADD_CONDITIONS.length === 0) {
            return { satisfied: true, skipBodyData: false };
        }

        // 現在の進行度・日付・時間の組み合わせに一致する条件を探す
        const matchingCondition = STATUS_ADD_CONDITIONS.find(condition => {
            return condition.progress === progress &&
                condition.date === date &&
                condition.time === time;
        });

        // 条件が設定されていない場合は加算を許可
        if (!matchingCondition) {
            return { satisfied: true, skipBodyData: false };
        }

        let satisfied = false;

        // 条件タイプに応じてチェック
        if (matchingCondition.conditionType === 'variable') {
            // 変数の値が閾値以上かチェック
            const variableId = Number(matchingCondition.variableId);
            const threshold = Number(matchingCondition.threshold || 0);
            if (variableId && variableId > 0) {
                const currentValue = Number($gameVariables.value(variableId) || 0);
                satisfied = currentValue >= threshold;
            } else {
                // 条件タイプが不正な場合は加算を許可（安全のため）
                satisfied = true;
            }
        } else if (matchingCondition.conditionType === 'switch') {
            // スイッチがONかチェック
            const switchId = Number(matchingCondition.switchId);
            if (switchId && switchId > 0) {
                satisfied = $gameSwitches.value(switchId);
            } else {
                // 条件タイプが不正な場合は加算を許可（安全のため）
                satisfied = true;
            }
        } else {
            // 条件タイプが不正な場合は加算を許可（安全のため）
            satisfied = true;
        }

        // skipBodyDataフラグを取得（条件を満たしていない場合のみ適用）
        const skipBodyData = !satisfied && (matchingCondition.skipBodyData === true || matchingCondition.skipBodyData === 'true');

        return { satisfied, skipBodyData };
    }

    /**
     * グループB: 数値ステータスを更新（加算）
     * @param {string} key - データキー（例: "1_0_0"）
     * @returns {number} countTotalの加算値（countLiquid更新用）
     */
    function updateStatusValues(key) {
        const data = STATUS_DATA[key];
        if (!data) return 0;

        let heroChanged = false;
        let otherChanged = false;
        let totalAddAmount = 0;

        // 回数系
        if (data.countHero !== null && data.countHero !== undefined && data.countHero !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_HERO) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_HERO, '加算', data.countHero, current);
            $gameVariables.setValue(VAR_ID_COUNT_HERO, current + data.countHero);
            heroChanged = true;
        }
        if (data.countFriend !== null && data.countFriend !== undefined && data.countFriend !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_FRIEND) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_FRIEND, '加算', data.countFriend, current);
            $gameVariables.setValue(VAR_ID_COUNT_FRIEND, current + data.countFriend);
            otherChanged = true;
        }
        if (data.countMayor !== null && data.countMayor !== undefined && data.countMayor !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_MAYOR) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_MAYOR, '加算', data.countMayor, current);
            $gameVariables.setValue(VAR_ID_COUNT_MAYOR, current + data.countMayor);
            otherChanged = true;
        }
        if (data.countKid !== null && data.countKid !== undefined && data.countKid !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_KID) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_KID, '加算', data.countKid, current);
            $gameVariables.setValue(VAR_ID_COUNT_KID, current + data.countKid);
            otherChanged = true;
        }
        if (data.countUncle !== null && data.countUncle !== undefined && data.countUncle !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_UNCLE) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_UNCLE, '加算', data.countUncle, current);
            $gameVariables.setValue(VAR_ID_COUNT_UNCLE, current + data.countUncle);
            otherChanged = true;
        }
        // 行為系
        if (data.countCondom !== null && data.countCondom !== undefined && data.countCondom !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_CONDOM) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_CONDOM, '加算', data.countCondom, current);
            $gameVariables.setValue(VAR_ID_COUNT_CONDOM, current + data.countCondom);
            otherChanged = true;
        }
        if (data.countRaw !== null && data.countRaw !== undefined && data.countRaw !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_RAW) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_RAW, '加算', data.countRaw, current);
            $gameVariables.setValue(VAR_ID_COUNT_RAW, current + data.countRaw);
            otherChanged = true;
        }
        if (data.countAss !== null && data.countAss !== undefined && data.countAss !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_ASS) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_ASS, '加算', data.countAss, current);
            $gameVariables.setValue(VAR_ID_COUNT_ASS, current + data.countAss);
            otherChanged = true;
        }
        if (data.countBreast !== null && data.countBreast !== undefined && data.countBreast !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_BREAST) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_BREAST, '加算', data.countBreast, current);
            $gameVariables.setValue(VAR_ID_COUNT_BREAST, current + data.countBreast);
            otherChanged = true;
        }
        if (data.countHand !== null && data.countHand !== undefined && data.countHand !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_HAND) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_HAND, '加算', data.countHand, current);
            $gameVariables.setValue(VAR_ID_COUNT_HAND, current + data.countHand);
            otherChanged = true;
        }
        if (data.countMouth !== null && data.countMouth !== undefined && data.countMouth !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_MOUTH) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_MOUTH, '加算', data.countMouth, current);
            $gameVariables.setValue(VAR_ID_COUNT_MOUTH, current + data.countMouth);
            otherChanged = true;
        }
        // countLiquidはcountTotalから自動計算するため、ここでは更新しない
        if (data.countPregnant !== null && data.countPregnant !== undefined && data.countPregnant !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_PREGNANT) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_PREGNANT, '加算', data.countPregnant, current);
            $gameVariables.setValue(VAR_ID_COUNT_PREGNANT, current + data.countPregnant);
            otherChanged = true;
        }
        if (data.countTotal !== null && data.countTotal !== undefined && data.countTotal !== 0) {
            const current = $gameVariables.value(VAR_ID_COUNT_TOTAL) || 0;
            logVariableUpdate(key, VAR_ID_COUNT_TOTAL, '加算', data.countTotal, current);
            // フラグを立てて、Game_Variables.prototype.setValueのフックでcountTotalの処理をスキップ
            // （updateByProgressRangeで累積値を計算して最後に一度だけupdateLiquidFromTotalを呼ぶため）
            _VA_UpdatingLiquid = true;
            $gameVariables.setValue(VAR_ID_COUNT_TOTAL, current + data.countTotal);
            _VA_UpdatingLiquid = false;
            totalAddAmount = data.countTotal;
            // countTotalは通知に含めない（他の項目の合計なので）
        }

        // 通知を表示（countHeroが優先）
        if (heroChanged) {
            showNotifyMessage('Your relationship with Elly has deepened!');
        } else if (otherChanged) {
            showNotifyMessage('I heard a new rumor about Elly...');
        }

        return totalAddAmount;
    }


    /**
     * グループC: 関係性テキストを更新（代入・疎なデータ）
     * @param {string} key - データキー（例: "1_0_0"）
     * @param {boolean} forceOverwrite - 強制上書きフラグ（初期値設定時はtrue）
     */
    function updateRelationTexts(key, forceOverwrite = false) {
        const data = RELATION_DATA[key];
        if (!data) return; // データが存在しない場合は何もしない

        // 好きな人
        if (data.favorite !== null && data.favorite !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_FAVORITE);
            const newValue = normalizeNewline(data.favorite);
            logVariableUpdate(key, VAR_ID_FAVORITE, '代入', newValue, oldValue);
            $gameVariables.setValue(VAR_ID_FAVORITE, newValue);
        }
        // 初体験
        if (data.first !== null && data.first !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_FIRST);
            const newValue = normalizeNewline(data.first);
            logVariableUpdate(key, VAR_ID_FIRST, '代入', newValue, oldValue);
            $gameVariables.setValue(VAR_ID_FIRST, newValue);
        }
        // 一番上手
        if (data.best !== null && data.best !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_BEST);
            const newValue = normalizeNewline(data.best);
            logVariableUpdate(key, VAR_ID_BEST, '代入', newValue, oldValue);
            $gameVariables.setValue(VAR_ID_BEST, newValue);
        }
        // 一番下手
        if (data.worst !== null && data.worst !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_WORST);
            const newValue = normalizeNewline(data.worst);
            logVariableUpdate(key, VAR_ID_WORST, '代入', newValue, oldValue);
            $gameVariables.setValue(VAR_ID_WORST, newValue);
        }
        // ページ2タイトル
        if (data.page2Title !== null && data.page2Title !== undefined) {
            const oldValue = $gameVariables.value(VAR_ID_PAGE2_TITLE);
            const newValue = normalizeNewline(data.page2Title);
            logVariableUpdate(key, VAR_ID_PAGE2_TITLE, '代入', newValue, oldValue);
            $gameVariables.setValue(VAR_ID_PAGE2_TITLE, newValue);
        }

        // "0_0_0" の場合、身体部位テキストと数値変数の初期値も処理
        const bodyPartKeys = ['lip', 'bust', 'pussy', 'hip'];
        if (key === "0_0_0") {
            // 身体部位テキスト（lip, bust, pussy, hip）の初期値
            bodyPartKeys.forEach(partKey => {
                if (data[partKey] !== null && data[partKey] !== undefined) {
                    const variableId = resolveTextParamVariableId(partKey);
                    if (variableId) {
                        if (forceOverwrite) {
                            // 強制上書きモード：既に値があっても上書き
                            const oldValue = $gameVariables.value(variableId);
                            const value = normalizeNewline(String(data[partKey]));
                            logVariableUpdate(key, variableId, '代入(強制)', value, oldValue);
                            $gameVariables.setValue(variableId, value);
                        } else {
                            // 通常モード：未設定の場合のみ設定
                            const current = $gameVariables.value(variableId);
                            // ツクールの変数は未使用時に 0 になるため、0 も「何も入っていない」とみなす
                            if (current === null || current === undefined || current === '' || current === 0) {
                                const value = normalizeNewline(String(data[partKey]));
                                logVariableUpdate(key, variableId, '代入(初期)', value, current);
                                $gameVariables.setValue(variableId, value);
                            }
                        }
                        // アイコン更新（iconプロパティを優先、なければ部位別Iconをチェック）
                        const iconKey = `${partKey}Icon`;
                        const iconConfig = data.icon !== null && data.icon !== undefined ? data.icon : data[iconKey];
                        if (iconConfig !== null && iconConfig !== undefined) {
                            updateBodyIcon(key, partKey, iconConfig);
                        }
                    }
                }
            });

            // 数値変数の初期値（文字列）
            const numberVarKeys = [
                'countHero', 'countFriend', 'countMayor', 'countKid', 'countUncle',
                'countCondom', 'countRaw', 'countAss', 'countBreast', 'countHand',
                'countLiquid', 'countPregnant', 'countTotal', 'countMouth'
            ];

            numberVarKeys.forEach(varKey => {
                if (data[varKey] !== null && data[varKey] !== undefined) {
                    const variableId = resolveNumberParamVariableId(varKey);
                    if (variableId) {
                        const current = Number($gameVariables.value(variableId) || 0);
                        const processed = processNumberValue(data[varKey], current);

                        if (forceOverwrite) {
                            // 強制上書きモード：加算・減算・代入を実行
                            if (processed.type === 'add') {
                                logVariableUpdate(key, variableId, '加算(強制)', processed.value, current);
                                $gameVariables.setValue(variableId, current + processed.value);
                            } else if (processed.type === 'sub') {
                                logVariableUpdate(key, variableId, '減算(強制)', processed.value, current);
                                $gameVariables.setValue(variableId, current - processed.value);
                            } else {
                                // 代入（数値または文字列）
                                if (typeof processed.value === 'number') {
                                    logVariableUpdate(key, variableId, '代入(強制)', processed.value, current);
                                    $gameVariables.setValue(variableId, processed.value);
                                } else {
                                    logVariableUpdate(key, variableId, '代入(強制)', processed.value, current);
                                    $gameVariables.setValue(variableId, normalizeNewline(String(processed.value)));
                                }
                            }
                        } else {
                            // 通常モード：未設定の場合のみ設定
                            // ツクールの変数は未使用時に 0 になるため、0 も「何も入っていない」とみなす
                            if (current === null || current === undefined || current === '' || current === 0) {
                                if (processed.type === 'add') {
                                    logVariableUpdate(key, variableId, '加算(初期)', processed.value, current);
                                    $gameVariables.setValue(variableId, current + processed.value);
                                } else if (processed.type === 'sub') {
                                    logVariableUpdate(key, variableId, '減算(初期)', processed.value, current);
                                    $gameVariables.setValue(variableId, current - processed.value);
                                } else {
                                    // 代入（数値または文字列）
                                    if (typeof processed.value === 'number') {
                                        logVariableUpdate(key, variableId, '代入(初期)', processed.value, current);
                                        $gameVariables.setValue(variableId, processed.value);
                                    } else {
                                        logVariableUpdate(key, variableId, '代入(初期)', processed.value, current);
                                        $gameVariables.setValue(variableId, normalizeNewline(String(processed.value)));
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }


    /**
     * グループD: 目標テキストを更新（独立監視）
     * @param {number} goalValue - Goal変数の値
     */
    function updateGoalText(goalValue) {
        const text = GOAL_DATA[goalValue];
        if (text !== null && text !== undefined) {
            $gameVariables.setValue(VAR_ID_GOAL_TEXT, normalizeGoalNewline(text));
        }
    }

    /**
     * 進行度・日付・時間が変化した時の更新処理
     */
    function updateByProgress() {
        try {
            const { progress, date, time } = getCurrentProgressData();
            const key = generateKey(progress, date, time);
            // 現在のキーに対して各種更新を実行
            const totalAddAmount = applyAllUpdatesForKey(key);
            // countTotalの加算値に基づいてcountLiquidを更新
            if (totalAddAmount > 0) {
                updateLiquidFromTotal(totalAddAmount);
            }
        } catch (e) {
            console.error(`[${pluginName}] 更新処理でエラーが発生しました:`, e);
        }
    }

    /**
     * 単一キーに対して全ての更新を適用
     * @param {string} key - "進行度_日付_時間"
     * @returns {number} countTotalの加算値（countLiquid更新用）
     */
    function applyAllUpdatesForKey(key) {
        console.log(`[${pluginName}] === キー [${key}] の更新処理を開始 ===`);

        // キーから進行度・日付・時間を取得
        const keyParts = key.split('_');
        let conditionResult = { satisfied: true, skipBodyData: false };

        if (keyParts.length === 3) {
            const progress = Number(keyParts[0] || 0);
            const date = Number(keyParts[1] || 0);
            const time = Number(keyParts[2] || 0);
            conditionResult = checkStatusAddCondition(progress, date, time);
        }

        // グループA: 身体部位テキスト（条件未満でskipBodyDataがtrueの場合はスキップ）
        if (!conditionResult.skipBodyData) {
            updateBodyTexts(key);
        } else {
            console.log(`[${pluginName}] [${key}] 身体部位テキスト更新をスキップ（条件未満）`);
        }

        // グループB: 数値ステータス（条件を満たしていない場合はスキップ）
        let totalAddAmount = 0;
        if (conditionResult.satisfied) {
            totalAddAmount = updateStatusValues(key);
        } else {
            console.log(`[${pluginName}] [${key}] 数値ステータス更新をスキップ（条件未満）`);
        }

        // グループC: 関係性テキスト
        updateRelationTexts(key);

        console.log(`[${pluginName}] === キー [${key}] の更新処理を終了 ===`);

        // 追加機能: コモンイベント実行チェック
        checkCommonEventConditions(keyParts[0], keyParts[1], keyParts[2]);

        return totalAddAmount;
    }

    /**
     * コモンイベント実行条件をチェックして実行
     * @param {string|number} progress
     * @param {string|number} date
     * @param {string|number} time
     */
    function checkCommonEventConditions(progress, date, time) {
        // 抑制フラグが立っている場合は実行しない
        if (_VA_SuppressCommonEvent) {
            console.log(`[${pluginName}] コモンイベント実行は抑制されています`);
            return;
        }

        const p = Number(progress);
        const d = Number(date);
        const t = Number(time);

        // 条件に一致するものを検索
        const conditions = COMMON_EVENT_CONDITIONS.filter(c =>
            c.progress === p && c.date === d && c.time === t
        );

        if (conditions.length === 0) return;

        // $gameSystemに実行済みリストを保存するので、なければ初期化
        if (!$gameSystem) return;
        if (!$gameSystem._VA_ExecutedEvents) {
            $gameSystem._VA_ExecutedEvents = {}; // key: "progress_date_time_commonId"
        }

        conditions.forEach(c => {
            const eventKey = `${p}_${d}_${t}_${c.commonEventId}`;

            // 繰り返しOFFかつ既に実行済みの場合はスキップ
            if (!c.repeat && $gameSystem._VA_ExecutedEvents[eventKey]) {
                console.log(`[${pluginName}] コモンイベント${c.commonEventId}は実行済みのためスキップ`);
                return;
            }

            // コモンイベント実行予約
            if ($gameTemp) {
                console.log(`[${pluginName}] コモンイベント${c.commonEventId}を予約`);
                $gameTemp.reserveCommonEvent(c.commonEventId);

                // 実行済みとしてマーク
                if (!c.repeat) {
                    $gameSystem._VA_ExecutedEvents[eventKey] = true;
                }
            }
        });
    }

    /**
     * 進行度・日付・時間の変化を、間のステップも含めて反映
     * - progress が変わった場合は、従来通り新しい1点のみを更新
     * - 同一 progress で day/time が前方向に大きく飛んだ場合、
     *   その間に存在するすべてのキーを順番に更新する
     *
     * @param {{progress:number, date:number, time:number}} from
     * @param {{progress:number, date:number, time:number}} to
     */
    function updateByProgressRange(from, to) {
        console.log(`[${pluginName}] ▼▼▼ updateByProgressRange 開始 ▼▼▼`);
        console.log(`[${pluginName}]   変更前: progress=${from.progress}, date=${from.date}, time=${from.time}`);
        console.log(`[${pluginName}]   変更後: progress=${to.progress}, date=${to.date}, time=${to.time}`);

        let totalAddAmount = 0;

        // progress が変わった場合は従来通り単発更新のみ
        if (from.progress !== to.progress) {
            console.log(`[${pluginName}]   進行度が変更されたため、単発更新を実行`);
            const key = generateKey(to.progress, to.date, to.time);
            totalAddAmount = applyAllUpdatesForKey(key);
            // countTotalの加算値に基づいてcountLiquidを更新
            if (totalAddAmount > 0) {
                updateLiquidFromTotal(totalAddAmount);
            }
            console.log(`[${pluginName}] ▲▲▲ updateByProgressRange 終了 ▲▲▲`);
            return;
        }

        const progress = from.progress;

        // day(0-3) と time(0-3) を 0〜15 の線形インデックスに変換
        const fromIndex = from.date * 4 + from.time;
        const toIndex = to.date * 4 + to.time;

        const forwardSteps = (toIndex - fromIndex + 16) % 16;
        const backwardSteps = (fromIndex - toIndex + 16) % 16;

        console.log(`[${pluginName}]   fromIndex=${fromIndex}, toIndex=${toIndex}, forwardSteps=${forwardSteps}, backwardSteps=${backwardSteps}`);

        // 変化なし or 1ステップだけ、もしくは「後ろ向き」の方が近い場合は単発更新に留める
        if (forwardSteps <= 1 || forwardSteps > backwardSteps) {
            console.log(`[${pluginName}]   単発更新を実行（forwardSteps=${forwardSteps}）`);
            const key = generateKey(to.progress, to.date, to.time);
            totalAddAmount = applyAllUpdatesForKey(key);
            // countTotalの加算値に基づいてcountLiquidを更新
            if (totalAddAmount > 0) {
                updateLiquidFromTotal(totalAddAmount);
            }
            console.log(`[${pluginName}] ▲▲▲ updateByProgressRange 終了 ▲▲▲`);
            return;
        }

        // 前方向に forwardSteps 回進めながら、途中の全てのキーを更新
        // countTotalの加算値を累積する
        console.log(`[${pluginName}]   範囲更新を実行: ${forwardSteps}ステップ分を順次処理`);
        let index = fromIndex;
        for (let i = 0; i < forwardSteps; i++) {
            index = (index + 1) % 16;
            const date = Math.floor(index / 4);
            const time = index % 4;
            const key = generateKey(progress, date, time);
            console.log(`[${pluginName}]   ループ ${i + 1}/${forwardSteps}: キー [${key}] を処理`);
            const addAmount = applyAllUpdatesForKey(key);
            totalAddAmount += addAmount;
        }

        // 累積したcountTotalの加算値に基づいてcountLiquidを更新
        if (totalAddAmount > 0) {
            updateLiquidFromTotal(totalAddAmount);
        }
        console.log(`[${pluginName}] ▲▲▲ updateByProgressRange 終了 ▲▲▲`);
    }


    // ============================================================================
    // フック処理
    // ============================================================================

    /**
     * Game_Variables.prototype.setValue をフック
     */
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;

    // 進行度系更新の一時抑制フラグ（プラグインコマンドでのリセット用）
    let _VA_SuppressProgressUpdate = false;
    // コモンイベント実行の一時抑制フラグ（特定コマンド用）
    let _VA_SuppressCommonEvent = false;
    // countLiquid自動計算中のフラグ（重複更新を防ぐ）
    let _VA_UpdatingLiquid = false;

    Game_Variables.prototype.setValue = function (variableId, value) {
        const oldValue = this.value(variableId);

        // countLiquidはcountTotalから自動計算されるため、直接変更を警告（初期値設定時は除く）
        if (variableId === VAR_ID_COUNT_LIQUID && oldValue !== value && oldValue !== null && oldValue !== undefined && oldValue !== '' && oldValue !== 0) {
            console.warn(`[${pluginName}] countLiquidはcountTotalから自動計算されます。直接変更は推奨されません。`);
        }

        // 変更前の進行度・日付・時間を記録
        const before = getCurrentProgressData();

        _Game_Variables_setValue.call(this, variableId, value);

        // 値が実際に変化した場合のみ処理
        if (oldValue === value) return;

        // 抑制フラグが立っている場合は進行度系の自動更新を行わない
        if (_VA_SuppressProgressUpdate) {
            return;
        }

        try {
            // 進行度・時間・日付の監視
            if (variableId === PROGRESS_VAR_ID ||
                variableId === TIME_VAR_ID ||
                variableId === DATE_VAR_ID) {
                const after = getCurrentProgressData();
                updateByProgressRange(before, after);
            }

            // 日付変更時の処理（0→1, 1→2, 2→3, 3→0 のいずれかの場合）
            if (variableId === DATE_VAR_ID) {
                const oldDate = Number(oldValue || 0);
                const newDate = Number(value || 0);
                // 日付が変化した場合（0→1, 1→2, 2→3, 3→0）
                if (oldDate !== newDate) {
                    onDateChanged();
                }
            }

            // 時間変更時の処理（0→1, 1→2, 2→3, 3→0 のいずれかの場合）
            if (variableId === TIME_VAR_ID) {
                const oldTime = Number(oldValue || 0);
                const newTime = Number(value || 0);
                // 時間が変化した場合（0→1, 1→2, 2→3, 3→0）
                if (oldTime !== newTime) {
                    onTimeChanged();
                }
            }

            // 目標変数の監視（独立）
            if (variableId === GOAL_VAR_ID) {
                updateGoalText(value);
            }

            // countTotalの監視（countLiquid自動計算用）
            // ただし、updateLiquidFromTotal内での更新はスキップ（重複を防ぐ）
            if (variableId === VAR_ID_COUNT_TOTAL && !_VA_UpdatingLiquid) {
                const oldTotal = Number(oldValue || 0);
                const newTotal = Number(value || 0);
                const addAmount = newTotal - oldTotal;
                if (addAmount > 0) {
                    updateLiquidFromTotal(addAmount);
                }
            }
        } catch (e) {
            console.error(`[${pluginName}] 変数更新フックでエラーが発生しました:`, e);
        }
    };

    // ============================================================================
    // プラグインコマンド（手動実行用）
    // ============================================================================

    /**
     * 時間を1進める（日付繰り上がり対応）
     * 日付と時間を同時に変更して、正しい範囲更新を行う
     */
    function advanceTime() {
        advanceTimeBySteps(1);
    }

    /**
     * 時間を指定ステップ分進める（日付繰り上がり対応）
     * @param {number} steps - 進めるステップ数（1〜16）
     */
    function advanceTimeBySteps(steps) {
        if (steps <= 0 || steps > 16) {
            console.warn(`[${pluginName}] advanceTimeBySteps: 無効なステップ数 ${steps}`);
            return;
        }

        console.log(`[${pluginName}] advanceTimeBySteps(${steps}) 開始`);

        // 変更前の状態を記録
        const before = getCurrentProgressData();
        console.log(`[${pluginName}]   変更前: progress=${before.progress}, date=${before.date}, time=${before.time}`);

        // 現在のインデックスから目標インデックスを計算
        const fromIndex = before.date * 4 + before.time;
        const toIndex = (fromIndex + steps) % 16;
        const targetDate = Math.floor(toIndex / 4);
        const targetTime = toIndex % 4;

        // 日付変更があるかチェック
        const dateChanged = targetDate !== before.date;

        // 抑制フラグをONにして、setValueのトリガーを無効化
        _VA_SuppressProgressUpdate = true;

        // 日付と時間を変更（抑制中なので自動更新はトリガーされない）
        if (dateChanged) {
            $gameVariables.setValue(DATE_VAR_ID, targetDate);
            // 日付変更時の処理（セルフスイッチリセット、周回判定など）
            onDateChanged();
        }
        $gameVariables.setValue(TIME_VAR_ID, targetTime);
        // 時間変更時の処理
        onTimeChanged();

        // 抑制フラグをOFF
        _VA_SuppressProgressUpdate = false;

        // 変更後の状態を取得
        const after = getCurrentProgressData();
        console.log(`[${pluginName}]   変更後: progress=${after.progress}, date=${after.date}, time=${after.time}`);

        // 正しい変更前後の状態でupdateByProgressRangeを呼び出し
        updateByProgressRange(before, after);

        console.log(`[${pluginName}] advanceTimeBySteps(${steps}) 終了`);
    }

    /**
     * 目標の日付・時間まで進める
     * @param {number} targetDate - 目標日付（0-3）
     * @param {number} targetTime - 目標時間（0-3）
     */
    function advanceTimeToTarget(targetDate, targetTime) {
        const before = getCurrentProgressData();
        const fromIndex = before.date * 4 + before.time;
        const toIndex = targetDate * 4 + targetTime;

        // 必要なステップ数を計算（前方向のみ）
        let steps = (toIndex - fromIndex + 16) % 16;

        // ステップ数が0の場合は何もしない
        if (steps === 0) {
            console.log(`[${pluginName}] advanceTimeToTarget: 目標と現在が同じため処理をスキップ`);
            return;
        }

        console.log(`[${pluginName}] advanceTimeToTarget(date=${targetDate}, time=${targetTime}) -> ${steps}ステップ進める`);
        advanceTimeBySteps(steps);
    }

    // スクリプトから呼び出せるようにグローバルに公開
    window.VariableAutoUpdater = window.VariableAutoUpdater || {};
    window.VariableAutoUpdater.advanceTime = advanceTime;
    window.VariableAutoUpdater.advanceTimeBySteps = advanceTimeBySteps;
    window.VariableAutoUpdater.advanceTimeToTarget = advanceTimeToTarget;


    /**
     * プラグインコマンド: 時間を1進める
     */
    PluginManager.registerCommand(pluginName, 'advanceTime', args => {
        advanceTime();
    });

    /**
     * プラグインコマンド: 現在の値に基づいて全更新を実行
     */
    PluginManager.registerCommand(pluginName, 'updateAll', args => {
        updateByProgress();
        const goalValue = $gameVariables.value(GOAL_VAR_ID) || 0;
        updateGoalText(goalValue);
    });


    /**
     * プラグインコマンド: 進行度系のみ更新
     */
    PluginManager.registerCommand(pluginName, 'updateProgress', args => {
        updateByProgress();
    });

    /**
     * プラグインコマンド: 目標のみ更新
     */
    PluginManager.registerCommand(pluginName, 'updateGoal', args => {
        const goalValue = $gameVariables.value(GOAL_VAR_ID) || 0;
        updateGoalText(goalValue);
    });

    /**
     * プラグインコマンド: 手動テキスト代入
     */
    PluginManager.registerCommand(pluginName, 'manualSetText', args => {
        const key = String(args.targetTextParam || '');
        const variableId = resolveTextParamVariableId(key);
        const text = args.text || '';
        const notify = String(args.notify || 'true').toLowerCase() === 'true';
        manualSetTextValue(variableId, text, notify);
    });

    /**
     * プラグインコマンド: 手動数値操作
     */
    PluginManager.registerCommand(pluginName, 'manualChangeNumber', args => {
        const key = String(args.targetNumberParam || '');
        const variableId = resolveNumberParamVariableId(key);
        const operation = String(args.operation || 'add');
        const value = Number(args.value || 0);
        const notify = String(args.notify || 'true').toLowerCase() === 'true';
        manualChangeNumberValue(variableId, operation, value, notify);
    });

    /**
     * プラグインコマンド: 手動トータル変数加算（液体量変更）
     */
    PluginManager.registerCommand(pluginName, 'manualAddTotalWithLiquid', args => {
        const totalAddAmount = Number(args.totalAddAmount || 1);
        const liquidMin = Number(args.liquidMin || 8);
        const liquidMax = Number(args.liquidMax || 15);
        const notify = String(args.notify || 'true').toLowerCase() === 'true';

        if (totalAddAmount <= 0) {
            console.warn(`[${pluginName}] トータル加算値は1以上である必要があります。`);
            return;
        }

        if (liquidMin < 0 || liquidMax < 0 || liquidMin > liquidMax) {
            console.warn(`[${pluginName}] 液体量範囲が不正です。最小値 <= 最大値 である必要があります。`);
            return;
        }

        // countTotalを加算
        const currentTotal = Number($gameVariables.value(VAR_ID_COUNT_TOTAL) || 0);
        const newTotal = currentTotal + totalAddAmount;

        // フラグを立てて、Game_Variables.prototype.setValueのフックでcountTotalの処理をスキップ
        _VA_UpdatingLiquid = true;
        $gameVariables.setValue(VAR_ID_COUNT_TOTAL, newTotal);
        _VA_UpdatingLiquid = false;

        // カスタム範囲で液体量を更新（通知フラグを渡す）
        updateLiquidFromTotal(totalAddAmount, liquidMin, liquidMax, notify);
    });

    /**
     * プラグインコマンド: テンプレートからテキスト代入
     */
    PluginManager.registerCommand(pluginName, 'setTextFromTemplate', args => {
        const partKey = String(args.targetTextParam || '');
        const variableId = resolveTextParamVariableId(partKey);
        const templateId = String(args.templateId || '');
        const notify = String(args.notify || 'true').toLowerCase() === 'true';

        if (!variableId) return;

        const template = findTemplateById(templateId);
        if (!template) return;

        // テンプレートのtextから次のテキストを取得（ローテーション対応）
        const nextText = getNextTemplateText(templateId, template.text);
        if (nextText === null) return;

        // 部位とテンプレのpartが一致しなくてもそのまま代入する仕様
        manualSetTextValue(variableId, nextText, notify);

        // テンプレートにアイコン情報が含まれている場合はアイコンも更新（ローテーション対応）
        // iconプロパティを優先、なければ部位別Iconをチェック
        const iconKey = `${partKey}Icon`;
        const iconConfig = template.icon !== null && template.icon !== undefined ? template.icon : template[iconKey];
        if (iconConfig !== null && iconConfig !== undefined) {
            const nextIcon = getNextTemplateIcon(templateId, iconConfig);
            if (nextIcon !== null && nextIcon !== undefined) {
                let iconVarId = 0;
                switch (partKey) {
                    case 'lip':
                        iconVarId = VAR_ID_LIP_ICON;
                        break;
                    case 'bust':
                        iconVarId = VAR_ID_BUST_ICON;
                        break;
                    case 'pussy':
                        iconVarId = VAR_ID_PUSSY_ICON;
                        break;
                    case 'hip':
                        iconVarId = VAR_ID_HIP_ICON;
                        break;
                }
                if (iconVarId > 0) {
                    $gameVariables.setValue(iconVarId, String(nextIcon));
                }
            }
        }
    });

    /**
     * プラグインコマンド: 通知メッセージ表示
     */
    PluginManager.registerCommand(pluginName, 'showNotify', args => {
        const message = String(args.message || '');
        if (message) {
            showNotifyMessage(message);
        }
    });

    /**
     * プラグインコマンド: 時間・日付をリセット（自動更新なし）
     */
    PluginManager.registerCommand(pluginName, 'resetTimeAndDateSilent', args => {
        _VA_SuppressProgressUpdate = true;
        _VA_SuppressCommonEvent = true; // コモンイベント実行抑制
        try {
            const oldDate = $gameVariables.value(DATE_VAR_ID) || 0;
            const oldTime = $gameVariables.value(TIME_VAR_ID) || 0;

            $gameVariables.setValue(TIME_VAR_ID, 0);
            $gameVariables.setValue(DATE_VAR_ID, 0);

            // 日付が0にリセットされた場合、日付変更時の処理を実行
            if (oldDate !== 0) {
                onDateChanged();
            }

            // 時間が0にリセットされた場合、時間変更時の処理を実行
            if (oldTime !== 0) {
                onTimeChanged();
            }
        } finally {
            _VA_SuppressProgressUpdate = false;
            _VA_SuppressCommonEvent = false;
        }
    });

    /**
     * プラグインコマンド: 進行度を設定してリセット
     * 進行度を指定した数値に設定し、時間・日付を0にリセット
     * RELATION_DATAの"進行度_9_9"が存在する場合は適用
     */
    PluginManager.registerCommand(pluginName, 'setProgressAndReset', args => {
        const progress = Number(args.progress || 1);
        const time = Number(args.time || 0);

        _VA_SuppressProgressUpdate = true;
        try {
            // 進行度を設定
            $gameVariables.setValue(PROGRESS_VAR_ID, progress);

            // 新規追加した変数・スイッチを全て0/OFFにリセット
            resetNewVariablesAndSwitches();

            // 時間・日付をリセット（日付は0、時間は指定値）
            const oldDate = $gameVariables.value(DATE_VAR_ID) || 0;
            const oldTime = $gameVariables.value(TIME_VAR_ID) || 0;
            $gameVariables.setValue(TIME_VAR_ID, time);
            $gameVariables.setValue(DATE_VAR_ID, 0);

            // RandomNPCBehaviorの内部状態をリセット（巻き戻り時の加算防止）
            if ($gameSystem.resetRandomNPCInternalState) {
                $gameSystem.resetRandomNPCInternalState();
            }

            // 日付が0にリセットされた場合、日付変更時の処理を実行
            if (oldDate !== 0) {
                onDateChanged();
            }

            // 時間が0にリセットされた場合、時間変更時の処理を実行
            if (oldTime !== 0) {
                onTimeChanged();
            }

            // RELATION_DATAの"進行度_9_9"が存在する場合は適用
            const relationKey = `${progress}_9_9`;
            if (RELATION_DATA && RELATION_DATA[relationKey]) {
                const relationData = RELATION_DATA[relationKey];

                // 通常の関係性テキストを適用
                if (relationData.favorite !== null && relationData.favorite !== undefined) {
                    $gameVariables.setValue(VAR_ID_FAVORITE, normalizeNewline(relationData.favorite));
                }
                if (relationData.first !== null && relationData.first !== undefined) {
                    $gameVariables.setValue(VAR_ID_FIRST, normalizeNewline(relationData.first));
                }
                if (relationData.best !== null && relationData.best !== undefined) {
                    $gameVariables.setValue(VAR_ID_BEST, normalizeNewline(relationData.best));
                }
                if (relationData.worst !== null && relationData.worst !== undefined) {
                    $gameVariables.setValue(VAR_ID_WORST, normalizeNewline(relationData.worst));
                }
                if (relationData.page2Title !== null && relationData.page2Title !== undefined) {
                    $gameVariables.setValue(VAR_ID_PAGE2_TITLE, normalizeNewline(relationData.page2Title));
                }

                // 身体部位テキスト（lip, bust, pussy, hip）も適用
                const bodyPartKeys = ['lip', 'bust', 'pussy', 'hip'];
                bodyPartKeys.forEach(partKey => {
                    if (relationData[partKey] !== null && relationData[partKey] !== undefined) {
                        const variableId = resolveTextParamVariableId(partKey);
                        if (variableId) {
                            const value = normalizeNewline(String(relationData[partKey]));
                            $gameVariables.setValue(variableId, value);
                            // アイコン更新（iconプロパティを優先、なければ部位別Iconをチェック）
                            const iconKey = `${partKey}Icon`;
                            const iconConfig = relationData.icon !== null && relationData.icon !== undefined ? relationData.icon : relationData[iconKey];
                            if (iconConfig !== null && iconConfig !== undefined) {
                                updateBodyIcon(relationKey, partKey, iconConfig);
                            }
                        }
                    }
                });

                // 数値変数の初期値（文字列）も適用
                const numberVarKeys = [
                    'countHero', 'countFriend', 'countMayor', 'countKid', 'countUncle',
                    'countCondom', 'countRaw', 'countAss', 'countBreast', 'countHand',
                    'countLiquid', 'countPregnant', 'countTotal', 'countMouth'
                ];

                // countLiquidが直接指定されているか確認（数値・文字列どちらでも）
                const hasLiquidDirect = relationData.countLiquid !== null && relationData.countLiquid !== undefined;

                let totalValue = null;
                numberVarKeys.forEach(varKey => {
                    if (relationData[varKey] !== null && relationData[varKey] !== undefined) {
                        const variableId = resolveNumberParamVariableId(varKey);
                        if (variableId) {
                            const current = Number($gameVariables.value(variableId) || 0);
                            const processed = processNumberValue(relationData[varKey], current);

                            if (varKey === 'countTotal') {
                                // countTotalの処理
                                if (processed.type === 'add') {
                                    const newValue = current + processed.value;
                                    $gameVariables.setValue(variableId, newValue);
                                    totalValue = newValue; // 加算後の値
                                } else if (processed.type === 'sub') {
                                    const newValue = current - processed.value;
                                    $gameVariables.setValue(variableId, newValue);
                                    totalValue = newValue; // 減算後の値
                                } else {
                                    // 代入
                                    if (typeof processed.value === 'number') {
                                        $gameVariables.setValue(variableId, processed.value);
                                        totalValue = processed.value; // 代入値
                                    } else {
                                        $gameVariables.setValue(variableId, normalizeNewline(String(processed.value)));
                                    }
                                }
                            } else if (varKey === 'countLiquid') {
                                // countLiquidは直接処理（countTotalから計算されない）
                                if (processed.type === 'add') {
                                    const currentLiquid = getCurrentLiquidValue();
                                    setLiquidValue(currentLiquid + processed.value);
                                } else if (processed.type === 'sub') {
                                    const currentLiquid = getCurrentLiquidValue();
                                    setLiquidValue(currentLiquid - processed.value);
                                } else {
                                    // 代入
                                    if (typeof processed.value === 'number') {
                                        setLiquidValue(processed.value);
                                    } else {
                                        // 文字列の場合はそのまま代入（単位付きの可能性がある）
                                        $gameVariables.setValue(variableId, normalizeNewline(String(processed.value)));
                                    }
                                }
                            } else {
                                // その他の数値変数
                                if (processed.type === 'add') {
                                    $gameVariables.setValue(variableId, current + processed.value);
                                } else if (processed.type === 'sub') {
                                    $gameVariables.setValue(variableId, current - processed.value);
                                } else {
                                    // 代入（数値または文字列）
                                    if (typeof processed.value === 'number') {
                                        $gameVariables.setValue(variableId, processed.value);
                                    } else {
                                        $gameVariables.setValue(variableId, normalizeNewline(String(processed.value)));
                                    }
                                }
                            }
                        }
                    }
                });

                // countTotalが数値で代入された場合、countLiquidを計算（値 × 12）
                // ただし、countLiquidが直接指定されている場合はスキップ
                if (totalValue !== null && typeof totalValue === 'number' && !hasLiquidDirect) {
                    const liquidValue = totalValue * 12;
                    setLiquidValue(liquidValue);
                }
            }
        } finally {
            _VA_SuppressProgressUpdate = false;
        }
    });

    /**
     * プラグインコマンド: データエクスポート
     * 現在のデータをJSON形式で変数に保存します。
     * 表計算ソフトで管理する場合は、このJSONをコピーして外部ファイルに保存してください。
     */
    PluginManager.registerCommand(pluginName, 'exportData', args => {
        const outputVarId = Number(args.outputVariableId || 1);
        if (!outputVarId) {
            console.error(`[${pluginName}] 出力先変数IDが無効です`);
            return;
        }

        try {
            const exportData = {
                bodyData: BODY_DATA,
                statusData: STATUS_DATA,
                relationData: RELATION_DATA,
                goalData: GOAL_DATA,
                templateList: TEMPLATE_LIST,
                exportDate: new Date().toISOString()
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            $gameVariables.setValue(outputVarId, jsonString);

            console.log(`[${pluginName}] データを変数${outputVarId}にエクスポートしました`);
            console.log(`[${pluginName}] JSON文字列（コピーして外部ファイルに保存してください）:`);
            console.log(jsonString);
        } catch (e) {
            console.error(`[${pluginName}] データエクスポート中にエラーが発生しました:`, e);
        }
    });

    /**
     * プラグインコマンド: データインポート
     * 変数からJSON文字列を読み込んで、データを上書きします。
     * 表計算ソフトで編集したJSONを変数にコピーしてから実行してください。
     */
    PluginManager.registerCommand(pluginName, 'importData', args => {
        const inputVarId = Number(args.inputVariableId || 1);
        if (!inputVarId) {
            console.error(`[${pluginName}] 入力元変数IDが無効です`);
            return;
        }

        try {
            const jsonString = String($gameVariables.value(inputVarId) || '');
            if (!jsonString || jsonString.trim() === '') {
                console.error(`[${pluginName}] 変数${inputVarId}にJSON文字列がありません`);
                return;
            }

            const importData = JSON.parse(jsonString);

            // データを上書き（存在するものだけ）
            if (importData.bodyData !== undefined) {
                BODY_DATA = importData.bodyData;
            }
            if (importData.statusData !== undefined) {
                STATUS_DATA = importData.statusData;
            }
            if (importData.relationData !== undefined) {
                RELATION_DATA = importData.relationData;
            }
            if (importData.goalData !== undefined) {
                GOAL_DATA = importData.goalData;
            }
            if (importData.templateList !== undefined) {
                TEMPLATE_LIST = importData.templateList;
            }

            console.log(`[${pluginName}] データを変数${inputVarId}からインポートしました`);
        } catch (e) {
            console.error(`[${pluginName}] データインポート中にエラーが発生しました:`, e);
        }
    });

    // ============================================================================
    // Scene_Boot フック（データファイル読み込み）
    // ============================================================================

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        // データベース読み込み後に、Hstatus.jsonからデータを読み込む
        // Scene_Bootのstart()内でDataManager.loadDatabase()が呼ばれた後なので、
        // その後に読み込む
        try {
            loadDataFromJson();
        } catch (e) {
            console.error(`[${pluginName}] データ読み込み中にエラーが発生しました:`, e);
        }
    };

    // ============================================================================
    // Scene_Map フック（マップ開始時に初期値を適用）
    // ============================================================================

    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function () {
        _Scene_Map_create.call(this);
        // タイトル画面スキップ時にも対応：変数が初期化されているか確認してから初期値を適用
        if ($gameSystem && $gameVariables && $gameVariables._data) {
            // 変数が初期化されているか確認
            const varInitialized = $gameVariables._data.length > 0;

            // フラグが未設定、または変数が初期化されていない場合は初期値を適用
            if (!varInitialized || !$gameSystem._VA_InitialValuesApplied) {
                try {
                    applyInitialValues(true); // 強制上書きモード
                    if ($gameSystem) {
                        $gameSystem._VA_InitialValuesApplied = true;
                    }
                } catch (e) {
                    console.error(`[${pluginName}] 初期値適用中にエラーが発生しました:`, e);
                }
            }
        }
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        // 念のため、startでも確認（createで適用されなかった場合のフォールバック）
        if ($gameSystem && $gameVariables && $gameVariables._data) {
            const varInitialized = $gameVariables._data.length > 0;
            if (!varInitialized || !$gameSystem._VA_InitialValuesApplied) {
                try {
                    applyInitialValues(true);
                    if ($gameSystem) {
                        $gameSystem._VA_InitialValuesApplied = true;
                    }
                } catch (e) {
                    console.error(`[${pluginName}] 初期値適用中にエラーが発生しました:`, e);
                }
            }
        }
    };

    // ============================================================================
    // DataManager フック（ゲーム開始時に初期値を適用）
    // ============================================================================

    /**
     * 初期値を適用する（ニューゲーム時とロード時両方で呼ばれる）
     * @param {boolean} forceOverwrite - 強制上書きフラグ（デフォルト: true）
     */
    function applyInitialValues(forceOverwrite = true) {
        // 既に適用済みの場合はスキップ（強制上書きモードの場合は除く）
        if (!forceOverwrite && $gameSystem && $gameSystem._VA_InitialValuesApplied) {
            console.log(`[${pluginName}] 初期値は既に適用済みのためスキップします`);
            return;
        }

        try {
            // RELATION_DATAの"0_0_0"が存在するか確認
            if (!RELATION_DATA || !RELATION_DATA["0_0_0"]) {
                console.warn(`[${pluginName}] RELATION_DATAの"0_0_0"が見つかりません`);
                return;
            }

            console.log(`[${pluginName}] 初期値を適用します（forceOverwrite: ${forceOverwrite}）`);
            // RELATION_DATAの"0_0_0"を使って初期値を適用（強制上書きモード）
            updateRelationTexts("0_0_0", forceOverwrite);
            // フラグを設定
            if ($gameSystem) {
                $gameSystem._VA_InitialValuesApplied = true;
            }
            console.log(`[${pluginName}] 初期値の適用が完了しました`);
        } catch (e) {
            console.error(`[${pluginName}] 初期値適用中にエラーが発生しました:`, e);
        }
    }

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        // ニューゲーム開始時はフラグをリセット
        if ($gameSystem) {
            $gameSystem._VA_InitialValuesApplied = false;
        }
        // 変数が初期化されている場合のみ初期値を適用
        // （タイトル画面スキップ時は変数がまだ初期化されていない可能性がある）
        if ($gameVariables && $gameVariables._data && $gameVariables._data.length > 0) {
            applyInitialValues();
        }
    };

    // ロード時にも初期値を適用（タイトル画面スキップ時に対応）
    const _DataManager_loadGameData = DataManager.loadGameData;
    DataManager.loadGameData = function (savefileId) {
        const result = _DataManager_loadGameData.call(this, savefileId);
        if (result && $gameVariables) {
            // 変数が初期化されている場合のみ初期値を適用
            // 既に値が設定されている場合はスキップ（updateRelationTexts内でチェック）
            applyInitialValues();
        }
        return result;
    };

})();

