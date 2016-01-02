
var BasicGame = BasicGame || {};
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

                this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		this.music = this.add.audio('titleMusic');
		this.music.loop = true;
//		this.music.play();

		this.text = this.add.text(300, 40, "Play Rad Runner 5000", this.style);
		this.playButton = this.add.button(400, 100, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

	},

	startGame: function (pointer) {
		this.music.stop();
		this.state.start('LevelMenu');
	}

};
