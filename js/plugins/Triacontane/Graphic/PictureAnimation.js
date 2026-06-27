/*=============================================================================
 PictureAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.3 2021/01/11 セルの効果音設定のコマンドが正常に機能していなかった問題を修正
 1.1.2 2020/12/06 1.1.0の機能追加で最後のセルの最後のフレームまで到達したときに完了扱いにするよう修正
 1.1.1 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.1.0 2020/10/24 ピクチャのアニメーション完了まで次の命令に移行しない設定を追加
 1.0,2 2020/08/24 ピクチャのアニメーションセル設定でセル進行かどうかの判定処理が誤っていた問題を修正
 1.0.1 2020/08/23 ピクチャのアニメーションセル設定のコマンドが機能していなかった問題を修正
 1.0.0 2020/02/28 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/
/*:
 * @target MZ
 * @plugindesc Picture Animation
 * @author Triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 * 
 * @param returnToFirstCell
 * @text Return to the first cell
 * @desc Return to the first cell after the end of the non-looping animation. If disabled, it will stop at the last cell.
 * @default true
 * @type boolean
 *
 * @param cgSettings
 * @text CG Set Settings
 * @desc Register the base name and number of cells for each CG set. If not registered, the default cell number will be used.
 * @type struct<CGSet>[]
 * @default []
 *
 * @param defaultCellNumber
 * @text Default Cell Number
 * @desc Default number of cells to use when CG set is not found in settings. Images with fewer cells will still work.
 * @type number
 * @default 50
 * @min 1
 * @max 999
 *
 * @param debugMode
 * @text Debug Mode
 * @desc Output debug logs (with the prefix [PictureAnimation]) only when this is enabled.
 * @type boolean
 * @default false
 *
 * @param debugLogLimit
 * @text Debug Log Limit
 * @desc Maximum times the same debug log will be shown before being suppressed.
 * @type number
 * @default 30
 * @min 1
 *
 * @param cellVariableId
 * @text Cell Variable ID
 * @desc The variable ID to store the current cell number when using Animation Cell Settings.
 * @type variable
 * @default 0
 *
 * @param cellVariableOffset
 * @text Cell Variable Offset
 * @desc The value to subtract from the cell number when storing it in the variable.
 * @type number
 * @default 0
 * @min 0
 *
 * @command INIT
 * @text Animation Preparation
 * @desc Prepare the picture to be animated.Do it just before "Show Picture".
 *
 * @arg cgBaseName
 * @text CG Image File
 * @desc Select a CG image file. The base name will be extracted from the filename (e.g., HCG01_008.png -> HCG01).
 * @type file
 * @dir img/pictures/
 * @default 
 *
 * @arg frameNumber
 * @text Number of frames
 * @desc Number of frames in the animation interval
 * @type number
 * @default 1
 * @min 1
 *
 * @arg fade
 * @text Fade time
 * @desc The number of frames to change images (if set to 0, it will not fade)
 * @type number
 * @default 0
 *
 * @command START
 * @text Start Animation
 * @desc Start to animate the picture of the specified picture number.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg loop
 * @text With or without a loop
 * @desc The presence of loop playback.
 * @type boolean
 * @default false
 *
 * @arg wait
 * @text Wait fot Completion
 * @desc If set to true, wait for the event to progress until the animation is complete.
 * @type boolean
 * @default false
 *
 * @arg animationType
 * @text Animation Type
 * @desc Animation Type.
 * @type select
 * @default 1
 * @option 1->2->3->4->1->2->3->4... (If the number of cells is 4.)
 * @value 1
 * @option 1->2->3->4->3->2->1->2... (If the number of cells is 4.)
 * @value 2
 * @option Custom Patterns
 * @value 3
 *
 * @arg customPattern
 * @text Custom Patterns
 * @desc The pattern if the animation type is set to "Custom Pattern".
 * @type number[]
 * @default ["1"]
 *
 * @command STOP
 * @text End of Animation
 * @desc Finish animating a picture of the specified picture number.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg force
 * @text Forced Exit
 * @desc If enabled, the animation will stop the moment it is executed. If disabled, it will stop after a cycle.
 * @type boolean
 * @default false
 *
 * @command SET_CELL
 * @text Animation Cell Settings
 * @desc Set the animation cells directly. This is useful if you want to animate at any time.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber
 * @text Cell Number
 * @desc The cell number to be specified. The starting number is 1, and a value of 0 will advance the current cell by one.
 * @type number
 * @default 0
 *
 * @arg wait
 * @text Wait fot Completion
 * @desc If set to true, it will wait for the event to run during the crossfade.
 * @type boolean
 * @default false
 *
 * @arg completeSwitchId
 * @text Completion Switch ID
 * @desc Switch ID to turn ON when accessing a non-existent cell (0 = disabled). This indicates that all images have been viewed.
 * @type switch
 * @default 0
 * @min 0
 *
 * @arg fadeDuration
 * @text Fade Duration Override
 * @desc Override fade duration for this command only. -1 = use default (Animation Preparation setting).
 * @type number
 * @default -1
 * @min -1
 *
 * @command CELL_LOOP
 * @text Cell Loop Animation
 * @desc Alternate between two cell numbers with crossfade effect.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber1
 * @text Cell Number 1
 * @desc The first cell number to alternate.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber2
 * @text Cell Number 2
 * @desc The second cell number to alternate.
 * @type number
 * @default 2
 * @min 1
 *
 * @arg fade
 * @text With Fade
 * @desc Enable crossfade effect between cells.
 * @type boolean
 * @default true
 *
 * @arg fadeDuration
 * @text Fade Duration
 * @desc Duration of fade in frames. If 0, uses the value set in Animation Preparation.
 * @type number
 * @default 0
 * @min 0
 *
 * @arg loopCount
 * @text Loop Count
 * @desc Number of times to alternate. (1 = one round trip: cell1 -> cell2 -> cell1)
 * @type number
 * @default 1
 * @min 1
 *
 * @arg waitAfterLoop
 * @text Wait After Loop
 * @desc Wait duration in frames after one round trip.
 * @type number
 * @default 15
 * @min 0
 *
 * @arg oneWay
 * @text One Way
 * @desc If enabled, it stops at the second cell without returning. (Stops at 1->2)
 * @type boolean
 * @default false
 *
 * @command LINK_VARIABLE
 * @text Cell Variables Links
 * @desc Synchronize the animated cells with the specified variables. As the value of the variable changes, the displayed cell will also change automatically.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg variableId
 * @text Variable Number
 * @desc The variable number of the link target.
 * @type variable
 * @default 1
 *
 * @command LINK_SOUND
 * @text SE Settings
 * @desc Play SE at the time the animation cell switches.
 *
 * @arg cellNumber
 * @text Cell Number
 * @desc The cell number to be specified.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg se
 * @text Sound Effect
 * @desc Sound Effect
 * @type struct<SE>
 * @default
 *
 * @command CELL_SEQUENCE
 * @text Cell Sequence
 * @desc Advances cells in the specified order on decision key input.
 *
 * @arg pictureNumber
 * @text Picture ID
 * @desc Picture ID.
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellSequence
 * @text Cell Sequence
 * @desc Sequence of cell numbers separated by commas (e.g., 1,2,3).
 * @type string
 * @default 1,2,3
 *
 * @arg okSe
 * @text OK SE
 * @desc SE to play when the OK key is pressed (advancing sequence).
 * @type struct<SE>
 * @default
 *
 * @arg cancelSe
 * @text Cancel SE
 * @desc SE to play when the Cancel key is pressed (exiting sequence).
 * @type struct<SE>
 * @default
 *
 * @help Animate the picture at the specified frame interval.
 * Prepare the cell images you want to animate (*) and enter the following commands.
 *
 * 1. Animation Preparation (Plugin Command)
 * 2. Show Picture (Event Command)
 * 3. Start Animation (Plugin Command)
 * 4. End of animation (Plugin Command)
 *
 * There are three ways of placement
 *  vertical: arrange the cells vertically to make the whole into one file.
 *  horizon: Cells are lined up horizontally to make the whole into a single file.
 *  number: Prepare multiple cell images with sequential numbers. (The original part is an arbitrary string of characters)
 *   original00.png(The original file specified in the picture display)
 *   original01.png
 *   original02.png...
 *
 * attention!　If you use "Exclude unused files" of the deployment method,
 * it may be excluded as unused files at deployment time.
 *
 * In addition to simply animating cells, 
 * you can also specify cell numbers directly from the plugin command or link the value of a variable to a cell number.
 * In addition to simply animating cells,
 *  you can also specify cell numbers directly from the plugin command or link the value of a variable to a cell number.
 * It is useful for productions such as picture-story shows or to change the display state of standing pictures depending on the conditions.
 *
 * Script details
 *
 * Get the current cell number for the picture being animated.
 * It can be used in the event commands "variable manipulation" and "conditional branching".
 * Running it while not viewing the picture will result in an error.
 * $gameScreen.picture(1).cell; // Get a cell with picture ID [1].
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */
/*:ja
 * @target MZ
 * @plugindesc ピクチャのアニメーションプラグイン
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 * 
 * @param returnToFirstCell
 * @text 最初のセルに戻る
 * @desc ループしないアニメーションの終了後、最初のセルに戻ります。無効にすると最後のセルで止まります。
 * @default true
 * @type boolean
 *
 * @param cgSettings
 * @text CGセット設定
 * @desc 各CGセットのベース名とセル数を登録します。登録されていない場合はデフォルトセル数が使用されます。
 * @type struct<CGSet>[]
 * @default []
 *
 * @param defaultCellNumber
 * @text デフォルトセル数
 * @desc CGセット設定で見つからない場合に使用するデフォルトのセル数です。実際の画像がこの数より少なくても動作します。
 * @type number
 * @default 50
 * @min 1
 * @max 999
 *
 * @param debugMode
 * @text デバッグモード
 * @desc 有効にすると[PictureAnimation]のデバッグログを出力します。無効時は出力しません。
 * @type boolean
 * @default false
 *
 * @param debugLogLimit
 * @text デバッグログ上限
 * @desc 同じ内容のデバッグログを出力する最大回数です。超えると抑制されます。
 * @type number
 * @default 30
 * @min 1
 *
 * @param cellVariableId
 * @text セル変数ID
 * @desc アニメーションセル設定を使用した際に、現在のセル番号を格納する変数のIDです。
 * @type variable
 * @default 0
 *
 * @param cellVariableOffset
 * @text セル変数オフセット
 * @desc セル変数に格納する際、現在のセル番号から減算する値です。（例: 1を指定すると、セル1のとき変数は0になります）
 * @type number
 * @default 0
 * @min 0
 *
 * @command INIT
 * @text アニメーション準備
 * @desc ピクチャをアニメーション対象にする準備をします。「ピクチャの表示」の直前に実行してください。
 *
 * @arg cgBaseName
 * @text CG画像ファイル
 * @desc CG画像ファイルを選択してください。ファイル名からベース名が自動抽出されます（例: HCG01_008.png → HCG01）。
 * @type file
 * @dir img/pictures/
 * @default 
 *
 * @arg frameNumber
 * @text フレーム数
 * @desc アニメーション間隔のフレーム数
 * @type number
 * @default 1
 * @min 1
 *
 * @arg fade
 * @text フェード時間
 * @desc 画像切替に掛かるフレーム数（0にするとフェードしない）
 * @type number
 * @default 0
 *
 * @command START
 * @text アニメーション開始
 * @desc 指定したピクチャ番号のピクチャをアニメーションを開始します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg loop
 * @text ループ有無
 * @desc ループ再生の有無です。
 * @type boolean
 * @default false
 *
 * @arg wait
 * @text 完了までウェイト
 * @desc 有効にするとアニメーションが完了するまでイベントの進行を待機します。
 * @type boolean
 * @default false
 *
 * @arg animationType
 * @text アニメーションタイプ
 * @desc アニメーションタイプです。
 * @type select
 * @default 1
 * @option 1→2→3→4→1→2→3→4... (セル数が4の場合)
 * @value 1
 * @option 1→2→3→4→3→2→1→2... (セル数が4の場合)
 * @value 2
 * @option カスタムパターン
 * @value 3
 *
 * @arg customPattern
 * @text カスタムパターン
 * @desc アニメーションタイプを「カスタムパターン」にした場合のパターンです。
 * @type number[]
 * @default ["1"]
 *
 * @command STOP
 * @text アニメーション終了
 * @desc 指定したピクチャ番号のピクチャをアニメーションを終了します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg force
 * @text 強制終了
 * @desc 有効にすると実行した瞬間にアニメーションが止まります。無効にすると一巡してから止まります。
 * @type boolean
 * @default false
 *
 * @command SET_CELL
 * @text アニメーションセル設定
 * @desc アニメーションのセルを直接設定します。任意のタイミングでアニメーションしたい場合に有効です。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber
 * @text セル番号
 * @desc 指定対象のセル番号です。開始番号は1で、0を指定すると、現在のセルからひとつ進めます。
 * @type number
 * @default 0
 *
 * @arg wait
 * @text ウェイト有無
 * @desc ウェイトありを設定すると、クロスフェード中はイベントの実行を待機します。
 * @type boolean
 * @default false
 *
 * @arg completeSwitchId
 * @text 完了スイッチ番号
 * @desc 存在しないセルにアクセスした場合にONにするスイッチ番号です（0=無効）。全ての画像を見たことを示します。
 * @type switch
 * @default 0
 * @min 0
 *
 * @arg fadeDuration
 * @text フェード時間上書き
 * @desc このコマンド実行時のみフェード時間を上書きします。-1 = 上書きしない（アニメーション準備の設定を使用）。
 * @type number
 * @default -1
 * @min -1
 *
 * @command CELL_LOOP
 * @text アニメーションセルの往復
 * @desc 2つのセル番号をフェードで交互に表示します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber1
 * @text セル番号1
 * @desc 交互に表示する最初のセル番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber2
 * @text セル番号2
 * @desc 交互に表示する2番目のセル番号です。
 * @type number
 * @default 2
 * @min 1
 *
 * @arg fade
 * @text フェードあり
 * @desc セル間のクロスフェード効果を有効にします。
 * @type boolean
 * @default true
 *
 * @arg fadeDuration
 * @text フェード時間
 * @desc フェードにかかるフレーム数です。0の場合はアニメーション準備で設定した値を使用します。
 * @type number
 * @default 0
 * @min 0
 *
 * @arg loopCount
 * @text 往復回数
 * @desc 往復する回数です。（1 = セル1 → セル2 → セル1 の1往復）
 * @type number
 * @default 1
 * @min 1
 *
 * @arg waitAfterLoop
 * @text 往復後のウェイト
 * @desc 1往復後に入れるウェイトのフレーム数です。
 * @type number
 * @default 15
 * @min 0
 *
 * @arg oneWay
 * @text 片道
 * @desc 有効にすると往復せずに行きっぱなしになります。（1→2で止まる）
 * @type boolean
 * @default false
 *
 * @command LINK_VARIABLE
 * @text セルの変数のリンク
 * @desc アニメーションのセルを指定した変数と連動させます。変数の値が変化すると表示しているセルも自動的に変化します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg variableId
 * @text 変数番号
 * @desc リンク対象の変数番号です。
 * @type variable
 * @default 1
 *
 * @command LINK_SOUND
 * @text 効果音の設定
 * @desc アニメーションのセルが切り替わったタイミングで効果音を演奏します。
 *
 * @arg cellNumber
 * @text セル番号
 * @desc 指定対象のセル番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg se
 * @text 効果音
 * @desc 演奏する効果音です。
 * @type struct<SE>
 * @default
 *
 * @command CELL_SEQUENCE
 * @text セル順送り
 * @desc 決定キー入力で指定した順番通りにセルを送ります。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellSequence
 * @text セル順序
 * @desc カンマ区切りで指定したセル番号の順序です（例: 1,2,3）。
 * @type string
 * @default 1,2,3
 *
 * @arg okSe
 * @text 決定SE
 * @desc 決定キーで順送りしたときに演奏するSEです。
 * @type struct<SE>
 * @default
 *
 * @arg cancelSe
 * @text キャンセルSE
 * @desc キャンセルキーで中断したときに演奏するSEです。
 * @type struct<SE>
 * @default
 *
 * @help 指定したフレーム間隔でピクチャをアニメーションします。
 * アニメーションしたいセル画像（※）を用意の上
 * 以下のコマンドを入力してください。
 *
 * 1. ピクチャのアニメーション準備（プラグインコマンド）
 * 2. ピクチャの表示（通常のイベントコマンド）
 * 3. ピクチャのアニメーション開始（プラグインコマンド）
 * 4. ピクチャのアニメーション終了（プラグインコマンド）
 *
 * ※配置方法は以下の3通りがあります。
 *  縦　：セルを縦に並べて全体を一つのファイルにします。
 *  横　：セルを横に並べて全体を一つのファイルにします。
 *  連番：連番のセル画像を複数用意します。(original部分は任意の文字列)
 *   original00.png(ピクチャの表示で指定するオリジナルファイル)
 *   original01.png
 *   original02.png...
 *
 * 要注意！　配置方法の連番を使う場合、デプロイメント時に
 * 未使用ファイルとして除外される可能性があります。
 * その場合、削除されたファイルを入れ直す等の対応が必要です。
 *
 * また、単にアニメーションさせる以外にも、プラグインコマンドから
 * セル番号を直接指定したり、変数の値とセル番号を連動させたりできます。
 * 紙芝居のような演出や、条件次第で立ち絵の表示状態を変化させたりする場合に
 * 有効です。
 *
 * スクリプト詳細
 *
 * アニメーション中のピクチャに対して現在のセル番号を取得します。
 * イベントコマンド「変数の操作」や「条件分岐」で使用できます。
 * ピクチャを表示していないときに実行するとエラーになります。
 * $gameScreen.picture(1).cell; // ピクチャ番号[1]のセルを取得
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SE:
 * @param name
 * @desc SEのファイル名称です。
 * @default Book1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @desc SEのボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @desc SEのピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @desc SEの左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~CGSet:ja
 * @param baseName
 * @text ベース名
 * @desc CGのベースファイル名です。(例: HCG01)
 * @type string
 * @default 
 *
 * @param cellNumber
 * @text セル数
 * @desc このCGセットの総枚数（セル数）です。
 * @type number
 * @min 1
 * @default 1
 */

/*~struct~CGSet:
 * @param baseName
 * @text Base Name
 * @desc The base filename for the CG set (e.g., HCG01).
 * @type string
 * @default 
 *
 * @param cellNumber
 * @text Number of Cells
 * @desc The total number of images (cells) in this CG set.
 * @type number
 * @min 1
 * @default 1
 */

(function () {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const debugMode = !!param.debugMode;
    const debugLogLimit = Math.max(1, Number(param.debugLogLimit || 30));

    (function setupPictureAnimationLogger() {
        const originalConsole = {
            log: console.log.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console)
        };
        const logCounts = {};

        const shouldSuppress = function (message) {
            logCounts[message] = (logCounts[message] || 0) + 1;
            if (logCounts[message] <= debugLogLimit) {
                return false;
            }
            if (logCounts[message] === debugLogLimit + 1) {
                originalConsole.log(`${message} (further occurrences suppressed)`);
            }
            return true;
        };

        const wrap = function (type) {
            return function () {
                if (!arguments.length) return;
                const firstArg = arguments[0];
                const isPaLog = typeof firstArg === 'string' && firstArg.indexOf('[PictureAnimation]') >= 0;
                if (!isPaLog) {
                    originalConsole[type].apply(console, arguments);
                    return;
                }
                if (!debugMode) {
                    return;
                }
                if (shouldSuppress(firstArg)) {
                    return;
                }
                originalConsole[type].apply(console, arguments);
            };
        };

        console.log = wrap('log');
        console.warn = wrap('warn');
        console.error = wrap('error');
    })();

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    PluginManagerEx.registerCommand(script, "INIT", function (args) {
        console.log('[PictureAnimation] INITコマンド実行:', args);
        // デフォルトセル数を取得（設定されていない場合は50）
        const defaultCellNumber = param.defaultCellNumber || 50;
        let cellNumber = defaultCellNumber;

        if (args.cgBaseName) {
            // ファイル名からベース名を抽出（例: EVENT/HCG01_008.png -> HCG01）
            let baseName = args.cgBaseName;
            // 拡張子を削除
            baseName = baseName.replace(/\.[^.]*$/, '');
            // _数字 の部分を削除（例: HCG01_008 -> HCG01）
            baseName = baseName.replace(/_(\d+)$/, '');
            // パス部分を除去（最後の / 以降だけを取得）
            // 例: EVENT/HCG01 -> HCG01, HCG01 -> HCG01
            const pathMatch = baseName.match(/\/([^\/]+)$/);
            if (pathMatch) {
                baseName = pathMatch[1];
            }
            console.log('[PictureAnimation] 抽出したベース名:', baseName, '(元のファイル名:', args.cgBaseName, ')');

            // CGセット設定から検索（設定がある場合のみ）
            if (param.cgSettings && param.cgSettings.length > 0) {
                console.log('[PictureAnimation] CG設定:', param.cgSettings);
                const cgSet = param.cgSettings.find(function (set) {
                    return set.baseName === baseName;
                });
                if (cgSet) {
                    cellNumber = cgSet.cellNumber;
                    console.log('[PictureAnimation] CGセット見つかりました。セル数:', cellNumber);
                } else {
                    console.log('[PictureAnimation] CGセットが見つかりませんでした。デフォルトセル数を使用:', defaultCellNumber);
                }
            } else {
                console.log('[PictureAnimation] CGセット設定が未登録。デフォルトセル数を使用:', defaultCellNumber);
            }
        } else {
            console.log('[PictureAnimation] cgBaseNameが未設定。デフォルトセル数を使用:', defaultCellNumber);
        }
        console.log('[PictureAnimation] 設定するセル数:', cellNumber, 'フレーム数:', args.frameNumber);
        $gameScreen.setPicturesAnimation(cellNumber, args.frameNumber, 'number', args.fade);
    });

    PluginManagerEx.registerCommand(script, "LINK_SOUND", function (args) {
        if (args.se && args.se.name !== '') {
            $gameScreen.addPaSound(args.se, args.cellNumber);
        }
    });

    PluginManagerEx.registerCommand(script, "START", function (args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.startAnimationFrame(args.animationType, args.loop, args.customPattern);
        }
        if (args.wait) {
            this.waitForPictureAnimation(args.pictureNumber);
        }
    });

    PluginManagerEx.registerCommand(script, "STOP", function (args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.stopAnimationFrame(args.force);
        }
    });

    PluginManagerEx.registerCommand(script, "SET_CELL", function (args) {
        console.log('[PictureAnimation] SET_CELLコマンド実行:', args);
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            // 完了スイッチ番号を設定
            if (args.completeSwitchId > 0) {
                picture.setCompleteSwitchId(args.completeSwitchId);
                console.log('[PictureAnimation] 完了スイッチ番号を設定:', args.completeSwitchId);
            }

            // フェード時間の一時的な上書き処理
            // args.fadeDurationは新しいパラメータで、既存のコマンドではundefinedになる
            // undefinedまたは-1の場合はデフォルト（上書きなし）
            const fadeDurationOverride = args.fadeDuration !== undefined ? args.fadeDuration : -1;
            const originalFadeDuration = picture._fadeDuration;
            const shouldOverrideFade = fadeDurationOverride >= 0;

            if (shouldOverrideFade) {
                console.log('[PictureAnimation] フェード時間を一時上書き:', originalFadeDuration, '->', fadeDurationOverride);
                picture._fadeDuration = fadeDurationOverride;
            }

            const beforeCell = picture.cell;
            let advanced = false;
            if (args.cellNumber > 0) {
                const targetCell = args.cellNumber - 1;
                console.log('[PictureAnimation] セル番号指定:', args.cellNumber, '-> 0ベース:', targetCell);
                picture.cell = targetCell;
                advanced = true;
            } else {
                console.log('[PictureAnimation] セルを次に進める');
                // 次のセルが存在するかチェック
                if (picture.canAdvanceToNextCell()) {
                    picture.addCellCount();
                    advanced = true;
                } else {
                    console.log('[PictureAnimation] 次のセルが存在しないため、セルを進めません');
                }
            }
            const afterCell = picture.cell;
            console.log('[PictureAnimation] セル変更:', 'before:', beforeCell, 'after:', afterCell, '_cellCount:', picture._cellCount);

            // parameterで指定された変数にセル番号を代入
            const cellVariableId = Math.max(0, Number(param.cellVariableId || 0));
            const cellVariableOffset = Math.max(0, Number(param.cellVariableOffset || 0));
            if (cellVariableId > 0) {
                const newValue = (afterCell + 1) - cellVariableOffset;
                if ($gameVariables.value(cellVariableId) !== newValue) {
                    $gameVariables.setValue(cellVariableId, newValue);
                }
            }

            // ウェイト処理
            const waitDuration = shouldOverrideFade ? fadeDurationOverride : picture._fadeDuration;
            if (args.wait) {
                this.wait(waitDuration);
            } else if (args.completeSwitchId > 0 && args.cellNumber <= 0) {
                // 完了スイッチ監視時は自動で1フレーム待機し、スイッチONを確実に検出できるようにする
                // （RPGツクールMZの描画更新タイミングの都合で即時判定できないため）
                this.wait(1);
            }

            // フェード時間を元に戻す（フェード完了後）
            if (shouldOverrideFade) {
                // フェード完了後に元の値に戻すためのタイマーを設定
                picture._restoreFadeDuration = originalFadeDuration;
                picture._restoreFadeDurationAfter = fadeDurationOverride;
            }
        } else {
            console.error('[PictureAnimation] ピクチャが見つかりません。pictureNumber:', args.pictureNumber);
        }
    });

    // アニメーションセルの往復コマンド
    PluginManagerEx.registerCommand(script, "CELL_LOOP", function (args) {
        console.log('[PictureAnimation] CELL_LOOPコマンド実行:', args);
        const picture = $gameScreen.picture(args.pictureNumber);
        if (!picture) {
            console.error('[PictureAnimation] ピクチャが見つかりません。pictureNumber:', args.pictureNumber);
            return;
        }

        // セル番号（1ベース → 0ベースに変換）
        const cell1 = args.cellNumber1 - 1;
        const cell2 = args.cellNumber2 - 1;
        // フェード時間（0の場合はピクチャの設定値を使用）
        const fadeDuration = args.fadeDuration > 0 ? args.fadeDuration : picture._fadeDuration;
        // フェードなしの場合は0に設定
        const actualFadeDuration = args.fade ? fadeDuration : 0;
        // 往復回数（デフォルト1）
        const loopCount = Math.max(1, args.loopCount || 1);
        // 往復後のウェイト（デフォルト15フレーム）
        const waitAfterLoop = args.waitAfterLoop !== undefined ? args.waitAfterLoop : 15;
        // 片道フラグ
        const oneWay = args.oneWay;

        console.log('[PictureAnimation] CELL_LOOP設定:', {
            cell1: cell1,
            cell2: cell2,
            fade: args.fade,
            fadeDuration: actualFadeDuration,
            loopCount: loopCount,
            waitAfterLoop: waitAfterLoop,
            oneWay: oneWay
        });

        // 一時的にフェード時間を変更（フェードありの場合）
        const originalFadeDuration = picture._fadeDuration;
        picture._fadeDuration = actualFadeDuration;

        // 1往復 = cell1 → cell2 → cell1
        // loopCount回繰り返す
        // 各セル変更時、フェードありならフェード時間分ウェイト
        // 1往復後、waitAfterLoop分ウェイト

        // 合計ウェイト時間を計算
        // 1往復につき：cell1→cell2（フェード時間） + cell2→cell1（フェード時間） + 往復後ウェイト
        // ただし最初にcell1に設定する場合のフェード時間も含む
        // loopCount往復するので：
        // 最初のcell1設定（フェードあり） + loopCount * (cell2へのフェード + cell1へのフェード + 往復後ウェイト)
        // ただし最後の往復後はウェイトなしでもよいが、指定に従う

        // 往復アニメーションを非同期で実行するための設定
        // Game_Interpreterに往復アニメーションの状態を保存
        this._cellLoopState = {
            pictureNumber: args.pictureNumber,
            cell1: cell1,
            cell2: cell2,
            fadeDuration: actualFadeDuration,
            loopCount: loopCount,
            waitAfterLoop: waitAfterLoop,
            currentLoop: 0,
            currentPhase: 0, // 0: cell1表示, 1: cell2表示, 2: cell1戻り, 3: ウェイト中, 4: 片道終了
            waitCounter: 0,
            originalFadeDuration: originalFadeDuration,
            oneWay: oneWay
        };

        // 最初にcell1を表示（フェードありの場合）
        picture.cell = cell1;

        // ウェイトモードを設定
        this.setWaitMode('cellLoopAnimation');
        this._waitPictureId = args.pictureNumber;
    });

    // セルループアニメーションのウェイトモード処理
    const _Game_Interpreter_updateWaitMode_cellLoop = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'cellLoopAnimation') {
            return this.updateCellLoopAnimation();
        }
        return _Game_Interpreter_updateWaitMode_cellLoop.apply(this, arguments);
    };

    Game_Interpreter.prototype.updateCellLoopAnimation = function () {
        const state = this._cellLoopState;
        if (!state) {
            this._waitMode = '';
            return false;
        }

        const picture = $gameScreen.picture(state.pictureNumber);
        if (!picture) {
            this._waitMode = '';
            this._cellLoopState = null;
            return false;
        }

        // フェード中はウェイト
        if (picture.isFading()) {
            return true;
        }

        // ウェイトカウンター処理
        if (state.waitCounter > 0) {
            state.waitCounter--;
            return true;
        }

        // フェーズに応じた処理
        switch (state.currentPhase) {
            case 0: // cell1表示中 → cell2へ
                picture.cell = state.cell2;
                if (state.oneWay && state.currentLoop >= state.loopCount - 1) {
                    state.currentPhase = 4;
                } else {
                    state.currentPhase = 1;
                }
                if (state.fadeDuration > 0) {
                    return true; // フェード待機
                }
                break;

            case 1: // cell2表示中 → cell1へ戻る
                picture.cell = state.cell1;
                state.currentPhase = 2;
                if (state.fadeDuration > 0) {
                    return true; // フェード待機
                }
                break;

            case 2: // cell1に戻った → 1往復完了
                state.currentLoop++;
                if (state.currentLoop >= state.loopCount) {
                    // 全往復完了
                    picture._fadeDuration = state.originalFadeDuration;
                    this._waitMode = '';
                    this._cellLoopState = null;
                    return false;
                }
                // 次の往復へ
                state.waitCounter = state.waitAfterLoop;
                state.currentPhase = 3;
                if (state.waitAfterLoop > 0) {
                    return true; // ウェイト待機
                }
                break;

            case 3: // 往復後ウェイト完了 → 次の往復開始
                state.currentPhase = 0;
                // すぐに次のフェーズへ（cell1 → cell2）
                picture.cell = state.cell2;
                if (state.oneWay && state.currentLoop >= state.loopCount - 1) {
                    state.currentPhase = 4;
                } else {
                    state.currentPhase = 1;
                }
                if (state.fadeDuration > 0) {
                    return true; // フェード待機
                }
                break;

            case 4: // 片道終了
                picture._fadeDuration = state.originalFadeDuration;
                this._waitMode = '';
                this._cellLoopState = null;
                return false;
        }

        // 即座に次のフェーズへ進む（フェードなしの場合）
        return this.updateCellLoopAnimation();
    };

    PluginManagerEx.registerCommand(script, 'CELL_SEQUENCE', function (args) {
        console.log('[PictureAnimation] CELL_SEQUENCEコマンド実行:', args);
        const picture = $gameScreen.picture(args.pictureNumber);
        if (!picture) {
            console.error('[PictureAnimation] ピクチャが見つかりません。pictureNumber:', args.pictureNumber);
            return;
        }

        const sequence = args.cellSequence.split(',').map(function (n) {
            return parseInt(n.trim(), 10) - 1; // 0ベースに変換
        });

        if (sequence.length === 0) {
            return;
        }

        this._cellSequenceState = {
            pictureNumber: args.pictureNumber,
            sequence: sequence,
            currentIndex: 0,
            okSe: args.okSe,
            cancelSe: args.cancelSe
        };

        // 最初のセルを表示
        picture.cell = sequence[0];

        // ウェイトモードを設定
        this.setWaitMode('cellSequence');
        this._waitPictureId = args.pictureNumber;
    });

    const _Game_Interpreter_updateWaitMode_cellSequence = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'cellSequence') {
            return this.updateCellSequence();
        }
        return _Game_Interpreter_updateWaitMode_cellSequence.apply(this, arguments);
    };

    Game_Interpreter.prototype.updateCellSequence = function () {
        const state = this._cellSequenceState;
        if (!state) {
            this._waitMode = '';
            return false;
        }

        const picture = $gameScreen.picture(state.pictureNumber);
        if (!picture) {
            this._waitMode = '';
            this._cellSequenceState = null;
            return false;
        }

        // 決定キーで次へ
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            if (state.okSe && state.okSe.name) {
                AudioManager.playSe(state.okSe);
            }
            state.currentIndex++;
            if (state.currentIndex >= state.sequence.length) {
                // 最後まで到達したら終了
                this._waitMode = '';
                this._cellSequenceState = null;
                return false;
            } else {
                // 次のセルへ
                picture.cell = state.sequence[state.currentIndex];
            }
        }
        // キャンセルキーで中断
        else if (Input.isTriggered('cancel')) {
            if (state.cancelSe && state.cancelSe.name) {
                AudioManager.playSe(state.cancelSe);
            }
            this._waitMode = '';
            this._cellSequenceState = null;
            return false;
        }

        return true;
    };

    PluginManagerEx.registerCommand(script, "LINK_VARIABLE", function (args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.linkToVariable(args.variableId);
        }
    });

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'pictureAnimation') {
            const picture = $gameScreen.picture(this._waitPictureId);
            if (picture && picture.isAnimationPlaying()) {
                return true;
            } else {
                this._waitPictureId = 0;
                this._waitMode = '';
                return false;
            }
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    Game_Interpreter.prototype.waitForPictureAnimation = function (pictureId) {
        this.setWaitMode('pictureAnimation');
        this._waitPictureId = pictureId;
    };

    //=============================================================================
    // Game_Screen
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    Game_Screen.prototype.setPicturesAnimation = function (cellNumber, frameNumber, direction, fadeDuration) {
        this._paCellNumber = cellNumber;
        this._paFrameNumber = frameNumber;
        this._paDirection = direction;
        this._paFadeDuration = fadeDuration;
    };

    Game_Screen.prototype.addPaSound = function (sound, frame) {
        if (!this._paSounds) this._paSounds = [];
        this._paSounds[frame] = sound;
    };

    Game_Screen.prototype.clearPicturesAnimation = function () {
        this._paCellNumber = 1;
        this._paFrameNumber = 1;
        this._paDirection = '';
        this._paFadeDuration = 0;
        this._paSounds = null;
    };

    const _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function (pictureId, name, origin, x, y,
        scaleX, scaleY, opacity, blendMode) {
        _Game_Screen_showPicture.apply(this, arguments);
        const realPictureId = this.realPictureId(pictureId);
        console.log('[PictureAnimation] showPicture呼び出し:', 'pictureId:', pictureId, 'name:', name, 'realPictureId:', realPictureId);
        console.log('[PictureAnimation] _paCellNumber:', this._paCellNumber);
        if (this._paCellNumber > 1) {
            let startingCell = 0;
            if (name) {
                const match = name.match(/_(\d+)$/);
                if (match) {
                    // ファイル名の数字部分を抽出（1ベース）し、0ベースに変換
                    const fileCellNumber = parseInt(match[1], 10);
                    // ファイル名が000から始まる場合（0ベース）と001から始まる場合（1ベース）の両方に対応
                    // 通常は0ベース（000, 001, 002, ...）なので、そのまま使用
                    startingCell = fileCellNumber;
                    console.log('[PictureAnimation] ファイル名から開始セル抽出:', fileCellNumber, '-> startingCell:', startingCell);
                } else {
                    console.log('[PictureAnimation] ファイル名に数字部分が見つかりませんでした');
                }
            }
            console.log('[PictureAnimation] setAnimationFrameInit呼び出し:', {
                cellNumber: this._paCellNumber,
                frameNumber: this._paFrameNumber,
                direction: this._paDirection,
                fadeDuration: this._paFadeDuration,
                startingCell: startingCell
            });
            this._pictures[realPictureId].setAnimationFrameInit(
                this._paCellNumber, this._paFrameNumber, this._paDirection, this._paFadeDuration, this._paSounds, startingCell);
            this.clearPicturesAnimation();
        }
    };

    Game_Screen.prototype.isActivePicture = function (picture) {
        const realId = this._pictures.indexOf(picture);
        return realId > this.maxPictures() === $gameParty.inBattle();
    };

    //=============================================================================
    // Game_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    const _Game_Picture_initialize = Game_Picture.prototype.initialize;
    Game_Picture.prototype.initialize = function () {
        _Game_Picture_initialize.call(this);
        this.initAnimationFrameInfo();
    };

    Game_Picture.prototype.initAnimationFrameInfo = function () {
        this._cellNumber = 1;
        this._frameNumber = 1;
        this._cellCount = 0;
        this._frameCount = 0;
        this._animationType = 0;
        this._customArray = null;
        this._loopFlg = false;
        this._direction = '';
        this._fadeDuration = 0;
        this._fadeDurationCount = 0;
        this._prevCellCount = 0;
        this._animationFlg = false;
        this._linkedVariable = 0;
        this._cellSes = [];
        this._completeSwitchId = 0;
    };

    Game_Picture.prototype.direction = function () {
        return this._direction;
    };

    Game_Picture.prototype.cellNumber = function () {
        return this._cellNumber;
    };

    Game_Picture.prototype.prevCellCount = function () {
        return this._prevCellCount;
    };

    Game_Picture.prototype.isMulti = function () {
        return this.direction() === 'number';
    };

    /**
     * The cellCount of the Game_Picture (0 to cellNumber).
     *
     * @property cellCount
     * @type Number
     */
    Object.defineProperty(Game_Picture.prototype, 'cell', {
        get: function () {
            let result;
            if (this._linkedVariable > 0) {
                result = $gameVariables.value(this._linkedVariable) % this._cellNumber;
            } else {
                switch (this._animationType) {
                    case 3:
                        result = (this._customArray[this._cellCount] - 1).clamp(0, this._cellNumber - 1);
                        break;
                    case 2:
                        result = this._cellNumber - 1 - Math.abs(this._cellCount - (this._cellNumber - 1));
                        break;
                    case 1:
                        result = this._cellCount;
                        break;
                    default:
                        result = this._cellCount;
                }
            }
            console.log('[PictureAnimation] cell getter:', {
                _cellCount: this._cellCount,
                _animationType: this._animationType,
                _cellNumber: this._cellNumber,
                result: result
            });
            return result;
        },
        set: function (value) {
            const beforeCellCount = this._cellCount;
            const newCellCount = value % this.getCellNumber();
            console.log('[PictureAnimation] cell setter:', {
                value: value,
                getCellNumber: this.getCellNumber(),
                newCellCount: newCellCount,
                beforeCellCount: beforeCellCount
            });
            if (this._cellCount !== newCellCount) {
                this._prevCellCount = this.cell;
                this._fadeDurationCount = this._fadeDuration;
            }
            this._cellCount = newCellCount;
            console.log('[PictureAnimation] cell setter完了:', '_cellCount:', this._cellCount);
        }
    });

    Game_Picture.prototype.getCellNumber = function () {
        switch (this._animationType) {
            case 3:
                return this._customArray.length;
            case 2:
                return (this._cellNumber - 1) * 2;
            case 1:
                return this._cellNumber;
            default:
                return this._cellNumber;
        }
    };

    const _Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function () {
        _Game_Picture_update.call(this);
        if (this.isFading()) {
            this.updateFading();
        } else if (this.hasAnimationFrame() && this.isActive()) {
            this.updateAnimationFrame();
        } else if (this._lastFrameCount > 0) {
            this._lastFrameCount--;
        }
    };

    Game_Picture.prototype.linkToVariable = function (variableNumber) {
        this._linkedVariable = variableNumber.clamp(1, $dataSystem.variables.length);
    };

    Game_Picture.prototype.setCompleteSwitchId = function (switchId) {
        this._completeSwitchId = switchId.clamp(0, $dataSystem.switches.length);
    };

    Game_Picture.prototype.completeSwitchId = function () {
        return this._completeSwitchId;
    };

    Game_Picture.prototype.updateAnimationFrame = function () {
        this._frameCount = (this._frameCount + 1) % this._frameNumber;
        if (this._frameCount === 0) {
            this.addCellCount();
            this.playCellSe();
            if (this.isEndFirstLoop() && !this._loopFlg) {
                this._animationFlg = false;
                this._lastFrameCount = this._frameNumber;
            }
        }
    };

    Game_Picture.prototype.isEndFirstLoop = function () {
        return this._cellCount === (param.returnToFirstCell ? 0 : this.getCellNumber() - 1);
    };

    Game_Picture.prototype.updateFading = function () {
        this._fadeDurationCount--;
        // フェード完了時に一時的な上書きを元に戻す
        if (this._fadeDurationCount <= 0 && this._restoreFadeDuration !== undefined) {
            this._fadeDuration = this._restoreFadeDuration;
            this._restoreFadeDuration = undefined;
            this._restoreFadeDurationAfter = undefined;
            console.log('[PictureAnimation] フェード時間を元に戻しました:', this._fadeDuration);
        }
    };

    Game_Picture.prototype.prevCellOpacity = function () {
        if (this._fadeDuration === 0) return 0;
        return this.opacity() / this._fadeDuration * this._fadeDurationCount;
    };

    Game_Picture.prototype.addCellCount = function () {
        this.cell = this._cellCount + 1;
    };

    Game_Picture.prototype.canAdvanceToNextCell = function () {
        const nextCellCount = this._cellCount + 1;
        const completeSwitchId = this.completeSwitchId();

        // 完了スイッチが設定されていない場合、常に進められる
        if (completeSwitchId === 0) {
            return true;
        }

        // Sprite_Pictureから次のセルが存在するかチェック
        if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._pictureSprites) {
            // 現在のピクチャに対応するスプライトを探す
            const pictureSprites = SceneManager._scene._spriteset._pictureSprites;
            for (let i = 0; i < pictureSprites.length; i++) {
                const sprite = pictureSprites[i];
                if (sprite && sprite.picture && sprite.picture() === this) {
                    if (sprite._bitmaps) {
                        const maxCellIndex = sprite._bitmaps.length - 1;
                        const nextCellExists = nextCellCount <= maxCellIndex && sprite._bitmaps[nextCellCount];
                        let nextCellReady = false;
                        if (nextCellExists) {
                            nextCellReady = sprite._bitmaps[nextCellCount].isReady();
                        }

                        // 次のセルが存在しない、または準備できていない場合、進めない
                        if (!nextCellExists || !nextCellReady) {
                            console.log('[PictureAnimation] 次のセルが存在しないため、完了スイッチをON:', completeSwitchId, 'currentCell:', this._cellCount, 'nextCell:', nextCellCount);
                            $gameSwitches.setValue(completeSwitchId, true);
                            return false;
                        }
                        return true;
                    }
                }
            }
        }

        // スプライトが見つからない場合、進められる（エラーを避けるため）
        return true;
    };

    Game_Picture.prototype.playCellSe = function () {
        const se = this._cellSes[this.cell + 1];
        if (se) {
            AudioManager.playSe(se);
        }
    };

    Game_Picture.prototype.setAnimationFrameInit = function (cellNumber, frameNumber, direction, fadeDuration, cellSes, startingCell) {
        startingCell = startingCell || 0;
        this._cellNumber = cellNumber;
        this._frameNumber = frameNumber;
        this._frameCount = 0;
        // startingCellを0ベースの範囲内に制限
        const clampedCell = Math.max(0, Math.min(startingCell, cellNumber - 1));
        this._cellCount = clampedCell;
        this._direction = direction;
        this._fadeDuration = fadeDuration;
        this._cellSes = cellSes || [];
        console.log('[PictureAnimation] setAnimationFrameInit完了:', {
            cellNumber: cellNumber,
            startingCell: startingCell,
            clampedCell: clampedCell,
            _cellCount: this._cellCount,
            direction: direction
        });
    };

    Game_Picture.prototype.startAnimationFrame = function (animationType, loopFlg, customArray) {
        this._animationType = animationType;
        this._customArray = customArray;
        this._animationFlg = true;
        this._loopFlg = loopFlg;
        if (this._cellNumber <= this._cellCount) {
            this._cellCount = this._cellNumber - 1;
        }
        this.playCellSe();
    };

    Game_Picture.prototype.stopAnimationFrame = function (forceFlg) {
        this._loopFlg = false;
        if (forceFlg) {
            this._animationFlg = false;
        }
    };

    Game_Picture.prototype.hasAnimationFrame = function () {
        return this._animationFlg;
    };

    Game_Picture.prototype.isFading = function () {
        return this._fadeDurationCount !== 0;
    };

    Game_Picture.prototype.isAnimationPlaying = function () {
        return this.hasAnimationFrame() || this.isFading() || this._lastFrameCount > 0;
    };

    Game_Picture.prototype.isNeedFade = function () {
        return this._fadeDuration !== 0;
    };

    Game_Picture.prototype.isActive = function () {
        return $gameScreen.isActivePicture(this);
    };

    //=============================================================================
    // Sprite_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    const _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function (pictureId) {
        this._prevSprite = null;
        _Sprite_Picture_initialize.apply(this, arguments);
    };

    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
        _Sprite_Picture_update.apply(this, arguments);
        const picture = this.picture();
        if (picture && picture.name()) {
            if (picture.isMulti() && !this._bitmaps) {
                this.loadAnimationBitmap();
            }
            if (this.isBitmapReady()) {
                this.updateAnimationFrame(this, picture.cell);
                if (picture.isNeedFade()) this.updateFading();
            }
        }
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function () {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        if (!this.picture()) {
            this._bitmaps = null;
            if (this._prevSprite) {
                this._prevSprite.bitmap = null;
            }
        }
    };

    Sprite_Picture.prototype.updateFading = function () {
        if (!this._prevSprite) {
            this.makePrevSprite();
        }
        if (!this._prevSprite.bitmap) {
            this.makePrevBitmap();
        }
        const picture = this.picture();
        if (picture.isFading()) {
            this._prevSprite.visible = true;
            this.updateAnimationFrame(this._prevSprite, picture.prevCellCount());
            this._prevSprite.opacity = picture.prevCellOpacity();
        } else {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.updateAnimationFrame = function (sprite, cellCount) {
        const picture = this.picture();
        const direction = picture.direction();
        const completeSwitchId = picture.completeSwitchId();
        console.log('[PictureAnimation] updateAnimationFrame:', {
            cellCount: cellCount,
            direction: direction,
            _bitmaps: !!this._bitmaps,
            _bitmapsLength: this._bitmaps ? this._bitmaps.length : 0,
            _bitmapsCellCount: this._bitmaps ? !!this._bitmaps[cellCount] : false,
            completeSwitchId: completeSwitchId
        });

        // 完了スイッチがONの場合、元のビットマップを使用して終了
        if (completeSwitchId > 0 && $gameSwitches.value(completeSwitchId)) {
            console.log('[PictureAnimation] 完了スイッチがONのため、元のビットマップを使用');
            if (this.bitmap && this.bitmap.isReady()) {
                sprite.bitmap = this.bitmap;
                sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
            }
            return;
        }

        switch (direction) {
            case 'number':
                // セル番号が範囲外かどうかをチェック
                const maxCellIndex = this._bitmaps ? this._bitmaps.length - 1 : 0;
                const isOutOfRange = cellCount < 0 || cellCount > maxCellIndex;
                // 範囲内の場合のみ、ビットマップの存在をチェック
                let isCellExists = false;
                let isCellReady = false;
                if (!isOutOfRange && this._bitmaps) {
                    isCellExists = !!this._bitmaps[cellCount];
                    if (isCellExists) {
                        isCellReady = this._bitmaps[cellCount].isReady();
                    }
                }

                // 存在しないセルにアクセスした場合、完了スイッチをONにする
                // ビットマップが存在しない、または存在するが準備できていない（ファイルが見つからない）場合
                const isCellNotAvailable = isOutOfRange || !isCellExists || (isCellExists && !isCellReady);

                if (isCellNotAvailable && completeSwitchId > 0) {
                    console.log('[PictureAnimation] 存在しないセルにアクセス。完了スイッチをON:', completeSwitchId, 'cellCount:', cellCount, 'maxCellIndex:', maxCellIndex, 'isCellExists:', isCellExists, 'isCellReady:', isCellReady);
                    $gameSwitches.setValue(completeSwitchId, true);
                    // スイッチをONにした後、元のビットマップを使用
                    if (this.bitmap && this.bitmap.isReady()) {
                        sprite.bitmap = this.bitmap;
                        sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
                    }
                    return;
                }

                // セル番号が範囲外の場合、範囲内に制限
                const safeCellCount = Math.max(0, Math.min(cellCount, maxCellIndex));

                if (isCellExists && isCellReady) {
                    sprite.bitmap = this._bitmaps[safeCellCount];
                    sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
                    console.log('[PictureAnimation] セル表示成功:', safeCellCount);
                } else {
                    // ビットマップが見つからない、または未準備の場合、元のビットマップを使用
                    console.warn('[PictureAnimation] セル', safeCellCount, 'のビットマップが見つかりませんまたは未準備。元のビットマップを使用');
                    if (this.bitmap && this.bitmap.isReady()) {
                        sprite.bitmap = this.bitmap;
                        sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
                    }
                }
                break;
            case 'vertical':
                const height = sprite.bitmap.height / this.picture().cellNumber();
                const y = cellCount * height;
                sprite.setFrame(0, y, sprite.bitmap.width, height);
                break;
            case 'horizon':
                const width = sprite.bitmap.width / this.picture().cellNumber();
                const x = cellCount * width;
                sprite.setFrame(x, 0, width, sprite.bitmap.height);
                break;
            default:
                sprite.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    };

    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function () {
        _Sprite_Picture_loadBitmap.apply(this, arguments);
        this._bitmapReady = false;
        this._bitmaps = null;
        if (this._prevSprite) {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.loadAnimationBitmap = function () {
        const cellNumber = this.picture().cellNumber();
        console.log('[PictureAnimation] loadAnimationBitmap開始:', {
            _pictureName: this._pictureName,
            cellNumber: cellNumber
        });
        // 元のファイル名から数字部分を抽出してベース名を取得
        const match = this._pictureName.match(/^(.+?)_(\d+)$/);
        let baseName = this._pictureName;
        let cellDigit = cellNumber.toString().length;
        let startIndex = 0;

        if (match) {
            // ファイル名が _数字 で終わる場合（例: HCG01_008）
            baseName = match[1] + '_';
            // 実際のファイル名の数字部分の桁数を取得
            cellDigit = match[2].length;
            // 元のファイルのセル番号を取得（0ベース）
            startIndex = parseInt(match[2], 10);
            console.log('[PictureAnimation] ファイル名マッチ:', {
                baseName: baseName,
                cellDigit: cellDigit,
                startIndex: startIndex
            });
        } else {
            // ファイル名が _数字 で終わらない場合、従来の方法を使用
            baseName = this._pictureName.substr(0, this._pictureName.length - cellDigit);
            console.log('[PictureAnimation] ファイル名マッチなし、従来の方法:', baseName);
        }

        // _bitmaps配列を初期化（全セル分のサイズを確保）
        // 存在しないセルはundefinedのままでも問題ない
        this._bitmaps = new Array(cellNumber);
        // 元のファイルを適切なインデックスに配置
        this._bitmaps[startIndex] = this.bitmap;
        console.log('[PictureAnimation] _bitmaps初期化:', {
            length: this._bitmaps.length,
            startIndex: startIndex,
            bitmapSet: !!this._bitmaps[startIndex]
        });

        // 残りのセルを読み込む（存在しないファイルでもエラーにならない）
        for (let i = 0; i < cellNumber; i++) {
            if (i !== startIndex) {
                const filename = baseName + i.padZero(cellDigit);
                // ファイル存在チェックを行う（暗号化ファイル .png_ にも対応）
                if (Utils.isNwjs()) {
                    const fs = require('fs');
                    const path = require('path');
                    const base = path.dirname(process.mainModule.filename);
                    // 通常のpngファイルと暗号化ファイル(.png_)の両方をチェック
                    const filePath = path.join(base, 'img/pictures/', filename + '.png');
                    const encryptedFilePath = path.join(base, 'img/pictures/', filename + '.png_');
                    if (!fs.existsSync(filePath) && !fs.existsSync(encryptedFilePath)) {
                        /* console.warn('[PictureAnimation] ファイルが存在しないため読み込みをスキップ:', filePath); */
                        continue;
                    }
                }
                console.log('[PictureAnimation] セル読み込み:', i, '->', filename);
                // ImageManager.loadPictureは暗号化ファイルにも対応している
                this._bitmaps[i] = ImageManager.loadPicture(filename);
            }
        }
        this._bitmapReady = false;
        console.log('[PictureAnimation] loadAnimationBitmap完了');
    };

    Sprite_Picture.prototype.makePrevSprite = function () {
        this._prevSprite = new Sprite();
        this._prevSprite.visible = false;
        this.addChild(this._prevSprite);
    };

    Sprite_Picture.prototype.makePrevBitmap = function () {
        this._prevSprite.bitmap = this.bitmap;
        this._prevSprite.anchor.x = this.anchor.x;
        this._prevSprite.anchor.y = this.anchor.y;
    };

    Sprite_Picture.prototype.isBitmapReady = function () {
        if (!this.bitmap) return false;
        if (this._bitmapReady) return true;
        let result;
        if (this.picture().isMulti()) {
            // 存在するビットマップ（undefinedでないもの）が準備できていればOK
            // 存在しないセルのビットマップは無視する
            result = this._bitmaps && this._bitmaps.some(function (bitmap) {
                return bitmap && bitmap.isReady();
            });
            // 少なくとも1つのビットマップが準備できていればOK
            if (!result && this.bitmap && this.bitmap.isReady()) {
                // 元のビットマップが準備できていればOK
                result = true;
            }
        } else {
            result = this.bitmap.isReady();
        }
        this._bitmapReady = result;
        return result;
    };
})();
