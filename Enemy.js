var Phaser = Phaser || {};
var BasicGame = BasicGame || {};


BasicGame.Enemy = function(game, positionX, positionY, sprite, options) {
	"use strict"
	 Phaser.Sprite.call(this, game, positionX, positionY, sprite);
     this.game.physics.arcade.enable(this);
     this.anchor.setTo(.5, 0.40); //so it flips around its middle
     this.body.velocity.x = -100;
     this.body.gravity.y = 1000;
     this.body.collideWorldBounds = true;
}

BasicGame.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Enemy.prototype.constructor = BasicGame.Enemy;


BasicGame.Enemy.prototype.update = function () {

    if(!this.body.onFloor() || this.body.blocked.right || this.body.blocked.left){
        var flip = this.scale.x;
        this.scale.x = -1*flip;
        this.body.velocity.x = flip * 100;

    }

};
