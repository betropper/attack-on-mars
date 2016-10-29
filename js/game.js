var globalScale = .5;
var C = {
 "game": {
   "zoomScale": 3,
    "width": 2800 * globalScale,
    "height": 1280 * globalScale,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '40px Poiret One'
   },
   "smallStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '35px Poiret One',
      "style": {
        backgroundColor: 'black'
      }
   },

   "ynStyle": {
      align: 'center',
      fill: "#ffffff",
      font: '50px Poiret One',
      "style": {
        backgroundColor: 'black'
      }
   },
   "scaleRatio": window.devicePixelRatio / 3
 },
 "bg": {
   "width": 3300,
   "height": 2787,
   "resizeX": 3300/5574,
   "resizeY": 2787/5574,
   "scale": .46 * globalScale,
   "file": "assets/gameboard.jpg"
 },
 "mech": {
   "width": 72,
   "height": 72,
   "scale": 1.3 * globalScale,
   "battleSpacing": 100,
   "battleSpeed": 2
 },
 "destroyed": {
   "scale": 1.55 * globalScale
 },

 "monster": {
   "width": 72,
   "height": 72,
   "scale": 1.3 * globalScale
 },
 "menuBar": {
  "width": 2400,
  "height": 300
 },
 "wrench": {
  "width": 200,
  "height": 200
 },
 "arrow": {
  "width": 512,
  "height": 512
 },
 "extras": {
  "width": 72,
  "height": 72
 }, 
 "upgradeMenu": {
  "width": 1725,
  "height": 2350,
  "scale": 1.3 * globalScale
 
 }
}
var focusX,
 focusY,
 xPivot,
 yPivot;
var battleSpeedDecrease = 0;
var boughtBool;
var upgradeState;
var confirmState;
var confirmText;
var battleTexts = [];
var attackText;
var siegeText;
var waitButton;
var mineButton;
var wallButton;
var lastClicked;
var repairText;
var upgradeText;
var upgradeMenu;
var upgradeDisplay;
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
var priceText;
var jaja = null;
var donovank = "White";
var tempFocus;
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
      timeConstantScroll: 700, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });

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
    this.load.image("mine","assets/Mines.png", C.extras.width,C.extras.height);
    this.load.image("dropwall", "assets/DropWall.png", C.extras.width, C.extras.height);
    this.load.image("obliterationray", "assets/ObliterationRay.png", C.extras.width, C.extras.height);
    game.load.bitmapFont('attackfont','assets/attackfont.png', 'assets/attackfont.fnt');
  }
  create() {
    console.log("Loaded!");
    this.state.start("Setup");
  }
}

class Setup {

  create() {
    console.log(playersList);
    //if (playersList.length === 0) {
    console.log("memes");
    for (var i = 0; i < obj_keys.length; i++) {
      Space[obj_keys[i]].occupied = false;
    }   
  
    playerCount = parseInt(prompt("How many will be playing?", "2")) || null;
    game.stage.smoothed = true;
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
      playersList[i].upgrades = [];
      playersList[i].colorDiscounts = [{color: "red", discount: 0 },{color: "blue", discount: 0},{color: "green", discount: 0},{color: "yellow",discount: 0},{color: "purple", discount: 0},{color: "black", discount: 0}]
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
    spaceDisplay = game.add.text(2000, 100,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    attributeDisplay = game.add.text(spaceDisplay.x, spaceDisplay.y + 160, "", C.game.textStyle);
    spaceDisplay.anchor.setTo(.5); 
    attributeDisplay.anchor.setTo(.5);
    upgradeDisplay = game.add.text(attributeDisplay.x, attributeDisplay.y + 160, "", C.game.textStyle);
    upgradeDisplay.anchor.setTo(.5);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    menuBar = game.add.sprite(0,(game.height/worldScale) - 162 + C.menuBar.height/4,"menubar");
    menuBar.width = C.menuBar.width;
    menuBar.height = C.menuBar.height;
    menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
    menuBar.kill();
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
    //
    //Disables scrolling when upgrading is done
    //game.camera.focusOnXY(playersList[1].sprite.x, playersList[1].sprite.y);
    if (game.camera.y < 0) {
      game.camera.y = 0;
      if (upgradeState === true) {
        upgradeState = false;
        game.input.onTap._bindings = [];  
        if (boughtBool === true) {
          actionPoints -= 1;
          boughtBool = false;
        }
        game.kineticScrolling.stop();
        game.camera.y = 0;
        //menuBar.reset(menuBar.x,menuBar.y);
      }
    }
    if (upgradeState && !confirmState && upgradeMenu && game.camera.y >= upgradeMenu.y + upgradeMenu.height/2 - game.camera.height) {
      game.camera.y = upgradeMenu.y + upgradeMenu.height/2 - game.camera.height;
    } else if (confirmState === true) {
      game.camera.y = upgradeMenu.y + upgradeMenu.height/2 + game.camera.height/2;
    }
    if (actionPoints === 0 && pendingBattles.length === 0 && zoomOut !== true && zoomOut !== true) {
      changeTurn();
    }

    if (focusSpace && focusX) {
      findIncrementsTo(focusSpace);
      var xMenu = focusX; 
      var yMenu = focusY;
    }
    
    var cursors = game.input.keyboard.createCursorKeys();
    /*if (cursors.up.isDown) {
      game.camera.y -= 4;
      console.log(game.camera.y);
    }*/

     if (zoomIn === true) {
      // Temporary for testing. Change this later.
      if (!menuBar.alive) {
        menuBar = game.add.sprite(0,(game.height/worldScale) - 162 + C.menuBar.height/4,"menubar");
        menuBar.width = C.menuBar.width;
        menuBar.height = C.menuBar.height;
        menuBar.fixedToCamera = true;
        game.world.bringToTop(menuBar);
      }
       for (i = 0; i < buttonsTextList.length; i++) {
        buttonsTextList[0].kill();
       }
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i] !== battlePlayer) {
            playersList[i].sprite.inputEnabled = false;
          }
        }
        worldScale += 0.04;
        console.log("Tick.");
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        game.world.bringToTop(menuBar);
        if (yPivot < 0) {
          yPivot = 0
        }
        if (Math.floor(worldScale) === C.game.zoomScale && Math.floor(yPivot) === game.camera.y && Math.floor(xPivot) === game.camera.x) {
          zoomIn = false;
          console.log("Done zooming");
        }
         if (game.camera.x < xPivot && xPivot > 0 && zoomIn) {
          game.camera.x = Phaser.Math.clamp(game.camera.x + focusSpace.increment.x, 0, xPivot);
        } else if (game.camera.x > xPivot && xPivot > 0 && zoomIn) {
          game.camera.x = Phaser.Math.clamp(game.camera.x - focusSpace.increment.x, xPivot, 9999);
        }
        if (game.camera.y < yPivot && yPivot > 0 && zoomIn) {
          game.camera.y = Phaser.Math.clamp(game.camera.y + focusSpace.increment.y, 0, yPivot);
        } else if (game.camera.y > yPivot && yPivot > 0 && zoomIn) {
          game.camera.y = Phaser.Math.clamp(game.camera.y - focusSpace.increment.y, yPivot, 9999);
        }
       //console.log("x is " + xPivot);
       //console.log("y is " + yPivot);
    } else if (zoomOut === true) {
        if (menuBar) {
          menuBar.kill();
        }
        worldScale -= 0.04;
        /*
        menuBar.width = C.menuBar.width / worldScale;
        menuBar.height = C.menuBar.height / worldScale;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        */
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
      var lookAt = focusX; 
      battlePlayer.sprite.x = Phaser.Math.clamp(battlePlayer.sprite.x + C.mech.battleSpeed, 0, lookAt + C.mech.battleSpacing);
      battleMonster.sprite.x = Phaser.Math.clamp(battleMonster.sprite.x - C.mech.battleSpeed, lookAt - C.mech.battleSpacing, 3000);
      if (battlePlayer.sprite.x === lookAt + C.mech.battleSpacing && battleMonster.sprite.x - 35 && zoomIn === false) {
        battleTurn = battlePlayer;
        attackText = game.add.bitmapText(menuBar.x + 50, menuBar.y + 20 ,'attackfont', "Attack!",30);
        attackText.anchor.set(0.5);
        attackText.inputEnabled = true;
        attackText.events.onInputDown.add(queAttack, {attacker: battlePlayer});
        battleTexts.push(attackText);
        if (battlePlayer.canSiege) {
          siegeText = game.add.bitmapText(battleTexts[battleTexts.length - 1].x + 60, menuBar.y + 20, 'attackfont', "Siege Mode", 10);
          siegeText.anchor.set(0.5);
          siegeText.inputEnabled = true;
          siegeText.events.onInputDown.add(queAttack, {attacker: battlePlayer, modifier: "Siege Mode"});
          battleTexts.push(siegeText);
        }
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
    worldScale = Phaser.Math.clamp(worldScale, 1, C.game.zoomScale);
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
       upgradeDisplay.setText("Upgrades for " + over.sprite.key +":\n" + over.upgrades.join(",\n"));
      } else if (over.sprite.key === "monster") {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + "\nResearch Point Reward: " + over.rp)
      }
    } else if (lastClicked) {
      attributeDisplay.setText("\nName: " + lastClicked.sprite.key + "\nHP: " + turn.hp + "\nResearch Points: " + turn.rp);
      upgradeDisplay.setText("Upgrades for " + lastClicked.sprite.key + ":\n" + lastClicked.upgrades.join(",\n"));
    }

  }
}

function queAttack() {
  if (battleTurn === this.attacker) {
    this.attacker.attacking = true;
    if (this.modifier && this.modifier === "Siege Mode") {
      this.attacker.siegeMode = true;
    }
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
      buttonsTextList.push(repairText);
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
      //buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    
    if (!upgradeText && normalState) { 
      upgradeText = game.add.text(950, menuBar.y, "Upgrade " + sprite.key, C.game.textStyle);
      upgradeText.anchor.set(0.5);
      upgradeText.inputEnabled = true;
      upgradeText.events.onInputUp.add(upgrade, {upgrading: lastClicked});
      upgradeButton = game.add.sprite(upgradeText.x, upgradeText.y + 85, 'wrench');
      upgradeButton.anchor.set(0.5);
      upgradeButton.inputEnabled = true;
      upgradeButton.width = 40;
      upgradeButton.height = 40;
      upgradeButton.battleButton = false;
      buttonsList.push(upgradeButton);
      buttonsTextList.push(upgradeText);
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: lastClicked});
    } else if (normalState) {
      upgradeText.reset(950, menuBar.y);
      upgradeText.setText("Upgrade " + sprite.key);
      upgradeText.events.onInputUp._bindings = [];
      upgradeText.events.onInputUp.add(upgrade, {upgrading: lastClicked});
      upgradeButton.reset(upgradeText.x, upgradeText.y + 85);
      game.world.bringToTop(upgradeButton);
      upgradeButton.events.onInputUp._bindings = [];
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: lastClicked});
    }

    if (!wallButton && normalState && lastClicked.upgrades.indexOf("Drop Wall") > -1) { 
      wallButton = game.add.sprite(300, menuBar.y + 77, 'dropwall');
      wallButton.anchor.set(0.5);
      wallButton.inputEnabled = true;
      wallButton.battleButton = false;
      wallButton.height = 80;
      wallButton.width = 80;
      buttonsList.push(wallButton);
      wallButton.events.onInputDown.add(U["Drop Wall"].active, {player: lastClicked});
    } else if (normalState && lastClicked.upgrades.indexOf("Drop Wall") > -1) {
      wallButton.reset(wallButton.x, wallButton.y);
      wallButton.events.onInputDown._bindings = [];
      wallButton.events.onInputDown.add(U["Drop Wall"].active, {player: lastClicked});
      //buttonsList.push(wallButton);
    } else if (wallButton) {
      //buttonsList.splice(wallButton, 1);
      wallButton.kill();
    }

    if (!mineButton && normalState && lastClicked.upgrades.indexOf("Mines") > -1) { 
      mineButton = game.add.sprite(200, menuBar.y + 77, 'mine');
      mineButton.anchor.set(0.5);
      mineButton.inputEnabled = true;
      mineButton.battleButton = false;
      mineButton.height = 80;
      mineButton.width = 80;
      buttonsList.push(mineButton);
      mineButton.events.onInputDown.add(U.Mines.active, {player: lastClicked});
    } else if (normalState && lastClicked.upgrades.indexOf("Mines") > -1) {
      mineButton.reset(mineButton.x, mineButton.y);
      mineButton.events.onInputDown._bindings = [];
      mineButton.events.onInputDown.add(U.Mines.active, {player: lastClicked});
      //buttonsList.push(mineButton);
    } else if (mineButton) {
      //buttonsList.splice(mineButton, 1);
      mineButton.kill();
    }

    /*
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
    }*/
  } else if (sprite.key === "monster") {
    if (repairText) {
      repairText.kill();
      //buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    if (upgradeText) {
      upgradeText.kill();
      //buttonsList.splice(upgradeButton, 1);
      upgradeButton.kill();
    }
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
      list.splice(list[i],1);
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
    space.increment = {x: (((focusX*C.game.zoomScale))/(C.game.zoomScale/.04)), y: (((focusY*C.game.zoomScale))/(C.game.zoomScale/.04))};
}

function changeValueScale(value,xory) {
  if (xory === "x") {
    return value * C.bg.scale*C.bg.resizeX + game.bg.position.x; 
  } else if (xory === "y") {
    return value * C.bg.scale*C.bg.resizeY + game.bg.position.y; 
  }
}

function checkAttack(sprite,pointer) {
  if (sprite.overlap(battleMonster.sprite)) {
    attack(battlePlayer,battleMonster)
  }
  if (battleState === true) {
    sprite.x = focusX + C.mech.battleSpacing;
    sprite.y = focusY;
  }
}

function attack(attacker,defender) {
  var bhits = rollDie(attacker.batk - (defender.batkDecrease || 0)); 
  var rhits = 0;
  if (attacker.ratk) {
    rhits = rollDie(attacker.ratk - (defender.ratkDecrease || 0));
  } 
  var successes = rhits + bhits;
  if (attacker.siegeMode) {
    successes += 1;
    attacker.def -= 1;
    attacker.canSiege = false;
  }
  if (defender.guarenteedDef && successes > 0) {
    successes -= defender.guarenteedDef;
  }
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
      for (i = 0; i < resultsList.length; i++) {
        resultsList[i].y -= 40
      }
      var battleResults = game.add.bitmapText(Math.round(focusX),Math.round(focusY - 60), 'attackfont', text, 20);
    } else { 
      var battleResults = game.add.bitmapText(Math.round(focusX),Math.round(focusY - 60), 'attackfont', text, 20);
    }
    battleResults.anchor.x = .5;
    battleResults.anchor.y = .5;
    game.world.bringToTop(battleResults);
    resultsList.push(battleResults);
    game.time.events.add(Phaser.Timer.SECOND * 2, killResults, this, battleResults);
  if (damaged && damaged.hp <= 0) {
    battlePlayer.attacking = false;
    console.log("DED with " + damaged.hp);
    scrubList(globalList);
    if (attacker.siegeMode) {
      attacker.siegeMode = false;
      attacker.def += 1;
    }
    for (i = 0; i < battleTexts.length; i++) {
      battleTexts[i].kill();
      battleTexts.splice(battleTexts[i],1);
    }
    if (damaged === battlePlayer) {
      removeFromList(playersList[damaged.sprite.number], focusSpace);
      playersList[damaged.sprite.number].sprite.kill();
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
    } else if (damaged === battleMonster) {
      focusSpace.occupied = removeFromList(monstersList[damaged.sprite.number], focusSpace);
      battlePlayer.rp += damaged.rp;
      monstersList.splice(damaged.sprite.number, 1);
      damaged.sprite.destroy();
      battlePlayer.sprite.events.onDragStop._bindings = [];
      battlePlayer.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      battlePlayer.sprite.x = focusX;

      console.log("Monster died, moving back to position " + focusX );
    }
    pendingBattles.splice(0,1);
    if (focusSpace.occupied && focusSpace.occupied !== false) {
      scrubList(focusSpace.occupied);
    }
    for (i = 1; i < playersList.length; i++) {
      playersList[i].sprite.inputEnabled = true;
      playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
    }
    if (pendingBattles.length > 0) {
      console.log("There are more battles.");
      battleMonster = pendingBattles[0].pendingMonster;
      battlePlayer = pendingBattles[0].pendingPlayer;
      focusSpace = pendingBattles[0].space;
      focusX = changeValueScale(focusSpace.x,"x");
      focusY = changeValueScale(focusSpace.y,"y"); 
      yPivot = (battlePlayer.sprite.y *C.game.zoomScale) - game.camera.height/2; 
      xPivot = (battlePlayer.sprite.x *C.game.zoomScale) - game.camera.width/2;
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
        for (i = 0; i < battleTexts.length; i++) {
          battleTexts[i].kill();
        }
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.inputEnabled = false;
      }
      battleMonster.sprite.x += C.mech.battleSpeed - battleSpeedDecrease;
      battleSpeedDecrease += .02;
      if (battleMonster.sprite.x >= focusX) {
        attack(battleMonster,battlePlayer);
        battleSpeedDecrease = 0;
        if (battleState === true) {
          battleMonster.sprite.x = focusX - C.mech.battleSpacing;
          for (i = 0; i < battleTexts.length; i++) {
            battleTexts[i].reset(battleTexts[i].x, battleTexts[i].y);
          }
          battlePlayer.sprite.inputEnabled = true;
          battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
        }
      }
    } else if (battleTurn === battlePlayer && battlePlayer.attacking === true) {
      if (attackText) {
        for (i = 0; i < battleTexts.length; i++) {
          battleTexts[i].kill();
        }
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.inputEnabled = false;
      }

      battlePlayer.sprite.x -= C.mech.battleSpeed - battleSpeedDecrease;
      battleSpeedDecrease += .02;
      if (battlePlayer.sprite.x <= focusX) {
        battleSpeedDecrease = 0;
        attack(battlePlayer,battleMonster);
        if (battleState === true) {
          battlePlayer.sprite.x = focusX + C.mech.battleSpacing;
          for (i = 0; i < battleTexts.length; i++) {
            battleTexts[i].reset(battleTexts[i].x, battleTexts[i].y);
          }
          battlePlayer.sprite.inputEnabled = true;
          battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
          battlePlayer.attacking = false;
        }
      }
    }
  }

  function waitOneAction() {
    actionPoints -= 1;
    if (lastClicked && lastClicked.canRepair) {
      repair(lastClicked); 
    }
  }

  function moveMonsters() {
      for (var i = 0; i < monstersList.length ; i++) {
        var newDestination = monstersList[i].key.substring(0,2) + (parseInt(monstersList[i].key.charAt(2)) - 1);
        monstersList[i].sprite.closestSpaces = getClosestSpaces(monstersList[i].key);
        //Finds the closest spaces from two spaces away in case of
        //monster bait upgrade
        var twoAwayList = [];
        for (m = 0; m < monstersList[i].sprite.closestSpaces.keys.length; m++) {
            //monstersList[i].sprite.closestSpaces.selectedSpaces[m].closestSpaces = getClosestSpaces(monstersList[i].sprite.closestSpaces.keys[m]) 
            var checkKeys = getClosestSpaces(monstersList[i].sprite.closestSpaces.keys[m]).keys;
            for (l = 0; l < checkKeys.length; l++) {
              checkKeys[l] = {key: checkKeys[l], parent: monstersList[i].sprite.closestSpaces.keys[m]}
              twoAwayList.push(checkKeys[l]);
            }
          }
        console.log(twoAwayList);
        for (m = 0; m < twoAwayList.length; m++) {
          if (Space[twoAwayList[m].key].occupied) {
            for (l = 0; l < Space[twoAwayList[m].key].occupied.length; l++) {
              if (playersList.indexOf(Space[twoAwayList[m].key].occupied[l]) > -1 && Space[twoAwayList[m].key].occupied[l].upgrades.indexOf("Monster Bait") > -1) {
                var newDestination = twoAwayList[m].parent;
              }
            }
          }
        }
        for (y = 0; y < monstersList[i].sprite.closestSpaces.selectedSpaces.length; y++) {
          for (o = 0; o < monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied.length; o++) {
            if (playersList.indexOf(monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o]) > -1) {
              var newDestination = monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o].key;
              console.log("Moving to player at " + newDestination);
            }
          }
        }
          
        if (Space[newDestination]) {
          if (Space[newDestination].occupied) {
            for (x = 0; x < Space[newDestination].occupied.length; x++) {
              if (monstersList.indexOf(Space[newDestination].occupied[x]) > -1) {
                var containsMonsters = true;
              } else if (playersList.indexOf(Space[newDestination].occupied[x]) > -1) {
                var containsPlayers = true;
              }
            }
          }
          
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
          } 
          if (containsMonsters && !containsPlayers) {
            var newDestination = monstersList[i].key;
          }
        }
        console.log("Monster is moving to " + newDestination);
        move(monstersList[i], newDestination);
      } else {
        console.log("Broken destination was " + newDestination);
      }
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
  if (playersList.indexOf(object) > -1) {
    setLastClicked(object.sprite);
  } else if (monstersList.indexOf(object) > -1) {
    if (Space[destination].wall) {
      Space[destination].wall.destroy();
      Space[destination].wall = false;
      return
    } else if (Space[destination].mine) {
      Space[destination].mine.destroy();
      Space[destination].mine = false;
      object.hp -= 1;
      console.log("BOOM!");
    }
  }
  object.sprite.x = Space[destination].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
  object.sprite.y = Space[destination].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;
  removeFromList(object, Space[object.key]);
  object.key = destination;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.space = Space[destination];
  addToOccupied(object, Space[destination]);
  game.world.bringToTop(object.sprite);
  checkBattle(Space[object.key]);

}

function repair(repairing) {
  var repairing = repairing || repairing;
  if (repairing.hp < repairing.maxhp) {
    repairing.hp = repairing.maxhp;
    actionPoints -= 1;
    repairText.kill();
    repairButton.kill();
  }
}

function upgrade(upgrading) {
  var upgrading = this.upgrading || upgrading 
  confirmState = false;
  if (this.yn) {
      var boughtUpgrade = U[this.boughtUpgrade];
      if (this.yn === "yes" && boughtUpgrade) {
        if (boughtUpgrade.passive) {
          boughtUpgrade.passive(upgrading);
        }
        if (boughtUpgrade.color) {
            for (i = 0; i < upgrading.colorDiscounts.length; i++) {
              if (upgrading.colorDiscounts[i].color === boughtUpgrade.color) {
                upgrading.colorDiscounts[i].discount += 1;
                var discountValue = upgrading.colorDiscounts[i].discount - 1;
                break
              }
          }
        }
        if ((boughtUpgrade.cost - discountValue) > 0) {
          upgrading.rp -= (boughtUpgrade.cost - discountValue);
          console.log("cost was " + (boughtUpgrade.cost-discountValue));
        }
        lastClicked.upgrades.push(this.boughtUpgrade);
        boughtBool = true;
      }
  }
  console.log("Upgrading " + upgrading.sprite.key);
  upgradeText.kill();
  upgradeButton.kill();
  menuBar.kill();
  if (!upgradeMenu) {
    upgradeMenu = game.add.sprite(game.world.centerX, game.world.centerY + C.game.height/2 + (C.upgradeMenu.height*C.upgradeMenu.scale)/2 + 200, 'upgradeMat');
    upgradeMenu.anchor.setTo(.5,.5);
    upgradeMenu.scale.x = C.upgradeMenu.scale;
    upgradeMenu.scale.y = C.upgradeMenu.scale;
  console.log(upgradeDescription);
  }
    var upgradeDescription = game.add.text(upgradeMenu.x, upgradeMenu.y - upgradeMenu.height/2 - 100, "Click on an upgrade to see its details, scroll up to return to the game", C.game.textStyle);
    upgradeDescription.anchor.setTo(.5,.5);
  game.kineticScrolling.start();
  game.input.onTap.add(chooseUpgrade, {menu: upgradeMenu});
  game.camera.y = game.height;
  upgradeState = true;
}


function chooseUpgrade(event) {
  if (game.camera.y >= 430) {
    console.log(event);
    var x1 = 340 * globalScale, x2 = 2425 * globalScale,
    y1 = 1544 * globalScale, y2 = 3650 * globalScale;
    console.log("Points are at " + x1 + "," + x2 + "," + y1 + "," + y2 + ".");
    console.log(event.worldX + " " + event.worldY);
    if (event.worldX > x1 && event.worldX < x2 && event.worldY > y1 && event.worldY < y2 ){
      var options = ["Electric Fists","Targeting Computer","Siege Mode","Nullifier Shield","The Payload",
        "Bigger Fists","Weakpoint Analysis","Weaponized Research","Nullifier Shield","The Payload",
        "Mines","Drop Wall","Fortified Cities","Obliteration Ray","Super Go Gast",
        "More Armor","Field Repair","Even More Armor","Obliteration Ray","Super Go Fast",
        "5D Accelerators","Autododge","Emergency Jump Jets","Fusion Cannon","Mind-Machine Interface",
        "Hyper Caffeine","Monster Bait","Chaos Systems","Fusion Cannon","Mind-Machine Interface"
      ]
      var x = event.worldX - x1,
          y = event.worldY - y1;
      var choice = options[Math.floor(x / (415*globalScale)) + 5*Math.floor(y /(350*globalScale))];
      console.log(choice);
      console.log("Event was at " + x + " " + y);
      game.kineticScrolling.stop();
      game.camera.y = game.camera.y;
      game.input.onTap._bindings = [];
      confirmUpgrade(lastClicked,choice);
    } 
  }
}

function confirmUpgrade(player,upgradeName) {
      confirmState = true;
      game.camera.y = upgradeMenu.y + upgradeMenu.height/2 + game.camera.height/2;
      var consideredUpgrade = U[upgradeName];
      if (confirmText) {
        confirmText.setText("Are you sure you would like to purchase " + upgradeName + " on " + lastClicked.sprite.key +"?\n\n" + consideredUpgrade.desc);
      } else {
        confirmText = game.add.text(game.camera.x + game.camera.width/2,game.camera.y + game.camera.height/2 - 230,"Are you sure you would like to purchase " + upgradeName + " on " + lastClicked.sprite.key +"?\n\n" + consideredUpgrade.desc, C.game.textStyle);
        confirmText.anchor.setTo(.5,.5);
      }
      for (i = 0; i < player.colorDiscounts.length; i++) {
        if (player.colorDiscounts[i].color === consideredUpgrade.color) {
          var discountValue = player.colorDiscounts[i].discount;
          break
        }
      }
      if (priceText) {
        priceText.setText(upgradeName + " is a tier " + consideredUpgrade.cost + " upgrade.\nOther " + consideredUpgrade.color + " upgrades you have purchased have reduced the cost to " + (consideredUpgrade.cost - discountValue));
      } else {
      priceText = game.add.text(confirmText.x, confirmText.y + 400, upgradeName + " is a tier " + consideredUpgrade.cost + " upgrade.\nOther " + consideredUpgrade.color + " upgrades you have purchased have reduced the cost to " + (consideredUpgrade.cost - discountValue),C.game.smallStyle)
      priceText.anchor.setTo(.5,.5);
      }
      var yes = game.add.text(confirmText.x - 150, priceText.y + 100, "Yes", C.game.ynStyle);
      yes.anchor.setTo(.5,.5);
      yes.inputEnabled = true;
      yes.events.onInputUp.add(upgrade, {upgrading: lastClicked, yn: "yes", boughtUpgrade: upgradeName});
      var no = game.add.text(confirmText.x + 150, priceText.y + 100, "No", C.game.ynStyle);
      no.anchor.setTo(.5,.5);
      no.inputEnabled = true;
      no.events.onInputUp.add(upgrade, {upgrading: lastClicked, yn: "no"});
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
          if (space.occupied[i].hp > 0) {
            pendingMonster = space.occupied[i];
          }
      } else if (space.occupied[i] && playerNames.indexOf(space.occupied[i].sprite.key) > -1) {
          if (space.occupied[i].hp > 0) {
            pendingPlayer = space.occupied[i];
          }
      
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
          focusX = changeValueScale(focusSpace.x,"x");
          focusY = changeValueScale(focusSpace.y,"y");
          yPivot = (battlePlayer.sprite.y *C.game.zoomScale) - game.camera.height/2; 
          xPivot = (battlePlayer.sprite.x *C.game.zoomScale) - game.camera.width/2;
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
      if (turn && turn.sprite.number && turn.sprite.number < playerCount) {
        turn = playersList[turn.sprite.number + 1];
      } else if (turn && turn.sprite.number && turn.sprite.number === playerCount || turn === undefined) {
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i].upgrades.indexOf("Siege Mode") && playersList[i].canSiege === false) {
            playersList[i].canSiege = true;
          }
        }
        turn = playersList[1];
      } 
    } while (turn === undefined)
      console.log("Switching to this turn:");
      console.log(turn);
      if (turn.rpPerTurn && turn.sprite.alive) {
        turn.rp += turn.rpPerTurn;
      }
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
        var spaceObjX = closestSpaces.selectedSpaces[i].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
        var spaceObjY = closestSpaces.selectedSpaces[i].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;
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
  var condition = true;
  while (condition === true) {
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
  } 
  
  console.log(object + " found a home");
  if (object !== "monster") {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,object); 
  } else {
    if (threatLevel <= 12) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"initialMonster"); 
    } else if (threatLevel <= 24) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"growingMonster"); 
    } else {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"extinctionMonster"); 
    }
    random.spriteName = random.key;
    random.key = "monster";
  }
  random.anchor.x = .5;
  random.anchor.y = .5;
  if (object === "purplecircle") {
    random.scale.x = C.destroyed.scale;
    random.scale.y = C.destroyed.scale;
    occupiedRows.push(space.key.substring(0,2));
  } else {
    random.scale.x = C.mech.scale;
    random.scale.y = C.mech.scale;
  }
  random.smoothed = true;
  random.prototype = Object.create(Phaser.Sprite.prototype);
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
  targetSpace = Space[space];
  spawn = game.add.sprite(targetSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,targetSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,object); 
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
  spawn.smoothed = true;
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
//game.state.add("Reload",Reload);
game.state.start("Boot");

