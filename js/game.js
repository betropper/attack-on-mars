var C = {
 "game": {
   "width": 320,
   "height": 568
 },
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": .058,
   "file": "assets/gameboard.jpg"
 },
 "mech": {
   "width": 72,
   "height": 72,
   "scale": .2
 },
 "monster": {
   "width": 72,
   "height": 72,
   "scale": .2
 }
}


var First = "red";
var Second = "blue";
var Third = "green";
var Fourth = "orange";
var playersList = [];
var occupiedRows = ['center'];
var playerNames = [First,Second,Third,Fourth];
var playerCount = 2;

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

  preload() {
    console.log("Placing Board");
    this.bg = this.add.tileSprite(0,0,5574,5574,"gameboard");
    this.bg.scale.set(C.bg.scale || .1);
    playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      playerCount = 2;
    } else if (playerCount > 4) {
      playerCount = 4;
    }
    //players = game.add.group();
    for (var i = 1; i <= playerCount; i++) {
      console.log(i);
      var destroyedCityColumn = spawnRandom("purplecircle", i, "0", false).key;
      occupiedRows.push(destroyedCityColumn.substring(0,2));
      playersList[i] = spawnRandom(playerNames[i-1], i, "0", true);
      spawnRandom("monster", i, "3", true);
    }
  }

  create() {
    var turn = playersList[1];
    turn.sprite.inputEnabled = true;
    turn.sprite.input.enableDrag(true);
    var closestSpaces = getClosestSpaces(turn.key);
    //turn.events.onDragStop.add(attachClosestSpace, this,
    //moveableSpaces);
  }
}


class Play {
    create() {
      console.log(playersList[1]);
    }
}

function attachClosestSpace(mech,closestSpaces) {
    
}

function findNextLetter(letter) {
  return letter.substring(0,letter.length-1)+String.fromCharCode(letter.charCodeAt(letter.length-1)+1)
}

function findPreviousLetter(letter) {
  return letter.substring(0,letter.length-1)+String.fromCharCode(letter.charCodeAt(letter.length-1)-1)
}

function getClosestSpaces(spaceKey) { 
  var obj_keys = Object.keys(Space);
  var close_keys = [];
  var lastQuadrant = String.fromCharCode(96 + playerCount);
  //Fisrt three, the if, the else if, and the else, determine the left and right
  //spaces. Pattern is Left, Right, Up, Down
  if (spaceKey.indexOf("1") === 1) {
    if (spaceKey.charAt(0) !== "a") {
      close_keys.push(findPreviousLetter(spaceKey.charAt(0)) + 4 + spaceKey.charAt(2) );
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
      console.log(findPreviousLetter(spaceKey));
     } else {
      close_keys.push(lastQuadrant + 4 + spaceKey.charAt(2));
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
     }     
  } else if (spaceKey.indexOf("4") === 1) {
    if (spaceKey.charAt(0) === lastQuadrant) {
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
      close_keys.push("a1" + spaceKey.charAt(2));
    } else {
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
      close_keys.push(findNextLetter(spaceKey.charAt(0)) + 1 + spaceKey.charAt(2) );
      console.log(findNextLetter(spaceKey));
    } 
   } else {
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
      close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
   } 

  // These next if statements find the nearby spaces per column, up
   // and down. It accounts for the top and bottom spaces as well.
  if (spaceKey.indexOf("3") === 2) { 
    close_keys.push("center");
    close_keys.push(findPreviousLetter(spaceKey));
  } else if (spaceKey.indexOf("0") === 2 ) { 
    close_keys.push(findNextLetter(spaceKey));
  } else if (spaceKey === "center") {
    for (var i = 1; i <= playerCount; i++) {
       for (var l = 1; l <= 4; l++) {
         close_keys.push(String.fromCharCode(96 + i) + l + 3);
       } 
    } 
  } else {
    close_keys.push(findPreviousLetter(spaceKey));
    close_keys.push(findNextLetter(spaceKey));
  }
  selectedSpaces = [];
  close_keys.forEach(function(key) {
    selectedSpaces.push(Space[key]);
  });
  return {
    selectedSpaces: selectedSpaces,
    keys: close_keys
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
    } else {
        condition = false;
    }
    console.log(condition);
  } while (condition === true);

  random = game.add.sprite(space.selectedSpace.x*C.bg.scale,space.selectedSpace.y*C.bg.scale,object); 
  random.anchor.x = .5;
  random.anchor.y = .5;
  random.scale.x = C.mech.scale;
  random.scale.y = C.mech.scale;
  random.smoothed = false;
  space.selectedSpace.occupied = true;
  return {
    space: space.selectedSpace,
    key: space.key,
    sprite: random
  }
}

var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.add("Play",Play);
game.state.start("Boot");
