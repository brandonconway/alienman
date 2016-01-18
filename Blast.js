var Phaser = Phaser || {};
var BasicGame = BasicGame || {};

BasicGame.Blast = function(game, sprite, options) {
	"use strict"
	 Phaser.Sprite.call(this, game, positionX, positionY, sprite);
         this.game.physics.arcade.enable(this);
}

BasicGame.Blast.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Blast.prototype.constructor = BasicGame.Blast;
