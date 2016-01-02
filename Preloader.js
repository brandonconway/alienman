
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

                this.load.image('goldenCoin', 'assets/images/goldCoin.png');
                this.load.image('door', 'assets/images/door.png');
		this.load.image('playButton', 'assets/images/play_button.png');
		this.load.audio('titleMusic', ['assets/audio/main_menu.mp3']);
		this.load.audio('coin', ['assets/audio/coin.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here
		this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);
    		this.load.image('gameTiles', 'assets/images/sheet1.png');
    
    		this.load.spritesheet('player', 'assets/images/player.png', 46, 50, 28);
		
		this.load.audio('mainMusic', ['assets/audio/main.mp3']);
		this.load.audio('die', ['assets/audio/die.ogg']);
		this.load.audio('jump', ['assets/audio/jump.mp3']);
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
