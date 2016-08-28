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

var Space = {
 "center": {
   "x": 2795,
   "y": 2765
 },
 "a": {
    "10": {
      "x": 3215,
      "y": 543
    },
    "11": {
      "x": 3145,
      "y": 930
    },
    "12": {
      "x": 3065,
      "y": 1360
    },
    "13": {
      "x": 2955,
      "y": 1922
    },
    "20": {
      "x": 4080,
      "y": 875
    },
    "21": {
      "x": 3835,
      "y": 1217
    },
    "22": {
      "x": 3575,
      "y": 1593
    },
    "23": {
      "x": 3271,
      "y": 2077
    },
    "30": {
      "x": 4667,
      "y": 1550
    },
    "31": {
      "x": 4347,
      "y": 1745
    },
    "32": {
      "x": 3975,
      "y": 2000
    },
    "33": {
      "x": 3523,
      "y": 2290
    }
 }
}

var First = "red";
var Second = "blue";
var Third = "orange";
var Fourth = "green";
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
    this.load.image("greencircle", "assets/green-circle.png", C.monster.width, C.monster.height);
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
      player = playersList[i];
      player.type = "player"
    }
    
  }

}

function getRandomSpace() {
  var obj_keys= Object.keys(Space);
  var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
  selectedSpace = Space[ran_key];
  console.log(selectedSpace);
  console.log(Space);
  return selectedSpace
}

function spawnRandom(object) {
  //game.add.sprite(x,y,object)
}

var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Play",Play);
game.state.start("Boot");
