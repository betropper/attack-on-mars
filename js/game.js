var game = new Phaser.Game(320,568);
var CONFIG = {
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": 0.05740940078
 }
}

var Mech = function() {
 this.config = CONFIG;
 
}

function preload() {
 this.config = CONFIG;
 this.load.image("blue", "assets/bluesquare.png",72,72);
 this.load.image("red", "assets/redsquare.png",72,72);
 this.load.image("green", "assets/greensquare.png",72,72);
 this.load.image("orange", "assets/orangesquare.png",72,72);
 this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
 this.load.image("redcircle", "assets/red-circle.png", 72, 72);
 this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);
 this.load.image("menubar","assets/greenishbar.jpg",1200,90);
 this.load.image("gameboard","assets/gameboard.jpg",5574,5574);
}

function create() {
 background = game.add.tileSprite(0,0,5574,5574,"gameboard");
 this.background.scale.set(this.config.bg.scale || 1);
}
