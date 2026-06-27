//=============================================================================
// MoviePicture.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.3.1 2025/04/12 The play() request was interrupted by a call to pause()のエラー抑制
// 2.3.0 2025/02/19 プラグインコマンドの動画ファイル指定で@fileに対応
// 2.2.2 2024/09/15 敵キャラを動画表示する機能で、敵キャラの変身に対応できていなかった問題を修正
// 2.2.1 2024/09/11 サブファオルダに配置された動画ファイルを再生できない問題を修正
// 2.2.0 2022/03/10 敵キャラを動画にできる機能を追加
// 2.1.0 2021/08/15 2.0.3の修正により動画音量種別をnoneにするとエラーになっていた問題を修正
//                  動画ファイルの再生でファイル名に制御文字を使えるよう修正
// 2.0.3 2021/07/31 動画音量種別に指定した項目のボリュームを0にしたとき、音量100で再生されてしまう問題を修正
// 2.0.2 2020/09/13 ヘルプ微修正
// 2.0.1 2020/09/13 ヘルプ微修正
// 2.0.0 2020/09/13 MZで動作するよう全面的に改修
// 1.7.1 2019/08/26 他のプラグインとの組み合わせによりエラーになる可能性のある記述を修正
// 1.7.0 2019/06/30 動画の取得元フォルダと拡張子を変更して動画を難読化できるようにしました。
// 1.6.0 2019/06/29 複数の動画を並行してロードしているときは、すべての動画のロードが完了してから再生するよう変更しました
//                  一定フレームで動画を中断させるコマンドを追加
// 1.5.1 2019/06/29 画面遷移したとき、動画でないピクチャまで非表示になってしまう問題を修正
// 1.5.0 2019/06/11 動画再生終了後、動画ピクチャを自動削除せず最終フレームで静止したままにする機能を追加
// 1.4.1 2019/05/21 動画を縮小表示したときのジャギを軽減
//                  ヘルプの記載を本体バージョン1.6を前提に修正
// 1.4.0 2019/01/06 movieフォルダ以外の場所に配置されている動画ファイルを再生できる機能を追加
// 1.3.3 2018/11/08 再生開始直後に停止したとき、特定条件下で正常に停止しない問題を修正
// 1.3.2 2018/06/17 ピクチャの消去によって動画再生を終了した場合に、再生速度と音量が初期化されない問題を修正
// 1.3.1 2017/08/27 二連続で再生したときに動画の音量同期機能が正常に動作しない問題を修正
// 1.3.0 2017/08/26 動画の音量をいずれかのオーディオ音量と同期させる機能を追加
// 1.2.0 2017/08/18 動画の再生速度(倍率)を変更できるプラグインコマンドを追加
// 1.1.0 2017/08/09 アルファチャンネル付き動画の再生に対応（ただし特定の手順を踏む必要あり）
// 1.0.3 2017/08/08 エラー処理を追加
// 1.0.2 2017/08/07 環境に関する制約を追加
// 1.0.1 2017/08/07 リファクタリング（仕様の変更はなし）
// 1.0.0 2017/08/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 動画のピクチャ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MoviePicture.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param movieVolumeType
 * @text 動画音量種別
 * @desc 動画再生時に音声が含まれる場合、その音量を参照するオーディオ種別です。指定しない場合、常に100%で再生されます。
 * @default none
 * @type select
 * @option none
 * @option BGM
 * @option BGS
 * @option ME
 * @option SE
 *
 * @param autoEraseOnEnd
 * @text 終了時自動削除
 * @desc 動画再生終了時に動画ピクチャを自動で削除します。削除しない場合、動画は最終フレームで静止します。
 * @default true
 * @type boolean
 *
 * @param webmExt
 * @text webm偽装拡張子
 * @desc webm形式を再生するときの偽装拡張子です。難読化したい場合に指定します。対応フォーマットが増えるわけではありません。
 * @default
 *
 * @param mp4Ext
 * @text mp4偽装拡張子
 * @desc mp4形式を再生するときの偽装拡張子です。難読化したい場合に指定します。対応フォーマットが増えるわけではありません。
 * @default
 *
 * @param seamlessPictureStart
 * @text シームレス再生ピクチャ開始番号
 * @desc シームレス動画再生で使用するピクチャ番号の開始値です。
 * @default 11
 * @type number
 *
 * @param seamlessPictureEnd
 * @text シームレス再生ピクチャ終了番号
 * @desc シームレス動画再生で使用するピクチャ番号の終了値です。
 * @default 29
 * @type number
 *
 * @param seamlessDefaultX
 * @text シームレス再生表示位置X
 * @desc シームレス動画再生時のX座標です。
 * @default 0
 * @type number
 *
 * @param seamlessDefaultY
 * @text シームレス再生表示位置Y
 * @desc シームレス動画再生時のY座標です。
 * @default 0
 * @type number
 *
 * @command PREPARE
 * @text ピクチャ動画準備
 * @desc 指定した動画ファイルをピクチャ動画として準備します。
 *
 * @arg fileName
 * @text ファイル名
 * @desc 再生する動画ファイルです。『movies』フォルダ以下の動画ファイルを拡張子無しで入力します。
 * @default
 * @type file
 * @dir movies
 *
 * @arg loop
 * @text ループ
 * @desc 有効にすると動画をループ再生します。
 * @default false
 * @type boolean
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg reload
 * @text 再読み込み
 * @desc 同一番号のピクチャに対して同一の動画を表示しようとしたときに、最初から再生し直します。
 * @default false
 * @type boolean
 *
 * @arg autoplay
 * @text 自動再生
 * @desc 読み込み完了と同時に再生を開始します。無効にした場合、プラグインコマンドから手動再生します。
 * @default true
 * @type boolean
 *
 * @arg finishSwitch
 * @text 再生終了スイッチ
 * @desc 動画の再生が終了したタイミングでONになるスイッチです。ループ再生の場合は、1ループした時点でONになります。
 * @default 0
 * @type switch
 *
 * @command PAUSE
 * @text 一時停止
 * @desc 再生中の動画を一時停止します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command PLAY
 * @text 再生
 * @desc 動作の再生を開始します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command WAIT
 * @text 完了までウェイト
 * @desc 動作の再生が完了するまでイベントの進行を待機します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command SET_VOLUME
 * @text 音量設定
 * @desc 動画の音量を設定します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @command SET_RATE
 * @text 再生倍率設定
 * @desc 動画の再生倍率を設定します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg rate
 * @text 再生倍率
 * @desc 動画の再生倍率です。
 * @default 100
 * @type number
 *
 * @command PRELOAD_RANGE
 * @text 連番動画のプリロード
 * @desc 指定した範囲の連番動画をメモリ上に読み込み、キャッシュします。
 *
 * @arg baseName
 * @text ファイル名（ベース）
 * @desc 連番の元となるファイル名です。数字部分は除いて指定します。
 * @default
 *
 * @arg start
 * @text 開始番号
 * @desc 連番の開始番号です。
 * @default 1
 * @type number
 *
 * @arg end
 * @text 終了番号
 * @desc 連番の終了番号です。
 * @default 1
 * @type number
 *
 * @arg digits
 * @text 桁数
 * @desc 連番の桁数です。数字が指定桁数になるよう0埋めされます。0の場合はそのまま連結します。
 * @default 3
 * @type number
 *
 * @command PLAY_INDEX
 * @text 連番動画の再生
 * @desc 連番動画の中から指定したインデックスの動画を再生準備します。（別途ピクチャの表示が必要）
 *
 * @arg baseName
 * @text ファイル名（ベース）
 * @desc 連番の元となるファイル名です。プリロード時と同じものを指定します。
 * @default
 *
 * @arg index
 * @text インデックス
 * @desc 再生する連番のインデックスです。
 * @default 1
 * @type number
 *
 * @arg digits
 * @text 桁数
 * @desc 連番の桁数です。数字が指定桁数になるよう0埋めされます。0の場合はそのまま連結します。
 * @default 3
 * @type number
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 20
 * @type number
 *
 * @arg loop
 * @text ループ
 * @desc 有効にすると動画をループ再生します。
 * @default false
 * @type boolean
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg autoplay
 * @text 自動再生
 * @desc 読み込み完了と同時に再生を開始します。無効にした場合、プラグインコマンドから手動再生します。
 * @default true
 * @type boolean
 *
 * @arg finishSwitch
 * @text 再生終了スイッチ
 * @desc 動画の再生が終了したタイミングでONになるスイッチです。ループ再生の場合は、1ループした時点でONになります。
 * @default 0
 * @type switch
 *
 * @command PLAY_SEQUENCE
 * @text 連番動画の連続再生
 * @desc 動画1を再生後、動画2に切り替えて再生します。動画1はループなしで再生されます。
 *
 * @arg index1
 * @text 動画1のインデックス
 * @desc 最初に再生する動画のインデックスです。
 * @default 1
 * @type number
 *
 * @arg index2
 * @text 動画2のインデックス
 * @desc 動画1終了後に再生する動画のインデックスです。
 * @default 2
 * @type number
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 20
 * @type number
 *
 * @arg loop2
 * @text 動画2のループ
 * @desc 動画2をループ再生するかどうかです。
 * @default true
 * @type boolean
 *
 * @arg transitionWait
 * @text 切り替え時のウェイト
 * @desc 動画1終了から動画2開始までのウェイト（フレーム数）。0で瞬時に切り替えます。
 * @default 0
 * @type number
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @command PLAY_SEAMLESS
 * @text 連番動画のシームレス再生
 * @desc プラグイン内でピクチャ表示を自動化し、シームレスに動画を再生します。前の動画は自動停止されます。
 *
 * @arg index
 * @text インデックス
 * @desc 再生する連番のインデックスです。
 * @default 1
 * @type number
 *
 * @arg loop
 * @text ループ
 * @desc 有効にすると動画をループ再生します。
 * @default false
 * @type boolean
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg fadeIn
 * @text フェードイン
 * @desc 有効にすると動画表示時にフェードインします。
 * @default false
 * @type boolean
 *
 * @arg fadeInDuration
 * @text フェードイン時間
 * @desc フェードインにかけるフレーム数です。
 * @default 30
 * @type number
 *
 * @arg waitForEnd
 * @text 再生終了までウェイト
 * @desc ループOFFの場合、動画の再生が終了するまでイベントの進行を待機します。
 * @default false
 * @type boolean
 *
 * @command STOP_SEAMLESS
 * @text 連番動画のシームレス停止
 * @desc 現在再生中のシームレス動画を停止します。
 *
 * @arg fadeOut
 * @text フェードアウト
 * @desc 有効にすると動画停止時にフェードアウトします。
 * @default false
 * @type boolean
 *
 * @arg fadeOutDuration
 * @text フェードアウト時間
 * @desc フェードアウトにかけるフレーム数です。
 * @default 30
 * @type number
 *
 * @command CLEAR_VIDEO_CACHE
 * @text 動画キャッシュのクリア
 * @desc プリロードされたすべての動画をメモリから解放します。
 *
 * @command PLAY_SEAMLESS_SEQUENCE
 * @text シームレス連続再生
 * @desc 動画1を再生後、動画2にシームレスに切り替えて再生します。ピクチャ表示は自動化されます。
 *
 * @arg index1
 * @text 動画1のインデックス
 * @desc 最初に再生する動画のインデックスです（ループなし）。
 * @default 1
 * @type number
 *
 * @arg index2
 * @text 動画2のインデックス
 * @desc 動画1終了後に再生する動画のインデックスです。
 * @default 2
 * @type number
 *
 * @arg loop2
 * @text 動画2のループ
 * @desc 動画2をループ再生するかどうかです。
 * @default true
 * @type boolean
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg fadeIn
 * @text フェードイン
 * @desc 有効にすると動画1の表示時にフェードインします。
 * @default false
 * @type boolean
 *
 * @arg fadeInDuration
 * @text フェードイン時間
 * @desc フェードインにかけるフレーム数です。
 * @default 30
 * @type number
 *
 * @arg transitionWait
 * @text 切り替え時のウェイト
 * @desc 動画1終了から動画2開始までのウェイト（フレーム数）。0で瞬時に切り替えます。
 * @default 0
 * @type number
 *
 * @command PLAY_GALLERY
 * @text 動画ギャラリー再生
 * @desc プリロードした動画を1から最後まで順番に再生します。決定キーで次へ、キャンセルキーで終了。
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg noLoopIndices
 * @text ループ無効の動画番号
 * @desc ループ再生しない動画のインデックスをカンマ区切りで指定（例: 1,2,4）
 * @default
 * @type string
 *
 * @arg fadeIn
 * @text フェードイン
 * @desc 有効にすると各動画の表示時にフェードインします。
 * @default false
 * @type boolean
 *
 * @arg fadeInDuration
 * @text フェードイン時間
 * @desc フェードインにかけるフレーム数です。
 * @default 30
 * @type number
 *
 * @help ピクチャの表示枠を使って動画を再生します。
 * ピクチャの移動や回転、色調変更による処理の対象になるほか、
 * 複数の動画の並行再生が可能になります。
 * また、動画がウィンドウの下に表示されるようになります。
 *
 * 『ピクチャ動画準備』のコマンド実行後に、ファイルを空にして
 * イベントコマンド『ピクチャの表示』を実行してください。
 *
 * このプラグインは、ローカル実行(Game.exe)のみをサポート対象とします。
 * Webブラウザでも動作する可能性はありますが、自己責任でご利用ください。
 *
 * ピクチャ同様、敵キャラを動画表示できます。
 * 敵キャラのメモ欄に以下の通り設定してください。
 *
 * // 動画[aaa]を敵キャラ画像の代わりに表示します。
 * <動画:aaa>
 * <Movie:aaa>
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * We will create an English version when it works well.
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

    PluginManagerEx.registerCommand(script, 'PREPARE', args => {
        $gameScreen.setVideoPicture(args);
    });

    PluginManagerEx.registerCommand(script, 'PAUSE', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoPause(true);
        }
    });

    PluginManagerEx.registerCommand(script, 'PLAY', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoPause(false);
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_VOLUME', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoVolume(args.volume);
        }
    });

    PluginManagerEx.registerCommand(script, 'WAIT', function (args) {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoWait(true);
            this._waitMode = 'videoPicture';
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_RATE', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoSpeed(args.rate);
        }
    });

    PluginManagerEx.registerCommand(script, 'PRELOAD_RANGE', args => {
        const start = args.start;
        const end = args.end;
        const digits = args.digits;
        const baseName = args.baseName;
        // baseNameとdigitsを保存（PLAY_INDEXで省略可能にするため）
        $gameScreen._lastPreloadBaseName = baseName;
        $gameScreen._lastPreloadDigits = digits;
        // start/endも保存（ギャラリー機能用）
        $gameScreen._lastPreloadStart = start;
        $gameScreen._lastPreloadEnd = end;
        for (let i = start; i <= end; i++) {
            const fileName = baseName + String(i).padStart(digits, '0');
            ImageManager.reserveVideo(fileName);
        }
    });

    PluginManagerEx.registerCommand(script, 'PLAY_INDEX', args => {
        const index = args.index;
        // baseNameとdigitsは省略可能（PRELOAD_RANGEで保存した値を使用）
        const digits = args.digits || $gameScreen._lastPreloadDigits || 3;
        const baseName = args.baseName || $gameScreen._lastPreloadBaseName || '';
        const fileName = baseName + String(index).padStart(digits, '0');
        const videoArgs = {
            fileName: fileName,
            loop: args.loop,
            smooth: args.smooth,
            volume: args.volume,
            autoplay: args.autoplay,
            finishSwitch: args.finishSwitch,
            reload: false
        };
        $gameScreen.setVideoPicture(videoArgs);
    });

    PluginManagerEx.registerCommand(script, 'PLAY_SEQUENCE', function (args) {
        const digits = $gameScreen._lastPreloadDigits || 3;
        const baseName = $gameScreen._lastPreloadBaseName || '';
        const index1 = args.index1;
        const index2 = args.index2;
        const pictureId = args.pictureId;
        const loop2 = args.loop2;
        const transitionWait = args.transitionWait || 0;
        const smooth = args.smooth;
        const volume = args.volume;

        // 動画1の設定（ループなし）
        const fileName1 = baseName + String(index1).padStart(digits, '0');
        const videoArgs1 = {
            fileName: fileName1,
            loop: false,
            smooth: smooth,
            volume: volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };
        $gameScreen.setVideoPicture(videoArgs1);

        // 連続再生情報を保存
        $gameScreen._videoSequence = {
            index2: index2,
            pictureId: pictureId,
            loop2: loop2,
            transitionWait: transitionWait,
            smooth: smooth,
            volume: volume,
            baseName: baseName,
            digits: digits
        };
    });

    // シームレス再生コマンド
    PluginManagerEx.registerCommand(script, 'PLAY_SEAMLESS', function (args) {
        const digits = $gameScreen._lastPreloadDigits || 3;
        const baseName = $gameScreen._lastPreloadBaseName || '';
        const index = args.index;
        const fileName = baseName + String(index).padStart(digits, '0');

        // 前の動画のピクチャ番号を保存
        const previousPictureId = $gameScreen._currentSeamlessPictureId;

        // 次に使うピクチャ番号を取得（先に取得）
        const pictureId = $gameScreen.getNextSeamlessPictureId();
        if (pictureId === null) {
            console.warn('MoviePicture: シームレス再生用のピクチャ番号が不足しています。');
            return;
        }

        // 動画設定
        const videoArgs = {
            fileName: fileName,
            loop: args.loop,
            smooth: args.smooth,
            volume: args.volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };
        $gameScreen.setVideoPicture(videoArgs);

        // ピクチャを自動表示（新しい動画を先に表示）
        const x = param.seamlessDefaultX || 0;
        const y = param.seamlessDefaultY || 0;
        const initialOpacity = args.fadeIn ? 0 : 255;
        $gameScreen.showPicture(pictureId, '', 0, x, y, 100, 100, initialOpacity, 0);

        // 現在のシームレス再生ピクチャ番号を保存
        $gameScreen._currentSeamlessPictureId = pictureId;

        // フェードイン処理
        if (args.fadeIn) {
            const duration = args.fadeInDuration || 30;
            $gameScreen.movePicture(pictureId, 0, x, y, 100, 100, 255, 0, duration);
        }

        // 前の動画を遅延消去（新しい動画が描画される時間を確保）
        if (previousPictureId) {
            $gameScreen.addSeamlessDelayedErase(previousPictureId, 3);
        }

        // ループOFFかつウェイト指定時は再生終了まで待機
        if (args.waitForEnd && !args.loop) {
            const picture = $gameScreen.picture(pictureId);
            if (picture) {
                picture.setVideoWait(true);
                this._waitMode = 'videoPicture';
            }
        }
    });

    // シームレス停止コマンド
    PluginManagerEx.registerCommand(script, 'STOP_SEAMLESS', args => {
        const pictureId = $gameScreen._currentSeamlessPictureId;
        if (!pictureId) return;

        if (args.fadeOut) {
            const duration = args.fadeOutDuration || 30;
            const x = param.seamlessDefaultX || 0;
            const y = param.seamlessDefaultY || 0;
            $gameScreen.movePicture(pictureId, 0, x, y, 100, 100, 0, 0, duration);
            // フェードアウト完了後に消去
            $gameScreen._seamlessFadeOutInfo = {
                pictureId: pictureId,
                remainingFrames: duration
            };
        } else {
            $gameScreen.erasePicture(pictureId);
        }
        $gameScreen._currentSeamlessPictureId = null;
    });

    // 動画キャッシュクリアコマンド
    PluginManagerEx.registerCommand(script, 'CLEAR_VIDEO_CACHE', args => {
        ImageManager.clearVideoCache();
    });

    // 動画ギャラリー再生コマンド
    PluginManagerEx.registerCommand(script, 'PLAY_GALLERY', function (args) {
        const digits = $gameScreen._lastPreloadDigits || 3;
        const baseName = $gameScreen._lastPreloadBaseName || '';
        const startIndex = $gameScreen._lastPreloadStart || 1;
        const endIndex = $gameScreen._lastPreloadEnd || 1;

        // ループ無効の動画番号をパース
        let noLoopSet = new Set();
        if (args.noLoopIndices) {
            const indices = args.noLoopIndices.split(',').map(s => parseInt(s.trim(), 10));
            noLoopSet = new Set(indices.filter(n => !isNaN(n)));
        }

        // ギャラリー状態を保存
        $gameScreen._videoGallery = {
            baseName: baseName,
            digits: digits,
            startIndex: startIndex,
            currentIndex: startIndex,
            endIndex: endIndex,
            smooth: args.smooth,
            volume: args.volume,
            noLoopSet: noLoopSet,
            fadeIn: args.fadeIn,
            fadeInDuration: args.fadeInDuration || 30,
            active: true
        };

        // 最初の動画を再生
        this._playGalleryVideo($gameScreen._videoGallery);

        // ギャラリーモードでウェイト
        this._waitMode = 'videoGallery';
    });

    // シームレス連続再生コマンド
    PluginManagerEx.registerCommand(script, 'PLAY_SEAMLESS_SEQUENCE', args => {
        const digits = $gameScreen._lastPreloadDigits || 3;
        const baseName = $gameScreen._lastPreloadBaseName || '';
        const index1 = args.index1;
        const index2 = args.index2;
        const fileName1 = baseName + String(index1).padStart(digits, '0');

        // 前の動画のピクチャ番号を保存
        const previousPictureId = $gameScreen._currentSeamlessPictureId;

        // 次に使うピクチャ番号を取得（先に取得）
        const pictureId = $gameScreen.getNextSeamlessPictureId();
        if (pictureId === null) {
            console.warn('MoviePicture: シームレス再生用のピクチャ番号が不足しています。');
            return;
        }

        // 動画1の設定（ループなし）
        const videoArgs1 = {
            fileName: fileName1,
            loop: false,
            smooth: args.smooth,
            volume: args.volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };
        $gameScreen.setVideoPicture(videoArgs1);

        // ピクチャを自動表示（新しい動画を先に表示）
        const x = param.seamlessDefaultX || 0;
        const y = param.seamlessDefaultY || 0;
        const initialOpacity = args.fadeIn ? 0 : 255;
        $gameScreen.showPicture(pictureId, '', 0, x, y, 100, 100, initialOpacity, 0);

        // 現在のシームレス再生ピクチャ番号を保存
        $gameScreen._currentSeamlessPictureId = pictureId;

        // フェードイン処理
        if (args.fadeIn) {
            const duration = args.fadeInDuration || 30;
            $gameScreen.movePicture(pictureId, 0, x, y, 100, 100, 255, 0, duration);
        }

        // 前の動画を遅延消去（新しい動画が描画される時間を確保）
        if (previousPictureId) {
            $gameScreen.addSeamlessDelayedErase(previousPictureId, 3);
        }

        // 連続再生情報を保存（動画1終了時に動画2へ切り替え）
        $gameScreen._seamlessSequence = {
            index2: index2,
            pictureId: pictureId,
            loop2: args.loop2,
            transitionWait: args.transitionWait || 0,
            smooth: args.smooth,
            volume: args.volume,
            baseName: baseName,
            digits: digits
        };
    });

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'videoPicture') {
            const waiting = $gameScreen.isVideoWaiting();
            if (!waiting) {
                this._waitMode = '';
            }
            return waiting;
        } else if (this._waitMode === 'videoGallery') {
            return this._updateVideoGallery();
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    // ギャラリーモードの更新処理
    Game_Interpreter.prototype._updateVideoGallery = function () {
        const gallery = $gameScreen._videoGallery;
        if (!gallery || !gallery.active) {
            this._endVideoGallery();
            return false;
        }

        // キャンセルボタン判定
        if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this._endVideoGallery();
            return false;
        }

        // ループなし動画の再生終了判定（自動で次へ進む）
        const isNoLoop = gallery.noLoopSet.has(gallery.currentIndex);
        if (isNoLoop) {
            const pictureId = $gameScreen._currentSeamlessPictureId;
            if (pictureId) {
                const spriteset = SceneManager._scene._spriteset;
                if (spriteset) {
                    const sprite = spriteset._pictureContainer.children.find(
                        s => s instanceof Sprite_Picture && s._pictureId === pictureId
                    );
                    if (sprite && sprite.bitmap && sprite.bitmap.isEnded()) {
                        if (gallery.currentIndex < gallery.endIndex) {
                            gallery.currentIndex++;
                            this._playGalleryVideo(gallery);
                            return true;
                        } else {
                            // 最後の動画だったので終了
                            this._endVideoGallery();
                            return false;
                        }
                    }
                }
            }
        }

        // 決定ボタン or カーソル右で次の動画へ
        if (Input.isTriggered('ok') || Input.isTriggered('right') || TouchInput.isTriggered()) {
            if (gallery.currentIndex < gallery.endIndex) {
                gallery.currentIndex++;
                this._playGalleryVideo(gallery);
            } else {
                // 最後の動画だったので終了
                this._endVideoGallery();
                return false;
            }
        }

        // カーソル左で前の動画へ
        if (Input.isTriggered('left')) {
            if (gallery.currentIndex > gallery.startIndex) {
                gallery.currentIndex--;
                this._playGalleryVideo(gallery);
            }
        }

        return true;
    };

    // ギャラリー用の動画再生
    Game_Interpreter.prototype._playGalleryVideo = function (gallery) {
        const fileName = gallery.baseName + String(gallery.currentIndex).padStart(gallery.digits, '0');
        const loop = !gallery.noLoopSet.has(gallery.currentIndex);

        // 前の動画のピクチャ番号を保存
        const previousPictureId = $gameScreen._currentSeamlessPictureId;

        // 次に使うピクチャ番号を取得
        const pictureId = $gameScreen.getNextSeamlessPictureId();
        if (pictureId === null) {
            console.warn('MoviePicture: シームレス再生用のピクチャ番号が不足しています。');
            return;
        }

        // 動画設定
        const videoArgs = {
            fileName: fileName,
            loop: loop,
            smooth: gallery.smooth,
            volume: gallery.volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };
        $gameScreen.setVideoPicture(videoArgs);

        // ピクチャを自動表示
        const x = param.seamlessDefaultX || 0;
        const y = param.seamlessDefaultY || 0;
        const initialOpacity = gallery.fadeIn ? 0 : 255;
        $gameScreen.showPicture(pictureId, '', 0, x, y, 100, 100, initialOpacity, 0);

        // 現在のシームレス再生ピクチャ番号を保存
        $gameScreen._currentSeamlessPictureId = pictureId;

        // フェードイン処理
        if (gallery.fadeIn) {
            const duration = gallery.fadeInDuration || 30;
            $gameScreen.movePicture(pictureId, 0, x, y, 100, 100, 255, 0, duration);
        }

        // 前の動画を遅延消去
        if (previousPictureId) {
            $gameScreen.addSeamlessDelayedErase(previousPictureId, 3);
        }
    };

    // ギャラリー終了処理
    Game_Interpreter.prototype._endVideoGallery = function () {
        const gallery = $gameScreen._videoGallery;
        if (gallery) {
            gallery.active = false;
        }
        $gameScreen._videoGallery = null;

        // 現在の動画を停止
        const pictureId = $gameScreen._currentSeamlessPictureId;
        if (pictureId) {
            $gameScreen.erasePicture(pictureId);
            $gameScreen._currentSeamlessPictureId = null;
        }

        this._waitMode = '';
    };

    //=============================================================================
    // Game_Screen
    //  動画ピクチャを準備します。
    //=============================================================================
    Game_Screen.prototype.setVideoPicture = function (args) {
        this._videoPicture = args;
    };

    Game_Screen.prototype.getVideoPicture = function () {
        return this._videoPicture;
    };

    Game_Screen.prototype.clearVideoPicture = function () {
        this._videoPicture = null;
    };

    Game_Screen.prototype.isVideoWaiting = function () {
        return this._pictures.some(function (picture) {
            return picture && picture.isVideoWait();
        });
    };

    // 連続再生のウェイト処理
    const _Game_Screen_update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
        _Game_Screen_update.apply(this, arguments);
        this.updateVideoSequenceWait();
    };

    Game_Screen.prototype.updateVideoSequenceWait = function () {
        if (this._videoSequenceWait > 0) {
            this._videoSequenceWait--;
            if (this._videoSequenceWait <= 0 && this._videoSequencePending) {
                const pending = this._videoSequencePending;
                this._videoSequencePending = null;
                // Sprite_Pictureを探して切り替えを実行
                const spriteset = SceneManager._scene._spriteset;
                if (spriteset) {
                    const sprite = spriteset._pictureContainer.children.find(
                        s => s instanceof Sprite_Picture && s._pictureId === pending.pictureId
                    );
                    if (sprite) {
                        // useNewPictureフラグがある場合は新しいピクチャ番号を使用（フラッシュ防止）
                        if (pending.useNewPicture) {
                            sprite._switchToNextVideoSeamless(pending.videoArgs, pending.pictureId);
                        } else {
                            sprite._switchToNextVideo(pending.videoArgs);
                        }
                    }
                }
            }
        }
        // フェードアウト完了後のピクチャ消去
        if (this._seamlessFadeOutInfo) {
            this._seamlessFadeOutInfo.remainingFrames--;
            if (this._seamlessFadeOutInfo.remainingFrames <= 0) {
                this.erasePicture(this._seamlessFadeOutInfo.pictureId);
                this._seamlessFadeOutInfo = null;
            }
        }
        // シームレス切り替え時の遅延消去処理（配列で複数管理）
        if (this._seamlessDelayedEraseList && this._seamlessDelayedEraseList.length > 0) {
            for (let i = this._seamlessDelayedEraseList.length - 1; i >= 0; i--) {
                const item = this._seamlessDelayedEraseList[i];
                item.remainingFrames--;
                if (item.remainingFrames <= 0) {
                    this.erasePicture(item.pictureId);
                    this._seamlessDelayedEraseList.splice(i, 1);
                }
            }
        }
    };

    // シームレス再生用のピクチャ番号管理
    Game_Screen.prototype.getNextSeamlessPictureId = function () {
        const start = param.seamlessPictureStart || 11;
        const end = param.seamlessPictureEnd || 29;
        // 次に使うピクチャ番号を循環で取得
        if (!this._seamlessPictureIndex) {
            this._seamlessPictureIndex = start;
        } else {
            this._seamlessPictureIndex++;
            if (this._seamlessPictureIndex > end) {
                this._seamlessPictureIndex = start;
            }
        }
        return this._seamlessPictureIndex;
    };

    // 現在のシームレス動画を停止（内部用）
    Game_Screen.prototype.stopCurrentSeamlessVideo = function () {
        const pictureId = this._currentSeamlessPictureId;
        if (pictureId) {
            // 前の動画を即座に消去（フェードなし）
            this.erasePicture(pictureId);
            this._currentSeamlessPictureId = null;
        }
    };

    // 遅延消去を配列に追加
    Game_Screen.prototype.addSeamlessDelayedErase = function (pictureId, delayFrames) {
        if (!this._seamlessDelayedEraseList) {
            this._seamlessDelayedEraseList = [];
        }
        this._seamlessDelayedEraseList.push({
            pictureId: pictureId,
            remainingFrames: delayFrames
        });
    };

    //=============================================================================
    // Game_Picture
    //  動画ピクチャに関連するプロパティを追加定義します。
    //=============================================================================
    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function (name, origin, x, y, scaleX,
        scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        const video = $gameScreen.getVideoPicture();
        if (video && !name) {
            this.showVideo(video)
        } else {
            this._video = false;
        }
    };

    Game_Picture.prototype.showVideo = function (video) {
        this._videoReload = video.reload;
        this._name = PluginManagerEx.convertEscapeCharacters(video.fileName);
        this._videoLoop = video.loop;
        this._videoSmooth = video.smooth;
        this._videoFinishSwitch = video.finishSwitch;
        if (this._videoFinishSwitch) {
            $gameSwitches.setValue(this._videoFinishSwitch, false);
        }
        this._video = true;
        this._ended = false;
        this.setVideoVolume(video.volume || 0);
        this.setVideoPause(!video.autoplay);
        $gameScreen.clearVideoPicture();
    };

    Game_Picture.prototype.onFinishVideo = function () {
        if (this.isVideoWait()) {
            this.setVideoWait(false);
        }
        if (this._videoFinishSwitch) {
            $gameSwitches.setValue(this._videoFinishSwitch, true);
        }
    };

    Game_Picture.prototype.isNeedVideoReload = function () {
        return this._videoReload;
    };

    Game_Picture.prototype.clearNeedVideoReload = function () {
        this._videoReload = false;
    };

    Game_Picture.prototype.isVideo = function () {
        return this._video;
    };

    Game_Picture.prototype.isVideoLoop = function () {
        return this._videoLoop;
    };

    Game_Picture.prototype.isVideoSmooth = function () {
        return this._videoSmooth;
    };

    Game_Picture.prototype.setVideoPause = function (value) {
        this._pauseVideo = this.isVideo() && value;
    };

    Game_Picture.prototype.isVideoPause = function () {
        return this._pauseVideo;
    };

    Game_Picture.prototype.setVideoWait = function (value) {
        this._waitVideo = this.isVideo() && value;
    };

    Game_Picture.prototype.isVideoWait = function () {
        return this._waitVideo;
    };

    Game_Picture.prototype.setVideoVolume = function (value) {
        this._volumeVideo = value;
    };

    Game_Picture.prototype.getVideoRealVolume = function () {
        return this._volumeVideo * AudioManager.getVideoPictureVolume();
    };

    Game_Picture.prototype.setVideoVolumeType = function (value) {
        this._volumeVideoType = value;
    };

    Game_Picture.prototype.setVideoSpeed = function (value) {
        this._speedVideo = value;
    };

    Game_Picture.prototype.getVideoSpeed = function () {
        return this._speedVideo || 100;
    };

    Game_Picture.prototype.setVideoTimePosition = function (value) {
        this._videoTimePosition = value;
    };

    Game_Picture.prototype.getVideoTimePosition = function () {
        return this._videoTimePosition || 0;
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.updateVideoName();
    };

    const _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function (enemyId) {
        _Game_Enemy_transform.apply(this, arguments);
        this.updateVideoName();
    };

    Game_Enemy.prototype.updateVideoName = function () {
        this._videoName = PluginManagerEx.findMetaValue(this.enemy(), ['Movie', '動画']);
    };

    const _Game_Enemy_battlerName = Game_Enemy.prototype.battlerName;
    Game_Enemy.prototype.battlerName = function () {
        return this._videoName ? this._videoName : _Game_Enemy_battlerName.apply(this, arguments);
    };

    Game_Enemy.prototype.isVideo = function () {
        return !!this._videoName;
    };

    const _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function (name) {
        if (this._enemy.isVideo()) {
            this.loadVideo(name);
        } else {
            this.destroyVideo();
            _Sprite_Enemy_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Enemy.prototype.loadVideo = function (name) {
        if (this.isVideoEnemy()) {
            this.destroyVideo();
        }
        this.bitmap = ImageManager.loadVideo(name, true);
        this.bitmap.setVideoLoop(true);
        this.bitmap.addLoadListener(() => this.prepareVideo());
        this._loadingState = 'loading';
    };

    Sprite_Enemy.prototype.isVideoEnemy = function () {
        return this.bitmap && this.bitmap.isVideo();
    };

    Sprite_Enemy.prototype.destroyVideo = function () {
        if (!this.isVideoEnemy()) {
            return;
        }
        this.bitmap.destroy();
        this.texture = new PIXI.Texture(Sprite._emptyBaseTexture, new Rectangle());
        this.bitmap = null;
    };

    Sprite_Enemy.prototype.prepareVideo = function () {
        this._refresh();
        this._loadingState = 'prepared';
    };

    //=============================================================================
    // Sprite_Picture
    //  ムービーピクチャを読み込みます。
    //=============================================================================
    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function () {
        if (this.picture().isVideo()) {
            this.loadVideo();
        } else {
            this.destroyVideo();
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Picture.prototype.loadVideo = function () {
        if (SceneManager.isBattleStartUnexpectedLoad()) {
            return;
        }
        if (this.isVideoPicture()) {
            this.destroyVideo();
        }
        this.picture().clearNeedVideoReload();
        this.bitmap = ImageManager.loadVideo(this._pictureName, this.picture().isVideoSmooth());
        this.restoreVideoTimePosition();
        this.bitmap.addLoadListener(function () {
            this.prepareVideo();
        }.bind(this));
        this._loadingState = 'loading';
    };

    Sprite_Picture.prototype.prepareVideo = function () {
        this._refresh();
        this._playStart = true;
        const picture = this.picture();
        if (picture) {
            this._volume = null;
            this.updateVideoVolume();
            this._loadingState = 'prepared';
        } else {
            this._loadingState = null;
        }
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function () {
        if (!this.picture()) {
            this.destroyVideo();
        }
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        this.updateVideo();
    };

    Sprite_Picture.prototype.updateVideo = function () {
        if (!this.isVideoPicture()) {
            return;
        }
        if (this.picture().isNeedVideoReload()) {
            this.loadVideo();
        }
        this.updateVideoFinish();
        if (this._playStart) {
            this.updateVideoSpeed();
            this.updateVideoPause();
            this.updateVideoVolume();
            this.updateVideoLoop();
        }
    };

    Sprite_Picture.prototype.updateVideoSpeed = function () {
        const speed = this.picture().getVideoSpeed() / 100;
        if (speed !== this._speed) {
            this._speed = speed;
            this.bitmap.setVideoSpeed(speed);
        }
    };

    Sprite_Picture.prototype.updateVideoPause = function () {
        const pause = this.picture().isVideoPause();
        if (this._pause !== false && !pause) {
            this.bitmap.play();
        }
        if (!this._pause && pause) {
            this.bitmap.pause();
        }
        this._pause = pause;
    };

    Sprite_Picture.prototype.stopVideo = function () {
        if (this.isVideoPicture()) {
            this.bitmap.pause();
            this._pause = true;
        }
    };

    Sprite_Picture.prototype.updateVideoLoop = function () {
        this.bitmap.setVideoLoop(this.picture().isVideoLoop());
    };

    Sprite_Picture.prototype.updateVideoVolume = function () {
        const volume = this.picture().getVideoRealVolume();
        if (volume !== this._volume) {
            this._volume = volume;
            this.bitmap.setVolume(volume / 100);
        }
    };

    Sprite_Picture.prototype.updateVideoFinish = function () {
        const picture = this.picture();
        const finish = !this.bitmap.isPlayingWait();
        if (picture && finish) {
            picture.onFinishVideo();
        }
        // 連続再生の処理（旧PLAY_SEQUENCE用）
        if (this.bitmap.isEnded() && $gameScreen._videoSequence) {
            const seq = $gameScreen._videoSequence;
            if (seq.pictureId === this._pictureId) {
                this._handleVideoSequence(seq);
                $gameScreen._videoSequence = null;
                return;
            }
        }
        // シームレス連続再生の処理（新PLAY_SEAMLESS_SEQUENCE用）
        if (this.bitmap.isEnded() && $gameScreen._seamlessSequence) {
            const seq = $gameScreen._seamlessSequence;
            if (seq.pictureId === this._pictureId) {
                this._handleSeamlessSequence(seq);
                $gameScreen._seamlessSequence = null;
                return;
            }
        }
        if (this.bitmap.isEnded() && param.autoEraseOnEnd) {
            this.eraseVideo();
        }
    };

    Sprite_Picture.prototype._handleVideoSequence = function (seq) {
        const fileName2 = seq.baseName + String(seq.index2).padStart(seq.digits, '0');
        const videoArgs2 = {
            fileName: fileName2,
            loop: seq.loop2,
            smooth: seq.smooth,
            volume: seq.volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };

        if (seq.transitionWait > 0) {
            // ウェイトがある場合は少し待ってから切り替え
            $gameScreen._videoSequenceWait = seq.transitionWait;
            $gameScreen._videoSequencePending = {
                pictureId: seq.pictureId,
                videoArgs: videoArgs2
            };
        } else {
            // 瞬時に切り替え
            this._switchToNextVideo(videoArgs2);
        }
    };

    Sprite_Picture.prototype._handleSeamlessSequence = function (seq) {
        const fileName2 = seq.baseName + String(seq.index2).padStart(seq.digits, '0');
        const videoArgs2 = {
            fileName: fileName2,
            loop: seq.loop2,
            smooth: seq.smooth,
            volume: seq.volume,
            autoplay: true,
            finishSwitch: 0,
            reload: false
        };

        if (seq.transitionWait > 0) {
            // ウェイトがある場合は少し待ってから切り替え
            $gameScreen._videoSequenceWait = seq.transitionWait;
            $gameScreen._videoSequencePending = {
                pictureId: seq.pictureId,
                videoArgs: videoArgs2,
                useNewPicture: true // 新しいピクチャ番号を使うフラグ
            };
        } else {
            // 新しいピクチャ番号で動画2を表示（フラッシュ防止）
            this._switchToNextVideoSeamless(videoArgs2, seq.pictureId);
        }
    };

    // シームレス連続再生用の切り替え（新しいピクチャ番号を使用）
    Sprite_Picture.prototype._switchToNextVideoSeamless = function (videoArgs, oldPictureId) {
        // 新しいピクチャ番号を取得
        const newPictureId = $gameScreen.getNextSeamlessPictureId();
        if (newPictureId === null) {
            // ピクチャ番号が不足している場合は従来方式にフォールバック
            this._switchToNextVideo(videoArgs);
            return;
        }

        // 動画設定
        $gameScreen.setVideoPicture(videoArgs);

        // 新しいピクチャで動画2を表示
        const x = param.seamlessDefaultX || 0;
        const y = param.seamlessDefaultY || 0;
        $gameScreen.showPicture(newPictureId, '', 0, x, y, 100, 100, 255, 0);

        // 現在のシームレス再生ピクチャ番号を更新
        $gameScreen._currentSeamlessPictureId = newPictureId;

        // 古いピクチャ（動画1）を遅延消去
        if (oldPictureId) {
            $gameScreen.addSeamlessDelayedErase(oldPictureId, 3);
        }
    };

    Sprite_Picture.prototype._switchToNextVideo = function (videoArgs) {
        $gameScreen.setVideoPicture(videoArgs);
        this.picture().showVideo(videoArgs);
        this.loadVideo();
    };

    Sprite_Picture.prototype.eraseVideo = function () {
        this.destroyVideo();
        if (this.picture()) {
            $gameScreen.erasePicture(this._pictureId);
            this.visible = false;
        }
    };

    Sprite_Picture.prototype.saveVideoTimePosition = function () {
        const picture = this.picture();
        if (picture && this.isVideoPicture()) {
            picture.setVideoTimePosition(this.bitmap.getCurrentTime());
        }
    };

    Sprite_Picture.prototype.restoreVideoTimePosition = function () {
        const picture = this.picture();
        if (picture && this.isVideoPicture()) {
            this.bitmap.setCurrentTime(picture.getVideoTimePosition());
        }
    };

    Sprite_Picture.prototype.destroyVideo = function () {
        if (!this.isVideoPicture()) {
            return;
        }
        this.bitmap.destroy();
        this.texture = new PIXI.Texture(Sprite._emptyBaseTexture, new Rectangle());
        this._volume = null;
        this._speed = null;
        this._pause = null;
        this._playStart = false;
        this.bitmap = null;
    };

    Sprite_Picture.prototype.isVideoPicture = function () {
        return this.bitmap && this.bitmap.isVideo();
    };

    Sprite_Picture.prototype.isLoading = function () {
        return this._loadingState === 'loading';
    };

    Sprite_Picture.prototype.isPrepared = function () {
        return this._loadingState === 'prepared';
    };

    //=============================================================================
    // Spriteset_Base
    //=============================================================================
    Spriteset_Base.prototype.clearAllVideo = function () {
        this.findVideoList().forEach(picture => {
            picture.saveVideoTimePosition();
            picture.destroyVideo();
        });
    };

    Spriteset_Base.prototype.stopAllVideo = function () {
        this.findVideoList().forEach(picture => {
            picture.stopVideo();
        });
    };

    Spriteset_Base.prototype.findVideoList = function () {
        return this._pictureContainer.children.filter(picture => {
            return picture instanceof Sprite_Picture && picture.isVideoPicture();
        })
    };

    //=============================================================================
    // Scene_Base
    //=============================================================================
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function () {
        this.clearAllVideo();
        _Scene_Base_terminate.apply(this, arguments);
    };

    Scene_Base.prototype.clearAllVideo = function () {
        if (this._spriteset) {
            this._spriteset.clearAllVideo();
        }
    };

    Scene_Base.prototype.stopAllVideo = function () {
        if (this._spriteset) {
            this._spriteset.stopAllVideo();
        }
    };

    //=============================================================================
    // ImageManager
    //  動画の読み込みを追加定義します。
    //=============================================================================
    ImageManager._videoCache = {};

    ImageManager.loadVideo = function (filename, smooth) {
        if (filename) {
            const cacheKey = this.getVideoFilePath(filename);
            if (this._videoCache[cacheKey]) {
                const bitmap = this._videoCache[cacheKey];
                bitmap.reset(); // 再生位置などをリセット
                return bitmap;
            }
            return new Bitmap_Video(this.getVideoFilePath(filename), smooth, true);
        } else {
            return this._emptyBitmap;
        }
    };

    ImageManager.reserveVideo = function (filename) {
        const path = this.getVideoFilePath(filename);
        let bitmap = this._videoCache[path];
        if (!bitmap) {
            bitmap = new Bitmap_Video(path, true, false);
            bitmap.setCached(true);
            this._videoCache[path] = bitmap;
        }
        return bitmap;
    };

    // すべての動画キャッシュをクリア
    ImageManager.clearVideoCache = function () {
        // まずシームレス再生関連のピクチャを消去
        if ($gameScreen) {
            // 現在再生中のシームレス動画を消去
            const currentId = $gameScreen._currentSeamlessPictureId;
            if (currentId) {
                $gameScreen.erasePicture(currentId);
                $gameScreen._currentSeamlessPictureId = null;
            }

            // フェードアウト待ちのピクチャを消去
            if ($gameScreen._seamlessFadeOutInfo) {
                $gameScreen.erasePicture($gameScreen._seamlessFadeOutInfo.pictureId);
                $gameScreen._seamlessFadeOutInfo = null;
            }

            // 遅延消去待ちのピクチャをすべて消去
            if ($gameScreen._seamlessDelayedEraseList) {
                for (const item of $gameScreen._seamlessDelayedEraseList) {
                    $gameScreen.erasePicture(item.pictureId);
                }
                $gameScreen._seamlessDelayedEraseList = [];
            }

            // ギャラリー状態もクリア
            $gameScreen._videoGallery = null;
        }

        // 1フレーム待ってからキャッシュを破棄（描画完了を待つ）
        setTimeout(() => {
            for (const key in this._videoCache) {
                const bitmap = this._videoCache[key];
                if (bitmap) {
                    bitmap._isCached = false;
                    bitmap.destroy();
                }
            }
            this._videoCache = {};
        }, 0);
    };

    ImageManager.getVideoFilePath = function (filename) {
        return 'movies/' + Utils.encodeURI(filename) + this.getVideoFileExt();
    };

    ImageManager.getVideoFileExt = function () {
        if (Utils.canPlayWebm()) {
            return '.' + (param.webmExt || 'webm');
        } else {
            return '.' + (param.mp4Ext || 'mp4');
        }
    };

    //=============================================================================
    // SceneManager
    //  戦闘開始時にマップピクチャが一瞬読み込まれてしまう現象を回避します
    //=============================================================================
    SceneManager.isBattleStartUnexpectedLoad = function () {
        return this._scene instanceof Scene_Battle && !$gameParty.inBattle();
    };

    //=============================================================================
    // AudioManager
    //  動画ピクチャの音量を取得します。
    //=============================================================================
    AudioManager._movieVolumePropertyMap = {
        BGM: 'bgmVolume',
        BGS: 'bgsVolume',
        ME: 'meVolume',
        SE: 'seVolume',
        VOICE: 'voiceVolume'
    };

    AudioManager.getVideoPictureVolume = function () {
        const property = this._movieVolumePropertyMap[param.movieVolumeType];
        return Video._volume * (this.hasOwnProperty(property) ? this[property] / 100 : 1.0);
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function () {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene && !this.isGameActive()) {
            this._scene.stopAllVideo();
        }
    };

    //=============================================================================
    // Bitmap
    //  動画かどうかを判定します。
    //=============================================================================
    Bitmap.prototype.isVideo = function () {
        return false;
    };

    /**
     * Bitmap_Video
     * 動画ビットマップクラスです。
     * @constructor
     */
    function Bitmap_Video() {
        this.initialize.apply(this, arguments);
    }

    Bitmap_Video.prototype = Object.create(Bitmap.prototype);
    Bitmap_Video.prototype.constructor = Bitmap_Video;

    Bitmap_Video.prototype.initialize = function (url, smooth, autoplay) {
        Bitmap.prototype.initialize.call(this);
        this._createCanvas(1, 1);
        this.smooth = smooth;
        this._autoplay = autoplay !== false; // default true
        this._requestVideo(url);
        this._prevCurrentTime = 0;
        this._isCached = false;
    };

    Bitmap_Video.prototype.setCached = function (value) {
        this._isCached = value;
    };

    Bitmap_Video.prototype.reset = function () {
        if (this.isReady()) {
            this._video.currentTime = 0;
            this._video.pause();
            this._video.muted = false; // 再生時はミュート解除
            this._ended = false;
        }
    };

    Bitmap_Video.prototype.isVideo = function () {
        return !!this._video;
    };

    Bitmap_Video.prototype.setVolume = function (volume) {
        this._video.volume = volume;
    };

    Bitmap_Video.prototype.pause = function () {
        if (this.isLoaded()) {
            this._video.pause();
        }
    };

    Bitmap_Video.prototype.play = function () {
        this._video.play();
    };

    const _Bitmap_Video_destroy = Bitmap_Video.prototype.destroy;
    Bitmap_Video.prototype.destroy = function () {
        if (this._isCached) {
            this.pause();
            // キャッシュされている場合はDestroyしない
            return;
        }
        if (this.isReady()) {
            this.pause();
            this._video = null;
        } else {
            this._loadingDestory = true;
            return;
        }
        _Bitmap_Video_destroy.apply(this, arguments);
    };

    Bitmap_Video.prototype._requestVideo = function (url) {
        this._createVideo(url);
        this._createVideoBaseTexture();
        this._loadingState = 'requesting';
    };

    Bitmap_Video.prototype._createVideo = function (url) {
        this._video = document.createElement('video');
        this._video.src = url;
        // プリロード時は音声を無効化
        if (!this._autoplay) {
            this._video.muted = true;
        }
        this._video.addEventListener('canplaythrough', this._loadListener = this._onLoad.bind(this));
        this._video.addEventListener('ended', this._endedListener = this._onEnded.bind(this));
        this._video.addEventListener('error', this._errorListener = this._onError.bind(this));
        this._video.load();
        this._video.autoplay = this._autoplay;
    };

    Bitmap_Video.prototype._createVideoBaseTexture = function () {
        const scaleMode = this.smooth ? PIXI.SCALE_MODES.LINEAR : PIXI.SCALE_MODES.NEAREST;
        this._baseTexture = PIXI.Texture.from(this._video, { scaleMode: scaleMode });
    };

    Bitmap_Video.prototype._onLoad = function () {
        this._loadingState = 'loaded';
        if (!this._video) {
            return;
        }
        if (this._loadingDestory) {
            this.destroy();
            return;
        }
        const width = this._video.videoWidth;
        const height = this._video.videoHeight;
        this.resize(width, height);
        this._callLoadListeners();
    };

    Bitmap_Video.prototype._onEnded = function () {
        this._ended = true;
    };

    Bitmap_Video.prototype.isLoaded = function () {
        return this._video && this._loadingState === 'loaded';
    };

    Bitmap_Video.prototype._onError = function () {
        this._video.removeEventListener('load', this._loadListener);
        this._video.removeEventListener('ended', this._endedListener);
        this._video.removeEventListener('error', this._errorListener);
        this._loadingState = 'error';
    };

    Bitmap_Video.prototype.isPlayingWait = function () {
        if (this._video.loop) {
            return this.isFirstLap();
        } else {
            return !this.isEnded();
        }
    };

    Bitmap_Video.prototype.isFirstLap = function () {
        const time = this._video.currentTime;
        if (this._prevCurrentTime >= time) {
            return false;
        }
        this._prevCurrentTime = time;
        return true;
    };

    Bitmap_Video.prototype.isEnded = function () {
        return this._ended;
    };

    Bitmap_Video.prototype.setVideoLoop = function (loop) {
        this._video.loop = loop;
    };

    Bitmap_Video.prototype.setCurrentTime = function (value) {
        this._video.currentTime = value;
    };

    Bitmap_Video.prototype.getCurrentTime = function () {
        return this._video.currentTime;
    };

    Bitmap_Video.prototype.setVideoSpeed = function (value) {
        this._video.playbackRate = value;
    };
})();

