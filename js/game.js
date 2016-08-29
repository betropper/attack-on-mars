var C = {
 "game": {
   "width": 320,
   "height": 568
 },
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": 0.058,
   "file": "assets/gameboard.jpg"
 },
 "mech": {
   "width": 72,
   "height": 72
 },
 "monster": {
   "width": 72,
   "height": 72
 }
}

import Space from "spaces";
var First;
var Second;
var Third;
var Fourth;
var playersList = [First,Second,Third,Fourth];

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
    this.load.image("blue", "assets/bluesquare.png",C.mech.width,C.mech.height);
    this.load.image("red", "assets/redsquare.png",C.mech.width,C.mech.height);
    this.load.image("green", "assets/greensquare.png",C.mech.width,C.mech.height);
    this.load.image("orange", "assets/orangesquare.png",C.mech.width,C.mech.height);
    /*this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
    this.load.image("redcircle", "assets/red-circle.png", 72, 72);
    this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);*/
    this.load.image("monster", "assets/green-circle.png", C.monster.width, C.monster.height);
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
    this.bg.scale.set(C.bg.scale || .1);
    var playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      var playerCount = 2;
    } else if (playerCount > 4) {
      var playerCount = 4;
    }
    //players = game.add.group();
    for (var i = 1; i <= playerCount; i++) {
      console.log(i);
      var player = playersList[i];
      spawnRandom("monster");
    }
    
  }

}

function getRandomSpace() {
  var obj_keys= Object.keys(Space);
  var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
  selectedSpace = Space[ran_key];
  return {
    selectedSpace: selectedSpace,
    key: ran_key
  }
}

function spawnRandom(object) {
  var space = getRandomSpace();
  while (space.key.indexOf("0") > -1) {
    console.log("Rerolling.");
    space = getRandomSpace();
  }
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale,space.selectedSpace.y*C.bg.scale,object); 
  random.anchor.x = .5;
  random.anchor.y = .5;
  random.scale.x = .3;
  random.scale.y = .3;
}
var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Play",Play);
game.state.start("Boot");
