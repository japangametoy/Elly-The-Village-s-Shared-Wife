//=============================================================================
// Mihil_EventPageCondition.js
//=============================================================================
// Copyright (c) 2018- Mihiraghi
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
/*:
 * @plugindesc イベントページの出現条件をスクリプトで制御します
 * @author Mihiraghi
 * @Thanks elleonard => findPageCondition()
 * @target MZ
 * 
 * @help 注釈コマンドを作り、1行目にpage_condition
 * 2行目以降にイベントページの出現条件をスクリプトで書きます。
 * 
 * 例えば
 * 
 * 注釈: page_condition
 *     : $gameVariables.value(1) <= $gameVariables.value(2) &&
 *     : $gameParty.gold() >= 1000
 * 
 * なら変数1番が変数2番以下 かつ 所持金が1000以上ならイベント出現。
 * となります。
 * 
 * また、1行目が//で始まるコメントの場合は、その行を無視して
 * 2行目以降のpage_conditionを有効にします。
 * 
 * 注釈: //コメント
 *     : page_condition
 *     : ($gameVariables.value(2) !== 3
 *     : && $gameVariables.value(3) >= 3)
 * スイッチ、セルフスイッチなど、通常の出現条件との併用も可能です。
 * 
 * 
 * 類似プラグインとしては
 * HIME_CustomPageConditions.js
 * SAN_ExtendedEventPage.js
 * などがあります。
 * 
 * イベントコマンドの条件分岐を使いたい場合は
 * HIME_CustomPageConditions.jsを
 * イベントページの条件を満たした時に特殊な処理を行いたい場合は
 * SAN_ExtendedEventPage.jsを
 * それぞれ使い分けるとよさそうです。
 * 
 * Ver1.1.0 MZでも動くはず
 * Ver1.0.0 配布
 * 
 */


(function () {
    'use strict';

    const _Game_Event_meetsConditions = Game_Event.prototype.meetsConditions
    Game_Event.prototype.meetsConditions = function (page) {
        return !_Game_Event_meetsConditions.call(this, page) ? false :
            this.matchConditionNote(page);
    }

    Game_Event.prototype.matchConditionNote = function (page) {
        const findPageCondition = (list) => {
            // 注釈コマンド(108)または注釈続き(408)で "page_condition" を見つける
            const condIndex = list.findIndex(command =>
                (command.code === 108 || command.code === 408) &&
                command.parameters[0].match(/page_condition/gi)
            );
            if (condIndex < 0) return "";

            // page_condition の前の行が//で始まるコメントの場合は、その行を無視
            let startIndex = condIndex;
            if (condIndex > 0) {
                const prevCommand = list[condIndex - 1];
                if ((prevCommand.code === 108 || prevCommand.code === 408) &&
                    prevCommand.parameters[0].trim().startsWith('//')) {
                    // 前の行がコメントなので、page_conditionの行から開始
                    startIndex = condIndex;
                }
            }

            const firstIndex = startIndex + 1; // page_condition の次の行から
            const tail = list.slice(firstIndex);
            const endOffset = tail.findIndex(command => command.code !== 408); // 連続する注釈行の終わり
            const lastIndex = endOffset >= 0 ? firstIndex + endOffset : list.length; // 絶対インデックスに戻す

            const conditionLines = list.slice(firstIndex, lastIndex)
                .map(command => command.parameters[0]);

            // 最初の行が//で始まる場合はスキップ
            if (conditionLines.length > 0 && conditionLines[0].trim().startsWith('//')) {
                conditionLines.shift();
            }

            return conditionLines.join("\n");
        };
        const list = page.list;
        const str = findPageCondition(list);

        if (str) {
            try {
                return eval(str);
            } catch (error) {
                console.error(error, { str: `Could not interpret: ${str}`, page: page, error: error })
            }
        }
        return true// defaultはtrue(すべての条件に外れなかったらtrue。ややこしい)
    }

})();

