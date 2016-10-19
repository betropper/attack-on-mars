var C = {
 "game": {
   "width": 1200,
   "height": 640,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '20px Poiret One'
   },
   "smallStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '10px Poiret One',
      "style": {
        backgroundColor: 'black'
      }
   },
    "scaleRatio": window.devicePixelRatio / 3
 },
 "bg": {
   "resize": .25,
   "width": 1394,
   "height": 1394,
   "scale": .40,
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
  "width": 1200,
  "height": 160
 },
 "wrench": {
  "width": 200,
  "height": 200
 },
 "arrow": {
  "width": 512,
  "height": 512
 }
}
var attackText;
var waitButton;
var lastClicked;
var repairText;
var upgradeText;
var upgradeMenu;
var worldScale = 1;
var First = "red";
var Second = "blue";
var Third = "green";
var Fourth = "yellow";
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
var battleTurn = null;
var battleStarting = false;
var pendingBattles = [];
var threatLevel = 0;
var menuBar;
var battleState;
var resultsList = [];
var buttonsList = [];
var buttonsTextList = [];
//CHANGE THE CAMERA BOUNDS SO YOU CAN CHANGE EVERYTHING ELSE AHHHH

class Boot {
  init() {

  }
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

  game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
  game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 325, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });
  game.kineticScrolling.start();
    console.log("Loading.");
    this.load.image("upgradeMat","assets/UpgradeMat.png",469,676);
    this.load.image("gameboard",C.bg.file,C.bg.width,C.bg.height);
    this.load.image("blue", "assets/PlayerIcon1.png",C.mech.width,C.mech.height);
    this.load.image("red", "assets/PlayerIcon2.png",C.mech.width,C.mech.height);
    this.load.image("green", "assets/PlayerIcon3.png",C.mech.width,C.mech.height);
    this.load.image("yellow", "assets/PlayerIcon4.png",C.mech.width,C.mech.height);
    this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
    this.load.image("redcircle", "assets/red-circle.png", 72, 72);
    this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);
    this.load.image("initialMonster", "assets/InitialIcon.png", C.monster.width, C.monster.height);
    this.load.image("growingMonster", "assets/GrowingIcon.png", C.monster.width, C.monster.height);
    this.load.image("extinctionMonster", "assets/ExtinctionIcon.png", C.monster.width, C.monster.height);
    this.load.image("menubar","assets/menubar.png",C.menuBar.width,C.menuBar.height);
    this.load.image("wrench","assets/wrench.png", C.wrench.width,C.wrench.height);
    this.load.image("arrow","assets/arrow.png", C.arrow.width,C.arrow.height);
    game.load.bitmapFont('attackfont','assets/attackfont.png', 'assets/attackfont.fnt');
  }
  create() {
    console.log("Loaded!");
    this.state.start("Setup");
  }
}


/*class Reload {
    create() {

    game.bg = game.add.sprite(0, game.world.centerY - game.height / 2, "gameboard");
    game.bg.scale.setTo(C.bg.scale, C.bg.scale);
    for (var i = 0; i < obj_keys.length; i++) {
      Space[obj_keys[i]].occupied = false;
    }   

    for (var i = 1; i <= playerCount; i++) {
      if (!Number.isInteger(playersList[i])) {
        playersList[i].sprite = game.add.sprite(playersList[i].sprite.x, playersList[i].sprite.y, playerNames[i]);
        playersList[i].sprite.number = i;
        playersList[i].sprite.inputEnabled = true;
        playersList[i].sprite.input.enableDrag(true);
        playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
        closestSpaces = getClosestSpaces(playersList[i].key);
        playersList[i].sprite.closestSpaces = closestSpaces;
        playersList[i].sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      }
    }
    for (var i = 0; i < monstersList; i++) {
      if (monstersList[i].hp > 0) {
        monstersList[i].sprite = game.add.sprite(monstersList[i].sprite.x, monstersList[i].sprite.y, monstersList[i].sprite.spriteName);
        monstersList[i].sprite.number = i;
        monstersList[i].sprite.inputEnabled = true;
        monstersList[i].sprite.events.onInputDown.add(setLastClicked, this);
      }
    }

    spaceDisplay = game.add.text(900, 250,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    attributeDisplay = game.add.text(spaceDisplay.x, spaceDisplay.y + 160, "", C.game.textStyle);
    spaceDisplay.anchor.setTo(.5); 
    attributeDisplay.anchor.setTo(.5);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    // Temporary for testing. Change this later.
    menuBar = game.add.sprite(0,(game.height/worldScale) - 162 + C.menuBar.height/4,"menubar");
    menuBar.width = C.menuBar.width;
    menuBar.height = C.menuBar.height;
    menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
    waitButton = game.add.button(80, menuBar.y + 80, 'purplecircle', waitOneAction);
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    waitButton.scale.y = .6;
    waitButton.battleButton = false;
    buttonsList.push(waitButton);
    game.world.bringToTop(waitButton);
  }

  update() {

    //Set ZoomIn to true or ZoomOut to false to enable zoom. It will
    //reset itself.
    if (actionPoints === 0 && pendingBattles.length === 0 && zoomOut !== true && zoomOut !== true) {
      changeTurn();
    }
    if (focusSpace && focusSpace.x) {
      var xPivot = changeValueScale(focusSpace.x) * 4 - game.camera.view.halfWidth;
      var yPivot = changeValueScale(focusSpace.y) * 4 - game.camera.view.halfHeight; 
      var xMenu = changeValueScale(focusSpace.x); 
      var yMenu = changeValueScale(focusSpace.y);
    }
    
    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      game.camera.y -= 4;
      console.log(game.camera.y);
    }

     if (zoomIn === true) {
       for (i = 0; i < buttonsTextList.length; i++) {
        buttonsTextList[0].kill();
       }
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i] !== battlePlayer) {
            playersList[i].sprite.inputEnabled = false;
          }
        }
        worldScale += 0.03;
        console.log("Tick.");
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/4, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/4, C.menuBar.height);
        game.world.bringToTop(menuBar);
        if (yPivot < 0) {
          yPivot = 0
        }
        if (Math.floor(worldScale) === 4 && Math.floor(yPivot) === game.camera.y && Math.floor(xPivot) === game.camera.x) {
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
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/4, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/4, C.menuBar.height);
        game.world.bringToTop(menuBar);
        if (game.camera.x > 0 || game.camera.y > 0) {
          if (focusSpace.increment.x > 0) {
            game.camera.x -= focusSpace.increment.x;
          } else {
            game.camera.x += focusSpace.increment.x;
          }
          if (focusSpace.increment.y > 0) {
            game.camera.y -= focusSpace.increment.y;
          } else {
            game.camera.y += focusSpace.increment.y;
          }

          game.camera.x = Phaser.Math.clamp(game.camera.x, 0, 3000);
          game.camera.y = Phaser.Math.clamp(game.camera.y, 0, 3000);

        } else if (worldScale <= 1) {
            zoomOut = false;
            for (i = 0; i < buttonsList.length; i++) {
              game.world.bringToTop(buttonsList[i]);
            }

            for (i = 0; i < buttonsTextList.length; i++) {
              buttonsTextList[0].reset(buttonsTextList[0].x,buttonsTextList[0].y);
            }
        }
    } if (battleStarting) {
      var lookAt = focusSpace.x * C.bg.scale*C.bg.resize + game.bg.position.x;
      battlePlayer.sprite.x = Phaser.Math.clamp(battlePlayer.sprite.x + .2, 0, lookAt + 30);
      battleMonster.sprite.x = Phaser.Math.clamp(battleMonster.sprite.x - .2, lookAt - 30, 3000);
      if (battlePlayer.sprite.x === lookAt + 30 && battleMonster.sprite.x - 30) {
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
        battleStarting = false;
        battleState = true;
        }
    } else if (battleState === true) {
      battle(battlePlayer,battleMonster);
      // Change this, placeholder ending.

    }
    // set a minimum and maximum scale value
    worldScale = Phaser.Math.clamp(worldScale, 1, 4);
    game.world.scale.set(worldScale);
    if (spaceDisplay) {
      spaceDisplay.setText("Valid Movements for " + turn.sprite.key + ":\n " + turn.sprite.closestSpaces.keys.join(" ") + "\nRemaining Moves: " + actionPoints,C.game.textStyle);
    }
    for (var i = 0; i < globalList.length; i++) {
      if (globalList[i].sprite.input && globalList[i].sprite.input.pointerOver()) {
        var over = globalList[i]; 
      } 
    }
    if (over) { 
      if (playerNames.indexOf(over.sprite.key) > -1) {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Points: " + over.rp);
        /*if (attributeDisplay.text && lastClicked !== undefined && repairText && attributeDisplay.text.indexOf(lastClicked.sprite.key) === -1) {
          repairText.text = "Repair " + lastClicked.sprite.key;
        }
      } else if (over.sprite.key === "monster") {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Point Reward: " + over.rp)
      }
    } else {
      attributeDisplay.setText("\nName: " + turn.sprite.key + "\nHP: " + turn.hp + "\nResearch Points: " + turn.rp);
    }

  }
}*/


class Setup {

  create() {
    console.log(playersList);
    //if (playersList.length === 0) {
    console.log("memes");
    for (var i = 0; i < obj_keys.length; i++) {
      Space[obj_keys[i]].occupied = false;
    }   
  
    if (playersList.length === 0) {
    playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.camera.bounds = null;
    console.log("Placing Board");
    game.bg = game.add.sprite(0, game.world.centerY - game.height / 2, "gameboard");
    game.bg.scale.setTo(C.bg.scale, C.bg.scale);
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      playerCount = 2;
    } else if (playerCount > 4) {
      playerCount = 4;
    }

    for (var i = 1; i <= playerCount; i++) {
      console.log(i);
      var destroyedCityColumn = spawnRandom("purplecircle", i, "0", false);
      destroyedCities[i-1] = destroyedCityColumn;
      playersList[i] = spawnRandom(playerNames[i-1], i, "0", true); 
      playersList[i].sprite.number = i;
      playersList[i].sprite.inputEnabled = true;
      playersList[i].sprite.input.enableDrag(true);
      playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
      closestSpaces = getClosestSpaces(playersList[i].key);
      playersList[i].sprite.closestSpaces = closestSpaces;
      playersList[i].sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      monstersList[i-1] = spawnRandom("monster", i, "3", true);
      monstersList[i-1].sprite.number = i - 1;
      monstersList[i-1].sprite.inputEnabled = true;
      monstersList[i-1].sprite.events.onInputDown.add(setLastClicked, this);
    }
    turn = playersList[1];
    turn.sprite.inputEnabled = true;
    turn.sprite.input.enableDrag(true);
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    // Add in text that is displayed.
    spaceDisplay = game.add.text(900, 250,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    attributeDisplay = game.add.text(spaceDisplay.x, spaceDisplay.y + 160, "", C.game.textStyle);
    spaceDisplay.anchor.setTo(.5); 
    attributeDisplay.anchor.setTo(.5);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    // Temporary for testing. Change this later.
    menuBar = game.add.sprite(0,(game.height/worldScale) - 162 + C.menuBar.height/4,"menubar");
    menuBar.width = C.menuBar.width;
    menuBar.height = C.menuBar.height;
    menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
    waitButton = game.add.button(80, menuBar.y + 80, 'purplecircle', waitOneAction);
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    waitButton.scale.y = .6;
    waitButton.battleButton = false;
    buttonsList.push(waitButton);
    game.world.bringToTop(waitButton);
    } else {
    
    }
    }
  update() {

    //Set ZoomIn to true or ZoomOut to false to enable zoom. It will
    //reset itself.
    if (actionPoints === 0 && pendingBattles.length === 0 && zoomOut !== true && zoomOut !== true) {
      changeTurn();
    }
    if (focusSpace && focusSpace.x) {
      var xPivot = changeValueScale(focusSpace.x) * 4 - game.camera.view.halfWidth;
      var yPivot = changeValueScale(focusSpace.y) * 4 - game.camera.view.halfHeight; 
      var xMenu = changeValueScale(focusSpace.x); 
      var yMenu = changeValueScale(focusSpace.y);
    }
    
    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      game.camera.y -= 4;
      console.log(game.camera.y);
    }

     if (zoomIn === true) {
       for (i = 0; i < buttonsTextList.length; i++) {
        buttonsTextList[0].kill();
       }
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i] !== battlePlayer) {
            playersList[i].sprite.inputEnabled = false;
          }
        }
        worldScale += 0.03;
        console.log("Tick.");
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/4, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/4, C.menuBar.height);
        game.world.bringToTop(menuBar);
        if (yPivot < 0) {
          yPivot = 0
        }
        if (Math.floor(worldScale) === 4 && Math.floor(yPivot) === game.camera.y && Math.floor(xPivot) === game.camera.x) {
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
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/4, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/4, C.menuBar.height);
        game.world.bringToTop(menuBar);
        if (game.camera.x > 0 || game.camera.y > 0) {
          if (focusSpace.increment.x > 0) {
            game.camera.x -= focusSpace.increment.x;
          } else {
            game.camera.x += focusSpace.increment.x;
          }
          if (focusSpace.increment.y > 0) {
            game.camera.y -= focusSpace.increment.y;
          } else {
            game.camera.y += focusSpace.increment.y;
          }

          game.camera.x = Phaser.Math.clamp(game.camera.x, 0, 3000);
          game.camera.y = Phaser.Math.clamp(game.camera.y, 0, 3000);

        } else if (worldScale <= 1) {
            zoomOut = false;
            for (i = 0; i < buttonsList.length; i++) {
              game.world.bringToTop(buttonsList[i]);
            }

            for (i = 0; i < buttonsTextList.length; i++) {
              buttonsTextList[0].reset(buttonsTextList[0].x,buttonsTextList[0].y);
            }
        }
    } if (battleStarting) {
      var lookAt = focusSpace.x * C.bg.scale*C.bg.resize + game.bg.position.x;
      battlePlayer.sprite.x = Phaser.Math.clamp(battlePlayer.sprite.x + .2, 0, lookAt + 30);
      battleMonster.sprite.x = Phaser.Math.clamp(battleMonster.sprite.x - .2, lookAt - 30, 3000);
      if (battlePlayer.sprite.x === lookAt + 30 && battleMonster.sprite.x - 35 && zoomIn === false) {
        battleTurn = battlePlayer;
        attackText = game.add.bitmapText(menuBar.x + 30, menuBar.y + 20, 'attackfont', "Attack!", 10);
        attackText.anchor.set(0.5);
        attackText.inputEnabled = true;
        attackText.events.onInputDown.add(queAttack, {attacker: battlePlayer});
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
        battleStarting = false;
        battleState = true;
        }
    } else if (battleState === true) {
      battle(battlePlayer,battleMonster);
      // Change this, placeholder ending.

    }
    // set a minimum and maximum scale value
    worldScale = Phaser.Math.clamp(worldScale, 1, 4);
    game.world.scale.set(worldScale);
    if (spaceDisplay) {
      spaceDisplay.setText("Valid Movements for " + turn.sprite.key + ":\n " + turn.sprite.closestSpaces.keys.join(" ") + "\nRemaining Moves: " + actionPoints,C.game.textStyle);
    }
    for (var i = 0; i < globalList.length; i++) {
      if (globalList[i].sprite.input && globalList[i].sprite.input.pointerOver()) {
        var over = globalList[i]; 
      } 
    }
    if (over) { 
      if (playerNames.indexOf(over.sprite.key) > -1) {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Points: " + over.rp);
        /*if (attributeDisplay.text && lastClicked !== undefined && repairText && attributeDisplay.text.indexOf(lastClicked.sprite.key) === -1) {
          repairText.text = "Repair " + lastClicked.sprite.key;
        }*/
      } else if (over.sprite.key === "monster") {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Point Reward: " + over.rp)
      }
    } else {
      attributeDisplay.setText("\nName: " + turn.sprite.key + "\nHP: " + turn.hp + "\nResearch Points: " + turn.rp);
    }

  }
}

function queAttack() {
  if (battleTurn === this.attacker) {
    this.attacker.attacking = true;
  }
}

function setLastClicked(sprite) {
  if (playerNames.indexOf(sprite.key) > -1) {
    lastClicked = playersList[sprite.number];
    var normalState = battleState !== false && zoomIn !== false && zoomOut !== false;
    if (lastClicked.key.indexOf("0") === 2 && !repairText && lastClicked.hp < lastClicked.maxhp && normalState) { 
      repairText = game.add.text(1050, menuBar.y, "Repair " + sprite.key, C.game.textStyle);
      repairText.anchor.set(0.5);
      repairText.inputEnabled = true;
      repairText.events.onInputDown.add(repair, {repairing: lastClicked});
      repairButton = game.add.sprite(repairText.x, repairText.y + 85, 'wrench');
      repairButton.anchor.set(0.5);
      repairButton.inputEnabled = true;
      repairButton.width = 40;
      repairButton.height = 40;
      repairButton.battleButton = false;
      buttonsList.push(repairButton);
      buttonsTextLit.push(repairText);
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked});
    } else if (lastClicked.key.indexOf("0") === 2 && lastClicked.hp < lastClicked.maxhp && normalState) {
      repairText.reset(1050, menuBar.y);
      repairText.setText("Repair " + sprite.key);
      repairText.events.onInputDown._bindings = [];
      repairText.events.onInputDown.add(repair, {repairing: lastClicked});
      repairButton.reset(repairText.x, repairText.y + 85);
      repairButton.events.onInputDown._bindings = [];
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked});
    } else if (repairText) {
      repairText.kill();
      buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    
    if (!upgradeText && normalState) { 
      upgradeText = game.add.text(950, menuBar.y, "Upgrade " + sprite.key, C.game.textStyle);
      upgradeText.anchor.set(0.5);
      upgradeText.inputEnabled = true;
      upgradeText.events.onInputDown.add(upgrade, {upgrading: lastClicked});
      upgradeButton = game.add.sprite(upgradeText.x, upgradeText.y + 85, 'wrench');
      upgradeButton.anchor.set(0.5);
      upgradeButton.inputEnabled = true;
      upgradeButton.width = 40;
      upgradeButton.height = 40;
      upgradeButton.battleButton = false;
      buttonsList.push(upgradeButton);
      buttonsTextList.push(upgradeText);
      upgradeButton.events.onInputDown.add(upgrade, {upgrading: lastClicked});
    } else if (normalState) {
      upgradeText.reset(950, menuBar.y);
      upgradeText.setText("Upgrade " + sprite.key);
      upgradeText.events.onInputDown._bindings = [];
      upgradeText.events.onInputDown.add(upgrade, {upgrading: lastClicked});
      upgradeButton.reset(upgradeText.x, upgradeText.y + 85);
      upgradeButton.events.onInputDown._bindings = [];
      upgradeButton.events.onInputDown.add(upgrade, {upgrading: lastClicked});
    }

    if (arrows = []) {
      var directions = [{direction: "left", angle: 180},{direction: "up", angle: -90}, {direction: "inward", angle: 90}, {direction: "right", angle:0}];
      for (i = 0; i < directions.length; i++) {
        arrowButton = game.add.sprite(menuBar.x + 200 + i*50, menuBar.y + 85, 'arrow');
        arrowButton.anchor.set(0.5);
        arrowButton.inputEnabled = true;
        arrowButton.width = 40;
        arrowButton.height = 40;
        arrowButton.battleButton = false;
        arrowButton.attributes = directions[i];
        arrowButton.angle = arrowButton.attributes.angle; 
        arrows.push(arrowButton);
        buttonsList.push(arrowButton);
        arrowButton.events.onInputDown.add(arrowMove, {moving: lastClicked, direction: arrows[i].attributes.direction});
      }
    } else {
      for (i = 0; i < arrows.length; i++) {
        arrows[i].reset(arrows[i].x, arrows[i].y);
        arrows[i].events.onInputDown._bindings = [];
        arrows[i].events.onInputDown.add(arrowMove, {moving: lastClicked, direction: arrows[i].attributes.direction});
      } 
    }
  } else if (sprite.key === "monster") {
    if (repairText) {
      repairText.kill();
      buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    if (upgradeText) {
      upgradeText.kill();
      buttonsList.splice(upgradeButton, 1);
      upgradeButton.kill();
    }
  }
  
}


class Upgrade {
  create() {
    var returnText = game.add.text(game.world.centerX, game.world.centerY, 'Return to Game',C.game.textStyle);
    returnText.anchor.set(0.5);
    returnText.inputEnabled = true;
    returnText.events.onInputDown.add(reloadGame,this);
  }
}

function reloadGame() {
  game.state.start("Setup");
}

class GameOver {
    create() {
        game.world.scale.set(1);
        console.log("YOU LOSE.");
        var gg = game.add.text(game.world.centerX, game.world.centerY, "GAME\nOVER",C.game.textStyle);
        var restart = game.add.text(game.world.centerX, game.world.centerY + 100, "Restart?",C.game.textStyle);
        gg.anchor.setTo(.5);
        restart.anchor.setTo(.5);
        restart.inputEnabled = true;
        restart.events.onInputDown.add(resetGame, this);
        game.world.pivot.x = 0;
        game.world.pivot.y = 0;
        game.camera.x = 0;
        game.camera.y = 0;
      }
   
}

function resetGame() {
  game.state.start("Setup");
var waitButton
var lastClicked;
var repairText;
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
var battleTurn = null;
var battleStarting = false;
var pendingBattles = [];
var threatLevel = 0;
var menuBar;
var battleState;
var resultsList = [];
var buttonsList = [];
}

function scrubList(list) {
  for (i = 0; i < list.length; i++) {
    if (!list[i] || list[i].hp && list[i].hp <= 0) {
      list.splice(list[1],1);
    }
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
    space.increment = {x: (changeValueScale(space.x) * 4 - game.camera.view.halfWidth) / 101, y: (changeValueScale(space.y) * 4 - game.camera.view.halfHeight) / 101};
}

function changeValueScale(value) {
  return value * C.bg.scale*C.bg.resize + game.bg.position.x; 
}

function checkAttack(sprite,pointer) {
  if (sprite.overlap(battleMonster.sprite)) {
    attack(battlePlayer,battleMonster)
  }
  if (battleState === true) {
    sprite.x = changeValueScale(focusSpace.x) + 30;
    sprite.y = changeValueScale(focusSpace.y);
  }
}

function attack(attacker,defender) {
  var bhits = rollDie(attacker.batk);                                                                                       
  var rhits = 0;
  if (attacker.ratk) {
    rhits = rollDie(attacker.batk);                                                                                       
  }
  var successes = rhits + bhits;
  console.log(attacker.sprite.key + " hit " +successes + " hit/hits!");
  var defences = rollDie(defender.def);
  console.log(defender.sprite.key + " defended " + defences + " hit/hits!");
  if (successes > defences) {
    defender.hp -= successes - defences;
    var damaged = defender;
    var damageTaken = successes - defences;
    var text = defender.sprite.key + " took " + damageTaken.toString() + " damage from " + attacker.sprite.key + ".";
  } else if (defences > successes) {
    attacker.hp -= defences - successes;
    var damaged = attacker;
    var damageTaken = defences - successes;
    var text = attacker.sprite.key + " took " + damageTaken.toString() + " damage from " + defender.sprite.key + " defences!";
  } else {
    var damaged = undefined;
    var damageTaken = undefined;
    console.log("No damage.");
    var text = defender.sprite.key + " blocked every hit from " + attacker.sprite.key + "!";
  }
    if (resultsList.length > 0) {
      var battleResults = game.add.bitmapText(Math.round(changeValueScale(focusSpace.x)),Math.round(resultsList[resultsList.length - 1].y + 25), 'attackfont', text, 10);
    } else { 
      var battleResults = game.add.bitmapText(Math.round(changeValueScale(focusSpace.x)),Math.round(changeValueScale(focusSpace.y)) - 80, 'attackfont', text, 10);
    }
    battleResults.anchor.x = .5;
    battleResults.anchor.y = .5;
    game.world.bringToTop(battleResults);
    resultsList.push(battleResults);
    game.time.events.add(Phaser.Timer.SECOND * 2, killResults, this, battleResults);
  if (damaged && damaged.hp <= 0) {
    console.log("DED with " + damaged.hp);
    scrubList(globalList);
    if (damaged === battlePlayer) {
      playersList[damaged.sprite.number] = damaged.number;
      removeFromList(playersList[damaged.sprite.number], focusSpace);
      damaged.sprite.destroy();
      var destroyedPlayers = 0;
      for (var i = 1; i <= playersList.length; i++) {
        if (sprite.number.isInteger(playersList[i])) {
          destroyedPlayers += 1;
        }
      }
      console.log("There are " + destroyedPlayers + " mechs destroyed.")
      if (destroyedPlayers === playerCount) {
        zoomOut = true;
        game.state.start("GameOver");
      }
    } else if (damaged === battleMonster) {
      focusSpace.occupied = removeFromList(monstersList[damaged.sprite.number], focusSpace);
      battlePlayer.rp += damaged.rp;
      monstersList.splice(damaged.sprite.number, 1);
      damaged.sprite.destroy();
      battlePlayer.sprite.events.onDragStop._bindings = [];
      battlePlayer.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      battlePlayer.sprite.x = changeValueScale(focusSpace.x);
      console.log("Monster died, moving back to position " + changeValueScale(focusSpace.x) );
    }
    pendingBattles.splice(0,1);
    if (focusSpace.occupied && focusSpace.occupied !== false) {
      scrubList(focusSpace.occupied);
    }
    for (i = 1; i < playersList.length; i++) {
      playersList[i].sprite.inputEnabled = true;
      playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
      playersList
    
    }
    if (pendingBattles.length > 0) {
      console.log("There are more battles.");
      battleMonster = pendingBattles[0].pendingMonster;
      battlePlayer = pendingBattles[0].pendingPlayer;
      focusSpace = pendingBattles[0].space;
      findIncrementsTo(focusSpace);
      zoomIn = true;
      battleState = false;
      battleStarting = true;
    } else {
      zoomIn = false;
      zoomOut = true;
      battleState = false;
    }
  }
    if (!damaged || damaged.hp > 0) {
    battleTurn = defender;
  }

}
function killResults(results) {
  results.destroy();
  resultsList.splice(results,1);
  console.log(results + " has been destroyed.");
}


function rollDie(count){ 
  var hits = 0;
  for (i = 1; i < count; i++) {
    if (Math.floor(Math.random() * ((6-1)+1) + 1) >= 5) {
      hits += 1;
    }
  }
  return hits;
} 

function battle(player, monster) {
  //Simple Placeholder battle
    if (battleTurn === battleMonster && battleMonster.sprite) {
      if (attackText) {
        attackText.kill();
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.inputEnabled = false;
      }
      battleMonster.sprite.x += .3;
      if (battleMonster.sprite.x >= changeValueScale(focusSpace.x)) {
        attack(battleMonster,battlePlayer);
        if (battleState === true) {
          battleMonster.sprite.x = battlePlayer.sprite.x - 60;
          attackText.reset(menuBar.x + 20, menuBar.y + 20);
          battlePlayer.sprite.inputEnabled = true;
          battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
        }
      }
    } else if (battleTurn === battlePlayer && battlePlayer.attacking === true) {
      if (attackText) {
        attackText.kill();
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.inputEnabled = false;
      }

      battlePlayer.sprite.x -= .3;
      if (battlePlayer.sprite.x <= changeValueScale(focusSpace.x)) {
        attack(battlePlayer,battleMonster);
        if (battleState === true) {
          battlePlayer.sprite.x = changeValueScale(focusSpace.x) + 30;
          attackText.reset(menuBar.x + 20, menuBar.y + 15);
          battlePlayer.sprite.inputEnabled = true;
          battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
          battlePlayer.attacking = false;
        }
      }
    }
  }

  function waitOneAction() {
    actionPoints -= 1;  
  }

  function moveMonsters() {
      for (var i = 0; i < monstersList.length ; i++) {
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
      console.log("Monster is moving to " + newDestination);
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
  if (playersList.indexOf(object) > -1) {
    setLastClicked(object.sprite);
  }
}

function repair() {
  if (this.repairing.hp < this.repairing.maxhp) {
    this.repairing.hp = this.repairing.maxhp;
    actionPoints -= 1;
    repairText.kill();
    repairButton.kill();
  }
}

function upgrade() {
  console.log("Upgrading " + this.upgrading.sprite.key);
  actionPoints -= 1;
  game.paused = true;
  upgradeMenu = game.add.sprite(spaceDisplay.x, spaceDisplay.y + 160, 'upgradeMat');
  upgradeMenu.anchor.setTo(.5,.5);
  upgradeMenu.scale.x = .37;
  upgradeMenu.scale.y = .37;
  game.input.onDown.add(finishUpgrade, {menu: upgradeMenu});
  
}


function finishUpgrade(event) {
  if (game.paused) {
    console.log(event);
    var x1 = this.menu.x - this.menu.width/2, x2 = this.menu.x + this.menu.width/2,
    y1 = this.menu.y - this.menu.y/2, y2 = this.menu.y + this.menu.height/2;
    if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
      var options = ["electric_fists"]
      var x = event.x - x1,
          y = event.y - y1;
      var choice = Math.floor(x / 90) + 3*Math.floor(y / 90);
      console.log(choice);
    } 
    game.paused = false;
    upgradeMenu.destroy();
  }
}


function arrowMove() {
  console.log(this.direction);
  var directions = this.moving.sprite.closestSpaces.directionObjects;
  console.log(directions);
  for (i = 0; i < directions.length; i++) {
    console.log("Tick.");
    if (this.direction === directions[i].direction) {
      console.log("Ding!");
      move(this.moving, this.moving.sprite.closestSpaces.directionObjects[i].spaceKey);
    }
  }
}

function checkBattle(space) {
  //Takes a space, and if there are both monsters and players on that
  //space, battle 
  //happens
  scrubList(globalList);
  scrubList(space.occupied);
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
    moveMonsters();
    actionPoints = 3;
    //turn.sprite.inputEnabled = false
    do {
      if (turn && turn.sprite.number && turn.number < playerCount) {
        turn = playersList[turn.sprite.number + 1];
      } else if (turn && turn.sprite.number && turn.number <= playerCount || Number.isInteger(turn) && turn === playerCount) {

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
 console.log(arrayName);
  var x;
 var tmpArray = new Array();
 if (object && arrayName.occupied) {
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
  var directionObjects = [];

  var directions = [clockwise,counter_clockwise,inward,outward];
  directions.forEach(function(direction) {
  if (direction !== undefined) {
    selectedSpaces.push(Space[direction]);
    var directionValue = Space[direction];
    var spaceValue = Space[spaceKey];
    if ((spaceValue.x > directionValue.x) && (diff(spaceValue.x, directionValue.x) > diff(spaceValue.y,directionValue.y))) {
        directionObjects.push({direction: "left", spaceKey: direction});
      }
    if ((spaceValue.x < directionValue.x) && (diff(spaceValue.x, directionValue.x) > diff(spaceValue.y,directionValue.y))) {
        directionObjects.push({direction: "right", spaceKey: direction});
      }
    if ((spaceValue.y > directionValue.y) && (diff(spaceValue.x, directionValue.x) < diff(spaceValue.y,directionValue.y))) {
        directionObjects.push({direction: "up", spaceKey: inward});
      }
    if ((spaceValue.y < directionValue.y) && (diff(spaceValue.x, directionValue.x) < diff(spaceValue.y,directionValue.y))) {
        directionObjects.push({direction: "down", spaceKey: outward});
      }
      close_keys.push(direction);
     }
   });
  return {
    selectedSpaces: selectedSpaces,
    keys: close_keys,
    directions: directions,
    directionObjects: directionObjects
  }
}
function diff(a,b){return Math.abs(a-b);}

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
  if (object !== "monster") {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,object); 
  } else {
    if (threatLevel <= 12) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,"initialMonster"); 
    } else if (threatLevel <= 24) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,"growingMonster"); 
    } else {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resize + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resize + game.bg.position.y,"extinctionMonster"); 
    }
    random.spriteName = random.key;
    random.key = "monster";
  }
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
    obj.maxhp = 4;
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
      obj.batk = 3;
      obj.rp = 1;
      obj.mr = 2;
    } else if (threatLevel <= 24) {
      obj.hp = 4;
      obj.batk = 4;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      obj.hp = 5;
      obj.batk = 5;
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
      obj.batk = 3;
      obj.rp = 1;
      obj.mr = 2;
    } else if (monstersList.length <= 24) {
      obj.hp = 4;
      obj.batk = 4;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      obj.hp = 5;
      obj.batk = 5;
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

var game = new Phaser.Game(C.game.width,C.game.height, Phaser.AUTO, '', {
    init: function () {

        //Load the plugin
        game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
    }
});
//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;game.scale.minWidth = 320;game.scale.minHeight = 480;game.scale.maxWidth = 768;game.scale.maxHeight = 1152;
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.add("GameOver",GameOver);
game.state.add("Upgrade",Upgrade);
//game.state.add("Reload",Reload);
game.state.start("Boot");

