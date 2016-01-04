
var BasicGame = BasicGame || {};
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
                console.log(this);
                this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		this.music = this.add.audio('titleMusic');
		this.music.loop = true;
//		this.music.play();

		this.background = this.add.sprite(0, 0, 'menuBackground');
		this.background.scale.setTo(4, 2);
		this.text = this.add.text(this.game.width/2, 40, "Play Rad Runner 5000", this.style).anchor.set(0.5);
		this.playButton = this.add.button(this.game.width/2, 100, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver').anchor.set(0.5);

	},

	startGame: function (pointer) {
		this.music.stop();
		this.state.start('LevelMenu');
	}

};
