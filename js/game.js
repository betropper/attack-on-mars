var C = {
 "game": {
   "width": 360,
   "height": 568
 },
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": 0.05740940078,
   "file": "assets/gameboard.jpg"
 }
}

class Boot {
  preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }
  create() {
    this.state.start("Load");
  }
}

class Load {
  preload() {
    console.log("Loading.");
    this.load.image("gameboard",C.bg.file);
    this.load.image("blue", "assets/bluesquare.png",72,72);
    this.load.image("red", "assets/redsquare.png",72,72);
    this.load.image("green", "assets/greensquare.png",72,72);
    this.load.image("orange", "assets/orangesquare.png",72,72);
    this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
    this.load.image("redcircle", "assets/red-circle.png", 72, 72);
    this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);
    this.load.image("menubar","assets/greenishbar.jpg",1200,90);
  }
  create() {
    console.log("Loaded!");
    this.state.start("Play");
  }

}

class Play {

  create() {
    console.log("Game Start");
    this.bg = this.add.tileSprite(0,0,5574,5574,"gameboard");
    this.bg.scale.set(this.config.bg.scale || 1);
  }

}
var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Play",Play);
game.state.start("Boot");
