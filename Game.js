/*
TODO
7. blast enemies
8. special moves or power ups double jump, etc
*/


var BasicGame = BasicGame || {};

var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
BasicGame.Game = function (game) {};

BasicGame.Game.prototype = {

     init: function (level) {
	   this.level = level;
       this.numLevels = 3;
     },
     create: function () {

	    this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#606060';
	    this.map = this.game.add.tilemap('level'+this.level);
	    this.map.addTilesetImage('sheet1', 'gameTiles');

	    //collision on blockedLayer
	    this.blockedLayer = this.map.createLayer('platformLayer');
	    this.map.setCollisionBetween(1, 15000, true, 'platformLayer');
        this.game.physics.arcade.checkCollision.down = false;
	    this.deathLayer = this.map.createLayer('deathLayer');
	    this.map.setCollisionBetween(1, 15000, true, 'deathLayer');
	    //resizes the game world to match the layer dimensions
	    this.blockedLayer.resizeWorld();

	    //Game/message text
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

        //create enemies
        this.createEnemies();
        this.createBumpers();

        //sounds
        this.coinSound = this.game.add.audio('coin');
        this.mainMusic = this.add.audio('mainMusic');
        this.enemyDie = this.add.audio('enemyDie');
        this.enemyDie.volume = 2.0;

	    //play music
	    this.mainMusic.loop = true;
	    if(!this.mainMusic.isPlaying){
	        this.mainMusic.play();
        }


        //add player
	    var player = new BasicGame.Player(this.game, 0, 0, 'player');
        this.player = this.game.add.existing(player);
        this.blasts = this.player.blasts;
        this.game.player = this.player;


	    //lives
        this.livesText = this.add.text(this.camera.width - 100, 0, 'Lives: '+ this.player.lives, { font: '24px Arial', fill: '#fff' });
        this.livesText.fixedToCamera = true;;

	},

    update: function () {

        //Collisions
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
        //die when touching lava or other death layer
        //this would be better if these were background and objects
        this.game.physics.arcade.collide(this.player, this.deathLayer, this.deathHandler, null, this)
        this.game.physics.arcade.collide(this.player, this.enemies, this.deathHandler, null, this)
        this.game.physics.arcade.collide(this.enemies, this.blasts, this.hitEnemy, null, this)
        this.game.physics.arcade.collide(this.enemies, this.bumpers);

        //Overlaps
	    //pick up coins
        this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);

	    //touch door
        this.game.physics.arcade.overlap(this.player, this.door, this.win, null, this);

    },

    quitGame: function (pointer) {

        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        //  Then let's go back to the main menu.
	    this.mainMusic.stop();
        this.mainMusic = null;
        this.player = null;
        this.map = null;
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

    findObjectsByType: function(type, map, layerName) {
        //find objects in a Tiled layer that containt a property called "type" equal to a certain value

        var result = new Array();
        map.objects[layerName].forEach(function(element){
        if(element.properties.type === type) {
            //Phaser uses top left, Tiled bottom left so we have to adjust
            element.y -= map.tileHeight;
            result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group, customObject, options) {
        //create a sprite from an object in TileMap object layer
        if(customObject != undefined){
            var sprite = group.add(
                            new customObject(this.game, element.x, element.y,
                                         element.properties.sprite, options)
                        );
        }
        else {
            var sprite = group.create(element.x, element.y, element.properties.sprite);
        }
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

    createEnemies: function() {
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        var result = this.findObjectsByType('enemy1', this.map, 'objectLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.enemies, BasicGame.Enemy, {'moving':'false'});
        }, this);
    },

    createBumpers: function() {
        this.bumpers = this.game.add.group();
        this.bumpers.enableBody = true;
        var result = this.findObjectsByType('bumper', this.map, 'objectLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.bumpers, BasicGame.Bumper);
        }, this);
    },

    collect: function(player, collectable) {
        this.coinSound.play();
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
            this.mainMusic.stop();
            this.mainMusic = null;
            this.score += 1000;
        }

        this.scoreText.text = 'Score: ' + this.score;
        this.gameText.text = 'YOU WIN\nSCORE: ' + this.score;
        this.gameText.visible = true;
        var nextLevel = this.level + 1;
        if(nextLevel <= this.numLevels){
            this.time.events.add(2500, this.state.start('Game', true, false, nextLevel), this);
        }
        else
            this.time.events.add(2500, this.quitGame, this);
    },


    hitEnemy: function(enemy, blast){
	    this.enemyDie.play();
        enemy.kill();
        blast.kill()
        this.score += 50;
        this.scoreText.text = 'Score: ' + this.score;


    }


};


