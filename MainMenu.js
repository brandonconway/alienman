
var BasicGame = BasicGame || {};
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
        this.style = { font: "bold 32px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle" };
		this.music = this.add.audio('titleMusic');
		this.music.loop = true;
		this.music.play();

		this.background = this.add.sprite(0, 0, 'menuBackground');
		this.text = this.add.text(this.game.width/2+150, 400, "Play Alien Man", this.style).anchor.set(0.5);
		this.playButton = this.add.button(this.game.width/2, 400, 'playButton', this.startGame, this).anchor.set(0.5);

	},

	startGame: function (pointer) {
		this.music.stop();
		this.state.start('LevelMenu');
	}

};
