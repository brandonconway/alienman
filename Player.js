var Phaser = Phaser || {};
var BasicGame = BasicGame || {};

BasicGame.Player = function(game, positionX, positionY, playerSprite) {
	"use strict";
	 Phaser.Sprite.call(this, game, positionX, positionY, playerSprite);
	 //this.frame = 5;
	 this.frame = 0;
	 //this.animations.add('right', [24, 25, 26, 25], 10, true);
	 this.animations.add('right', [5, 6, 7, 8, 9, 8, 7], 10, true);
	 this.animations.add('shoot', [3, 4,], 10, true);
         this.alive = true;
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
	 this.events.onOutOfBounds.add(function(){
		 this.alive = false;
                 this.die_sound.play();
		 //this.player.frame = 9;
		 this.player.frame = 2;
                 this.time.events.add(1500, this.quitGame, this);
            }, this);

} 

BasicGame.Player.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Player.prototype.constructor = BasicGame.Player;

BasicGame.Player.prototype.update = function () {

	if(this.cursors.right.isDown && this.alive){
                this.scale.x = 1; //facing default direction
		this.body.velocity.x = 155;
    	        if(this.body.onFloor()){
    	           this.animations.play('right');
		}
        }
	if(this.cursors.left.isDown && this.alive){
                this.scale.x = -1; //flip
		this.body.velocity.x = -155;
		if(this.body.onFloor()){
    	           this.animations.play('right');
		}
        }
	
	if(this.jumpButton.isDown && this.body.onFloor() && this.alive){
                this.animations.stop();
	        this.frame = 1;
                this.body.velocity.y -= 500;
                this.jump_sound.play();
        }
	else if(this.shootButton.isDown && this.alive){
		this.animations.play('shoot');
		if(!this.shoot_sound.isPlaying){
                this.shoot_sound.play();}
        }
        else if (this.cursors.down.isDown && this.body.onFloor() && this.alive){
		this.body.velocity.x = 0;
                this.animations.stop();
	        this.frame = 2;
        }
        else if(!this.cursors.left.isDown && !this.cursors.right.isDown && this.alive && this.body.onFloor()){
		this.body.velocity.x = 0;
                this.animations.stop();
	        this.frame = 0;
                    
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
                                        this.frame = 0; }, 
                                    this);
		 
		 }
}
