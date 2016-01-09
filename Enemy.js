var Phaser = Phaser || {};
var BasicGame = BasicGame || {};


BasicGame.Enemy = function(game, sprite, options) {
	"use strict"
         var positionX = game.world.randomX;	
         var positionY = game.world.randomY;	
	 Phaser.Sprite.call(this, game, positionX, positionY, sprite);
         this.game.physics.arcade.enable(this);
	 this.body.immovable = true;
}

BasicGame.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Enemy.prototype.constructor = BasicGame.Enemy;
