var Phaser = Phaser || {};
var BasicGame = BasicGame || {};

BasicGame.Player = function(game, positionX, positionY, playerSprite, options) {

    "use strict";
    Phaser.Sprite.call(this, game, positionX, positionY, playerSprite);
    this.frame = 0;
    this.animations.add('right', [5, 6, 7, 8, 9, 8, 7], 10, true);
    this.animations.add('shoot', [3, 4,], 10, true);
    this.alive = true;
    if(options.lives != undefined){
        this.lives = options.lives
    }
    else
        this.lives = 3;
        this.wins = false;
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 1000;
        this.anchor.setTo(.5, 1); //so it flips around its middle
        this.game.camera.follow(this);

        this.jump_sound = this.game.add.audio('jump');
        this.die_sound = this.game.add.audio('die');
        this.shoot_sound = this.game.add.audio('shoot');
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.blastTime = 0;
        this.createBlasts();

        this.events.onOutOfBounds.add(function(){
            BasicGame.Game.deathHandler()}, this);

}

BasicGame.Player.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Player.prototype.constructor = BasicGame.Player;

BasicGame.Player.prototype.update = function () {

    if (this.cursors.right.isDown){
	     this.move('right');
    }
    if (this.cursors.left.isDown){
	     this.move('left');
    }
    if (this.jumpButton.isDown){
	      this.jump();
    }
    if (this.shootButton.isDown){
        this.fireBlast();
    }
    else if (this.cursors.down.isDown && this.body.onFloor() && this.alive){
	    this.move('stop');
    }
    else if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.alive && this.body.onFloor()){
	    this.move('down');
    }

}


BasicGame.Player.prototype.move = function (direction) {
	if (this.alive){
		if (direction == 'right') {
			  this.scale.x = 1; //facing default direction
			  this.body.velocity.x = 155;
			  if(this.body.onFloor()){
				    this.animations.play('right');
			  }
		}
		else if (direction == 'left') {
		    this.scale.x = -1; //flip
			this.body.velocity.x = -155;
			if(this.body.onFloor()){
				this.animations.play('right');
			}
		}
		else if (direction == 'stop') {
			this.body.velocity.x = 0;
			this.animations.stop();
			this.frame = 2;
		}
		else if (direction == 'down') {
			this.body.velocity.x = 0;
			this.animations.stop();
			this.frame = 0;
		}

	}
}

BasicGame.Player.prototype.jump = function () {
	if (this.alive && this.body.onFloor()){
		this.animations.stop();
		this.frame = 1;
		this.body.velocity.y -= 500;
		this.jump_sound.play();
	}
}


BasicGame.Player.prototype.die = function() {
    if(this.alive){
        this.die_sound.play();
        this.alive = false;
        this.body.velocity.x = 0;
        this.animations.stop();
        this.frame = 2
        this.lives -=1;
    }
    if(this.lives > 0){
        var pos = this.x;
        this.game.time.events.add(800, function(){
            this.alive = true;
            this.reset(pos, 0);
            this.frame = 0; }, this);
    }
}


BasicGame.Player.prototype.createBlasts = function(){
        this.blasts = this.game.add.group();
        this.blasts.enableBody = true;
        this.blasts.physicsBodyType = Phaser.Physics.ARCADE;
        this.blasts.createMultiple(30, 'blast')

        this.blasts.setAll('checkWorldBounds', true);
        this.blasts.setAll('outOfBoundsKill', true);

        this.blasts.setAll('anchor.x', 0.5);
        this.blasts.setAll('anchor.y', 0.5);
}


BasicGame.Player.prototype.fireBlast = function(game) {
    if (this.alive){
	    this.animations.play('shoot');
	    if(!this.shoot_sound.isPlaying){
		    this.shoot_sound.play();
	    }

	    if(this.game.time.now > this.blastTime){
		    var blast = this.blasts.getFirstExists(false);
		    if (blast){
                //  And fire it
                blast.reset(this.x, (this.y-this.height/2));
                blast.body.velocity.x = this.scale.x*400;
                this.blastTime = this.game.time.now + 500;
                blast.lifespan = 1200;
		    }
	    }
    }
}
