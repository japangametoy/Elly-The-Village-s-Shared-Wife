/*:
 * @target MZ
 * @plugindesc デプロイ後の初回起動時にpackage.jsonを自動修正して再起動するプラグイン
 *
 * @help PatchPackageJson.js
 *
 * デプロイメントによってpackage.jsonが初期化されてしまう問題を解決します。
 * ゲーム起動時（テストプレイ以外）にpackage.jsonを確認し、
 * 最適化フラグが設定されていない場合は自動的に書き換えてゲームを再起動します。
 *
 * 設定される引数:
 * --force-color-profile=srgb
 * --disable-devtools
 * --disable-gpu-compositing
 * --num-raster-threads=4
 * --enable-checker-imaging
 *
 * 利用方法:
 * プラグイン管理でONにするだけです。パラメータはありません。
 *
 * @command dummy
 * @text ダミー
 * @desc ダミーコマンドです
 */

(() => {
    'use strict';

    // テストプレイ中は実行しない
    if (Utils.isOptionValid('test')) {
        return;
    }

    // NW.js環境でない場合は実行しない（ブラウザ版など）
    if (!Utils.isNwjs()) {
        return;
    }

    const fs = require('fs');
    const path = require('path');
    const child_process = require('child_process');

    // 実行ファイル（Game.exe）のあるフォルダを取得
    const projectPath = path.dirname(process.execPath);
    const packageJsonPath = path.join(projectPath, 'package.json');

    // 目標とするchromium-args
    const targetArgs = "--force-color-profile=srgb --disable-devtools --disable-gpu-compositing --num-raster-threads=4 --enable-checker-imaging";

    const updatePackageJson = () => {
        try {
            if (!fs.existsSync(packageJsonPath)) return;

            const data = fs.readFileSync(packageJsonPath, 'utf8');
            let json;
            try {
                json = JSON.parse(data);
            } catch (e) {
                return; // JSONパースエラー時は何もしない
            }

            // 現在の設定と目標設定が異なる場合のみ書き換え
            if (json['chromium-args'] !== targetArgs) {
                // コンソールにログ出力（標準出力が見える場合）
                console.log('Patching package.json chromium-args...');

                json['chromium-args'] = targetArgs;

                // 書き込み
                fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 4));

                // 再起動処理
                // Detachedで新しいプロセスを起動し、現在のプロセスを終了する
                const child = child_process.spawn(process.execPath, [], {
                    detached: true,
                    stdio: 'ignore',
                    cwd: projectPath // カレントディレクトリを明示
                });

                // 親プロセス（これ）が終了しても子プロセスが生き続けるようにする
                child.unref();

                // アプリケーション終了
                nw.App.quit();
            }
        } catch (e) {
            console.error('Failed to patch package.json:', e);
        }
    };

    updatePackageJson();
})();
