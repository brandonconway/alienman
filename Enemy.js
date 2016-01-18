var Phaser = Phaser || {};
var BasicGame = BasicGame || {};


BasicGame.Enemy = function(game, positionX, positionY, sprite, options) {
	"use strict"
	 Phaser.Sprite.call(this, game, positionX, positionY, sprite);
     this.game.physics.arcade.enable(this);
     this.velocity = 100;
     this.anchor.setTo(.5, 1); //so it flips around its middle
     this.body.velocity.x = this.velocity;
     this.body.gravity.y = 1000;
     this.body.collideWorldBounds = true;
     this.animations.add('walk', [1, 2, 3, 4, 5], 10, true);
     this.animations.add('attack', [1, 2, 3, 4, 5], 10, true);
     this.frame = 0;
     this.scale.x = -1;
     this.animations.play('walk');
}

BasicGame.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Enemy.prototype.constructor = BasicGame.Enemy;


BasicGame.Enemy.prototype.update = function () {
    //turnaround at world ends, blockedLayer and invisible bumpers
    if(this.body.blocked.right || this.body.blocked.left
      || this.body.touching.right || this.body.touching.left){
        var flip = this.scale.x;
        this.scale.x = -1*flip;
        this.animations.play('walk')
        this.body.velocity.x = flip * this.velocity;
    }
};

BasicGame.Bumper = function(game, positionX, positionY, sprite, options) {
	"use strict"
	 Phaser.Sprite.call(this, game, positionX, positionY);
     this.game.physics.arcade.enable(this);
     this.body.immovable = true;
     this.visible = false
}

BasicGame.Bumper.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Bumper.prototype.constructor = BasicGame.Bumper;



