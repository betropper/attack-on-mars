var C = {
 "game": {
   "width": 320,
   "height": 568,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      fontSize: '20px Arial'
   }
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
var turn;
var actionPoints = 3;
var closestSpaces;
var monstersList = [];

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

var spaceDisplay;
var destroyedCities = [];

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
      var destroyedCityColumn = spawnRandom("purplecircle", i, "0", false);
      destroyedCities[i-1] = destroyedCityColumn;
      occupiedRows.push(destroyedCityColumn.key.substring(0,2));
      playersList[i] = spawnRandom(playerNames[i-1], i, "0", true);
      playersList[i].number = i;
      playersList[i].rp = 3;
      playersList[i].hp = 4;
      monstersList[i-1] = spawnRandom("monster", i, "3", true);
    }
  }

  create() {
    turn = playersList[1];
    turn.sprite.inputEnabled = true;
    turn.sprite.input.enableDrag(true);
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    spaceDisplay = game.add.text(game.world.centerX - 40, game.world.centerY + 60,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
  }
  update() {
    if (spaceDisplay) {
      spaceDisplay.setText("Valid Movements for " + turn.sprite.key + ":\n " + turn.sprite.closestSpaces.keys.join(" ") + "\nRemaining moves: " + actionPoints,C.game.textStyle);
    }
  }

}


class Play {
    create() {
      console.log(playersList[1]);
    }
}

function moveMonsters() {
    for (var i = 0; i <= monstersList.length; i++) {
      monstersList[i].sprite.closestSpaces = getClosestSpaces(monstersList[i].key);
      var newDestination = monstersList[i].key.charAt(0,1) + (parseInt(monstersList[i].key.charAt(2)) - 1);
      if (parseInt(monstersList[i].key.charAt(2)) - 1 === 0 && monstersList[i].sprite.closestSpaces.selectedSpaces[newDestination].occupied && monstersList[i].sprite.closestSpaces.selectedSpaces[newDestination].occupied !== true) {
        console.log("U R DED");  
        var destroyedCityColumn = spawnRandom("purplecircle", newDestination.charCodeAt(0) - 96, "0", false);
        destroyedCities.push(destroyedCityColumn);
        occupiedRows.push(destroyedCityColumn.key.substring(0,2));
      } else if (parseInt(monstersList[i].key.charAt(2)) === 0 )  {
        newDestination = monstersList[i].sprite.closestSpaces.keys[clockwise];
        if (Space[newDestination].occupied !== true) {
          var destroyedCityColumn = spawnRandom("purplecircle", newDestination.charCodeAt(0) - 96, "0", false);
          destroyedCities.push(destroyedCityColumn);
          occupiedRows.push(destroyedCityColumn.key.substring(0,2));
        }
      }
      console.log(newDestination);
      move(monstersList[i], newDestination);
    }
    monstersList[].push(spawnRandom("monster", Math.floor(Math.random() * (playerCount - 1)) + 1, "3", true));
}

function move(object,destination) {
  object.sprite.x = Space[destination].x*C.bg.scale;
  object.sprite.y = Space[destination].y*C.bg.scale;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.key = destination;
  object.space.occupied = false;
  object.space = Space[destination];
  Space[destination].occupied = true;
}

function changeTurn() {
    actionPoints = 3;
    turn.sprite.input.enableDrag(false);
    turn.sprite.inputEnabled = false;
    if (turn.number < playerCount) {
      turn = playersList[turn.number + 1];
    } else {
      moveMonsters();
      turn = playersList[1];
    }
    //if (turn.sprite.inputEnabled === false) {
      turn.sprite.inputEnabled = true;
      turn.sprite.input.enableDrag(true);
    //}
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
}




function distance(x1, y1, x2, y2) {
   var dx = x1 - x2;
   var dy = y1 - y2;

   return Math.sqrt(dx * dx + dy * dy);
}

function attachClosestSpace(sprite,pointer) {
    var closestDistance = 9999;
    var closest = sprite;
    for (i = 0; i < sprite.closestSpaces.selectedSpaces.length; i++) {
        var spaceObjX = sprite.closestSpaces.selectedSpaces[i].x*C.bg.scale;
        var spaceObjY = sprite.closestSpaces.selectedSpaces[i].y*C.bg.scale;
        if (distance(spaceObjX,spaceObjY,sprite.x,sprite.y) < closestDistance) {
          closest = sprite.closestSpaces.selectedSpaces[i];
          closestDistance = distance(spaceObjX,spaceObjY,sprite.x,sprite.y);
          closestKey = sprite.closestSpaces.keys[i];
        }
    }
    console.log(closest);
    sprite.x = closest.x*C.bg.scale;
    sprite.y = closest.y*C.bg.scale;
    sprite.closestSpaces = getClosestSpaces(closestKey);
    turn.key = closestKey;
    turn.space.occupied = false;
    turn.space = closest;
    closest.occupied = true;
    actionPoints -= 1;
    if (actionPoints === 0) {
      changeTurn();
    }
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
      var counter_clockwise = close_keys.push(findPreviousLetter(spaceKey.charAt(0)) + 4 + spaceKey.charAt(2) );
      var clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
      console.log(findPreviousLetter(spaceKey));
     } else {
      var counter_clockwise = close_keys.push(lastQuadrant + 4 + spaceKey.charAt(2));
      var clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
     }     
  } else if (spaceKey.indexOf("4") === 1) {
    if (spaceKey.charAt(0) === lastQuadrant) {
      var counter_clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
      var clockwise = close_keys.push("a1" + spaceKey.charAt(2));
    } else {
      var counter_clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
      var clockwise = close_keys.push(findNextLetter(spaceKey.charAt(0)) + 1 + spaceKey.charAt(2) );
      console.log(findNextLetter(spaceKey));
    } 
   } else if (spaceKey !== "center") {
      var counter_clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) );
      var clockwise = close_keys.push(spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) );
   } 

  // These next if statements find the nearby spaces per column, up
   // and down. It accounts for the top and bottom spaces as well.
  if (spaceKey.indexOf("3") === 2 || spaceKey.indexOf("33") === 1) { 
    var inward = close_keys.push("center");
    var outward = close_keys.push(findPreviousLetter(spaceKey));
  } else if (spaceKey.indexOf("0") === 2 ) { 
    var inward = close_keys.push(findNextLetter(spaceKey));
  } else if (spaceKey === "center") {
    for (var i = 1; i <= playerCount; i++) {
       for (var l = 1; l <= 4; l++) {
         close_keys.push(String.fromCharCode(96 + i) + l + 3);
       } 
    } 
  } else {
    var inward = close_keys.push(findPreviousLetter(spaceKey));
    var outward = close_keys.push(findNextLetter(spaceKey));
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
