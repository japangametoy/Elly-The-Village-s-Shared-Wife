/*:
 * @target MZ
 * @plugindesc BGMの音量を滑らかにフェードアウト・インするプラグインコマンドを提供します。
 * @author 
 * 
 * @command FadeOutTo50
 * @text BGM音量を50までフェードアウト
 * @desc 現在のBGMの音量をフェードしながら50まで下げます。
 * 
 * @arg duration
 * @text フェード時間(ms)
 * @desc フェード時間（ミリ秒単位）。デフォルトは1000ms。
 * @default 1000
 * @type number
 * 
 * @command FadeOutTo0AndStop
 * @text BGMをフェードして停止
 * @desc 現在のBGMを音量0までフェードして停止します。
 * 
 * @arg duration
 * @text フェード時間(ms)
 * @desc フェード時間（ミリ秒単位）。デフォルトは1000ms。
 * @default 1000
 * @type number
 * 
 * @command FadeInTo90
 * @text BGM音量を90までフェードイン
 * @desc 現在のBGMの音量をフェードしながら90まで上げます。
 * 
 * @arg duration
 * @text フェード時間(ms)
 * @desc フェード時間（ミリ秒単位）。デフォルトは1000ms。
 * @default 1000
 * @type number
 */

(() => {
  const pluginName = "BGMfade";

  // 保留中の音量変更設定
  let pendingVolumeChange = null;

  function smoothVolumeChange(targetVolume, duration, onComplete) {
    const bgm = AudioManager._currentBgm;
    if (!bgm) {
      // BGMがまだ再生されていない場合、保留する
      pendingVolumeChange = { targetVolume, duration, onComplete };
      return;
    }
    
    const startVolume = bgm.volume;
    const bgmName = bgm.name;
    const steps = Math.max(1, Math.floor(duration / 50)); // 最小50ms間隔
    const stepTime = Math.max(50, duration / steps);
    const volumeStep = (targetVolume - startVolume) / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      const currentBgm = AudioManager._currentBgm;
      if (!currentBgm || (currentBgm.name !== bgmName && bgmName)) {
        clearInterval(interval);
        return;
      }
      
      currentStep++;
      const newVolume = Math.max(0, Math.min(100, Math.round(startVolume + volumeStep * currentStep)));
      
      // 現在再生中のBGMの音量のみを更新
      currentBgm.volume = newVolume;
      currentBgm._volume = newVolume; // 内部音量も更新
      AudioManager.updateBgmParameters(currentBgm);

      if (currentStep >= steps) {
        clearInterval(interval);
        // 最終音量を確実に設定
        currentBgm.volume = targetVolume;
        currentBgm._volume = targetVolume;
        AudioManager.updateBgmParameters(currentBgm);
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  // AudioManager.playBgmをフックして、BGM再生時に保留中の音量変更を適用
  const _AudioManager_playBgm = AudioManager.playBgm;
  AudioManager.playBgm = function(bgm, pos) {
    _AudioManager_playBgm.call(this, bgm, pos);
    
    // 保留中の音量変更がある場合、少し遅延して適用
    if (pendingVolumeChange) {
      const { targetVolume, duration, onComplete } = pendingVolumeChange;
      pendingVolumeChange = null;
      
      // BGMが実際に再生されるまで少し待つ
      setTimeout(() => {
        smoothVolumeChange(targetVolume, duration, onComplete);
      }, 50);
    }
  };

  PluginManager.registerCommand(pluginName, "FadeOutTo50", args => {
    const duration = Number(args.duration || 1000);
    smoothVolumeChange(50, duration);
  });

  PluginManager.registerCommand(pluginName, "FadeOutTo0AndStop", args => {
    const duration = Number(args.duration || 1000);
    smoothVolumeChange(0, duration, () => {
      AudioManager.stopBgm();
    });
  });

  PluginManager.registerCommand(pluginName, "FadeInTo90", args => {
    const duration = Number(args.duration || 1000);
    smoothVolumeChange(90, duration);
  });
})();
