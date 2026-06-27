// SimpleCharacterShadow.js Ver.1.3.1
// MIT License (C) 2024 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @plugindesc キャラクターに影を表示します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/502305768.html
* @help
* 標準では乗り物、タイル、オブジェクト、巨大、透明キャラクターに影が表示されません。
* ※スクリプトで強制的に表示する事も可能
* 飛行船は違和感が出ないように最初から影の不透明度を255にしています。
* 
* 【スクリプト（実行内容）】
* $gameActors.actor(n).setShadowScale(x, y);    //アクターn番の拡大率を設定
* $gameActors.actor(n).setShadowOffsets(x, y);  //アクターn番のオフセットを設定
* $gamePlayer.refresh();  //上記設定内容をプレイヤーキャラクターに反映。
* 
* 【スクリプト（移動ルート）】
* this.showShadow();        //表示＆強制表示解除
* this.forceShadow();       //キャラクターの状態にかかわらず強制表示
* this.hideShadow();        //非表示＆強制表示解除
* this.setShadowScale(x, y);   //拡大率を設定
* this.setShadowOffsets(x, y); //オフセットを設定
* this.requestShadow(true/false); //スプライトの生成/破棄
* ※thisの代わりにthis.character(n)を付ければ実行内容でも使えます。
*
* 【メモ（アクター）】
* アクターのメモ欄に入力します。
* <shadowOffsetX:数字> //オフセットX
* <shadowOffsetY:数字> //オフセットY
* <shadowScaleX:数字>  //拡大率X
* <shadowScaleY:数字>  //拡大率Y
*
* 【オプション】
* イベントの一行目に注釈を置き入力します。
* <hideShadow>    //非表示
* <forceShadow>   //キャラクターの状態にかかわらず表示
* <shadowOffsetX:数字> //オフセットX
* <shadowOffsetY:数字> //オフセットY
* <shadowScaleX:数字>  //拡大率X
* <shadowScaleY:数字>  //拡大率Y
* <createShadow>  //スプライト生成
* <removeShadow>  //スプライト破棄
*
* [更新履歴]
* 2024/02/08：Ver.1.0.0　公開。
* 2024/02/08：Ver.1.0.1　余分なコードを削除。
* 2024/02/16：Ver.1.0.2　飛行船の影のプライオリティを修正。
* 2024/06/09：Ver.1.1.0　キャラクターの表示がおかしくなる問題を修正。アクターの設定を追加。
* 2024/06/15：Ver.1.2.0　ジャンプ中に影のプライオリティが変動するオプションを追加しました（PriorityFix必須）。
* 2024/06/22：Ver.1.3.0　アンカーを設定可能にしました。プライオリティ制御を最適化。
* 2024/07/09：Ver.1.3.1　茂みで影の色を僅かに薄くなるようにしました（0.75倍）。
*
* @param createAll
* @text 全て作成
* @desc あらかじめ全てのキャラクターに影スプライトを生成しておきます。
* @type boolean
* @default true
*
* @param isBigCharacter
* @text 巨大キャラクターは？
* @desc 巨大キャラクター（ファイル名冒頭が$）に影を表示します。
* @type boolean
* @default false
*
* @param offsetX
* @text オフセットX
* @default 0
*
* @param offsetY
* @text オフセットY
* @default 9
*
* @param scaleX
* @text 拡大率X
* @default 80
*
* @param scaleY
* @text 拡大率Y
* @default 120
*
* @param anchorX
* @text アンカーX
* @default 0.5
* @desc X軸の原点です。小数で細かく指定可能。
* 0：左端　1：右端　0.5：中央
*
* @param anchorY
* @text アンカーY
* @default 1
* @desc Y軸の原点です。小数で細かく指定可能。
* 0：上端　1：下端　0.5：中央
*
* @param controlPriority
* @text プライオリティの制御
* @desc ジャンプ中は影のプライオリティを上げます。
* （PriorityFix導入時のみ）
* @type boolean
* @default true
*
*/

'use strict';
{
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const createAll = parameters.createAll === "true";
	const isBigCharacter = parameters.isBigCharacter === "true";
	const offsetX = +parameters.offsetX;
	const offsetY = +parameters.offsetY;
	const scaleX = +parameters.scaleX;
	const scaleY = +parameters.scaleY;
	const anchorX = Number(parameters.anchorX || 0.5);
	const anchorY = Number(parameters.anchorY || 1);
	const priorityFixed = !!PluginManager._parameters["PriorityFix".toLowerCase()];
	const controlPriority = priorityFixed && parameters.controlPriority === "true";

	//-----------------------------------------------------------------------------
	// Game_Temp

	const _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize.call(this);
		this._characterShadowQueue = [];
	};

	Game_Temp.prototype.requestCharacterShadow = function(target, visible) {
		const request = { target: target, visible: visible ?? true };
		this._characterShadowQueue.push(request);
	};

	Game_Temp.prototype.retrieveCharacterShadow = function() {
		return this._characterShadowQueue.shift();
	};

	//-----------------------------------------------------------------------------
	// Game_Actor

	const _Game_Actor_initMembers = Game_Actor.prototype.initMembers
	Game_Actor.prototype.initMembers = function() {
		_Game_Actor_initMembers.call(this);
		this._shadowScaleX = 100;
		this._shadowScaleY = 100;
		this._shadowOffsetX = 0;
		this._shadowOffsetY = 0;
	};
	const _Game_Actor_setup = Game_Actor.prototype.setup
	Game_Actor.prototype.setup = function(actorId) {
		_Game_Actor_setup.call(this, actorId);
		const actor = $dataActors[this._actorId];
		const meta = actor.meta;
		this._shadowOffsetX = Number(meta['shadowOffsetX'] || offsetX);
		this._shadowOffsetY = Number(meta['shadowOffsetY'] || offsetY);
		this._shadowScaleX = Number(meta['shadowScaleX'] || scaleX);
		this._shadowScaleY = Number(meta['shadowScaleY'] || scaleY);
	};

	Game_Actor.prototype.shadowScaleX = function() {
		return this._shadowScaleX;
	};

	Game_Actor.prototype.shadowScaleY = function() {
		return this._shadowScaleY;
	};

	Game_Actor.prototype.setShadowScale = function(scaleX, scaleY) {
		this._shadowScaleX = scaleX;
		this._shadowScaleY = scaleY;
	};

	Game_Actor.prototype.shadowOffsetX = function() {
		return this._shadowOffsetX;
	};

	Game_Actor.prototype.shadowOffsetY = function() {
		return this._shadowOffsetY;
	};

	Game_Actor.prototype.setShadowOffsets = function(x, y) {
		this._shadowOffsetX = x;
		this._shadowOffsetY = y;
	};

	//-----------------------------------------------------------------------------
	// Game_CharacterBase

	const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
	Game_CharacterBase.prototype.initMembers = function() {
		_Game_CharacterBase_initMembers.call(this);
		this._shadowShowing = true;
		this._shadowForcing = false;
		this._shadowScaleX = scaleX;
		this._shadowScaleY = scaleY;
		this._shadowOffsetX = offsetX;
		this._shadowOffsetY = offsetY;
		this._autoShadowRequest = createAll;
	};

	Game_CharacterBase.prototype.isAutoShadowRequest = function() {
		return this._autoShadowRequest;
	};

	Game_CharacterBase.prototype.setAutoShadowRequest = function(value) {
		this._autoShadowRequest = value;
	};

	Game_CharacterBase.prototype.requestShadow = function(visible) {
		$gameTemp.requestCharacterShadow(this, visible);
		this.setAutoShadowRequest(visible);
	};

	Game_CharacterBase.prototype.isShadowShowing = function() {
		return this._shadowShowing;
	};

	Game_CharacterBase.prototype.showShadow = function() {
		this._shadowShowing = true;
		this._shadowForcing = false;
	};

	Game_CharacterBase.prototype.isShadowForcing = function() {
		return this._shadowForcing;
	};

	Game_CharacterBase.prototype.forceShadow = function() {
		this._shadowForcing = true;
	};

	Game_CharacterBase.prototype.hideShadow = function() {
		this._shadowShowing = false;
		this._shadowForcing = false;
	};

	Game_CharacterBase.prototype.shadowScaleX = function() {
		return this._shadowScaleX;
	};

	Game_CharacterBase.prototype.shadowScaleY = function() {
		return this._shadowScaleY;
	};

	Game_CharacterBase.prototype.setShadowScale = function(scaleX, scaleY) {
		this._shadowScaleX = scaleX;
		this._shadowScaleY = scaleY;
	};

	Game_CharacterBase.prototype.shadowOffsetX = function() {
		return this._shadowOffsetX;
	};

	Game_CharacterBase.prototype.shadowOffsetY = function() {
		return this._shadowOffsetY;
	};

	Game_CharacterBase.prototype.setShadowOffsets = function(x, y) {
		this._shadowOffsetX = x;
		this._shadowOffsetY = y;
	};

	//-----------------------------------------------------------------------------
	// Game_Player

	const _Game_Player_refresh = Game_Player.prototype.refresh
	Game_Player.prototype.refresh = function() {
		_Game_Player_refresh.call(this);
		const actor = $gameParty.leader();
		if (actor) {
			this.setShadowOffsets(actor.shadowOffsetX(), actor.shadowOffsetY());
			this.setShadowScale(actor.shadowScaleX(), actor.shadowScaleY());
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Follower

	const _Game_Follower_refresh = Game_Follower.prototype.refresh;
	Game_Follower.prototype.refresh = function() {
		_Game_Follower_refresh.call(this);
		if (this.isVisible()) {
			const actor = this.actor();
			this.setShadowOffsets(actor.shadowOffsetX(), actor.shadowOffsetY());
			this.setShadowScale(actor.shadowScaleX(), actor.shadowScaleY());
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Vehicle

	const _Game_Vehicle_initMembers = Game_Vehicle.prototype.initMembers;
	Game_Vehicle.prototype.initMembers = function() {
		_Game_Vehicle_initMembers.call(this);
		this._autoShadowRequest = false;
	};

	Game_Vehicle.prototype.shadowOpacity = function() {
		return this.isTransparent() ? 0 : 255;
	};

	Game_Vehicle.prototype.shadowZ = function() {
		return this.isLowest() ? this.screenZ() - 1 : this.screenZ() + 1;
	};

	//-----------------------------------------------------------------------------
	// Spriteset_Map

	const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
	Spriteset_Map.prototype.initialize = function() {
		this._characterShadowSprites = [];
		_Spriteset_Map_initialize.call(this);
	};

	const _Spriteset_Map_update = Spriteset_Map.prototype.update;
	Spriteset_Map.prototype.update = function() {
		_Spriteset_Map_update.call(this);
		this.updateCharacterShadows();
	};

	const _Spriteset_Map_updateShadow = Spriteset_Map.prototype.updateShadow;
	Spriteset_Map.prototype.updateShadow = function() {
		_Spriteset_Map_updateShadow.call(this);
		this._shadowSprite.z = $gameMap.airship().shadowZ();
	};

	Spriteset_Map.prototype.updateCharacterShadows = function() {
		/*for (const sprite of this._characterShadowSprites) {
			if (!sprite.isXXXX()) {
				this.removeCharacterShadow(sprite);
			}
		}*/
		this.processCharacterShadowRequests();
	};

	Spriteset_Map.prototype.processCharacterShadowRequests = function() {
		for (;;) {
			const request = $gameTemp.retrieveCharacterShadow();
			if (request) {
				this.createCharacterShadow(request);
			} else {
				break;
			}
		}
	};

	Spriteset_Map.prototype.createCharacterShadow = function(request) {
		const oldSprite = this._characterShadowSprites.find(s => s._character === request.target);
		if (oldSprite && !request.visible) {
			this.removeCharacterShadow(oldSprite);
			return;
		}
		if (!oldSprite && request.visible) {
			const sprite = new Sprite_Shadow(request.target);
			this._tilemap.addChild(sprite);
			this._characterShadowSprites.push(sprite);
		}
	};

	Spriteset_Map.prototype.removeCharacterShadow = function(sprite) {
		this._characterShadowSprites.remove(sprite);
		this._tilemap.removeChild(sprite);
		sprite.destroy();
	};

	Spriteset_Map.prototype.removeAllCharacterShadows = function() {
		this._characterShadowSprites.forEach(sprite => this.removeCharacterShadow(sprite));
	};

	const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
	Spriteset_Map.prototype.createCharacters = function() {
		_Spriteset_Map_createCharacters.call(this);
		this.updateCharacterShadows();
	};

	const _Spriteset_Map_destroy = Spriteset_Map.prototype.destroy;
	Spriteset_Map.prototype.destroy = function(options) {
		this.removeAllCharacterShadows();//必要？
		_Spriteset_Map_destroy.apply(this, arguments);
	};

	//-----------------------------------------------------------------------------
	// Sprite_Character

	const _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
	Sprite_Character.prototype.initialize = function(character) {
		_Sprite_Character_initialize.call(this, character);
		if (character.isAutoShadowRequest()) {
			$gameTemp.requestCharacterShadow(character, true);
		}
	};

	//-----------------------------------------------------------------------------
	// Sprite_Shadow

	function Sprite_Shadow() {
		this.initialize(...arguments);
	}

	Sprite_Shadow.prototype = Object.create(Sprite.prototype);
	Sprite_Shadow.prototype.constructor = Sprite_Shadow;

	Sprite_Shadow.prototype.initialize = function(character) {
		Sprite.prototype.initialize.call(this);
		this.initMembers();
		this.setCharacter(character);
	};

	Sprite_Shadow.prototype.initMembers = function() {
		this.bitmap = ImageManager.loadSystem("Shadow1");
		this.anchor.x = anchorX;
		this.anchor.y = anchorY;
		this.z = 0;
		this._character = null;
		this._tileId = 0;
		this._characterName = "";
		this._noShadowCharacter = false;
	};

	Sprite_Shadow.prototype.setCharacter = function(character) {
		this._character = character;
	};

	Sprite_Shadow.prototype.checkCharacter = function(character) {
		return this._character === character;
	};

	Sprite_Shadow.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updateBitmap();
		this.updateVisibility();
		if (this.visible) {
			//this.updateFrame();
			this.updatePosition();
	        this.updateScale();
			this.updateOther();
		}
	};

	Sprite_Shadow.prototype.updateBitmap = function() {
		if (this.isImageChanged()) {
			this._tileId = this._character.tileId();
			this._characterName = this._character.characterName();
			const isTile = this._character.isTile();
			const isObject = this._character.isObjectCharacter();
			const isBig = !isBigCharacter && ImageManager.isBigCharacter(this._characterName);
			this._noShadowCharacter = isTile || isObject || isBig;
		}
	};

	Sprite_Shadow.prototype.isImageChanged = function() {
		return (
			this._tileId !== this._character.tileId() ||
			this._characterName !== this._character.characterName()
		);
	};

	Sprite_Shadow.prototype.updatePosition = function() {
		const character = this._character;
		this.x = character.screenX();
		this.y = character.screenY();
		this.z = character.screenZ() - 1;
		if (character._easyActionX) {
			this.x += character._easyActionX;
		}
		if (character.shadowOffsetX) {
			this.x += character.shadowOffsetX();
		}
		if (character.shadowOffsetY) {
			this.y += character.shadowOffsetY();
		}
		if (character.isJumping()) {
			const jumpHeight = character.jumpHeight();
			this.y += jumpHeight;
		}
	};

	Sprite_Shadow.prototype.updateScale = function() {
		if (this._character._shadowScaleX) {
			this.scale.x = this._character.shadowScaleX() / 100;
		}
		if (this._character._shadowScaleY) {
			this.scale.y = this._character.shadowScaleY() / 100;
		}
	};

	Sprite_Shadow.prototype.updateOther = function() {
		const character = this._character;
		this.opacity = character.opacity();
		if (character.bushDepth()) {
			this.opacity *= 0.75;
		}
		const jumpHeight = this.shadowJumpHeight();
		if (jumpHeight && jumpHeight > this.height * this.scale.y * (1 - this.anchor.y) + character.shadowOffsetY()) {
			this.z = character.screenZ();
		}
	};

	Sprite_Shadow.prototype.shadowJumpHeight = function() {
		return 0;
	};

	Sprite_Shadow.prototype.updateVisibility = function() {
		Sprite.prototype.updateVisibility.call(this);
		const character = this._character;
		if (!character.isShadowForcing() && (!character.isShadowShowing() || this.isEmptyCharacter() || this.isNoShadowCharacter())) {
			this.visible = false;
		}
	};

	Sprite_Shadow.prototype.isEmptyCharacter = function() {
		return this._tileId === 0 && !this._characterName;
	};

	Sprite_Shadow.prototype.isNoShadowCharacter = function() {
		return this._noShadowCharacter || this._character.isTransparent();
	};

	if (controlPriority) {
		Sprite_Shadow.prototype.shadowJumpHeight = function() {
			return Sprite_Character.prototype.jumpHeight.call(this);
		};
		Sprite_Shadow.prototype.jumpHeight = function() {
			const jumpHeight = this.shadowJumpHeight();
			if (!jumpHeight) {
				return 0;
			}
			const height = this.height * this.scale.y;
			const offsetH = (height * (1 - this.anchor.y) - this._character.shadowOffsetY()) / 2 - 12;
			return jumpHeight + offsetH;
		};
	}

	//-----------------------------------------------------------------------------
	// Game_Event

	const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
	Game_Event.prototype.setupPageSettings = function() {
		_Game_Event_setupPageSettings.call(this);
		const page = this.page();
		this.setShadowOffsets(page.shadowOffsetX ?? offsetX, page.shadowOffsetY ?? offsetY);
		if (page.hideShadow) {
			this.hideShadow();
		} else if (page.forceShadow) {
			this.forceShadow();
		} else {
			this.showShadow();
		}
		if (page.createShadow) {
			this.requestShadow(true);
		} else if (page.removeShadow) {
			this.requestShadow(false);
		}
		this.setShadowScale(page.shadowScaleX ?? scaleX, page.shadowScaleY ?? scaleY);
	};

	const _Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
	Game_Event.prototype.clearPageSettings = function() {
		_Game_Event_clearPageSettings.call(this);
		this.hideShadow();
	};

	const _Game_Event_erase = Game_Event.prototype.erase;
	Game_Event.prototype.erase = function() {
		this.requestShadow(false);
		_Game_Event_erase.call(this);
	};

	//-----------------------------------------------------------------------------
	// DataManager

	const _DataManager_onLoad = DataManager.onLoad;
	DataManager.onLoad = function(object) {
		_DataManager_onLoad.call(this, object);
		if (this.isMapObject(object) && Array.isArray(object.events)) {
			for (const event of object.events) {
				if (event && event.pages){
					extractMetadata(event);
				}
			}
		}
	};

	function extractMetadata(data) {
		for (const page of data.pages) {
			const comment = findComment(page);
			const commentData = {"note": comment};
			DataManager.extractMetadata(commentData);
			addPageSettings(page, commentData.meta);
		}
	}

	function findComment(page) {
		const list = page.list;
		if (!list[0] && list[0].code !== 108) {
			return "";
		}
		let comment = list[0].parameters[0];
		for (let i = 1; list[i] && list[i].code === 408; i++) {
			comment += list[i].parameters[0];
		}
		return comment;
	}

	function addPageSettings(page, meta) {
		page.createShadow = !!meta['createShadow'];
		page.removeShadow = !!meta['removeShadow'];
		page.forceShadow = !!meta['forceShadow'];
		page.hideShadow = !!meta['hideShadow'];
		page.shadowOffsetX = Number(meta['shadowOffsetX'] || offsetX);
		page.shadowOffsetY = Number(meta['shadowOffsetY'] || offsetY);
		page.shadowScaleX = Number(meta['shadowScaleX'] || scaleX);
		page.shadowScaleY = Number(meta['shadowScaleY'] || scaleY);
	}

}