var C = {
 "game": {
   "width": 320,
   "height": 568,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '16px Poiret One'
   }
 },
 "bg": {
   "width": 5574,
   "height": 5574,
   "scale": .058,
   "file": "assets/gameboard.png"
 },
 "mech": {
   "width": 72,
   "height": 72,
   "scale": .2
 },
 "destroyed": {
   "scale": .25
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
var globalList = [];
var spaceDisplay;
var attributeDisplay;
var destroyedCities = [];
var obj_keys = Object.keys(Space);

class Boot {
  preload() {
    this.scale.pageAlignHorizontally = true;
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.scale.pageAlignVertically = true;
  }
  create() {
    this.state.start("Load");
  }
}

class Load {
  preload() {
    console.log("Loading.");
    this.load.image("gameboard",C.bg.file,C.bg.width,C.bg.height);
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
    game.bg = game.add.tileSprite(0,0,5574,5574,"gameboard");
    game.bg.scale.set(C.bg.scale);
    playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      playerCount = 2;
    } else if (playerCount > 4) {
      playerCount = 4;
    }
    //players = game.add.group();

    for (var i = 0; i < obj_keys.length; i++) {
      Space[obj_keys[i]].occupied = false;
    }   

    for (var i = 1; i <= playerCount; i++) {
      console.log(i);
      var destroyedCityColumn = spawnRandom("purplecircle", i, "0", false);
      destroyedCities[i-1] = destroyedCityColumn;
      occupiedRows.push(destroyedCityColumn.key.substring(0,2));
      playersList[i] = spawnRandom(playerNames[i-1], i, "0", true);
      playersList[i].number = i;
      playersList[i].sprite.inputEnabled = true;
      playersList[i].sprite.input.enableDrag(true);
      monstersList[i-1] = spawnRandom("monster", i, "3", true);
    }
  }

  create() {
    turn = playersList[1];
    turn.sprite.inputEnabled = true;
    turn.sprite.input.enableDrag(true);
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    // Add in text that is displayed.
    spaceDisplay = game.add.text(game.world.centerX, game.world.centerY + 150,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    attributeDisplay = game.add.text(game.world.centerX, game.world.centerY + 230, "", C.game.textStyle);
    spaceDisplay.anchor.setTo(.5); 
    attributeDisplay.anchor.setTo(.5);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    // Temporary for testing. Change this later.
    var waitButton = game.add.button(spaceDisplay.x, spaceDisplay.y - 70, 'purplecircle', waitOneAction);
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    waitButton.scale.y = .6;
  }
  update() {
    if (spaceDisplay) {
      spaceDisplay.setText("Valid Movements for " + turn.sprite.key + ":\n " + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    }
    for (var i = 0; i < globalList.length; i++) {
      if (globalList[i].sprite.input && globalList[i].sprite.input.pointerOver()) {
        var over = globalList[i];
      }
    }
    if (over) { 
      if (playerNames.indexOf(over.sprite.key) > -1) {
        attributeDisplay.setText("Name: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Points: " + over.rp)
      }
    } else {
      attributeDisplay.setText("Remaining Moves: " + actionPoints);
    }

  }

}


class GameOver {
    create() {
      console.log("YOU LOSE.");
      var gg = game.add.text(game.world.centerX, game.world.centerY, "GAME\nOVER\n\nRestart?",C.game.textStyle);
      gg.anchor.setTo(.5); 
    }
}

function waitOneAction() {
  actionPoints -= 1;  
  if (actionPoints === 0) {
    changeTurn();
  }
}

function moveMonsters() {
    for (var i = 0; i <= monstersList.length - 1; i++) {
      monstersList[i].sprite.closestSpaces = getClosestSpaces(monstersList[i].key);
      var newDestination = monstersList[i].key.substring(0,2) + (parseInt(monstersList[i].key.charAt(2)) - 1);
      if (parseInt(monstersList[i].key.charAt(2)) !== 0 && parseInt(newDestination.charAt(2)) === 0) {
        if (Space[newDestination].occupied === false || Space[newDestination].occupied === null || Space[newDestination].occupied === undefined) {
          console.log("U R DED"); 
          var destroyedCityColumn = spawnSpecific("purplecircle", newDestination);
          destroyedCities.push(destroyedCityColumn);
          occupiedRows.push(destroyedCityColumn.key.substring(0,2));
        }
      } else if (parseInt(monstersList[i].key.charAt(2)) === 0 )  {
        newDestination = monstersList[i].sprite.closestSpaces.directions[1];
        if (Space[newDestination].occupied === false || Space[newDestination].occupied === null || Space[newDestination].occupied === undefined) {
          var destroyedCityColumn = spawnSpecific("purplecircle", newDestination);
          destroyedCities.push(destroyedCityColumn);
          occupiedRows.push(destroyedCityColumn.key.substring(0,2));
        } else {
        }
      }
      console.log("Monster is moving to " + Space[newDestination].occupied);
      move(monstersList[i], newDestination);
    }
    if (destroyedCities.length >= (playerCount * 4) - 4){
      game.state.start("GameOver");
    } else {
      var newMonster = monstersList.push(spawnRandom("monster", "random", "3"));
      console.log("New Monster is: ");
      console.log(newMonster-1);
      checkBattle(monstersList[newMonster-1].space);
    }
}

function move(object,destination) {
  console.log(object);
  object.sprite.x = Space[destination].x*C.bg.scale;
  object.sprite.y = Space[destination].y*C.bg.scale;
  removeFromList(object, Space[object.key]);
  object.key = destination;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.space = Space[destination];
  addToOccupied(object, Space[destination]);
  game.world.bringToTop(object.sprite);
  checkBattle(object.space);
}

function checkBattle(space) {
  //Takes a space, and if there are both monsters and players on that
  //space, battle happens.
  if (space.occupied != false) {
    var monsterCount = 0;
    var playerCount = 0;
    for (i = 0; i < space.occupied.length; i++) {
      if (space.occupied[i].sprite.key.indexOf('monster') > -1) {
        monsterCount += 1;
      } else if (playerNames.indexOf(space.occupied[i].sprite.key) > -1) {
        playerCount += 1;
      }
    }
    if (monsterCount > 0 && playerCount > 0) {
      console.log("BATTLE!");
      //game.paused = true;
       
    }
  }
}


function changeTurn() {
    actionPoints = 3;
    turn.sprite.input.enableDrag(false);
    //turn.sprite.inputEnabled = false;
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
    var closestSpaces = sprite.closestSpaces;
    if (playerNames.indexOf(sprite.key) > -1) {
      var obj = playersList[playerNames.indexOf(sprite.key) + 1]
      closestSpaces.selectedSpaces.push(obj.space);
      closestSpaces.keys.push(obj.key);
      console.log(closestSpaces);
    }
    for (i = 0; i < closestSpaces.selectedSpaces.length; i++) {
        var spaceObjX = closestSpaces.selectedSpaces[i].x*C.bg.scale;
        var spaceObjY = closestSpaces.selectedSpaces[i].y*C.bg.scale;
        if (distance(spaceObjX,spaceObjY,sprite.x,sprite.y) < closestDistance) {
          closest = closestSpaces.selectedSpaces[i];
          closestDistance = distance(spaceObjX,spaceObjY,sprite.x,sprite.y);
          closestKey = closestSpaces.keys[i];
        }
    }

    if (closestKey !== obj.key) {
        actionPoints -= 1;
    }
    if (playerNames.indexOf(sprite.key) > -1) {
      move(obj, closestKey);
    } else { 
      move(turn, closestKey);
    }
    /*console.log(closest);
    sprite.x = closest.x*C.bg.scale;
    sprite.y = closest.y*C.bg.scale;
    sprite.closestSpaces = getClosestSpaces(closestKey);
    turn.key = closestKey;
    turn.space.occupied = removeFromList(turn, turn.space)
    turn.space = closest;
    addToOccupied(turn, closest);*/
    if (actionPoints === 0) {
      changeTurn();
    }
}

function removeFromList(object,arrayName) {
 var x;
 var tmpArray = new Array();
 for(x = 0; x <= arrayName.occupied.length; x++)
 {
  if( arrayName.occupied[x] != undefined && arrayName.occupied[x].sprite.key != object.sprite.key ) { tmpArray[x] = arrayName.occupied[x]; }
 }
  if (tmpArray.length === 0) {
    arrayName.occupied = false;
  } else {
    return tmpArray;
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
  var inward; var outward; var clockwise; var counter_clockwise;
  //Fisrt three, the if, the else if, and the else, determine the left and right
  //spaces. Pattern is Left, Right, Up, Down
  if (spaceKey.indexOf("1") === 1) {
    if (spaceKey.charAt(0) !== "a") {
      counter_clockwise = findPreviousLetter(spaceKey.charAt(0)) + 4 + spaceKey.charAt(2);
      clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2);
     } else {
      counter_clockwise = lastQuadrant + 4 + spaceKey.charAt(2);
      clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2);
     }     
  } else if (spaceKey.indexOf("4") === 1) {
    if (spaceKey.charAt(0) === lastQuadrant) {
      counter_clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2);
      clockwise = "a1" + spaceKey.charAt(2);
    } else {
      counter_clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2);
      clockwise = findNextLetter(spaceKey.charAt(0)) + 1 + spaceKey.charAt(2);
      console.log(findNextLetter(spaceKey));
    } 
   } else if (spaceKey !== "center") {
      counter_clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) + 1) + spaceKey.charAt(2) ;
      clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2) ;
   } 

  selectedSpaces = [];
  // These next if statements find the nearby spaces per column, up
  // and down. It accounts for the top and bottom spaces as well.
  if (spaceKey.indexOf("3") === 2 || spaceKey.indexOf("33") === 1) { 
    inward = "center";
    outward = findPreviousLetter(spaceKey);
  } else if (spaceKey.indexOf("0") === 2 ) { 
    inward = findNextLetter(spaceKey);
  } else if (spaceKey === "center") {
    for (var i = 1; i <= playerCount; i++) {
       for (var l = 1; l <= 4; l++) {
         close_keys.push(String.fromCharCode(96 + i) + l + 3);
         selectedSpaces.push(Space[String.fromCharCode(96 + i) + l + 3]);
       } 
    } 
  } else {
    inward = findPreviousLetter(spaceKey);
    outward = findNextLetter(spaceKey);
  }
  var directions = [clockwise,counter_clockwise,inward,outward]
  directions.forEach(function(direction) {
    if (direction !== undefined) {
      selectedSpaces.push(Space[direction]);
      close_keys.push(direction);
    }
  });
  return {
    selectedSpaces: selectedSpaces,
    keys: close_keys,
    directions: directions
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
    } else if (quadrant && row && occupiedCheck === true) {
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant && row && quadrant === "random") {
        var chr = String.fromCharCode(96 + Math.floor(Math.random() * (playerCount)) + 1);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant === "random") {
        condition = space.key.indexOf("0");
    } 
    else if (quadrant && row) { 
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
  if (object === "purplecircle") {
    random.scale.x = C.destroyed.scale;
    random.scale.y = C.destroyed.scale;
  } else {
    random.scale.x = C.mech.scale;
    random.scale.y = C.mech.scale;
  }

  random.smoothed = false;
  var obj =  {
    space: space.selectedSpace,
    key: space.key,
    sprite: random
  };
  globalList.push(obj);
  if (space.selectedSpace.occupied === false) {
    space.selectedSpace.occupied = [obj];
  } else {
    addToOccupied(obj,space.selectedSpace); 
  }

  //deal with hitpoint values and other values
  if (playerNames.indexOf(object) > -1) {
    obj.rp = 3;
    obj.hp = 4; 
  } else if (object === "monster") {
    game.world.bringToTop(random);
    if (monstersList.length <= 12) {
      obj.hp = 1;
    }
  }
  return obj
}

function addToOccupied(object,space) {
  if (space.occupied === false || space.occupied === undefined) {
    space.occupied = [object];
  } else {
    space.occupied.push(object);
  }
}

function spawnSpecific(object,space) {
  targetSpace = Space[space]
  spawn = game.add.sprite(targetSpace.x*C.bg.scale,targetSpace.y*C.bg.scale,object); 
  spawn.anchor.x = .5;
  spawn.anchor.y = .5;
  if (object === "purplecircle") {
    spawn.scale.x = C.destroyed.scale;
    spawn.scale.y = C.destroyed.scale;
  } else {
    spawn.scale.x = C.mech.scale;
    spawn.scale.y = C.mech.scale;
  }
  if (object === "monster") {
    game.world.bringToTop(random);
  }
  spawn.smoothed = false;
  addToOccupied(targetSpace,spawn);
  return {
    space: targetSpace,
    key: space,
    sprite: spawn
  }
}

var game = new Phaser.Game(C.game.width,C.game.height);
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.add("GameOver",GameOver);
game.state.start("Boot");
