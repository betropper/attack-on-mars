var globalScale = .5;
var C = {
 "game": {
   "zoomScale": 3,
   "zoomSpeed": 600,
    "moveSpeed": 900,
   "width": 2800*globalScale,
    "height": 1280*globalScale,
   "textStyle": {
      align: 'center',
      fill: "#ffffff",
      font: 50*globalScale + 'px Poiret One'
   },
   "smallStyle": {
      align: 'center',
      fill: "#ffffff",
      font: 40*globalScale + 'px Poiret One',
      "style": {
        backgroundColor: 'black'
      }
   },

   "ynStyle": {
      align: 'center',
      fill: "#ffffff",
      font: 50 * globalScale+'px Poiret One',
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
   "battleSpacing": 100*globalScale,
   "battleSpeed": 3*globalScale
 },
 "destroyed": {
   "scale": 1.8 * globalScale
 },

 "monster": {
   "width": 72,
   "height": 72,
   "scale": 1.3 * globalScale
 },
 "menuBar": {
  "width": 294,
  "height": 120
 },
 "wrench": {
  "width": 300,
  "height": 300
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
 
 },
 "icons": {
  "width": 1379/7,
  "height": (1275/9)*2

 }
}
var bossNames = ["The Bloat","The Deciever","The Brute"] 
var focusX,
 focusY,
 xPivot,
 yPivot,
 zoomInTweens,
 mainMenuTweens = [],
 settingsMenuTweens = [],
 bossSprite
 fortifiedList = [];
var boss = {};
var battleSpeedDecrease = 0;
var boughtBool;
var upgradeState;
var confirmState;
var confirmText;
var battleTexts = [];
var playerBattleTexts = [];
var monsterBattleTexts = [];
var extraBattleTexts = [];
var attackText;
var siegeText;
var barsMoving;
var waitButton;
var mineButton;
var repairButton;
var upgradeButton;
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
var playerBar;
var monsterBar;
var battleState;
var resultsList = [];
var buttonsList = [];
var buttonsTextList = [];
var priceText;
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
      timeConstantScroll: 700*globalScale, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });

    console.log("Loading.");
    this.load.spritesheet('icons', "assets/Icons1.png", C.icons.width, C.icons.height)
    this.load.image("upgradeMat","assets/UpgradeMat.png",469,676);
    this.load.image("gameboard",C.bg.file,C.bg.width,C.bg.height);
    this.load.image("blue", "assets/PlayerIcon1.png",C.mech.width,C.mech.height);
    this.load.image("red", "assets/PlayerIcon2.png",C.mech.width,C.mech.height);
    this.load.image("green", "assets/PlayerIcon3.png",C.mech.width,C.mech.height);
    this.load.image("yellow", "assets/PlayerIcon4.png",C.mech.width,C.mech.height);
    this.load.image("bluecircle", "assets/blue-circle.png", 72, 72);
    this.load.image("redcircle", "assets/red-circle.png", 72, 72);
    this.load.image("purplecircle", "assets/purple-circle.png", 72, 72);
    this.load.image("destroyedCity", "assets/destroyedcity.png", 66, 124);
    this.load.image("initialMonster", "assets/InitialIcon.png", C.monster.width, C.monster.height);
    this.load.image("growingMonster", "assets/GrowingIcon.png", C.monster.width, C.monster.height);
    this.load.image("extinctionMonster", "assets/ExtinctionIcon.png", C.monster.width, C.monster.height);
    this.load.image("menubar","assets/menubar.png",C.menuBar.width,C.menuBar.height);
    this.load.image("wrench","assets/wrench.png", C.wrench.width,C.wrench.height);
    this.load.image("arrow","assets/arrow.png", C.arrow.width,C.arrow.height);
    this.load.spritesheet("leftright","assets/leftright.png", 62, 128);
    this.load.image("mine","assets/Mines.png", C.extras.width,C.extras.height);
    this.load.image("dropwall", "assets/DropWall.png", C.extras.width, C.extras.height);
    this.load.image("obliterationray", "assets/ObliterationRay.png", C.extras.width, C.extras.height);
    this.load.image("The Bloat", "assets/bloat.jpg");
    game.load.bitmapFont('attackfont','assets/attackfont.png', 'assets/attackfont.fnt');
  }
  create() {
    console.log("Loaded!");
    this.state.start("MainMenu");
  }
}

class MainMenu {
  
  preload() {
    if (Phaser.Device.desktop) {
      /*if (window.innerWidth < C.game.width) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      } else {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setUserScale((window.innerWidth)/2800,(window.innerHeight)/1280);
      }*/
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    } else {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
  }

  create() {
    var titleText = game.add.bitmapText(game.world.centerX, game.world.centerY - game.height/3, 'attackfont', "ATTACK ON MARS", 90*globalScale);
    titleText.anchor.set(0.5);
    playerCount = 4;
    var countNumber = game.add.bitmapText(game.world.centerX, game.world.centerY + game.height/6, 'attackfont', playerCount, 90*globalScale) 
    countNumber.anchor.set(0.5);
    var left = game.add.sprite(game.world.centerX - 140*globalScale, game.world.centerY + game.height/6, "leftright");
    left.frame = 0;
    left.anchor.set(0.5);
    left.inputEnabled = true;
    left.width = 90 * globalScale;
    left.height = 90 * globalScale;
    left.events.onInputDown.add(changePlayerCount, {action: -1, display: countNumber});
    var right = game.add.sprite(game.world.centerX + 140*globalScale, game.world.centerY + game.height/6, "leftright");
    right.frame = 1;
    right.anchor.set(0.5);
    right.inputEnabled = true;
    right.width = 90 * globalScale;
    right.height = 90 * globalScale;
    right.events.onInputDown.add(changePlayerCount, {action: 1, display: countNumber});
    var playerCountText = game.add.bitmapText(game.world.centerX, countNumber.y - 140*globalScale, 'attackfont', "Player Count", 90*globalScale);
    playerCountText.anchor.set(.5);
    game.input.onUp.add(checkButtons, {left: left, right: right});
    var playButton = game.add.bitmapText(game.world.centerX, countNumber.y + 140*globalScale, 'attackfont', "Play Game", 90*globalScale);
    playButton.anchor.set(.5);
    playButton.inputEnabled = true;
    playButton.events.onInputUp.add(changeState, {state: "Setup"});
    var settingsButton = game.add.bitmapText(game.world.centerX, playButton.y + 140*globalScale, 'attackfont', "Settings", 90*globalScale);
    settingsButton.anchor.set(.5);
    settingsButton.inputEnabled = true;
    var menuList = [left, countNumber, right, playerCountText, playButton, settingsButton];

    var returnButton = game.add.bitmapText(game.world.centerX + game.width, game.world.centerY - game.height/8, 'attackfont', "Return to Menu", 90*globalScale);
    returnButton.anchor.set(.5);
    //Off screen settings menu
    returnButton.inputEnabled = true;
    var settingsList = [returnButton]
    settingsButton.events.onInputUp.add(shiftSettings, {menuList: menuList, settingsList:settingsList});
    returnButton.events.onInputUp.add(shiftSettings, {menuList: menuList, settingsList:settingsList});
  }
}


function shiftSettings() {
  //game.camera.y += game.camera.width;
    console.log("Shifting");
    for (i = 0; i < this.menuList.length; i++) {
      if (!mainMenuTweens[i]|| (mainMenuTweens[i].position && mainMenuTweens[i].position === "center")) {
        mainMenuTweens[i] = game.add.tween(this.menuList[i]).to({x: this.menuList[i].x - game.width}, 700, Phaser.Easing.Back.InOut, true);
        mainMenuTweens[i].position = "left";
      } else if (mainMenuTweens[i].position === "left") {
        mainMenuTweens[i] = game.add.tween(this.menuList[i]).to({x: this.menuList[i].x + game.width}, 700, Phaser.Easing.Back.InOut, true);
        mainMenuTweens[i].position = "center";
      }
    }
    for (i = 0; i < this.settingsList.length; i++) {
      if (!settingsMenuTweens[i] || (settingsMenuTweens[i].position && settingsMenuTweens[i].position === "right")) {
        settingsMenuTweens[i] = game.add.tween(this.settingsList[i]).to({x: this.settingsList[i].x - game.width}, 700, Phaser.Easing.Back.InOut, true);
        settingsMenuTweens[i].position = "center";
      } else if (settingsMenuTweens[i].position === "center") {
        settingsMenuTweens[i] = game.add.tween(this.settingsList[i]).to({x: this.settingsList[i].x + game.width}, 700, Phaser.Easing.Back.InOut, true);
        settingsMenuTweens[i].position = "right";
      }
    }
    var settingMenuTween
}
function changeState() {
    game.state.start(this.state);
}

function changePlayerCount(callObject) {
  if (this.action && this.action + playerCount >= 2 && this.action + playerCount <= 4) {
    playerCount += this.action;
    if (this.display) {
      this.display.setText(playerCount);
    }
  } else {
    callObject.kill()
  }
}

function checkButtons() {
  if (!this.left.alive && playerCount > 2) {
    this.left.reset(this.left.x,this.left.y);
  } else if (!this.right.alive && playerCount < 4) {
    this.right.reset(this.right.x,this.right.y);
  }
}

class Setup {

  create() {
    console.log(playersList);
    //if (playersList.length === 0) {
    for (var i = 0; i < obj_keys.length; i++) {
      Space[obj_keys[i]].occupied = false;
    }   
    game.stage.smoothed = true;
  if (Phaser.Device.desktop) {
    /*if (window.innerWidth < C.game.width) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    } else {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale((window.innerWidth)/2800,(window.innerHeight)/1280);
    }*/
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  } else {
    alert("You are on mobile!");
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  }
    game.camera.bounds = null;
    console.log("Placing Board");
    game.bg = game.add.sprite(0, game.world.centerY - game.height / 2, "gameboard");
    game.bg.scale.setTo(C.bg.scale, C.bg.scale);
    if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
      playerCount = 2;
    } else if (playerCount > 4) {
      playerCount = 4;
    }
    game.time.events.add(Phaser.Timer.SECOND * 1, spawnBoss, this);
    for (var i = 1; i <= playerCount; i++) {
      console.log(i);
      var destroyedCityColumn = spawnRandom("destroyedCity", i, "0", false);
      destroyedCities[i-1] = destroyedCityColumn;
      playersList[i] = spawnRandom(playerNames[i-1], i, "0", true); 
      playersList[i].sprite.number = i;
      playersList[i].upgrades = [];
      playersList[i].colorDiscounts = [
        {color: "red", discount: 0 },
        {color: "blue", discount: 0},
        {color: "green", discount: 0},
        {color: "yellow",discount: 0},
        {color: "purple", discount: 0},
        {color: "black", discount: 0}
      ]
      playersList[i].sprite.inputEnabled = true;
      playersList[i].sprite.input.enableDrag(true);
      playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
      closestSpaces = getClosestSpaces(playersList[i].key);
      playersList[i].sprite.closestSpaces = closestSpaces;
      playersList[i].sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
      monstersList[i-1] = spawnRandom("monster", i, "3", true);
      monstersList[i-1].sprite.number = i - 1;

    }
    turn = playersList[1];
    turn.sprite.inputEnabled = true;
    turn.sprite.input.enableDrag(true);
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    // Add in text that is displayed.
    spaceDisplay = game.add.text(game.world.centerX + game.world.width/4, game.world.centerY - game.world.height/3,"Valid Movements for " + turn.sprite.key +":\n" + turn.sprite.closestSpaces.keys.join(" "),C.game.textStyle);
    attributeDisplay = game.add.text(spaceDisplay.x, spaceDisplay.y + 300*globalScale, "", C.game.textStyle);
    spaceDisplay.anchor.setTo(.5); 
    attributeDisplay.anchor.setTo(.5);
    upgradeDisplay = game.add.text(attributeDisplay.x, attributeDisplay.y + 450*globalScale, "", C.game.textStyle);
    upgradeDisplay.anchor.setTo(.5);
    turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    menuBar = game.add.sprite(0,game.height - game.camera.width/5,"menubar");
    menuBar.width = game.camera.width;
    menuBar.height = game.camera.width/5;
    //menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
    menuBar.kill();
    waitButton = game.add.button(70*globalScale, game.world.centerX + game.world.width/2 - 90*globalScale, 'purplecircle', waitOneAction);
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    //waitButton.scale.y = .6;
    waitButton.battleButton = false;
    buttonsList.push(waitButton);
    game.world.bringToTop(waitButton);
    
    }
  update() {
  /*if (Phaser.Device.desktop) {
      if (window.innerWidth < C.game.width) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      } else {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      }
    }*/
    //Set ZoomIn to true or ZoomOut to false to enable zoom. It will
    //reset itself.
    //
    //Disables scrolling when upgrading is done
    //game.camera.focusOnXY(playersList[1].sprite.x, playersList[1].sprite.y);
    if (game.camera.y <= 0) {
      game.camera.y = 0;
      if (upgradeState === true) {
        upgradeState = false;
        game.input.onTap._bindings = [];  
        if (boughtBool === true) {
          actionPoints -= 1;
          boughtBool = false;
        }
        game.kineticScrolling.stop();
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
      //findIncrementsTo(focusSpace);
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
      if (!zoomInTweens) {
        zoomInTweens = true;
        var zoomTween = game.add.tween(game.camera).to( { x: focusX*3 - game.camera.width/2 , y: focusY*3 - game.camera.height/2 + game.camera.height/8 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        //zoomTween.onComplete.add(zoomWorld, {zoomScale: C.game.zoomScale});
        var scaleTween = game.add.tween(game.world.scale).to( { x: C.game.zoomScale, y: C.game.zoomScale }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        scaleTween.onComplete.add(zoomFalse, this);
      }
        for (i = 0; i < buttonsTextList.length; i++) {
        buttonsTextList[i].kill();
       }

        for (i = 1; i < playersList.length; i++) {
          if (playersList[i] !== battlePlayer) {
            playersList[i].sprite.inputEnabled = false;
          }
        }
        /*
        menuBar.width = C.game.width / game.world.scale.x;
        menuBar.height = (C.game.height/10) / game.world.scale.y;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        */
        game.world.bringToTop(menuBar);
    } else if (zoomOut === true) {
      if (menuBar.alive) {   
          var zoomTween = game.add.tween(game.camera).to( { x: 0, y: 0 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
          var scaleTween = game.add.tween(game.world.scale).to( { x: 1, y: 1 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
          scaleTween.onComplete.add(zoomFalse, this);
          killBattleInfo()
      }
        /*menuBar.width = C.game.width / game.world.scale.x;
        menuBar.height = (C.game.height/10) / game.world.scale.y;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        game.world.bringToTop(menuBar);*/
        menuBar.attachedToCamera = false;
    } if (battleStarting) {
      var lookAt = focusX; 
      battlePlayer.sprite.x = Phaser.Math.clamp(battlePlayer.sprite.x + C.mech.battleSpeed/2, 0, lookAt + C.mech.battleSpacing);
      battleMonster.sprite.x = Phaser.Math.clamp(battleMonster.sprite.x - C.mech.battleSpeed/2, lookAt - C.mech.battleSpacing, 3000);
      if (battlePlayer.sprite.x === lookAt + C.mech.battleSpacing) {
        battleStarting = false;
        barsMoving = true;
      }
    } else if (battlePlayer && barsMoving) {
        game.world.scale.set(C.game.zoomScale);
        if (menuBar.alive === false) {  
          menuBar.reset(game.camera.x/C.game.zoomScale, game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale);
          menuBar.width = game.camera.width/C.game.zoomScale;
          menuBar.height = game.camera.height/8;
          //menuBar.y = game.camera.y + game.camera.height/C.game.zoomScale;
          //menuBar.x = game.camera.x/C.game.zoomScale;
          game.world.bringToTop(menuBar);
          var barTween = game.add.tween(menuBar).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8)}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          menuBar.attachedToCamera = false;
          if (!playerBar) {
            playerBar = game.add.sprite(focusX + game.camera.width/2, battlePlayer.sprite.y, 'menubar');
            playerBar.height = (game.camera.width/C.game.zoomScale)/5;
            playerBar.width = game.camera.height/8;
          } else if (playerBar.alive === false) {
            playerBar.reset(focusX + game.camera.width/2, battlePlayer.sprite.y);
          }
          playerBattleTexts.x = game.camera.x/C.game.zoomScale + game.camera.width/C.game.zoomScale - (300*globalScale)/C.game.zoomScale;
          var playerBarTween = game.add.tween(playerBar).to({ x: playerBattleTexts.x }, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          playerBarTween.onComplete.add(allowBattle,this);
          playerBar.anchor.setTo(.5);
          game.world.bringToTop(playerBar);
          if (!monsterBar) {
            monsterBar = game.add.sprite(focusX - game.camera.width/2, battlePlayer.sprite.y, 'menubar');
            monsterBar.width = game.camera.height/8;
            monsterBar.height = (game.camera.width/C.game.zoomScale)/5;
          } else if (monsterBar.alive === false) {
            monsterBar.reset(focusX - game.camera.width/2, battlePlayer.sprite.y);
          }
          monsterBattleTexts.x = game.camera.x/C.game.zoomScale + ((300*globalScale)/C.game.zoomScale);
          var monsterBarTween = game.add.tween(monsterBar).to({ x: monsterBattleTexts.x}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          monsterBar.anchor.setTo(.5);
          battleMonster.addBattleInfo("HP","hp",8);
          battlePlayer.addBattleInfo("HP","hp",8);
          game.world.bringToTop(menuBar);
        } else {
        //var barTween = game.add.tween(menuBar).to( { x: focusX*3 - game.camera.width/2 , y: focusY*3 + game.camera.height/2 - menuBar.height }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        }
        //game.add.tween(menuBar).to( { y: game.world.centerY }, 4000, Phaser.Easing.Bounce.Out, true);
        if (battleMonster.upgrades.indexOf("First Attack") === -1) {
          battleTurn = battlePlayer;
        } else {
          battleTurn = battleMonster;
          printBattleResults(battleMonster.sprite.key + " attacks first!");
        }
        attackText = game.add.bitmapText(menuBar.x + 100*globalScale, menuBar.y + menuBar.height,'attackfont', "Attack!",40*globalScale);
        attackText.anchor.set(0.5);
        attackText.inputEnabled = true;
        attackText.events.onInputDown.add(queAttack, {attacker: battlePlayer});
        battleTexts.push(attackText);
        if (battlePlayer.upgrades.indexOf("Emergency Jump Jets") > -1) {  
          addBattleText("Run",attemptEscape, "Emergency Jump Jets");
        } else {
          addBattleText("Run",attemptEscape, null);
        }
        if (battlePlayer.canSiege) {
          addBattleText("Siege Mode",queAttack,"Siege Mode");
        }
        if (battlePlayer.weaponizedResearchCharges && battlePlayer.weaponizedResearchCharges > 0) {
          addBattleText("Weaponized Research",queAttack,"Siege Mode");
        }
        for (i = 0; i < battleTexts.length; i++) {
          game.add.tween(battleTexts[i]).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + menuBar.height/2}, C.game.zoomSpeed*2, Phaser.Easing.Back.InOut, true)
          game.world.bringToTop(battleTexts[i]);
        }
        barsMoving = false;
    } else if (battleState === true) {
      battle(battlePlayer,battleMonster);
      // Change this, placeholder ending.

    }
    // set a minimum and maximum scale value
    //worldScale = Phaser.Math.clamp(worldScale, 1, C.game.zoomScale);
    //game.world.scale.set(worldScale);
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
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + " / " + over.maxhp + "\nDefence Die (green): " + over.def + "\nRed Attack Die: " + over.ratk + "\nBlue Attack Die: " + over.batk + "\nResearch Points: " + over.rp);
        /*if (attributeDisplay.text && lastClicked !== undefined && repairText && attributeDisplay.text.indexOf(lastClicked.sprite.key) === -1) {
          repairText.text = "Repair " + lastClicked.sprite.key;
        }*/
       upgradeDisplay.setText("Upgrades for " + over.sprite.key +":\n" + over.upgrades.join(",\n"));
      } else if (over.sprite.key === "monster" || bossNames.indexOf(over.sprite.key) > -1) {
        attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + " / " + over.maxhp + "\nDefence Die (green): " + over.def + "\nBlue Attack Die: " + over.batk + "\nResearch Point Reward: " + over.rp);
        upgradeDisplay.setText("Upgrades for " + over.sprite.key +":\n" + over.upgrades.join(",\n"));
      }
    } else if (lastClicked) {
      if (playerNames.indexOf(lastClicked.sprite.key) > -1) {
        attributeDisplay.setText("\nName: " + lastClicked.sprite.key + "\nHP: " + lastClicked.hp + " / " + lastClicked.maxhp + "\nDefence Die (green): " + lastClicked.def + "\nRed Attack Die: " + lastClicked.ratk + "\nBlue Attack Die: " + lastClicked.batk + "\nResearch Points: " + lastClicked.rp);
      } else {
        attributeDisplay.setText("\nName: " + lastClicked.sprite.key + "\nHP: " + lastClicked.hp + " / " + lastClicked.maxhp + "\nDefence Die (green): " + lastClicked.def + "\nBlue Attack Die: " + lastClicked.batk + "\nResearch Point Reward: " + lastClicked.rp);
      }
      upgradeDisplay.setText("Upgrades for " + lastClicked.sprite.key + ":\n" + lastClicked.upgrades.join(",\n"));
    }

  }
}

function allowBattle() {
  battlePlayer.sprite.events.onDragStop._bindings = [];
  battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
  battleStarting = false;
  battleState = true;
  for (i = 0; i < extraBattleTexts.length; i++) {
    game.add.tween(extraBattleTexts[i].valueDescription).to({ x: extraBattleTexts[i].bar.x }, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true)
    game.add.tween(extraBattleTexts[i].valueDisplay).to({ x: extraBattleTexts[i].bar.x  }, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true)
  }
}

function addBattleText(text, action, modifier) {
  var battleText = game.add.bitmapText(battleTexts[battleTexts.length - 1].x + battleTexts[battleTexts.length - 1].width/2 + 80*globalScale, menuBar.y + 40*globalScale, 'attackfont', text, 40*globalScale);
  battleText.anchor.y = 0.5;
  battleText.inputEnabled = true;
  battleText.events.onInputDown.add(action, {attacker: battlePlayer, modifier: modifier});
  battleTexts.push(battleText);
}
//'value' is the name of the changed value as a string.
function addBattleInfo(text, value, frame) {
  if (playersList.indexOf(this) > -1) {
    var x = playerBattleTexts.x;
    var list = playerBattleTexts;
    var bar = playerBar;
  } else if (monstersList.indexOf(this) > -1) {
    var x = monsterBattleTexts.x;
    var list = monsterBattleTexts;
    var bar = monsterBar;
  }
  //Adds the battle info into an appropriate spot relative to the bars
  if (bar === playerBar) {
    if (list.length > 0) {
      //var valueDescription = game.add.bitmapText(x + 150*globalScale,list[list.length - 1].valueDisplay.y + 40*globalScale, 'attackfont', text, 20*globalScale);
      //var valueDescription = game.add.sprite.(x + 150*globalScale,list[list.length - 1].valueDisplay.y + 40*globalScale, 'icons');
      var iconX = x + 150*globalScale;
      var iconY = list[list.length - 1].valueDisplay.y + 40*globalScale;
    } else {
      //var valueDescription = game.add.bitmapText(x + 150*globalScale,playerBar.y - playerBar.height/3, 'attackfont', text, 20*globalScale);
      var iconX = x + 150*globalScale;
      var iconY = playerBar.y - playerBar.height/3;
    }
    var valueDisplay = game.add.bitmapText(x + 150*globalScale,iconY + 30*globalScale, 'attackfont', this[value], 20*globalScale);
  } else if (bar === monsterBar) {
    if (list.length > 0) {
      //var valueDescription = game.add.bitmapText(x - 150*globalScale ,list[list.length - 1].valueDisplay.y + 40*globalScale, 'attackfont', text, 20*globalScale);
      var iconX = x - 150*globalScale;
      var iconY = list[list.length - 1].valueDisplay.y + 40*globalScale;
    } else {
      //var valueDescription = game.add.bitmapText(x - 150*globalScale ,playerBar.y - playerBar.height/3, 'attackfont', text, 20*globalScale);
      var iconX = x - 150*globalScale;
      var iconY = monsterBar.y - monsterBar.height/3;
    }
    var valueDisplay = game.add.bitmapText(x - 150*globalScale,iconY + 30*globalScale, 'attackfont', this[value], 20*globalScale);
  }
  var valueDescription = game.add.sprite(iconX,iconY, 'icons');
  valueDescription.scale.setTo(.5*globalScale);
  valueDescription.frame = frame;
  valueDisplay.anchor.setTo(.5);
  valueDescription.anchor.setTo(.5);

  //battleInfo.lastValue = value;
  battleDescObj = {
    parent: this,
    valueDescription: valueDescription,
    valueDisplay: valueDisplay,
    value: value,
    bar: bar
  }
  console.log(battleDescObj.parent);
  battleDescObj.update = function() {
    //this.description.x = this.bar.x;
    //this.valueDisplay.x = this.bar.x;
    if (this.value != this.parent[value].toString()) {
      this.value = this.parent[value].toString();
      this.valueDisplay.text = this.parent[value].toString();
    }
  }
  list.push(battleDescObj);
  extraBattleTexts.push(battleDescObj);
}

function spawnBoss() {  
  var drawnMonster = MonstersDeck.bossMonsters[Math.floor(Math.random() * MonstersDeck.bossMonsters.length)];
  boss.name = drawnMonster.name;
  boss.hp = drawnMonster.hp;
  boss.batk = drawnMonster.batk;
  boss.maxhp = drawnMonster.hp;
  boss.upgrades = drawnMonster.upgrades;
  for (i = 0; i < boss.upgrades.length; i++) {
    if (MU[boss.upgrades[i]] && MU[boss.upgrades[i]].passive) {
      MU[boss.upgrades[i]].passive(boss);
    }
  }
  boss.def = drawnMonster.def;
  boss.rp = 5;
  boss.mr = 4;
  var bossX = changeValueScale(Space["center"].x,"x");
  var bossY = changeValueScale(Space["center"].y,"y");
  boss.sprite = game.add.sprite(bossX,bossY,boss.name);
  boss.sprite.anchor.setTo(.5);
  Space["center"].occupied = [boss]
  if (boss.name === "The Bloat") {
    boss.sprite.scale.setTo(.16 * globalScale);
    var bossScaleTween = game.add.tween(boss.sprite.scale).to({x: .96*globalScale, y: .96*globalScale}, 500, Phaser.Easing.Back.InOut, true);
    bossScaleTween.onComplete.add(shakeSprite,{sprite: boss.sprite});
  }
  boss.sprite.inputEnabled = true;
  globalList.push(boss);
}

function shakeSprite(sprite) {
  sprite = this.sprite || sprite;
  game.camera.shake(.01, 500);
  if (boss.name === "The Bloat") { 
    game.time.events.add(500, shrinkSprite, this, boss.sprite);
  }
}

function shrinkSprite(sprite) {
 if (sprite.key === "The Bloat") {
   var bossScaleTween = game.add.tween(boss.sprite.scale).to({x: .16*globalScale, y: .16*globalScale}, 500, Phaser.Easing.Back.InOut, true);
 }
}

function zoomWorld() {
 if (this.zoomScale) {
  var scaleTween = game.add.tween(game.world.scale).to( { x: this.zoomScale, y: this.zoomScale }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
  scaleTween.onComplete.add(zoomFalse, this);
 }
}

function zoomFalse() {
  if (zoomIn === true) {
    zoomIn = false;
    zoomInTweens = false;

}
  if (zoomOut === true) { 
    zoomOut = false;
    for (i = 0; i < buttonsList.length; i++) {
      game.world.bringToTop(buttonsList[i]);
    }
    for (i = 0; i < buttonsTextList.length; i++) {
      buttonsTextList[i].reset(buttonsTextList[i].x,buttonsTextList[i].y);
    }
    game.world.scale.set(1);
  }
}

function queAttack() {
  if (battleTurn === this.attacker) {
    this.attacker.attacking = true;
    if (this.modifier && this.modifier === "Siege Mode") {
      this.attacker.siegeMode = true;
    } else if (this.modifier && this.modifier === "Weaponized Research") {
    }
  }
}

function setLastClicked(sprite) {
  if (playerNames.indexOf(sprite.key) > -1) {
    lastClicked = playersList[sprite.number];
    var normalState = !battleState && !zoomIn && !zoomOut;
    if  (lastClicked.key.indexOf("0") === 2 && !repairButton && lastClicked.hp < lastClicked.maxhp && normalState) { 
      //repairText = game.add.text(1050, menuBar.y, "Repair " + sprite.key, C.game.textStyle);
      //repairText.anchor.set(0.5);
      //repairText.inputEnabled = true;
      //repairText.events.onInputDown.add(repair, {repairing: lastClicked});
      repairButton = game.add.sprite(0, 0, 'wrench');
      repairButton.anchor.set(0.5);
      repairButton.inputEnabled = true;
      repairButton.width = 80;
      repairButton.height = 80;
      repairButton.battleButton = false;
      buttonsList.push(repairButton);
      //buttonsTextList.push(repairText);
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked});
    } else if (lastClicked.key.indexOf("0") === 2 && lastClicked.hp < lastClicked.maxhp && normalState) {
      //repairText.reset(1050, menuBar.y);
      //repairText.setText("Repair " + sprite.key);
      //repairText.events.onInputDown._bindings = [];
      //repairText.events.onInputDown.add(repair, {repairing: lastClicked});
      repairButton.reset(repairButton.x, repairButton.y);
      repairButton.events.onInputDown._bindings = [];
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked});
    } else if (repairButton) {
      //repairText.kill();
      //buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    
    if (!upgradeButton && normalState) { 
      //upgradeText = game.add.text(spaceDisplay.x + 200*globalScale, attributeDisplay.y, "Upgrade " + sprite.key, C.game.textStyle);
      //upgradeText.anchor.set(0.5);
      //upgradeText.inputEnabled = true;
      //upgradeText.events.onInputUp.add(upgrade, {upgrading: lastClicked});
      upgradeButton = game.add.sprite(0, 0, lastClicked.sprite.key);
      upgradeButton.anchor.set(0.5);
      upgradeButton.inputEnabled = true;
      upgradeButton.width = 80;
      upgradeButton.height = 80;
      upgradeButton.battleButton = false;
      buttonsList.push(upgradeButton);
      //buttonsTextList.push(upgradeText);
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: lastClicked});
    } else if (normalState) {
      //upgradeText.reset(upgradeText.x, upgradeText.y);
      //upgradeText.setText("Upgrade " + sprite.key);
      //upgradeText.events.onInputUp._bindings = [];
      //upgradeText.events.onInputUp.add(upgrade, {upgrading: lastClicked});
      upgradeButton.reset(upgradeButton.x, upgradeButton.y);
      upgradeButton.loadTexture(lastClicked.sprite.key);
      game.world.bringToTop(upgradeButton);
      upgradeButton.events.onInputUp._bindings = [];
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: lastClicked});
    }

    if (!wallButton && normalState && lastClicked.upgrades.indexOf("Drop Wall") > -1 && !lastClicked.wallDeployed) { 
      wallButton = game.add.sprite(300, menuBar.y + 77, 'dropwall');
      wallButton.anchor.set(0.5);
      wallButton.inputEnabled = true;
      wallButton.battleButton = false;
      wallButton.height = 80;
      wallButton.width = 80;
      buttonsList.push(wallButton);
      wallButton.input.enableDrag();
      wallButton.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: null, player: lastClicked, sprite: wallButton});
    } else if (normalState && lastClicked.upgrades.indexOf("Drop Wall") > -1 && !lastClicked.wallDeployed) {
      wallButton.reset(wallButton.x, wallButton.y);
      wallButton.events.onDragStop._bindings = [];
      wallButton.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: null, player: lastClicked, sprite: wallButton});
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
   for (i = 0; i < buttonsList.length; i++) {
     if (buttonsList[i].alive) {
      buttonsList[i].x = game.world.centerX + game.world.width/2 - 90*globalScale;
      if (lastButton) {
        buttonsList[i].y = lastButton.y + 90;
      } else {
        buttonsList[i].y = 70;
      }
      var lastButton = buttonsList[i];
     }
   }
  } else if (sprite.key === "monster") {
    if (repairText) {
      repairText.kill();
      //buttonsList.splice(repairButton, 1);
      repairButton.kill();
    }
    /*if (upgradeText) {
      upgradeText.kill();
      //buttonsList.splice(upgradeButton, 1);
      upgradeButton.kill();
    }*/
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
  game.state.start("MainMenu");
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
var monsterBar;
var playerBar;
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
  if (battleState === true && sprite.overlap(battleMonster.sprite)) {
    attack(battlePlayer,battleMonster)
  }
  if (battleState === true) {
    sprite.x = focusX + C.mech.battleSpacing;
    sprite.y = focusY;
  }
}
function printBattleResults(text,position) {
  if (resultsList.length > 0) {
    for (i = 0; i < resultsList.length; i++) {
      resultsList[i].y -= globalScale*40;
    }
  }
  if (!position) {
    var battleResults = game.add.bitmapText(Math.round(focusX),Math.round(focusY - 60*globalScale), 'attackfont', text, 30*globalScale);
  } else {
    var battleResults = game.add.bitmapText(Math.round(position.x),Math.round(position.y - 60*globalScale), 'attackfont', text, 30*globalScale);
  }
  battleResults.anchor.x = .5;
  battleResults.anchor.y = .5;
  game.world.bringToTop(battleResults);
  resultsList.push(battleResults);
  game.time.events.add(Phaser.Timer.SECOND * 3, killResults, this, battleResults);
}

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

function attemptEscape() {
  var method = this.modifier;
  killBattleInfo();
  console.log(method);
  if (method === null) {
    var row = parseInt(battlePlayer.key.charAt(2)) - 2;
    if (row < 0) {
      row = 0;
    } 
    var destination = battlePlayer.key.substring(0,2) + row;
    console.log("running to " + destination);
    move(battlePlayer,destination,"running");
  }
  move(battleMonster,destination,"chasing");
  var cameraTween = game.add.tween(game.camera).to( { x: changeValueScale(Space[destination].x,"x")*3 - game.camera.width/2 , y: changeValueScale(Space[destination].y,"y")*3 - game.camera.height/2 + game.camera.height/8 }, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
  cameraTween.onComplete.add(attackOfOppertunity, {attacker: battleMonster, defender: battlePlayer, destination: destination});
}

function attackOfOppertunity() {
  var attacker = attacker || this.attacker;
  var defender = defender || this.defender;
  var destination = destination || this.destination;
  console.log(defender);
  var bhits = rollDie(attacker.batk - (defender.batkDecrease || 0), attacker.batkGoal+1 || 6);
  var rhits = 0;
  if (attacker.ratk) {
    rhits = rollDie(attacker.ratk - (defender.ratkDecrease || 0), attacker.ratkGoal+1 || 6);
  } 
  var successes = rhits + bhits;
  if (defender.guarenteedDef && successes > 0) {
    successes -= defender.guarenteedDef;
  }
  var defences = rollDie(defender.def, defender.defGoal || 5);

  if (successes > defences) {
    defender.hp -= successes - defences;
    var damaged = defender;
    var damageTaken = successes - defences;
    var text = defender.sprite.key + " took " + damageTaken.toString() + " damage from " + attacker.sprite.key + " while running!";
  } else if (defences > successes) {
    var text = defender.sprite.key + " ran away while blocking all damage.";
  } else {
    var damaged = undefined;
    var damageTaken = undefined;
    var text = defender.sprite.key + " dodged every hit from " + attacker.sprite.key + "!";
  }
    printBattleResults(text, {x: defender.sprite.x, y: defender.sprite.y }); 
    if (attacker.upgrades.indexOf("Poison Aura") > -1) {
      var stacks = countInArray(attacker.upgrades,"Poison Aura");
      MU["Poison Aura"].active(attacker,defender,stacks);      
    }
  if (damaged && damaged.hp <= 0) {
    handleDeath(damaged,attacker);   
  } else {
    finishBattle();
    move(battlePlayer,destination);
  }
  battleTexts.splice(0,battleTexts.length);
  var attackerTween = game.add.tween(attacker.sprite).to( { x: changeValueScale(Space[attacker.key].x,"x"), y: changeValueScale(Space[attacker.key].y,"y")}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
}

function attack(attacker,defender) {
  var bhits = rollDie(attacker.batk - (defender.batkDecrease || 0), attacker.batkGoal || 5);
  var rhits = 0;
  if (attacker.ratk) {
    rhits = rollDie(attacker.ratk - (defender.ratkDecrease || 0), attacker.ratkGoal || 5);
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
  var defences = rollDie(defender.def, defender.defGoal || 5);
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
    printBattleResults(text); 
    if (attacker.upgrades.indexOf("Poison Aura") > -1) {
      var stacks = countInArray(attacker.upgrades,"Poison Aura");
      MU["Poison Aura"].active(attacker,defender,stacks);      
    }
  if (damaged && damaged.hp <= 0) {
    if (damaged === defender) {
      handleDeath(damaged,attacker);
    } else if (damaged === attacker) {
      handleDeath(damaged,defender);
    }
  }
    if (!damaged || damaged.hp > 0) {
    battleTurn = defender;
  }

}
function handleDeath(damaged,survivor) {
  if (damaged.upgrades.indexOf("Feign Death") > -1 && damaged.feigned === false) {
    MU["Feign Death"].active(damaged);
    return;
  }
  battlePlayer.attacking = false;
  console.log("DED with " + damaged.hp);
  scrubList(globalList);
  if (survivor.siegeMode) {
    survivor.siegeMode = false;
    survivor.def += 1;
  }
  if (damaged === battlePlayer) {
    focusSpace.occupied = removeFromList(playersList[battlePlayer.sprite.number], focusSpace);
    playersList[damaged.sprite.number].sprite.kill();
    var destroyedPlayers = 0;
    for (var i = 1; i < playersList.length; i++) {
      if (!playersList[i].sprite.alive) {
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
    battlePlayer.sprite.x = focusX;
    console.log("Monster died, moving back to position " + focusX )
  }
  finishBattle();

}

function finishBattle() {
  pendingBattles.splice(0,1);
  for (i = 0; i < battleTexts.length; i++) {
    battleTexts[i].kill();
  }
  for (i = 0; i < playerBattleTexts.length; i++) {
    playerBattleTexts[i].valueDisplay.destroy();
    playerBattleTexts[i].valueDescription.destroy();
  }
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].valueDisplay.destroy();
    monsterBattleTexts[i].valueDescription.destroy();
  }
  playerBattleTexts = [];
  monsterBattleTexts = [];
  if (focusSpace.occupied && focusSpace.occupied !== false) {
    scrubList(focusSpace.occupied);
  }

  for (i = 1; i < playersList.length; i++) {
    playersList[i].sprite.inputEnabled = true;
    playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
  }
  battlePlayer.sprite.events.onDragStop._bindings = [];
  battlePlayer.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
  if (pendingBattles.length > 0) {
    console.log("There are more battles.");
    killBattleInfo();
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
    if (!menuBar.alive) {
      menuBar.reset();
    }
    zoomIn = false;
    zoomOut = true;
    battleState = false;
  }
}

function killBattleInfo() {
  menuBar.kill();
  playerBar.kill();
  monsterBar.kill();
  for (i = 0; i < playerBattleTexts.length; i++) {
    playerBattleTexts[i].valueDescription.destroy();
    playerBattleTexts[i].valueDisplay.destroy();
  }
  playerBattleTexts = [];
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].valueDescription.destroy();
    monsterBattleTexts[i].valueDisplay.destroy();
  }
  monsterBattleTexts = [];
}

function killResults(results) {
  results.destroy();
  resultsList.splice(results,1);
  console.log(results + " has been destroyed.");
}

function rollDie(count, goal){ 
  var hits = 0;
  for (i = 1; i < count; i++) {
    if (Math.floor(Math.random() * ((6-1)+1) + 1) >= goal) {
      hits += 1;
    }
  }
  return hits;
} 

function battle(player, monster) {
  //Simple Placeholder battle
  game.world.bringToTop(monster.sprite);
  game.world.bringToTop(player.sprite);  
  for (i = 0; i < playerBattleTexts.length; i++) {
    playerBattleTexts[i].update();
  }
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].update(); 
  }
  if (battleTurn === battleMonster && battleMonster.sprite) {
      if (attackText) {
        if (battleMonster.upgrades.indexOf("Regeneration") > -1) {
          var stacks = countInArray(battleMonster.upgrades,"Regeneration");
          MU["Regeneration"].active(battleMonster, stacks);
        }
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
   scrubList(monstersList);   
    for (var i = 0; i < monstersList.length ; i++) {
        if (monstersList[i].key.charAt(2) !== "0") {
          var newDestination = monstersList[i].key.substring(0,2) + (parseInt(monstersList[i].key.charAt(2)) - 1);
        } else {
          var newDestination = monstersList[i].key;
        }
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
          if (monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied) {
            var len = monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied.length;
          } else {
            var len = 0;
          }
          for (o = 0; o < len; o++) {
            if (playersList.indexOf(monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o]) > -1) {
              var newDestination = monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o].key;
              console.log("Moving to player at " + newDestination);
            }
          }
        }
          

          
          if (parseInt(monstersList[i].key.charAt(2)) !== 0 && parseInt(newDestination.charAt(2)) === 0) {
            if (Space[newDestination].occupied === false || Space[newDestination].occupied === null || Space[newDestination].occupied === undefined) {
              console.log("U R DED");
              if (fortifiedList.indexOf(newDestination.charAt(0)) === -1 || Space[newDestination].damage === 1) {
                var destroyedCityColumn = spawnSpecific("destroyedCity", newDestination);
                destroyedCities.push(destroyedCityColumn);
                occupiedRows.push(destroyedCityColumn.key.substring(0,2));
                Space[newDestination].damage = 2;
              } else {
                Space[newDestination].damage = 1;
              }
            }
          } else if (parseInt(monstersList[i].key.charAt(2)) === 0 )  {
            if (Space[newDestination].damage && Space[newDestination].damage === 1) {
              newDestination = monstersList[i].key;
            } else {
              if (monstersList[i].sprite.key.charAt(1) !== "4") {
                newDestination = monstersList[i].key.charAt(0) + (parseInt(monstersList[i].key.charAt(1))+1) + monstersList[i].key.charAt(2);
              } else {
                newDestination = monstersList[i].sprite.closestSpaces.directions[2].spaceKey || monstersList[i].sprite.closestSpaces.directions[1].spaceKey;
              }
            }
            if ((Space[newDestination] || Space[newDestination] === monstersList[i].space) && (Space[newDestination].occupied === false || Space[newDestination].occupied === null || Space[newDestination].occupied === undefined)) {
              if (fortifiedList.indexOf(newDestination.charAt(0)) === -1 || Space[newDestination].damage === 1) {
                var destroyedCityColumn = spawnSpecific("destroyedCity", newDestination);
                destroyedCities.push(destroyedCityColumn);
                occupiedRows.push(destroyedCityColumn.key.substring(0,2));
                Space[newDestination].damage = 2;
              } else {
                Space[newDestination].damage = 1;
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
          if (containsMonsters && !containsPlayers) {
            var newDestination = monstersList[i].key;
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

function destroyWall() {
    this.wallSpace.wall.owner.wallDeployed = false;
    this.wallSpace.wall.destroy();
    this.wallSpace.wall = false;
    var moveTween = game.add.tween(this.object.sprite).to( { x: changeValueScale(this.formerSpace.x,"x"), y: changeValueScale(this.formerSpace.y,"y") }, 500, Phaser.Easing.Back.InOut, true);
    console.log(this.formerSpace);
}

function explode(sprite) { 
    this.mineSpace.mine.destroy();
    this.mineSpace.mine = false;
    var dieTween = game.add.tween(this.sprite).to( { x: game.world.centerX + game.width/2 + this.sprite.width*2, angle: 720}, 700, Phaser.Easing.Linear.None, true);
    dieTween.onComplete.add(this.sprite.kill, this);
}

function chase() {

}

function move(object,destination,escaping) {
  console.log(object);
  if (playersList.indexOf(object) > -1) {
    setLastClicked(object.sprite);
  }
  console.log(destination);
  var destinationX = Space[destination].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
  var destinationY = Space[destination].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;  
  if (escaping) {
    if (escaping === "running") {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      //moveTween.onComplete.add();
      return;
    } else if (escaping === "chasing") {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      return;
    }
  } 
  else if (playersList.indexOf(object) > -1) {
    object.sprite.x = destinationX;
    object.sprite.y = destinationY;
  } else { 
    if (Space[destination].wall) {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      moveTween.onComplete.add(destroyWall,{wallSpace: Space[destination], formerSpace: object.space, object: object});
      return
    } else if (Space[destination].mine) {
      object.hp -= 1;
      if (object.hp <= 0) {
        object.space.occupied = removeFromList(monstersList[object.sprite.number], object.space);
        Space[destination].mine.owner.rp += object.rp;
        monstersList.splice(object.sprite.number, 1);
        /*PLACE TWEEN HERE*/
        var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
        moveTween.onComplete.add(explode, {sprite: object.sprite, mineSpace: Space[destination]})
        return
      }
      console.log("BOOM!");
    }
    var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
    for (i = 1; i < playersList.length; i++) {
      if (playersList[i] && playersList[i].sprite) {
        playersList[i].sprite.inputEnabled = false;
      }
    }
  }
  removeFromList(object, Space[object.key]);
  object.key = destination;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.space = Space[destination];
  addToOccupied(object, Space[destination]);
  game.world.bringToTop(object.sprite);
  
  if (playersList.indexOf(object) > -1) {
    checkBattle(Space[object.key]);
  } else {
      moveTween.onComplete.add(checkBattle, {space:Space[object.key]});
    }
  }

  function repair(repairing) {
    var repairing = this.repairing || repairing;
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
    //upgradeText.kill();
    upgradeButton.kill();
    menuBar.kill();
    if (!upgradeMenu) {
    upgradeMenu = game.add.sprite(game.world.centerX, game.world.centerY + C.game.height/2 + (C.upgradeMenu.height*C.upgradeMenu.scale)/2 + 200*globalScale, 'upgradeMat');
    upgradeMenu.anchor.setTo(.5,.5);
    upgradeMenu.scale.x = C.upgradeMenu.scale;
    upgradeMenu.scale.y = C.upgradeMenu.scale;
  console.log(upgradeDescription);
  }
    var upgradeDescription = game.add.text(upgradeMenu.x, upgradeMenu.y - upgradeMenu.height/2 - 100*globalScale, "Click on an upgrade to see its details, scroll up to return to the game", C.game.textStyle);
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
    y1 = 1545 * globalScale, y2 = 3650 * globalScale;
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
      game.camera.y = game.camera.y;
      game.input.onTap._bindings = [];
      confirmUpgrade(lastClicked,choice);
      game.kineticScrolling.stop();
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
  for (i = 1; i < playersList.length; i++) {
    if (playersList[i] && playersList[i].sprite) {
      playersList[i].sprite.inputEnabled = true;
    }
  }
  if (this.space) {
    space = this.space;
  }
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
    if (space === Space["center"]) {
      pendingMonster = boss;
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

  var directions = [{direction: "clockwise", spaceKey: clockwise}, {direction: "counter_clockwise", spaceKey:counter_clockwise},{direction: "inward",spaceKey:inward},{direction: "outward",spaceKey:outward}];
  directions.forEach(function(direction) {
  if (direction && direction.spaceKey) {
    selectedSpaces.push(Space[direction.spaceKey] || undefined);
    var directionValue = Space[direction.spaceKey] || undefined;
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
      close_keys.push(direction.spaceKey);
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
  if (object === "destroyedCity") {
    random.anchor.x = .41;
    random.anchor.y = .5;
    random.scale.x = C.destroyed.scale;
    random.scale.y = C.destroyed.scale;
    random.angle = Math.atan2(game.bg.y + game.bg.height/2 - random.y, game.bg.x + game.bg.width/2 - random.x );
    random.angle = random.angle * (180/Math.PI) - 10;
    if (space.key === "a20" || space.key === "c10") {
      random.angle -= 11;
    } else if (space.key === "a10") {
      random.angle -= 7;
    } else if (space.key === "d30" || space.key === "d20") {
      random.angle += 10;
    }
      /*if(random.angle < 0) {
      random.angle = 360 - (-random.angle);
    }*/
    occupiedRows.push(space.key.substring(0,2));
  } else {
    random.scale.x = C.mech.scale;
    random.scale.y = C.mech.scale;
  }
  random.smoothed = true;
  random.alpha = 0;
  game.add.tween(random).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
  random.prototype = Object.create(Phaser.Sprite.prototype);
  //random.scale.setTo(C.game.scaleRatio,C.game.scaleRatio)
  var obj =  {
    space: space.selectedSpace,
    key: space.key,
    sprite: random
  };
  globalList.push(obj);
  obj.addBattleInfo = addBattleInfo;
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
      do {
        var drawnMonster = MonstersDeck.initialMonsters[Math.floor(Math.random() * MonstersDeck.initialMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.maxhp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {
          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 1;
      obj.mr = 2;
    } else if (threatLevel <= 24) { 
      do {
        var drawnMonster = MonstersDeck.growingMonsters[Math.floor(Math.random() * MonstersDeck.growingMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.maxhp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {
          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      if (threatLevel >= 36) {
        threatLevel = 24;
        for (i = 0; i < MonstersDeck.extinctionMonsters.length; i++) {
          MonsterDeck.extinctionMonsters.drawn = false;
        }
      }
      do {
        var drawnMonster = MonstersDeck.extinctionMonsters[Math.floor(Math.random() * MonstersDeck.extinctionMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.maxhp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {
          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 3;
      obj.mr = 4;
    } 
    drawnMonster.drawn;
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
  if (object === "destroyedCity") {
    spawn.scale.x = C.destroyed.scale;
    spawn.scale.y = C.destroyed.scale;
    spawn.angle = Math.atan2(game.bg.y + game.bg.height/2 - spawn.y, game.bg.x + game.bg.width/2 - spawn.x );
    spawn.angle = spawn.angle * (180/Math.PI) - 10;
    if(spawn.angle < 0)
      {
        spawn.angle = 360 - (-spawn.angle);
      }
    console.log(random.angle);
    occupiedRows.push(space.substring(0,2));
  } else {
    spawn.scale.x = C.mech.scale;
    spawn.scale.y = C.mech.scale;
  }
  if (object === "monster") {
    threatLevel += 1;
    game.world.bringToTop(random);
    obj.sprite.inputEnabled = true;
    obj.sprite.events.onInputDown.add(setLastClicked, this);
    if (threatLevel <= 12) {
      do {
        var drawnMonster = MonstersDeck.initialMonsters[Math.floor(Math.random() * MonstersDeck.initialMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.maxhp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {
          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 1;
      obj.mr = 2;
    } else if (threatLevel <= 24) { 
      do {
        var drawnMonster = MonstersDeck.growingMonsters[Math.floor(Math.random() * MonstersDeck.growingMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.maxhp = drawnMonster.hp;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {

          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 2;
      obj.mr = 3;
    } else {
      if (threatLevel >= 36) {
        threatLevel = 24;
        for (i = 0; i < MonstersDeck.extinctionMonsters.length; i++) {
          MonsterDeck.extinctionMonsters.drawn = false;
        }
      }
      do {
        var drawnMonster = MonstersDeck.extinctionMonsters[Math.floor(Math.random() * MonstersDeck.extinctionMonsters.length)];
      } while (drawnMonster.drawn)
      obj.hp = drawnMonster.hp;
      obj.maxhp = drawnMonster.hp;
      obj.batk = drawnMonster.batk;
      obj.upgrades = drawnMonster.upgrades;
      for (i = 0; i < obj.upgrades.length; i++) {
        if (MU[obj.upgrades[i]] && MU[obj.upgrades[i]].passive) {
          MU[obj.upgrades[i]].passive(obj);
        }
      }
      obj.def = drawnMonster.def;
      obj.rp = 3;
      obj.mr = 4;
    } 
    drawnMonster.drawn = true;
  }
  spawn.smoothed = true;
  addToOccupied(targetSpace,spawn);
  return {
    space: targetSpace,
    key: space,
    sprite: spawn
  }
}



//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;game.scale.minWidth = 320;game.scale.minHeight = 480;game.scale.maxWidth = 768;game.scale.maxHeight = 1152;
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');

console.log(Phaser.Device.desktop);
var game = new Phaser.Game(C.game.width,C.game.height, Phaser.AUTO, '', {
    init: function () {

        //Load the plugin
        game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
    }
});
game.state.add("Boot",Boot);
game.state.add("Load",Load);
game.state.add("Setup",Setup);
game.state.add("GameOver",GameOver);
game.state.add("MainMenu",MainMenu);
game.state.start("Boot");

