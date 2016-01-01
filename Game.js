/*
TODO
4. multiple levels
5. enemies 
6. enemy collisioins
7. blast enemies
8. special moves or power ups double jump, etc
*/


var BasicGame = BasicGame || {};

var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

     create: function () {
	    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.map = this.game.add.tilemap('level1');
	    this.map.addTilesetImage('sheet1', 'gameTiles');
	    //collision on blockedLayer
	    this.blockedLayer = this.map.createLayer('platformLayer');
	    this.map.setCollisionBetween(1, 15000, true, 'platformLayer');
            this.game.physics.arcade.checkCollision.down = false;
	    this.deathLayer = this.map.createLayer('deathLayer');
	    this.map.setCollisionBetween(1, 15000, true, 'deathLayer');
	    //resizes the game world to match the layer dimensions
	    this.blockedLayer.resizeWorld();

	    //Gameover/message text
            this.gameText = this.add.text(this.camera.width / 2, this.camera.height / 2 - 100, 'GAME OVER!', { font: '32px Arial', fill: '#fff' });
            this.gameText.anchor.setTo(0.5, 0.5)
            this.gameText.fixedToCamera = true;;
            this.gameText.visible = false;
		
	    //score
	    this.score = 0;
            this.scoreText = this.add.text(10,0, 'Score: '+ this.score, { font: '24px Arial', fill: '#fff' });
            this.scoreText.fixedToCamera = true;;

	    //create objects 
            this.createCoins();
            this.createDoor();

            //sounds
            this.coinSound = this.game.add.audio('coin');
            this.mainMusic = this.add.audio('mainMusic');

	    //play music
	    this.mainMusic.loop = true;
	    this.mainMusic.play();
	   
      
            //add player
	    var player = new BasicGame.Player(this.game, 0, 0, 'player');
            this.player = this.game.add.existing(player);

	    //lives
            this.livesText = this.add.text(this.camera.width - 100, 0, 'Lives: '+ this.player.lives, { font: '24px Arial', fill: '#fff' });
            this.livesText.fixedToCamera = true;;

	
    },

    update: function () {


	this.game.physics.arcade.collide(this.player, this.blockedLayer);
	//die when touching lava or other death layer
	//this would be better if these were background and objects
	this.game.physics.arcade.collide(this.player, this.deathLayer, this.deathHandler, null, this)
	//pick up coins
        this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
	//pick up coins
        this.game.physics.arcade.overlap(this.player, this.door, this.win, null, this);

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },

    deathHandler: function(){
                 this.player.die();
		 if(this.player.lives == 0){
		         this.mainMusic.stop();
			 this.gameText.visible = true;
			 this.time.events.add(1500, this.quitGame, this);
		 }
		 else {
	            this.score = 0;
		    this.livesText.text = 'Lives: '+ this.player.lives;
		    this.scoreText.text = 'Score: '+ this.score;
		 }
   },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
   findObjectsByType: function(type, map, layerName) {
      var result = new Array();
      map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
   },

   //create a sprite from an object
   createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
   },

   createCoins: function() {
      this.coins = this.game.add.group();
      this.coins.enableBody = true;
      var result = this.findObjectsByType('coin', this.map, 'objectLayer');
      result.forEach(function(element){
        this.createFromTiledObject(element, this.coins);
      }, this);
   },
   createDoor: function() {
      this.door = this.game.add.group();
      this.door.enableBody = true;
      var result = this.findObjectsByType('door', this.map, 'objectLayer');
      result.forEach(function(element){
        this.createFromTiledObject(element, this.door);
      }, this);
   },

   collect: function(player, collectable) {
    //play audio
    this.coinSound.play();
    //remove sprite
    collectable.destroy();
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

  },
  
   win: function(player, collectable){
   if(!this.player.wins){
      //some of this should be moved into a playerDIes method. maybe there is a prototype for this?
      this.player.body.velocity.x = 0;
      this.player.alive = false;
      this.player.animations.stop();
      this.player.frame = 5;
      this.player.wins = !this.player.wins;
      this.score += 1000;
   }   
   this.scoreText.text = 'Score: ' + this.score;
   this.gameText.text = 'YOU WIN\nSCORE: ' + this.score;
   this.gameText.visible = true;
   this.time.events.add(2500, this.quitGame, this);
  }


    

};
