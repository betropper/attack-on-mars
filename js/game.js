var C = {
 "game": {
   "width": 3200,
   "height": 5680
 },
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": 0.58,
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


var First = "red";
var Second = "blue";
var Third = "green";
var Fourth = "orange";
var playersList = [First,Second,Third,Fourth];
var turn = playersList[1];
var occupiedRows = ['center'];

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
    this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
    this.load.image("redcircle", "assets/red-circle.png", 72, 72);
    this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);
    this.load.image("monster", "assets/green-circle.png", C.monster.width, C.monster.height);
    this.load.image("menubar","assets/greenishbar.jpg",1200,90);
  }
  create() {
    console.log("Loaded!");
    this.state.start("Setup");
  }

}

class Setup {

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
      var destroyedCityColumn = spawnRandom("purplecircle", i, "0", false);
      occupiedRows.push(destroyedCityColumn.substring(0,2));
      spawnRandom(playersList[i-1], i, "0", true) ;
      spawnRandom("monster", i, "i", true);
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


function spawnRandom(object,quadrant,row,occupiedCheck) {
  var condition;
  do {
      var space = getRandomSpace();
    if (quadrant === "random" && occupiedCheck === true) {
        condition = space.key.indexOf("0") || selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1; 
    } else if (quadrant === "random") {
        condition = space.key.indexOf("0");
    } else if (quadrant && row && occupiedCheck === true) {
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant && row) { 
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0;
    }
    console.log(condition);
  } while (condition === true);

  random = game.add.sprite(space.selectedSpace.x*C.bg.scale,space.selectedSpace.y*C.bg.scale,object); 
  random.anchor.x = .5;
  random.anchor.y = .5;
  random.scale.x = 2;
  random.scale.y = 2;
  random.smoothed = false;
  selectedSpace.occupied = true;
  return space.key;
}

var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.start("Boot");
