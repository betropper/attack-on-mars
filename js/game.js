if (localStorage && localStorage.getItem("quality")) {
  var globalScale = localStorage.getItem('quality');
  var qualitySetting = localStorage.getItem('qualityKey');
} else {
  var globalScale = .5;
  var qualitySetting = "Low";
}
localStorage.setItem('quality', globalScale);
localStorage.setItem('qualityKey', qualitySetting);
var C = {
 "game": {
   "versionNumber": ".3.1",
   "zoomScale": 3,
   "zoomSpeed": 500,
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
 "mbg": {
   "width": 5291,
   "height": 4701,
   //"resizeX": 3300/5291,
   //"resizeY": 2787/5291,
   "scale": 1.4*globalScale,
   "file": "assets/rsz_1mainmenubackground.jpg"
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
  "width": (1348/7),
  "height": (749/4)
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
 bossSprite,
 fortifiedList = [],
 changingQuality,
 hoverSprite,
 actionIcons,
 upgradeTokens,
 mrTokens,
 heldSprite,
 monsterResources = 0,
 monsterResearchTrack = 0;
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
var destroyedPlayersList = [];
var actionPoints = 3;
var actionPointsRecord = 3;
var closestSpaces;
var monstersList = [];
var globalList = [];
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
var batkDisplay;
var ratkDisplay;
var defDisplay;

class Boot {
  init() {

  }
  preload() {
    this.scale.pageAlignHorizontally = true;
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.scale.pageAlignVertically = true;
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
    game.load.bitmapFont('attackfont','assets/attackfont.png', 'assets/attackfont.fnt');
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
    var loadingText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'attackfont', "Loading", 120*globalScale);
    loadingText.anchor.setTo(.5);
    console.log("Loading.");
    //this.load.spritesheet('icons', "assets/Icons.png", C.icons.width, C.icons.height)
    game.load.atlasJSONArray('icons', 'assets/Icons.png', 'assets/icons.json');
    this.load.image("upgradeMat","assets/UpgradeMat.png",469,676);
    this.load.image("gameboard",C.bg.file,C.bg.width,C.bg.height);
    this.load.image("background",C.mbg.file,C.mbg.width,C.mbg.height);
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
  }
  create() {
    console.log("Loaded!");
    this.state.start("MainMenu");
  }
}

var returnButton;
class MainMenu {
  preload() {


  }

  create() {
    game.mbg = game.add.sprite(game.world.centerX, game.world.centerY, "background");
    game.mbg.anchor.setTo(.5);
    game.mbg.scale.setTo(C.mbg.scale, C.mbg.scale);
    var titleText = game.add.bitmapText(game.world.centerX, game.world.centerY - game.height/2.5, 'attackfont', "ATTACK ON MARS", 90*globalScale);
    titleText.anchor.set(0.5);
    playerCount = 4;
    var countNumber = game.add.bitmapText(game.world.centerX, game.world.centerY + game.height/9, 'attackfont', playerCount, 90*globalScale) 
    countNumber.anchor.set(0.5);
    /*var left = game.add.sprite(game.world.centerX - 140*globalScale, game.world.centerY + game.height/6, "leftright");
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
    [right.events.onInputDown.add(changePlayerCount,]() {action: 1, display: countNumber});
    */
    var versionText = game.add.text(100*globalScale, 80*globalScale, "Version: "+C.game.versionNumber, C.game.smallStyle);
    var playerCountText = game.add.bitmapText(game.world.centerX, countNumber.y - 140*globalScale, 'attackfont', "Player Count (Locked)", 90*globalScale);
    playerCountText.anchor.set(.5);
    //game.input.onUp.add(checkButtons, {left: left, right: right});
    var playButton = game.add.bitmapText(game.world.centerX, countNumber.y + 140*globalScale, 'attackfont', "Play Game", 90*globalScale);
    playButton.anchor.set(.5);
    playButton.inputEnabled = true;
    playButton.events.onInputUp.add(clickFade, {inorout:"out", state: "Setup"});
    var settingsButton = game.add.bitmapText(game.world.centerX, playButton.y + 140*globalScale, 'attackfont', "Settings", 90*globalScale);
    settingsButton.anchor.set(.5);
    settingsButton.inputEnabled = true;
    var creditsButton = game.add.bitmapText(game.world.centerX, settingsButton.y + 140*globalScale, 'attackfont', "Credits", 90*globalScale);
    creditsButton.anchor.set(.5);
    creditsButton.inputEnabled = true;
    var menuList = [/*left,*/ countNumber, /*right,*/ playerCountText, playButton, settingsButton, creditsButton];
    returnButton = game.add.bitmapText(game.world.centerX + game.width, game.world.centerY - game.height/8, 'attackfont', "Return to Menu", 90*globalScale);
    returnButton.anchor.set(.5);
    //Off screen settings menu
    returnButton.inputEnabled = true;
    var lowButton = game.add.bitmapText(returnButton.x, returnButton.y + 200*globalScale, 'attackfont', "Low", 90*globalScale);
    var medButton = game.add.bitmapText(lowButton.x, lowButton.y + 140*globalScale, 'attackfont', "Medium", 90*globalScale);
    var highButton = game.add.bitmapText(medButton.x, medButton.y + 140*globalScale,'attackfont', "High", 90*globalScale);
    var qualityDisplay = game.add.bitmapText(highButton.x, highButton.y + 160*globalScale, 'attackfont', "You are currently on " + localStorage.getItem('qualityKey'), 90*globalScale);
    var settingsList = [returnButton,lowButton,medButton,highButton,qualityDisplay];
    console.log(settingsList);
    for (var i = 1; i < settingsList.length; i++) {
      settingsList[i].inputEnabled = true;
      settingsList[i].anchor.setTo(.5);
      settingsList[i].events.onInputUp.add(changeQuality, {quality: settingsList[i].text});
    }
    settingsButton.events.onInputUp.add(shiftSettings, {menuList: menuList, settingsList:settingsList});
    creditsButton.events.onInputUp.add(clickFade, {inorout: "out", state: "Credits"});
    returnButton.events.onInputUp.add(shiftSettings, {menuList: menuList, settingsList:settingsList});
    fade("in");
  }
  update() {
    if (changingQuality) {
      returnButton.text = "Restart with " + qualitySetting + " Settings";
    } else {
      returnButton.text = "Return to Menu";
    }
  }
}

class Credits {
  preload() {
      var credits = "Illustration:        Alice Bessoni\n\nGame Programming:       Benjamin Muhlestein\n\nGame Design:        Paul Ference\n\nGraphical Design:        Helen Tian";
      var creditsDisplay = game.add.bitmapText(game.world.centerX, game.world.centerY - game.world.height, 'attackfont', credits, 90*globalScale);
      var creditsTween = game.add.tween(creditsDisplay).to({y: game.world.centerY}, 4000, Phaser.Easing.Linear.None, true);
      creditsDisplay.anchor.setTo(.5);
      //creditsTween.onComplete.add(returnToMenu, this);
  }
  
  create() {
    fade("in");
    game.input.enabled = true;
    game.input.onTap.add(clickFade,{inorout: "out", state: "MainMenu"});
  }
}

function returnToMenu() {
  game.state.start("MainMenu");
}

function displayCredits() {
 game.state.start("Credits");
}

function startGame() {
  game.state.start("Setup");
}

function clickFade(event) {
  fade(this.inorout, this.state);
}

function changeQuality() {
  if (this.quality === "Low") {
    globalScale = .5;
  } else if (this.quality === "Medium") {
    globalScale = .7;
  } else if (this.quality === "High") {
    globalScale = 1;
  }
  /*
   C.game.ynStyle.font = 50*globalScale + 'px Poiret One'
   C.game.smallStyle.font = 40*globalScale + 'px Poiret One'
   C.game.textStyle.font = 50*globalScale + 'px Poiret One'
   C.mbg.scale = 1.4*globalScale;
   C.bg.scale = .46 * globalScale;
   C.mech.scale = 1.3 * globalScale;
   C.mech.battleSpacing = 100*globalScale;
   C.mech.battleSpeed = 3*globalScale;
   C.monster.scale = 1.3 * globalScale;
   C.upgradeMenu.scale = 1.3 * globalScale;
   C.destroyed.scale = 1.8 * globalScale;
   C.game.width = 2800*globalScale;
   C.game.height = 1280*globalScale;
*/
   if (localStorage && this.quality === localStorage.getItem('qualityKey')) {
    changingQuality = false;
   } else {
    changingQuality = true;
   }
   qualitySetting = this.quality;
   console.log("Quality changed to " + this.quality);
}


function fade(inorout, state) {
  console.log("Fading " + inorout);
  console.log(state);
  if (inorout === "out") {
    var start = 1;
    var end = 0;
  } else if (inorout === "in") {
    var start = 0;
    var end = 1;
  }
  for (var i = 0; i < game.world.children.length; i++) {
    game.world.children[i].alpha = start;
    var fadeTween = game.add.tween(game.world.children[i]).to({alpha: end}, 1000, Phaser.Easing.Linear.None, true)
  }
  if (state && state === "Restart") {
    fadeTween.onComplete.add(completeKill, this);
  } else if (state) {
    console.log(state);
    fadeTween.onComplete.add(changeState, {state: state});
  }
}

function completeKill() {
  document.location.href = ""; 
}

function shiftSettings() {
    console.log("Shifting");
    if (changingQuality === true) {
      localStorage.setItem('quality', globalScale);
      localStorage.setItem('qualityKey', qualitySetting);
      fade("out","Restart");
    }
    for (i = 0; i < this.menuList.length; i++) {
      if (!mainMenuTweens[i]|| (mainMenuTweens[i].position && mainMenuTweens[i].position === "center")) {
        mainMenuTweens[i] = game.add.tween(this.menuList[i]).to({x: this.menuList[i].x - game.width}, 700, Phaser.Easing.Back.InOut, true);
        mainMenuTweens[i].position = "left";
      } else if (mainMenuTweens[i].position === "left") {
        mainMenuTweens[i] = game.add.tween(this.menuList[i]).to({x: this.menuList[i].x + game.width}, 700, Phaser.Easing.Back.InOut, true);
        mainMenuTweens[i].position = "center";
        mainMenuTweens[i].onComplete.add(reEnableInput,this);
      }
      mainMenuTweens[i].inputEnabled = false;
    }
    for (i = 0; i < this.settingsList.length; i++) {
      if (!settingsMenuTweens[i] || (settingsMenuTweens[i].position && settingsMenuTweens[i].position === "right")) {
        settingsMenuTweens[i] = game.add.tween(this.settingsList[i]).to({x: this.settingsList[i].x - game.width}, 700, Phaser.Easing.Back.InOut, true);
        settingsMenuTweens[i].position = "center";
      } else if (settingsMenuTweens[i].position === "center") {
        settingsMenuTweens[i] = game.add.tween(this.settingsList[i]).to({x: this.settingsList[i].x + game.width}, 700, Phaser.Easing.Back.InOut, true);
        settingsMenuTweens[i].position = "right";
        settingsMenuTweens[i].onComplete.add(reEnableInput,this);
      }
      settingsMenuTweens[i].inputEnabled = false;
    }
}

function reEnableHover(sprite) {
  sprite.events.onInputDown._bindings = [];
  sprite.events.onInputOver._bindings = [];
  sprite.events.onInputOut._bindings = [];
  sprite.events.onDragStop._bindings = [];
  sprite.events.onDragStop.add(attachClosestSpace, sprite);
  sprite.events.onInputDown.add(setLastClicked, this);
  sprite.events.onInputOver.add(sprite.glow, {sprite:sprite});
  sprite.events.onInputOut.add(reduceScale,{sprite:sprite});
  sprite.events.onInputOut.add(sprite.glow, {sprite:sprite,fadeOut:true});
}

function reEnableInput() {
  this.inputEnabled = true;
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

  preload() {
  }

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
      reEnableHover(playersList[i].sprite);
      //turn = playersList[1];
    }
    for (var i = 0; i <= 5; i++) {
      if (i <= 3) {
        monstersList[i] = spawnRandom("monster", i + 1, "3");
        monstersList[i].sprite.number =  i;
      } else {
        monstersList[i] = spawnRandom("monster", "random", "3");
        monstersList[i].sprite.number =  i;
      }
    }

    // Add in text that is displayed.
    //attributeDisplay = game.add.text(game.world.centerX + game.world.width/4, game.world.centerY - game.world.height/3 + 300*globalScale, "", C.game.textStyle);
    //attributeDisplay.anchor.setTo(.5);
    upgradeDisplay = game.add.text(game.world.centerX + game.world.width/4, game.world.height/2, "", C.game.textStyle);
    upgradeDisplay.anchor.setTo(.5);

    menuBar = game.add.sprite(0,game.height - game.camera.width/5,"menubar");
    menuBar.width = game.camera.width;
    menuBar.height = game.camera.width/5;
    //menuBar.fixedToCamera = true;
    game.world.bringToTop(menuBar);
    menuBar.kill();
    

    actionIcons = game.add.group();
    upgradeTokens = game.add.group();
    mrTokens = game.add.group();
    fade("in");  
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
    if (heldSprite && !battleStarting && !zoomIn && !battleState) {
      heldSprite.x = game.input.mousePointer.x;
      heldSprite.y = game.input.mousePointer.y;
    }
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
          playersList[i].sprite.scale.setTo(C.mech.scale);
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
          battleMonster.addBattleInfo("HP",8,"hp", "maxhp");
          battlePlayer.addBattleInfo("HP",8,"hp", "maxhp");
          battleMonster.addBattleInfo("Blue Attack",5,"batk", "batkGoal" || 5);
          battlePlayer.addBattleInfo("Blue Attack",5,"batk", "batkGoal" || 5);
          battlePlayer.addBattleInfo("Red Attack",4,"ratk","ratkGoal" || 5);
          battlePlayer.addBattleInfo("Defence",7,"def", "defGoal" || 5);
          battleMonster.addBattleInfo("Defence",7,"def","defGoal" || 5);
          game.world.bringToTop(menuBar);
        } else {
        //var barTween = game.add.tween(menuBar).to( { x: focusX*3 - game.camera.width/2 , y: focusY*3 + game.camera.height/2 - menuBar.height }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        }
        //game.add.tween(menuBar).to( { y: game.world.centerY }, 4000, Phaser.Easing.Bounce.Out, true);

        var playerDie = {
          "Blue Attack": battlePlayer.batk,
          "Red Attack": battlePlayer.ratk,
          "Def": battlePlayer.def
        };
        for (i = 0; i < battleMonster.upgrades.length; i++) {
          if (battleMonster.upgrades[i].indexOf("-1 Mech") > -1) {
            MU["Dice -#"].active(battlePlayer,battleMonster.upgrades[i].substring(8),1);
            printBattleResults(battleMonster.sprite.key + " drained " + battlePlayer.sprite.key + " " + battleMonster.upgrades[i].substring(8) + "!");
          }
        }
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
        } else if (battleMonster != boss && battlePlayer.key.charAt(2) != "0" ){
          addBattleText("Run",attemptEscape, null);
        }
        if (battlePlayer.canSiege) {
          addBattleText("Siege Mode",queAttack,"Siege Mode");
        }
        if (battlePlayer.weaponizedResearchCharges && battlePlayer.weaponizedResearchCharges > 0) {
          addBattleText("Weaponized Research",changeDieMenu,"Weaponized Research");
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
    if (hoverSprite && actionPointsRecord != actionPoints) {
      if (actionPointsRecord != actionPoints && actionPointsRecord != 0) {
         actionIcons.children[actionPointsRecord-1].kill();
         actionPointsRecord -= 1;
      }
    }
    for (var i = 0; i < globalList.length; i++) {
      if (destroyedCities.indexOf(globalList[i]) === -1 && globalList[i].sprite.input && globalList[i].sprite.input.pointerOver()) {
        var over = globalList[i]; 
      } 
    }
    if (over) {
      setAttributeDisplay(over);
      if (playerNames.indexOf(over.sprite.key) > -1) {
        /*attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + " / " + over.maxhp + "\nDefence Die (green): " + over.def + "\nRed Attack Die: " + over.ratk + "\nBlue Attack Die: " + over.batk + "\nResearch Points: " + over.rp);
        if (attributeDisplay.text && lastClicked !== undefined && repairText && attributeDisplay.text.indexOf(lastClicked.sprite.key) === -1) {
          repairText.text = "Repair " + lastClicked.sprite.key;
        }*/
       upgradeDisplay.setText("Upgrades for " + over.sprite.key +":\n" + over.upgrades.join(",\n"));
       if (over.sprite.scale.x < (C.mech.scale + .3) && !battleState && !battleStarting && !zoomIn) {
         game.world.bringToTop(over.sprite);
         over.sprite.scale.x += .01;
         over.sprite.scale.y += .01;
       }
      } else if (over.sprite.key === "monster" || bossNames.indexOf(over.sprite.key) > -1) {
        //attributeDisplay.setText("\nName: " + over.sprite.key + "\nHP: " + over.hp + " / " + over.maxhp + "\nDefence Die (green): " + over.def + "\nBlue Attack Die: " + over.batk + "\nResearch Point Reward: " + over.rp);
        upgradeDisplay.setText("Upgrades for " + over.sprite.key +":\n" + over.upgrades.join(",\n"));
       if (over.sprite.scale.x < (C.mech.scale + .3) && !battleState && !battleStarting && !zoomIn && !over.name) {
         game.world.bringToTop(over.sprite);
         over.sprite.scale.x += .01;
         over.sprite.scale.y += .01;
       }
      }
    } else if (lastClicked) {
      if (playerNames.indexOf(lastClicked.sprite.key) > -1) {
        //attributeDisplay.setText("\nName: " + lastClicked.sprite.key + "\nHP: " + lastClicked.hp + " / " + lastClicked.maxhp + "\nDefence Die (green): " + lastClicked.def + "\nRed Attack Die: " + lastClicked.ratk + "\nBlue Attack Die: " + lastClicked.batk + "\nResearch Points: " + lastClicked.rp);
      } else {
        //attributeDisplay.setText("\nName: " + lastClicked.sprite.key + "\nHP: " + lastClicked.hp + " / " + lastClicked.maxhp + "\nDefence Die (green): " + lastClicked.def + "\nBlue Attack Die: " + lastClicked.batk + "\nResearch Point Reward: " + lastClicked.rp);
      }
      upgradeDisplay.setText("Upgrades for " + lastClicked.sprite.key + ":\n" + lastClicked.upgrades.join(",\n"));
    }

  }
}

function setAttributeDisplay(obj) {
 if (obj.sprite.key === "monster") {
    var spriteName = obj.sprite.spriteName;
 } else {
    var spriteName = obj.sprite.key;
  }
  if (!hoverSprite) {
    hoverSprite = game.add.sprite(game.bg.width,0,spriteName);
   //if (obj.addHoverInfo) {
    if (hoverSprite.key === "The Bloat") {
      hoverSprite.scale.setTo( .16*globalScale);
    } else {
      hoverSprite.scale.setTo(2*globalScale);
    }
    batkDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 100*globalScale, hoverSprite.y,5,"batk","batkGoal");
    ratkDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 100*globalScale, hoverSprite.y + batkDisplay.valueIcon.width,4,"ratk","ratkGoal");
    defDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 450*globalScale, hoverSprite.y,7,"def","defGoal");
    hpDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 100*globalScale, hoverSprite.y + batkDisplay.valueIcon.width*2,8,"hp", "maxhp");
    rpDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 450*globalScale, hoverSprite.y + batkDisplay.valueIcon.width*2,6,"rp");
    mpDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 700*globalScale, hoverSprite.y + batkDisplay.valueIcon.width*2,22,"mr");

    for (i = 0; i < 3; i++) {
      var actionPoint = actionIcons.create(ratkDisplay.valueIcon.x + 350*globalScale + (i*(70*globalScale)), ratkDisplay.valueIcon.y + 15*globalScale,'icons',0);
      actionPoint.scale.setTo(.6*globalScale);
    }
    //hoverSprite.y += hoverSprite.height/2
   //}
 } else {
   hoverSprite.loadTexture(spriteName);
   updateInfoDisplays(obj);
 }
  if (hoverSprite.key === "The Bloat") {
    hoverSprite.scale.setTo( .16*globalScale);
  } else {
    hoverSprite.scale.setTo(2*globalScale);
  }
}

function updateInfoDisplays(obj) {
   ratkDisplay.update(obj);
   batkDisplay.update(obj);
   defDisplay.update(obj); 
   rpDisplay.update(obj);
   mpDisplay.update(obj);
   hpDisplay.update(obj);
}

function allowBattle() {
  battlePlayer.sprite.events.onDragStop._bindings = [];
  battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
  battleStarting = false;
  battleState = true;
  for (i = 0; i < extraBattleTexts.length; i++) {
    game.add.tween(extraBattleTexts[i].valueIcon).to({ x: extraBattleTexts[i].list.x - 20*globalScale }, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true)
    game.add.tween(extraBattleTexts[i].valueDisplay).to({ x: extraBattleTexts[i].list.x + 20*globalScale  }, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true)
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

function addHoverInfo(x,y,frame,value,secondaryValue) {
  var valueIcon = game.add.sprite(x, y, 'icons',frame);
  valueIcon.scale.setTo(.5*globalScale);
  if (this[value]) {
  var valueDisplay = game.add.text(valueIcon.x + valueIcon.width, valueIcon.y + valueIcon.height/3, this[value] || 0, C.game.textStyle);
  } else {
  var valueDisplay = game.add.text(valueIcon.x + valueIcon.width, valueIcon.y + valueIcon.height/3, "0", C.game.textStyle);
  }
  infoDescObj = {
    parent: this,
    valueIcon: valueIcon,
    valueDisplay: valueDisplay,
    value: value,
    secondaryValue,
    valueName: value.toString(),
  }  
  if (secondaryValue && infoDescObj.parent[value]) {
    infoDescObj.valueDisplay.text = infoDescObj.parent[value].toString() + " [" + infoDescObj.parent[secondaryValue].toString() + "]";
  } else if (!infoDescObj.parent[infoDescObj.valueName]) {
    infoDescObj.valueDisplay.text = "";
   }
  infoDescObj.update = function(obj) {
    this.parent = obj;
    if (obj[this.valueName]) {
      if (this.value != obj[this.valueName].toString()) {
        this.value = obj[value].toString();
        this.valueDisplay.text = obj[value].toString();
        if (this.secondaryValue) {
          if (this.secondaryValue === "maxhp") {
            this.valueDisplay.text = obj[value].toString() + " / " + obj[secondaryValue].toString();
          } else {
            this.valueDisplay.text = obj[value].toString() + " [" + obj[secondaryValue].toString() + "]";
            console.log(this.valueDisplay.text);
          }
        }
      }
    } else {
      this.valueDisplay.text = "0";
      this.value = 0;
    }
  }
  return infoDescObj
}

function addBattleInfo(text, frame, value, secondaryValue) {
  if (playersList.indexOf(this) > -1) {
    var x = playerBattleTexts.x;
    var list = playerBattleTexts;
    var bar = playerBar;
  } else {
    var x = monsterBattleTexts.x;
    var list = monsterBattleTexts;
    var bar = monsterBar;
  }
  //Adds the battle info into an appropriate spot relative to the bars
  if (bar === playerBar) {
    if (list.length > 0) {
      var iconX = x + 150*globalScale;
      var iconY = list[list.length - 1].valueDisplay.y + 40*globalScale;
    } else {
      var iconX = x + 150*globalScale;
      var iconY = playerBar.y - playerBar.height/3;
    }
    var valueDisplay = game.add.bitmapText(x + 150*globalScale + 20*globalScale,iconY, 'attackfont', this[value], 20*globalScale);
  } else if (bar === monsterBar) {
    if (list.length > 0) {
      var iconX = x - 150*globalScale;
      var iconY = list[list.length - 1].valueDisplay.y + 40*globalScale;
    } else {
      var iconX = x - 150*globalScale;
      var iconY = monsterBar.y - monsterBar.height/3;
    }
    var valueDisplay = game.add.bitmapText(x - 150*globalScale + 20*globalScale,iconY, 'attackfont', this[value], 20*globalScale);
  }
  var valueIcon = game.add.sprite(iconX - 20*globalScale,iconY, 'icons',frame);
  valueIcon.scale.setTo(.18*globalScale);
  valueDisplay.anchor.setTo(.5);
  valueIcon.anchor.setTo(.5);
  console.log(value);
  battleDescObj = {
    parent: this,
    valueIcon: valueIcon,
    valueDisplay: valueDisplay,
    value: value,
    secondaryValue,
    valueName: value.toString(),
    bar: bar,
    list: list
  }
  console.log(battleDescObj.parent);
  if (secondaryValue) {
    battleDescObj.valueDisplay.text = battleDescObj.parent[value].toString() + " [" + battleDescObj.parent[secondaryValue].toString() + "]";
  }
  battleDescObj.update = function() {
    //this.description.x = this.bar.x;
    //this.valueDisplay.x = this.bar.x;
    if (this.value != this.parent[value].toString()) {
      this.value = this.parent[value].toString();
      this.valueDisplay.text = this.parent[value].toString();
      if (this.secondaryValue) {
        this.valueDisplay.text = this.parent[value].toString() + " [" + this.parent[secondaryValue].toString() + "]";
      }
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
  boss.batkGoal = 5;
  boss.defGoal = 5;
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
  boss.addBattleInfo = addBattleInfo;
  boss.addHoverInfo = addHoverInfo;
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
  bossScaleTween.onComplete.add(enableBossInput, {boss: boss});
}

function enableBossInput(boss) {
 this.boss.sprite.inputEnabled = true; 

}

function glow() {
  console.log(this);
  if (this.fadeOut === true) {
    tweenTint(this.sprite, 0xFFD27F, 0xffffff, 500);
  } else {
    tweenTint(this.sprite, 0xffffff, 0xFFD27F, 500);
  }
}

function tweenTint(obj, startColor, endColor, time, yoyo, repeat) {
  var repeat = repeat || 0;
  // create an object to tween with our step value at 0   
  var colorBlend = {step: 0};
  // create the tween on this object and tween its step property to 100
  var colorTween = game.add.tween(colorBlend).to({step: 100}, time, Phaser.Easing.Linear.None, false, 0, repeat);
  // run the interpolateColor function every time the tween updates, feeding it the updated value of our tween each time, and set the result as our tint
  colorTween.onUpdateCallback(function() { 
    obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
  });
  // set the object to the start color straight away
  obj.tint = startColor;
  // start the tween
  colorTween.start();
  if (yoyo && repeat) {
    colorTween.yoyo(true,repeat);
  } else if (yoyo) {
    colorTween.yoyo(true);
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

function changeDieMenu(attacker,modifier) {
  attacker = this.attacker || attacker;
  method = this.modifier || method;
  

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

var destroyedMechDisplays = [];

function setLastClicked(sprite) {
  if (!turn) {
    turn = playersList[sprite.number];
    //turn.sprite.inputEnabled = true;
    closestSpaces = getClosestSpaces(turn.key);
    turn.sprite.closestSpaces = closestSpaces;
    //turn.sprite.input.enableDrag(true);
    //turn.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    upgradeButton = game.add.sprite(0, game.bg.width, turn.sprite.key);
    upgradeButton.anchor.set(0.5);
    upgradeButton.inputEnabled = true;
    upgradeButton.width = 160*globalScale;
    upgradeButton.height = 160*globalScale;
    upgradeButton.battleButton = false;
    buttonsList.push(upgradeButton);
    upgradeButton.events.onInputUp.add(upgrade, {upgrading: turn});
    waitButton = game.add.button(game.world.centerX + game.world.width/2 - 90*globalScale, 140*globalScale, 'icons', waitOneAction);
    waitButton.frame = 2;
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    waitButton.scale.setTo(globalScale);
    waitButton.battleButton = false;
    buttonsList.push(waitButton);
    game.world.bringToTop(waitButton);
  }
  if (playerNames.indexOf(sprite.key) > -1) {
    lastClicked = playersList[sprite.number];
    var normalState = !battleState && !zoomIn && !zoomOut;

    for (i = 1; i < playersList.length; i++) {
      if (!playersList[i].rebuildButton && destroyedPlayersList.length > 0 && playersList[i].rbTokens && normalState) { 
        if (destroyedMechDisplays.length === 0) {
          var x = hoverSprite.x + hoverSprite.width/2 - 10*globalScale;
        } else {
          var x = destroyedMechDisplays[destroyedMechDisplays.length-1].valueIcon.x + 300*globalScale;
        }
        playersList[i].rebuildButton = playersList[i].addHoverInfo(x, hoverSprite.y + batkDisplay.valueIcon.width*4,21,"rbTokens");
        playersList[i].rebuildButton.mechSprite = game.add.sprite(playersList[i].rebuildButton.valueIcon.x + 9*globalScale, playersList[i].rebuildButton.valueIcon.y + 50*globalScale, playersList[i].sprite.key)
        playersList[i].rebuildButton.mechSprite.scale.setTo(globalScale);
        playersList[i].rebuildButton.valueIcon.inputEnabled = true;
        playersList[i].rebuildButton.valueIcon.width = 160*globalScale;
        playersList[i].rebuildButton.valueIcon.height = 160*globalScale;
        playersList[i].rebuildButton.valueDisplay.x = playersList[i].rebuildButton.valueIcon.x  + 40 + 90*globalScale;
        playersList[i].rebuildButton.valueDisplay.y = playersList[i].rebuildButton.valueIcon.y + 40;
        playersList[i].rebuildButton.valueIcon.battleButton = false;
        destroyedMechDisplays.push(playersList[i].rebuildButton);
        playersList[i].rebuildButton.valueIcon.events.onInputDown.add(rebuild, {rebuilding: playersList[i]});
        if (playersList[i].rebuildButton.parent.alive) {
          playersList[i].rebuildButton.valueIcon.kill();
          playersList[i].rebuildButton.valueDisplay.kill();
        }
      } else if (destroyedPlayersList.length > 0 && playersList[i].rbTokens && normalState) {
        playersList[i].rebuildButton.valueIcon.reset(playersList[i].rebuildButton.valueIcon.x, playersList[i].rebuildButton.valueIcon.y);
        playersList[i].rebuildButton.valueDisplay.reset(playersList[i].rebuildButton.valueDisplay.x, playersList[i].rebuildButton.valueDisplay.y);
        playersList[i].rebuildButton.mechSprite.revive();
        playersList[i].rebuildButton.valueIcon.events.onInputDown._bindings = [];
        playersList[i].rebuildButton.valueIcon.events.onInputDown.add(rebuild, {rebuilding: playersList[i]});
      } else if (playersList[i].rebuildButton) {
        playersList[i].rebuildButton.valueDisplay.kill();
        playersList[i].rebuildButton.valueIcon.kill();
        playersList[i].rebuildButton.mechSprite.kill();
      }
    }
    if (lastClicked.key.indexOf("0") === 2 && !repairButton && lastClicked.hp < lastClicked.maxhp && normalState) { 
      //repairText = game.add.text(1050, menuBar.y, "Repair " + sprite.key, C.game.textStyle);
      //repairText.anchor.set(0.5);
      //repairText.inputEnabled = true;
      //repairText.events.onInputDown.add(repair, {repairing: lastClicked});
      repairButton = game.add.sprite(0, 0, 'icons', 8);
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
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked, amount: undefined});
    } else if (repairButton) {
      //repairText.kill();
      //buttonsList.splice(repairButton, 1);
      repairButton.kill();
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
      if (lastButton) {
        console.log(i + "extra button.");
        if ((i)/3 === 1) {
          console.log("TRIGGERED");
          buttonsList[i].x = hoverSprite.x + hoverSprite.width;
          buttonsList[i].y = lastButton.y + 200*globalScale;
        } else {
          buttonsList[i].x = lastButton.x + 430*globalScale;
          buttonsList[i].y = lastButton.y;
        }
      } else {
        buttonsList[i].x = hoverSprite.x + hoverSprite.width;
        buttonsList[i].y = hoverSprite.y + 800*globalScale;
      }
      var lastButton = buttonsList[i];
     }
   }
  } else if (sprite.key === "monster") {
    if (repairText) {
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
  game.state.start("MainMenu");
}

function isOdd(num) { return num % 2;}

function winGame(winner) {
  game.input.enabled = false;
  for (i = 0; i < battleTexts.length; i++) {
    battleTexts[i].destroy();
  }
  battleTexts = [];
  for (i = 0; i < playerBattleTexts.length; i++) {
    playerBattleTexts[i].valueDisplay.destroy();
    playerBattleTexts[i].valueIcon.destroy();
  }
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].valueDisplay.destroy();
    monsterBattleTexts[i].valueIcon.destroy();
  }
  playerBattleTexts = [];
  monsterBattleTexts = [];
  if (focusSpace.occupied && focusSpace.occupied !== false) {
    focusSpace.occupied = scrubList(focusSpace.occupied);
  }
  for (i = 1; i < playersList.length; i++) {
    playersList[i].sprite.inputEnabled = true;
    reEnableHover(playersList[i].sprite);
  }
  /*
  battlePlayer.sprite.events.onDragStop._bindings = [];
  battlePlayer.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
  */
  winner = this.winner;
  var plusorneg = 1;
  var increment = 1;
  var monsterTween = game.add.tween(monsterBar).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  var winTween = game.add.tween(playerBar).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  if (isOdd(playerCount)=== 1) {
    var victoryTween = game.add.tween(winner.sprite).to({ x: focusX, y: focusY }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  } else {
    var victoryTween = game.add.tween(winner.sprite).to({ x: focusX - 100*globalScale, y: focusY }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  }
  victoryTween.onComplete.add(victoryScreen, this);
  for (i = 1; i < playersList.length; i++) {
    if (playersList[i] != winner) {
      if (plusorneg < 0 && isOdd(playerCount) === 0) {
        increment += 2;
      }
      game.add.tween(playersList[i].sprite).to({ x: (focusX + (100*globalScale)*(increment*plusorneg)), y: focusY }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
      plusorneg = -plusorneg;
    }
  }
}

function victoryScreen() {
  var victoryText = game.add.bitmapText(focusX,focusY - game.camera.height/C.game.zoomScale, 'attackfont', "YOU WIN!", 70*globalScale);
  victoryText.anchor.setTo(.5);
  game.add.tween(victoryText).to( { y: menuBar.y + menuBar.height/2 }, 1500, Phaser.Easing.Bounce.Out, true);   
}

class GameOver {
    create() {
        game.world.scale.set(1);
        console.log("YOU LOSE.");
        game.input.enabled = true;
        var gg = game.add.text(game.world.centerX, game.world.centerY, "GAME\nOVER",C.game.textStyle);
        var restart = game.add.text(game.world.centerX, game.world.centerY + 200*globalScale, "Restart?",C.game.textStyle);
        gg.anchor.setTo(.5);
        restart.anchor.setTo(.5);
        restart.inputEnabled = true;
        restart.events.onInputDown.add(completeKill, this);
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
  var tempList = []
  for (i = 0; i < list.length; i++) {
    if (list[i] && list[i].hp > 0) {
      tempList.push(list[i]);
    }
  }
  return tempList;
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
  //game.time.events.add(Phaser.Timer.SECOND * 3, killResults, this, battleResults);
  return battleResults;
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
    move(battlePlayer,destination);
    focusSpace.occupied = removeFromList(playersList[battlePlayer.sprite.number], focusSpace);
    finishBattle();
  }
  battleTexts = [];
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
    var damageTaken = successes - defences;
    damageTaken = shieldDamage(defender,damageTaken)
    defender.hp -= damageTaken;
    var damaged = defender;
    var text = defender.sprite.key + " took " + damageTaken.toString() + " damage from " + attacker.sprite.key + ".";
  } else if (defences > successes) {
    var damageTaken = defences - successes;
    damageTaken = shieldDamage(attacker,damageTaken)
    attacker.hp -= damageTaken;
    var damaged = attacker;
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
      var deathCase = "poisoned";
    }
    if (defender.hp <= 0) {
      handleDeath(damaged,attacker,deathCase);
    }
    else if (attacker.hp <= 0) {
      handleDeath(damaged,defender,deathCase);
    }

    if (!damaged || damaged.hp > 0) {
      battleTurn = defender;
    }

}
function handleDeath(damaged,survivor,deathCase) {
  battlePlayer.attacking = false;
  globalList = scrubList(globalList);
  if (deathCase === "poisoned") {
    if (battleMonster.upgrades.indexOf("Feign Death") > -1 && battleMonster.feigned === false) {
      MU["Feign Death"].active(battleMonster);
      return;
    }
    battleMonster.sprite.x = focusX;
    if (battleMonster.key.charAt(2) === "0") {
      var destroyedCityColumn = spawnSpecific("destroyedCity", battleMonster.key);
      destroyedCities.push(destroyedCityColumn);
      occupiedRows.push(destroyedCityColumn.key.substring(0,2));
    }
    focusSpace.occupied = scrubList(focusSpace.occupied);
    playersList[battlePlayer.sprite.number].rbTokens = 6;
    playersList[battlePlayer.sprite.number].sprite.kill();
    destroyedPlayersList.push(playersList[battlePlayer.sprite.number])
    var destroyedPlayers = 0;
    for (var i = 1; i < playersList.length; i++) {
      if (!playersList[i].sprite.alive) {
        destroyedPlayers += 1;
      }
    }
    if (destroyedPlayers === playerCount) {
      zoomOut = true;
      game.state.start("GameOver");
    }
    focusSpace.occupied = scrubList(focusSpace.occupied);
    battlePlayer.rp += battleMonster.rp;
    battlePlayer.mr += battleMonster.mr;
    monstersList.splice(battleMonster.sprite.number, 1);
    battleMonster.sprite.destroy();
    battlePlayer.sprite.x = focusX;
  } else {
  if (damaged.upgrades.indexOf("Feign Death") > -1 && damaged.feigned === false) {
    MU["Feign Death"].active(damaged);
    return;
  }
  if (damaged === battlePlayer) {
    battleMonster.sprite.x = focusX;
    if (damaged.key.charAt(2) === "0") {
      var destroyedCityColumn = spawnSpecific("destroyedCity", damaged.key);
      destroyedCities.push(destroyedCityColumn);
      occupiedRows.push(destroyedCityColumn.key.substring(0,2));
    }
    focusSpace.occupied = scrubList(focusSpace.occupied);
    playersList[damaged.sprite.number].rbTokens = 6;
    playersList[damaged.sprite.number].sprite.kill();
    destroyedPlayersList.push(playersList[damaged.sprite.number])
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
  } else if (damaged === battleMonster && damaged != boss) {
    focusSpace.occupied = scrubList(focusSpace.occupied);
    battlePlayer.rp += damaged.rp;
    battlePlayer.mr += damaged.mr;
    monstersList.splice(damaged.sprite.number, 1);
    damaged.sprite.destroy();
    battlePlayer.sprite.x = focusX;
    console.log("Monster died, moving back to position " + focusX )
  } else if (damaged === boss) {
    var winTween = game.add.tween(damaged.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    winTween.onComplete.add(winGame, {winner: survivor});
    return
  }
}
  finishBattle();
}

function shieldDamage(obj,damage) {
  if (obj.upgrades.indexOf("Nullifier Shield") > -1 && obj.shields === true) {
    damage -= 1;
    printBattleResults(obj.sprite.key + " blocked 1 damage with Nullifier Shield.");
    obj.shields = false;
  }
  return damage;
}

function resetDie(player,monster) {
  var playerDie = {
    "Blue Attack": "batk",
    "Red Attack": "ratk",
    "Def": "def"
  };
  if (player.tempStolen) {
    for (i = 0; i < player.tempStolen.length; i++) {
      player[playerDie[player.tempStolen[i].pool]] += player.tempStolen[i].amount;
    }
  }
  player.tempStolen = [];
  if (player.siegeMode) {
    player.siegeMode = false;
    player.def += 1;
  }

}

function finishBattle() {
  pendingBattles.splice(0,1);
  resetDie(battlePlayer,battleMonster);
  for (i = 0; i < battleTexts.length; i++) {
    battleTexts[i].destroy();
  }
  battleTexts = [];
  for (i = 0; i < playerBattleTexts.length; i++) {
    playerBattleTexts[i].valueDisplay.destroy();
    playerBattleTexts[i].valueIcon.destroy();
  }
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].valueDisplay.destroy();
    monsterBattleTexts[i].valueIcon.destroy();
  }
  playerBattleTexts = [];
  monsterBattleTexts = [];
  if (focusSpace.occupied && focusSpace.occupied !== false) {
    focusSpace.occupied = scrubList(focusSpace.occupied);
  }

  for (i = 1; i < playersList.length; i++) {
    playersList[i].sprite.inputEnabled = true;
    reEnableHover(playersList[i].sprite);
  }
  //checkBattle(focusSpace);
  for (i = 0; i < pendingBattles.length; i++) {
    if (pendingBattles[i].pendingPlayer.hp <= 0 || pendingBattles[i].pendingMonster.hp <= 0) {
      pendingBattles.splice(pendingBattles[i], 1);
    }
  }
  /*for (i = 0; i < monstersList.length; i++) {
    checkBattle(monstersList[i].space);
  }*/
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
    playerBattleTexts[i].valueIcon.destroy();
    playerBattleTexts[i].valueDisplay.destroy();
  }
  playerBattleTexts = [];
  for (i = 0; i < monsterBattleTexts.length; i++) {
    monsterBattleTexts[i].valueIcon.destroy();
    monsterBattleTexts[i].valueDisplay.destroy();
  }
  monsterBattleTexts = [];
  for (i = 0; i < resultsList.length; i++) {
    resultsList[i].destroy();
  }
  resultsList = []
}

function killResults(results) {
  results.destroy();
  resultsList.splice(results,1);
  console.log(results + " has been destroyed.");
}

function rollDie(count, goal){ 
  var hits = 0;
  for (i = 1; i < count; i++) {
    rollResult = Math.floor(Math.random() * ((6-1)+1) + 1);
    if (rollResult >= goal) {
      hits += 1;
    }
  }
  return hits;
} 

var rollingAnimation;

function updateRollText(rolling,type) {
  if (type === "atk") {
    if (playersList.indexOf(rolling) > -1) {
      var rollingCount = rolling["ratk"] + rolling["batk"];
    } else {
      var rollingCount = rolling["batk"];
    }
  } else {
    var rollingCount = rolling[type]
  }
  var hits = 0;
  var diceKeys = {
    "batk": "Blue Attack",
    "atk": "Attack",
    "def": "Defence"
  };
  var diceKey = diceKeys[type];
  var text = "Rolling for " + rolling.sprite.key + "s " + diceKey + " ";
  for (i = 0; i < rollingCount; i++) {
    rollResult = Math.floor(Math.random() * ((6-1)+1) + 1);
    if (rollResult >= rolling[type+"Goal"]) {
      hits += 1;
    }
    text += " +  " + rollResult;
  }
  if (!rollingAnimation) {
    rollingAnimation = printBattleResults(text);
  } else {
    rollingAnimation.text = text;
  }
  rollingAnimation.hits = hits;
  return {
    text: text, 
    hits: hits
  }
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
        var increment = C.game.moveSpeed/10
        game.time.events.repeat(increment, 5, updateRollText, this,battleMonster,"atk");
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
        var increment = C.game.moveSpeed/10
        game.time.events.repeat(increment, 5, updateRollText, this,battlePlayer,"atk");
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
      repair(lastClicked,null,1); 
    }
  }

  function moveMonsters() {
   monstersList = scrubList(monstersList);   
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

function move(object,destination,escaping) {
  console.log(object);
  game.input.enabled = false;
  if (playersList.indexOf(object) > -1) {
    setLastClicked(object.sprite);
  }
  console.log(destination);
  var destinationX = Space[destination].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
  var destinationY = Space[destination].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;  
  if (escaping) {
    if (escaping === "running") {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      moveTween.onComplete.add(reEnable,this);
      return;
    } else if (escaping === "chasing") {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      moveTween.onComplete.add(reEnable,this);
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
      moveTween.onComplete.add(reEnable,this);
      return
    } else if (Space[destination].mine) {
      object.hp -= 1;
      if (object.hp <= 0) {
        object.space.occupied = removeFromList(monstersList[object.sprite.number], object.space);
        Space[destination].mine.owner.rp += object.rp;
        Space[destination].mine.owner.mr += object.mr;
        monstersList.splice(object.sprite.number, 1);
        /*PLACE TWEEN HERE*/
        var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
        moveTween.onComplete.add(explode, {sprite: object.sprite, mineSpace: Space[destination]})
        moveTween.onComplete.add(reEnable,this);
        return
      }
      console.log("BOOM!");
    }
    var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
    moveTween.onComplete.add(reEnable,this);
    for (i = 1; i < playersList.length; i++) {
      if (playersList[i] && playersList[i].sprite) {
        playersList[i].sprite.inputEnabled = false;
      }
    }
  }
  removeFromList(object, Space[object.key]);
  if (playersList.indexOf(object) > -1) {
    removeFromList(playersList[object.sprite.number], Space[object.key]);
  }
  object.key = destination;
  object.sprite.closestSpaces = getClosestSpaces(object.key);
  object.space = Space[destination];
  addToOccupied(object, Space[destination]);
  game.world.bringToTop(object.sprite); 
  if (playersList.indexOf(object) > -1) {
    checkBattle(Space[object.key]);
    game.input.enabled = true;
  } else {
      moveTween.onComplete.add(checkBattle, {space:Space[object.key]});
      moveTween.onComplete.add(reEnable,this);
    }
  }

function reEnable() {
   game.input.enabled = true;
   actionIcons.callAll('revive');
   actionPointsRecord = 3;
}

function placeObject(obj,quadrant,column,row) {
  var obj = this.obj || obj;
  var quadrant = this.quadrant || quadrant;
  var column = this.column || column;
  //TEMP FIX 
  var column = false;
  var row = this.row || row;
  var closestDistance = 9999;
  var closestX = 9999;
  var closestY = 9999;
  var space = null;
  for (var i = 0; i < obj_keys.length; i++) {
    //console.log(closestDistance);
    var spaceObj = Space[obj_keys[i]];
    //console.log(spaceObj);
    var spaceObjX = spaceObj.x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
    var spaceObjY = spaceObj.y*C.bg.scale*C.bg.resizeY + game.bg.position.y;
    var distanceTo = distance(spaceObjX,spaceObjY,obj.sprite.x,obj.sprite.y)
    if (!spaceObj.wall && !spaceObj.occupied && distanceTo < closestDistance) {
      closestDistance = distanceTo;
      space = spaceObj;
      closestX = spaceObjX;
      closestY = spaceObjY;
      spaceKey = obj_keys[i];
    }
  }
  console.log(spaceKey);
  console.log(quadrant+column+row);
  
  var check = (!quadrant || spaceKey.charAt(0) === quadrant) && (!column || spaceKey.charAt(1) === column) && (!row || spaceKey.charAt(2) === row);
  if (!space.wall && !space.occupied && check) {
    heldSprite = null;
    obj.sprite.x = closestX;
    obj.sprite.y = closestY;
    addToOccupied(obj, Space[spaceKey]);
    obj.key = spaceKey;
    obj.sprite.closestSpaces = getClosestSpaces(obj.key);
    reEnableHover(obj.sprite);
    if (playersList.indexOf(obj) > -1) { 
    }
  }
}

function rebuild(rebuilding, pointer) {
  var rebuilding = this.rebuilding || rebuilding;
  rebuilding.rbTokens -= 1;
  rebuilding.rebuildButton.update(rebuilding);
  if (rebuilding.rbTokens === 0) {
    rebuilding.rbTokens = undefined;
    rebuilding.sprite.revive(pointer.x, pointer.y);
    rebuilding.hp = rebuilding.maxhp;
    heldSprite = rebuilding.sprite;
    rebuilding.sprite.events.onInputDown._bindings = [];
    rebuilding.sprite.events.onInputOver._bindings = [];
    rebuilding.sprite.events.onDragStop._bindings = [];
    rebuilding.sprite.events.onInputUp.add(placeObject,{obj:rebuilding, quadrant:String.fromCharCode(96 + rebuilding.sprite.number),column:false,row:"0"})
  }
  actionPoints -= 1;
}

function repair(repairing, pointer, amount) {
  var repairing = this.repairing || repairing;
  var amount = this.amount || amount
  console.log(amount);
  if (repairing.hp < repairing.maxhp) {
    if (amount) {
      repairing.hp += amount;
    } else {
      repairing.hp = repairing.maxhp;
      repairButton.kill();
      actionPoints -= 1;
    }
  }
    tweenTint(repairing.sprite, 0xffffff, 0x98FB98, 500, true);
}

  function upgrade(upgrading) {
    var upgrading = this.upgrading || upgrading 
    confirmState = false;
    if (this.yn) {
        var boughtUpgrade = U[this.boughtUpgrade];
        var unlocks = ["Nullifier Shield", "Obliteration Ray", "Fusion Cannon", "The Payload", "Super Go Fast", "Mind-Machine Interface"];
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
          upgrading.upgrades.push(this.boughtUpgrade);
          for (u = 0; u < unlocks.length; u++) {
            if (upgrading.upgrades.indexOf(unlocks[u]) > -1 && upgrading.upgrades.indexOf(unlocks[u]+" Unlock") === -1 ) {
              for (i = 0; i < upgrading.colorDiscounts.length; i++) {
                if (upgrading.colorDiscounts[i].color === U[unlocks[u]+" Unlock"].unlockColor && upgrading.colorDiscounts[i].discount >= 3) { 
                  if (U[unlocks[u]+" Unlock"].passive) {
                    U[unlocks[u]+" Unlock"].passive(upgrading);
                  }
                  upgrading.upgrades.push(unlocks[u]+" Unlock");
                }
              }
          }
        }
        boughtBool = true;
      }
      setAttributeDisplay(upgrading);
    }
    console.log("Upgrading " + upgrading.sprite.key);
    if (!upgradeMenu) {
    upgradeMenu = game.add.sprite(game.world.centerX, game.world.centerY + C.game.height/2 + (C.upgradeMenu.height*C.upgradeMenu.scale)/2 + 200*globalScale, 'upgradeMat');
    upgradeMenu.anchor.setTo(.5,.5);
    upgradeMenu.scale.x = C.upgradeMenu.scale;
    upgradeMenu.scale.y = C.upgradeMenu.scale;
    var upgradeDescription = game.add.text(upgradeMenu.x, upgradeMenu.y - upgradeMenu.height/2 - 100*globalScale, "Click on an upgrade to see its details, scroll up to return to the game", C.game.textStyle);
    upgradeDescription.anchor.setTo(.5,.5);
  }
  var options = ["Electric Fists","Targeting Computer","Siege Mode","Nullifier Shield","The Payload",
    "Bigger Fists","Weakpoint Analysis","Weaponized Research","Nullifier Shield Unlock","The Payload",
    "Mines","Drop Wall","Fortified Cities","Obliteration Ray","Super Go Gast",
    "More Armor","Field Repair","Even More Armor","Obliteration Ray","Super Go Fast Unlock",
    "5D Accelerators","Autododge","Emergency Jump Jets","Fusion Cannon","Mind-Machine Interface",
    "Hyper Caffeine","Monster Bait","Chaos Systems","Fusion Cannon Unlock","Mind-Machine Interface Unlock"
  ]
  upgradeTokens.callAll('kill');
  var x1 = 340 * globalScale, x2 = 2425 * globalScale,
  y1 = 1545 * globalScale, y2 = 3650 * globalScale;
  for (i = 0; i < upgrading.upgrades.length; i++) {
    if (options.indexOf(upgrading.upgrades[i]) > -1) {
      var upgradeLocation = options.indexOf(upgrading.upgrades[i]);
      var upX = x1 + (415/2)*globalScale + (415*globalScale)*upgradeLocation;
      var upY = y1 + ((350/2)*globalScale);
      while (upX > x2) {
        upX -= (415*globalScale)*5;
        upY += (350*globalScale);
      }
      if (upgradeTokens.getFirstDead()) {
        upgradeTokens.getFirstDead().revive(upX,upY);
      } else {
        var upgradeToken = upgradeTokens.create(upX, upY,'icons',18);
        upgradeToken.scale.setTo(.7*globalScale);
        upgradeToken.anchor.setTo(.5);
      }
    }
  }
  game.world.bringToTop(upgradeTokens);
  game.world.bringToTop(mrTokens);
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
        "Bigger Fists","Weakpoint Analysis","Weaponized Research","Nullifier Shield Unlock","The Payload",
        "Mines","Drop Wall","Fortified Cities","Obliteration Ray","Super Go Gast",
        "More Armor","Field Repair","Even More Armor","Obliteration Ray","Super Go Fast Unlock",
        "5D Accelerators","Autododge","Emergency Jump Jets","Fusion Cannon","Mind-Machine Interface",
        "Hyper Caffeine","Monster Bait","Chaos Systems","Fusion Cannon Unlock","Mind-Machine Interface Unlock"
      ]
      //var upgradeToken = upgradeTokens.create(event.x, event.y + game.camera.y,'icons',18);
      var x = event.worldX - x1,
          y = event.worldY - y1;
      var choice = options[Math.floor(x / (415*globalScale)) + 5*Math.floor(y /(350*globalScale))];
      console.log(choice);
      console.log("Event was at " + x + " " + y);
      game.camera.y = game.camera.y;
      game.input.onTap._bindings = [];
      confirmUpgrade(turn,choice);
    } else if (monsterResearchTrack < 3 && event.worldX > x1 && event.worldX < x2 && event.worldY > y2 + 400*globalScale && event.worldY < y2 + 830*globalScale) { 
      var mrProviders = [];
      monsterResources = 0;
      for (i = 1; i < playersList.length; i++) {
        if (playersList[i].mr > 0) {
          monsterResources += playersList[i].mr;
          mrProviders.push(playersList[i]);
        }
      }
      if (monsterResources >= 8) {
        monsterResearchTrack += 1;
        var mrCount = 0;
        for (i = 0; i < mrProviders.length; i++) {
          while (mrProviders[i].mr > 0 && mrCount < 8) {
            mrProviders[i].mr -= 1;
            mrCount += 1;
          }
        }
        var token = mrTokens.create((x1+(255*globalScale))+(530*globalScale*(monsterResearchTrack)), y2 + 615*globalScale,'icons',18);
        token.scale.setTo(globalScale);
        token.anchor.setTo(.5);
        for (i = 1; i < playersList.length; i++) { 
          if (monsterResearchTrack >= 3) {
            playersList[i].sprite.closestSpaces = getClosestSpaces(playersList[i].key);
          } else {
            Corp[playersList[i].corp].trackUpgrade(playersList[i],monsterResearchTrack);
          }
        }
      }
    }
  }
}

function confirmUpgrade(player,upgradeName) {
      var consideredUpgrade = U[upgradeName];
      if ((player.upgrades.indexOf(upgradeName) === -1) && consideredUpgrade && consideredUpgrade.desc) {
      game.kineticScrolling.stop();
      confirmState = true;
      game.camera.y = upgradeMenu.y + upgradeMenu.height/2 + game.camera.height/2;
      if (confirmText && consideredUpgrade && consideredUpgrade.desc) {
        confirmText.setText("Are you sure you would like to purchase " + upgradeName + " on " + turn.sprite.key +"?\n\n" + consideredUpgrade.desc);
      } else if (consideredUpgrade && consideredUpgrade.desc){
        confirmText = game.add.text(game.camera.x + game.camera.width/2,game.camera.y + game.camera.height/2 - 230,"Are you sure you would like to purchase " + upgradeName + " on " + turn.sprite.key +"?\n\n" + consideredUpgrade.desc, C.game.textStyle);
        confirmText.anchor.setTo(.5,.5);
      } else {
        if (!confirmText) {
          confirmText = game.add.text(game.camera.x + game.camera.width/2,game.camera.y + game.camera.height/2 - 230,"Currently a WIP! Check back later to access this upgrade!", C.game.textStyle);
          confirmText.anchor.setTo(.5,.5);
        } else {
          confirmText.setText("Currently a WIP! Check back later to access this upgrade!");
        }
      }
      for (i = 0; i < player.colorDiscounts.length; i++) {
        if (player.colorDiscounts[i].color === consideredUpgrade.color) {
          var discountValue = player.colorDiscounts[i].discount;
          console.log(discountValue);
          break
        }
      }
      var destroyTexts = ["Yes","No","Back"];
      for (i = 0; i < game.world.children.length; i++) {
        if (game.world.children[i].text && destroyTexts.indexOf(game.world.children[i].text) > -1) {
          game.world.children[i].destroy();
          console.log("KILLED.");
        }
      }
      if (consideredUpgrade.color === "black" || consideredUpgrade.color === "purple") {
        if (!priceText) {
          priceText = game.add.text(confirmText.x, confirmText.y + 400,"You have selected a " + consideredUpgrade.color + " upgrade.\nBlack and Purple upgrades are not available in the Demo version of Attack on Mars, purchase the full game to try them out!", C.game.smallStyle); 
          priceText.anchor.setTo(.5);
        } else {
          priceText.setText("You have selected a " + consideredUpgrade.color + " upgrade.\nBlack and Purple upgrades are not available in the Demo version of Attack on Mars, purchase the full game to try them out!"); 
        }
        for (i = 0; i < game.world.children.length; i++) {
          if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
            game.world.children[i].destroy();
          }
        }
        var back = game.add.text(confirmText.x, priceText.y + 100, "Back", C.game.ynStyle);
        back.anchor.setTo(.5,.5);
        back.inputEnabled = true;
        back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
        return;
      } else if (consideredUpgrade.unlock) {
        for (i = 0; i < player.colorDiscounts.length; i++) {
          if (player.colorDiscounts[i].color === consideredUpgrade.unlockColor) {
            discountValue = player.colorDiscounts[i].discount;
            console.log(discountValue);
            break
          }
        }
        if (priceText) {
          priceText.setText(upgradeName + " is a tier " + consideredUpgrade.cost + " unlock upgrade.\nPurchase " + (consideredUpgrade.cost - discountValue) + " more " + consideredUpgrade.unlockColor + " upgrades and " + upgradeName.replace(' Unlock','')  + " to unlock this.");
        } else {
          priceText = game.add.text(confirmText.x, confirmText.y + 400, upgradeName + " is a tier " + consideredUpgrade.cost + " unlock upgrade.\nPurchase " + (consideredUpgrade.cost - discountValue) + " more " + consideredUpgrade.unlockColor + " upgrades and " + upgradeName.replace(' Unlock','')  + " to unlock this.", C.game.smallStyle);
          priceText.anchor.setTo(.5,.5);
        }
        var back = game.add.text(confirmText.x, priceText.y + 100, "Back", C.game.ynStyle);
        for (i = 0; i < game.world.children.length; i++) {
          if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
            game.world.children[i].destroy();
          }
        }
        back.anchor.setTo(.5,.5);
        back.inputEnabled = true;
        back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
        return;
      } else if (priceText) {
        priceText.setText(upgradeName + " is a tier " + consideredUpgrade.cost + " upgrade.\nOther " + consideredUpgrade.color + " upgrades you have purchased have reduced the cost to " + (consideredUpgrade.cost - discountValue));
      } else {
        priceText = game.add.text(confirmText.x, confirmText.y + 400, upgradeName + " is a tier " + consideredUpgrade.cost + " upgrade.\nOther " + consideredUpgrade.color + " upgrades you have purchased have reduced the cost to " + (consideredUpgrade.cost - discountValue),C.game.smallStyle)
        priceText.anchor.setTo(.5,.5);
      }
      var yes = game.add.text(confirmText.x - 150, priceText.y + 100, "Yes", C.game.ynStyle);
      yes.anchor.setTo(.5,.5);
      yes.inputEnabled = true;
      yes.events.onInputUp.add(upgrade, {upgrading: turn, yn: "yes", boughtUpgrade: upgradeName});
      var no = game.add.text(confirmText.x + 150, priceText.y + 100, "No", C.game.ynStyle);
      no.anchor.setTo(.5,.5);
      no.inputEnabled = true;
      no.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
      } else {
        game.input.onTap.add(chooseUpgrade, {menu: upgradeMenu});
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
  for (i = 1; i < playersList.length; i++) {
    if (playersList[i] && playersList[i].sprite) {
      playersList[i].sprite.inputEnabled = true;
    }
  }
  if (this.space) {
    space = this.space;
  }
  globalList = scrubList(globalList);
  space.occupied = scrubList(space.occupied);
  var pendingMonster = null;
  var pendingMonsters = [];
  var pendingPlayer = null;

  if (space.occupied != false) {
    for (i = 0; i < space.occupied.length; i++) {
      if (space.occupied[i] && space.occupied[i].sprite.key.indexOf('monster') > -1) {
          if (space.occupied[i].hp > 0) {
            pendingMonsters.push(space.occupied[i]);
          }
      } else if (space.occupied[i] && playerNames.indexOf(space.occupied[i].sprite.key) > -1) {
          if (space.occupied[i].hp > 0) {
            pendingPlayer = space.occupied[i];
          }
      
      }
    }
    if (space === Space["center"]) {
      pendingMonster = boss;
      pendingMonsters.push(boss);
    }
    console.log(pendingMonsters);
    if (pendingPlayer === null || pendingMonsters.length === 0) {
      pendingMonster = null;
      pendingPlayer = null;
    } else {
      for (i = 0; i < pendingMonsters.length; i++) {
        pendingMonster = pendingMonsters[i]
        var pendingObject = {pendingPlayer: pendingPlayer, pendingMonster: pendingMonsters[i], space:space}
        if (pendingBattles.length > 0) {
          var exists = false;
          for (i = 0; i < pendingBattles.length; i++) {
            if (pendingBattles[i].pendingMonster === pendingObject.pendingMonster && pendingBattles[i].pendingPlayer === pendingObject.pendingPlayer) {
              var exists = true;
              break;
            }
          }
          if (!exists && pendingObject.pendingMonster.hp > 0 && pendingObject.pendingPlayer.hp > 0) {
            pendingBattles.push(pendingObject);
          }
        } else if (pendingObject.pendingMonster.hp > 0 && pendingObject.pendingPlayer.hp > 0) {
          pendingBattles.push(pendingObject);
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
}


function changeTurn() {
    if (turn) {
      moveMonsters();
    }
    actionPoints = 3;
    //turn.sprite.inputEnabled = false
    do {
      if (turn && turn.sprite.number && turn.sprite.number < playerCount) {
        turn = playersList[turn.sprite.number + 1];
      } else if (turn && turn.sprite.number && turn.sprite.number === playerCount || turn === undefined) {
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i].upgrades.indexOf("Siege Mode") > -1&& playersList[i].canSiege === false) {
            playersList[i].canSiege = true;
          }
          if (playersList[i].upgrades.indexOf("Nullifier Shield") > -1 && playersList[i].shields === false) {
            playersList[i].shields = true;
          }
          if (playersList[i].upgrades.indexOf("Nullifier Shield Unlock") > -1 ) {
            U["Nullifier Shield Unlock"].active(playersList[i],1);
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
      upgradeButton.reset(upgradeButton.x, upgradeButton.y);
      game.world.bringToTop(upgradeButton);
      upgradeButton.events.onInputUp._bindings = [];
      upgradeButton.loadTexture(turn.sprite.key);
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: turn});
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
    if (monsterResearchTrack >= 3) {
      inward = "center";
    }
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

function reduceScale() {
  var scaleTween = game.add.tween(this.sprite.scale).to( { x: C.mech.scale, y: C.mech.scale }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
}


function spawnRandom(object,quadrant,row,occupiedCheck) {
  var condition = true;
  var failSafe = 1;
  occupiedRows = ['center'];
  for (i = 0; i < destroyedCities.length; i++) {
    var cityChars = destroyedCities[i].key.substring(0,2)
    if (occupiedRows.indexOf(cityChars) === -1) {
      occupiedRows.push(cityChars);
    }
  }

  for (i = 0; i < monstersList.length; i++) {
    var monsterChars = monstersList[i].key.substring(0,2)
    if (occupiedRows.indexOf(monsterChars) === -1) {
      occupiedRows.push(monsterChars);
    }
  }

  while (condition === true) {
    failSafe += 1;
    var space = getRandomSpace();
    if   (quadrant === "random" && occupiedCheck === true) {
        if (row === "random") {
          condition = space.key.indexOf("0") || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
        } else {
          condition = space.key.indexOf("0") || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1 || space.key.charAt(2) != "3";
        }
    } else if (quadrant && row && occupiedCheck === true) {
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant && row && quadrant === "random") {
        var chr = String.fromCharCode(96 + Math.floor(Math.random() * (playerCount)) + 1);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant === "random") {
        condition = space.key.indexOf("0");
    } 
    else if (quadrant && row) { 
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0;
    } else {
        condition = false;
        if (failSafe >= 700) {
          var tempSpace = {
            selectedSpace: space.selectedSpace,
            key: space.key
          };
          do {
            var rand = monstersList[Math.floor(Math.random() * monstersList.length)];
            tempSpace.selectedSpace = rand.space;
            tempSpace.key = rand.key.substring(0,2) + "0";
          } while (tempSpace.selectedSpace.occupied && tempSpace.key.charAt(2) != "3")
          space = tempSpace;
        }
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
    random.glow = glow;
    random.events.onInputOut.add(reduceScale,{sprite:random});
    random.events.onInputOut.add(random.glow, {sprite:random,fadeOut:true});
    random.events.onInputOver.add(random.glow, {sprite:random});
  }
  random.smoothed = true;
  random.alpha = 0;
  game.add.tween(random).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
  random.prototype = Object.create(Phaser.Sprite.prototype);
  var obj =  {
    space: space.selectedSpace,
    key: space.key,
    sprite: random
  };
  if (object != "destroyedCity") {
    obj.addBattleInfo = addBattleInfo;
    obj.addHoverInfo = addHoverInfo;
  }
  globalList.push(obj);
  if (space.selectedSpace.occupied === false) {
    space.selectedSpace.occupied = [obj];
  } else {
    addToOccupied(obj,space.selectedSpace); 
  }

  //deal with hitpoint values and other values
  if (playerNames.indexOf(object) > -1) {
    obj.rp = 3;
    //Test for now. Everyone is Genericorp
    obj.corp = "Genericorp";
    obj.mr =  0;
    obj.hp = 4;
    obj.maxhp = 4;
    obj.def = 3;
    obj.ratk = 4;
    obj.batk = 4;
    obj.batkGoal = 5;
    obj.ratkGoal = 5;
    obj.defGoal = 5;
    obj.sprite.inputEnabled = true;
    obj.sprite.input.enableDrag(true);
  } else if (object === "monster") {
    threatLevel += 1;
    game.world.bringToTop(random);
    obj.sprite.inputEnabled = true;
    obj.batkGoal = 5;
    obj.ratkGoal = 5;
    obj.defGoal = 5;
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
    drawnMonster.drawn = true;

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
game.state.add("Credits",Credits);
game.state.start("Boot");

