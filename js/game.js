var C = {
 "game": {
   "width": 640,
   "height": 1136,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '16px Poiret One'
   },
    "scaleRatio": window.devicePixelRatio / 3
 },
 "bg": {
   "resize": .25,
   "width": 1394,
   "height": 1394,
   "scale": .46,
   "file": "assets/gameboard.png"
 },
 "mech": {
   "width": 72,
   "height": 72,
   "scale": .4
 },
 "destroyed": {
   "scale": .55
 },

 "monster": {
   "width": 72,
   "height": 72,
   "scale": .4
 },
 "menuBar": {
  "width": 640,
  "height": 320
 }
}

var worldScale = 1;
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
var viewRect;
var zoomIn;
var zoomOut;
var focusSpace;
var battlePlayer = null;
var battleMonster = null;
var battleStarting = false;
var pendingBattles = [];
var threatLevel = 0;
var menuBar;

//CHANGE THE CAMERA BOUNDS SO YOU CAN CHANGE EVERYTHING ELSE AHHHH

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
    this.load.image("menubar","assets/menubar.png",C.menuBar.width,C.menuBar.height);
  }
  create() {
    console.log("Loaded!");
    this.state.start("Setup");
  }
}

class Setup {

  create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.camera.bounds = null;
    console.log("Placing Board");
    game.bg = game.add.sprite(0, game.world.centerY - game.height / 2, "gameboard");
    game.bg.scale.setTo(C.bg.scale, C.bg.scale);
    playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      playerCount = 2;
    } else if (playerCount > 4) {
      playerCount = 4;
    }
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
      closestSpaces = getClosestSpaces(playersList[i].key);
      playersList[i].sprite.closestSpaces = closestSpaces;
      playersList[i].sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      monstersList[i-1] = spawnRandom("monster", i, "3", true);
      monstersList[i-1].number = i - 1; 
    }
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
    menuBar = game.add.sprite(0,(game.height/worldScale) - 320 + C.menuBar.height/4,"menubar");
    menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
  }
  update() {
    //Set ZoomIn to true or ZoomOut to false to enable zoom. It will
    //reset itself.
    if (actionPoints === 0 && pendingBattles.length === 0 && zoomOut !== true && zoomOut !== true) {
      changeTurn();
      game.world.bringToTop(menuBar);
    }
    if (focusSpace && focusSpace.x) {
      var xPivot = changeValueScale(focusSpace.x) * 3 - game.camera.view.halfWidth;
      var yPivot = changeValueScale(focusSpace.y) * 3 - game.camera.view.halfHeight; 
      var xMenu = changeValueScale(focusSpace.x); 
      var yMenu = changeValueScale(focusSpace.y);
    }
    
    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      game.camera.y -= 4;
      console.log(game.camera.y);
    }

     if (zoomIn === true) {
        worldScale += 0.03;
        console.log("Tick.");
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/3, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/3, C.menuBar.height);
        if (yPivot < 0) {
          yPivot = 0
        }
        if (Math.floor(worldScale) === 3 && Math.floor(yPivot) === game.camera.y && Math.floor(xPivot) === game.camera.x) {
          zoomIn = false;
          console.log("Done zooming");
        }
        if (game.camera.x < xPivot && xPivot > 0) {
          game.camera.x = Phaser.Math.clamp(game.camera.x + focusSpace.increment.x, 0, xPivot);
        } else if (game.camera.x > xPivot && xPivot > 0) {
          game.camera.x = Phaser.Math.clamp(game.camera.x - focusSpace.increment.x, xPivot, 9999);
        }
        if (game.camera.y < yPivot && yPivot > 0) {
          game.camera.y = Phaser.Math.clamp(game.camera.y + focusSpace.increment.y, 0, yPivot);
        } else if (game.camera.y > yPivot && yPivot > 0) {
          game.camera.y = Phaser.Math.clamp(game.camera.y - focusSpace.increment.y, yPivot, 9999);
        }
       //console.log("x is " + xPivot);
       //console.log("y is " + yPivot);
    } else if (zoomOut === true) {
        worldScale -= 0.03;
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/3, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/3, C.menuBar.height);
        if (game.camera.x > 0 || game.camera.y > 0) {
          game.camera.x -= focusSpace.increment.x;
          game.camera.y -= focusSpace.increment.y;
          game.camera.x = Phaser.Math.clamp(game.camera.x, 0, 3000);
          game.camera.y = Phaser.Math.clamp(game.camera.y, 0, 3000);

        } else if (worldScale <= 1) {
            zoomOut = false;

        }
    } if (battleStarting) {
      var lookAt = focusSpace.x * C.bg.scale*C.bg.resize + game.bg.position.x;
      battlePlayer.sprite.x = Phaser.Math.clamp(battlePlayer.sprite.x + .2, 0, lookAt + 30);
      battleMonster.sprite.x = Phaser.Math.clamp(battleMonster.sprite.x - .2, lookAt - 30, 3000);
      if (battlePlayer.sprite.x === lookAt + 30 && battleMonster.sprite.x - 30) {
        battleStarting = false;
        battle(battlePlayer,battleMonster);
      }
    }
    // set a minimum and maximum scale value
    
    worldScale = Phaser.Math.clamp(worldScale, 1, 3);
    game.world.scale.set(worldScale);
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
      } else if (over.sprite.key = "monster") {
        attributeDisplay.setText("Name: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Point Reward: " + over.rp)
      }
    } else {
      attributeDisplay.setText("Remaining Moves: " + actionPoints);
    }
  }
}


class GameOver {
    create() {
        game.world.scale.set(1);
        console.log("YOU LOSE.");
        var gg = game.add.text(game.world.centerX, game.world.centerY, "GAME\nOVER\n\nRestart?",C.game.textStyle);
        gg.anchor.setTo(.5);
        game.world.pivot.x = 0;
        game.world.pivot.y = 0;
        game.camera.x = 0;
        game.camera.y = 0;
      }
   
}

function attachToCamera(obj) {
        /*
        obj.width = C.obj.width / worldScale;
        obj.height = C.obj.height / worldScale;
        obj.width = Phaser.Math.clamp(obj.width, C.obj.width/3, C.obj.width);
        obj.height = Phaser.Math.clamp(obj.height, C.obj.height/3, C.obj.height);
        */
    }

function findIncrementsTo(space) {
    space.increment = {x: (changeValueScale(space.x) * 3 - game.camera.view.halfWidth) / 67, y: (changeValueScale(space.y) * 3 - game.camera.view.halfHeight) / 67};
}

function changeValueScale(value) {
  return value * C.bg.scale*C.bg.resize + game.bg.position.x; 
}

function battle(player, monster) {
  //Simple Placeholder battle
  console.log(monster);
  console.log(player);
  focusSpace.occupied = removeFromList(monster, focusSpace);
  monster.sprite.destroy();
  
  monstersList.splice(monster.number, 1);
  pendingBattles.splice(0,1);
  player.hp -= 1;
  if (player.hp === 0) {
    console.log("DED.");
    removeFromList(player, focusSpace);
    playersList[player.number] = player.number;
    player.sprite.destroy();
    var destroyedPlayers = 0;
    for (var i = 1; i <= playersList.length; i++) {
      if (Number.isInteger(playersList[i])) {
        destroyedPlayers += 1;
      }
    }
    console.log("There are " + destroyedPlayers + " mechs destroyed.")
    if (destroyedPlayers === playerCount) {
      zoomOut = true;
      game.state.start("GameOver");
    }
  } else {
    player.sprite.x = changeValueScale(focusSpace.x);
    player.sprite.y = changeValueScale(focusSpace.y);
    }
    if (pendingBattles.length > 0) {
      console.log("There are more battles.");
      focusSpace = pendingBattles[0].space;
      findIncrementsTo(focusSpace);
      battleMonster = pendingBattles[0].pendingMonster;
      battlePlayer = pendingBattles[0].pendingPlayer;
      zoomIn = true;
      battleStarting = true;
    } else {
      zoomOut = true;
    }
  }

  function waitOneAction() {
    actionPoints -= 1;  
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
      var newMonster = monstersList.push(spawnRandom("monster", "random", "3")) - 1;
      console.log("New Monster is: ");
      console.log(newMonster);
      checkBattle(monstersList[newMonster].space);
    }
}

function move(object,destination) {
  console.log(object);
  object.sprite.x = Space[destination].x*C.bg.scale*C.bg.resize + game.bg.position.x;
  object.sprite.y = Space[destination].y*C.bg.scale*C.bg.resize + game.bg.position.y;
  removeFromList(object, Space[object.key]);
  object.key = destination;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.space = Space[destination];
  addToOccupied(object, Space[destination]);
  game.world.bringToTop(object.sprite);
  checkBattle(Space[object.key]);
}

function checkBattle(space) {
  //Takes a space, and if there are both monsters and players on that
  //space, battle happens
  
  var pendingMonster = null;
  var pendingPlayer = null;
  if (space.occupied != false) {
    for (i = 0; i < space.occupied.length; i++) {
      if (space.occupied[i] && space.occupied[i].sprite.key.indexOf('monster') > -1) {
        pendingMonster = space.occupied[i];
      } else if (space.occupied[i] && playerNames.indexOf(space.occupied[i].sprite.key) > -1) {
        pendingPlayer = space.occupied[i];
      }
    }
    if (pendingPlayer === null || pendingMonster === null) {
      pendingMonster = null;
      pendingPlayer = null;
    } else {
      console.log("BATTLE with " + pendingPlayer.sprite.key + pendingMonster.sprite.key);
      if (pendingBattles.length > 0) {
        pendingBattles.push({pendingPlayer,pendingMonster,space});
      } else {
        pendingBattles.push({pendingPlayer,pendingMonster,space});
        battlePlayer = pendingPlayer;
        battleMonster = pendingMonster;
        focusSpace = space;
        findIncrementsTo(focusSpace);
        zoomIn = true;
        battleStarting = true;
      }
    }
  }
}


function changeTurn() {
    actionPoints = 3;
    //turn.sprite.inputEnabled = false
    do {
      if (turn && turn.number && turn.number < playerCount) {
        turn = playersList[turn.number + 1];
      } else if (turn && turn.number && turn.number <= playerCount || Number.isInteger(turn) && turn === playerCount) {
        moveMonsters();
        turn = playersList[1];
      } else if (Number.isInteger(turn)) {
        turn += 1;
        turn = playersList[turn];
      }
    } while (Number.isInteger(turn))
      console.log("Switching to this turn:");
      console.log(turn);
    //if (turn.sprite.inputEnabled === false) {
    //}
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
        var spaceObjX = closestSpaces.selectedSpaces[i].x*C.bg.scale*C.bg.resize + game.bg.position.x;
        var spaceObjY = closestSpaces.selectedSpaces[i].y*C.bg.scale*C.bg.resize + game.bg.position.y;
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
}

function removeFromList(object,arrayName) {
 var x;
 var tmpArray = new Array();
 if (object) {
    for(x = 0; x <= arrayName.occupied.length; x++) {
      if(arrayName.occupied[x] != undefined && arrayName.occupied[x].sprite.key != object.sprite.key ) { tmpArray[x] = arrayName.occupied[x]; }
    }
  } //else {
      //if(arrayName.occupied[x] != undefined) { tmpArray[x] = arrayName.occupied[x]; }
  //}
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
      clockwise = spaceKey.charAt(0) + (parseInt(spaceKey.charAt(1)) - 1) + spaceKey.charAt(2);
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

  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,object); 
  random.anchor.x = .5;
  random.anchor.y = .5;
  if (object === "purplecircle") {
    random.scale.x = C.destroyed.scale;
    random.scale.y = C.destroyed.scale;
  } else {
    random.scale.x = C.mech.scale;
    random.scale.y = C.mech.scale;
  }
  random.smoothed = true;
  //random.scale.setTo(C.game.scaleRatio,C.game.scaleRatio)
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
    obj.def = 3;
    obj.ratk = 4;
    obj.batk = 4;
    obj.sprite.inputEnabled = true;
    obj.sprite.input.enableDrag(true);
  } else if (object === "monster") {
    threatLevel += 1;
    game.world.bringToTop(random);
    obj.sprite.inputEnabled = true;
    if (threatLevel <= 12) {
      obj.hp = 3;
      obj.atk = 3;
      obj.rp = 1;
      obj.mr = 2;
    } else if (threatLevel <= 24) {
      obj.hp = 4;
      obj.atk = 4;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      obj.hp = 5;
      obj.atk = 5;
      obj.rp = 3;
      obj.mr = 4;
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
  spawn = game.add.sprite(targetSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,targetSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,object); 
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
    obj.sprite.inputEnabled = true;
    if (monstersList.length <= 12) {
      obj.hp = 3;
      obj.atk = 3;
      obj.rp = 1;
      obj.mr = 2;
    } else if (monstersList.length <= 24) {
      obj.hp = 4;
      obj.atk = 4;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      obj.hp = 5;
      obj.atk = 5;
      obj.rp = 3;
      obj.mr = 4;
    }
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
//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;game.scale.minWidth = 320;game.scale.minHeight = 480;game.scale.maxWidth = 768;game.scale.maxHeight = 1152;
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.add("GameOver",GameOver);
game.state.start("Boot");

