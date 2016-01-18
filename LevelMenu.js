var BasicGame = BasicGame || {};

BasicGame.LevelMenu = function(game){}

BasicGame.LevelMenu.prototype = {

	create: function () {

    this.background = this.add.sprite(0, 0, 'menuBackground');
	this.background.scale.setTo(4, 2);
	this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "400", boundsAlignV: "middle" };
	this.text = this.add.text(400, 40, "Choose a level", this.style);
	this.level1 = this.add.button(400, 100, 'playButton', function(){this.startGame(1);}, this, 'buttonOver', 'buttonOut', 'buttonOver');
	this.level1Text = this.add.text(this.level1.x + this.level1.width+10, this.level1.y, "Level 1", this.style);
	this.level2 = this.add.button(400, 50+this.level1.y, 'playButton', function(){this.startGame(2);}, this, 'buttonOver', 'buttonOut', 'buttonOver');
	this.level2Text = this.add.text(this.level2.x + this.level2.width+10, this.level2.y, "Level 2", this.style);
	this.level3 = this.add.button(400, 50+this.level2.y, 'playButton', function(){this.startGame(3);}, this, 'buttonOver', 'buttonOut', 'buttonOver');
	this.level3Text = this.add.text(this.level3.x + this.level3.width+10, this.level3.y, "Level 3", this.style);
    this.music = this.add.audio('titleMusic');
	this.music.loop = true;
	//this.music.play();

	},

	startGame: function (level) {
		this.music.stop();
		this.state.start('Game', true, false, level);
	}

}
