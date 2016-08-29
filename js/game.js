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
    "a10": {
      "x": 3215,
      "y": 543
    },
    "a11": {
      "x": 3145,
      "y": 930
    },
    "a12": {
      "x": 3065,
      "y": 1360
    },
    "a13": {
      "x": 2955,
      "y": 1922
    },
    "a20": {
      "x": 4080,
      "y": 875
    },
    "a21": {
      "x": 3835,
      "y": 1217
    },
    "a22": {
      "x": 3575,
      "y": 1593
    },
    "a23": {
      "x": 3271,
      "y": 2077
    },
    "a30": {
      "x": 4667,
      "y": 1550
    },
    "a31": {
      "x": 4347,
      "y": 1745
    },
    "a32": {
      "x": 3975,
      "y": 2000
    },
    "a33": {
      "x": 3600,
      "y": 2250
    },
    "a40": {
      "x": 5000,
      "y": 2353
    },
    "a41": {
      "x": 4625,
      "y": 2433
    },
    "a42": {
      "x": 4200,
      "y": 2520
    },
    "a43": {
      "x": 3730,
      "y": 2600
    },
    "a10": {
      "x": 5000,
      "y": 3255
    },
    "b11": {
      "x": 4625,
      "y": 3150
    },
    "b12": {
      "x": 4177,
      "y": 3063
    },
    "b13": {
      "x": 3745,
      "y": 2983
    },
    "b20": {
      "x": 4673,
      "y": 4031
    },
    "b21": {
      "x": 4345,
      "y": 3831
    },
    "b22": {
      "x": 3969,
      "y": 3575
    },
    "b23": {
      "x": 3600,
      "y": 3343
    },
    "b30": {
      "x": 4057,
      "y": 4647
    },
    "b31": {
      "x": 3833,
      "y": 4319
    },
    "b32": {
      "x": 3585,
      "y": 3960
    },
    "b33": {
      "x": 3321,
      "y": 3600
    },
    "b40": {
      "x": 3233,
      "y": 4983
    },
    "b41": {
      "x": 3145,
      "y": 4631
    },
    "b42": {
      "x": 3060,
      "y": 4191
    },
    "b43": {
      "x": 2977,
      "y": 3759
    },
    "c10": {
      "x": 2337,
      "y": 4990
    },
    "c11": {
      "x": 2417,
      "y": 4615
    },
    "c12": {
      "x": 2505,
      "y": 4167
    },
    "c13": {
      "x": 2593,
      "y": 3735
    },
    "c20": {
      "x": 1529,
      "y": 4617
    },
    "c21": {
      "x": 1753,
      "y": 4367
    },
    "c22": {
      "x": 2000,
      "y": 3983
    },
    "c23": {
      "x": 2241,
      "y": 3591
    }
}

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
  var obj_keys = Object.keys(Space);
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
