var BasicGame = BasicGame || {};
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};


BasicGame.Preloader.prototype = {

	preload: function () {

		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.background.scale.setTo(4, 4);
		this.preloadBar = this.add.sprite(400, 100, 'preloaderBar');

        this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		this.text = this.add.text(350, 100, "Loading...", this.style);
		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

//Images
        this.load.image('goldenCoin', 'assets/images/goldCoin.png');
        this.load.image('blast', 'assets/images/blast.png');
        this.load.image('menuBackground', 'assets/images/grass.jpeg');
        this.load.image('door', 'assets/images/door.png');
		this.load.image('playButton', 'assets/images/play_button.png');
    	this.load.image('gameTiles', 'assets/images/sheet1.png');
    	this.load.spritesheet('enemy1', 'assets/images/enemy1.png', 55, 64, 14);
    	this.load.spritesheet('player', 'assets/images/alienman_spritesheet.png', 42.666, 64, 10);

//Audio
		this.load.audio('titleMusic', ['assets/audio/main_menu.mp3']);
		this.load.audio('coin', ['assets/audio/coin.mp3']);
		this.load.audio('shoot', ['assets/audio/shoot.mp3']);
		this.load.audio('mainMusic', ['assets/audio/main.mp3']);
		this.load.audio('die', ['assets/audio/die.ogg']);
		this.load.audio('enemyDie', ['assets/audio/enemy_die.mp3']);
		this.load.audio('jump', ['assets/audio/jump.mp3']);

//Tilemaps
		this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);

	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {

		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
		  this.ready = true;
		  this.state.start('MainMenu');
		}

	}

};
