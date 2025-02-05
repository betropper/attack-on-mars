if (localStorage && localStorage.getItem("quality")) {
  var globalScale = localStorage.getItem('quality');
  var qualitySetting = localStorage.getItem('qualityKey');
} else {
  var globalScale = .5;
  var qualitySetting = "Low";
}
if (localStorage && localStorage.getItem('firstTime')) {
  var firstTime = localStorage.getItem('firstTime');
} else {
  var firstTime = true;
}
localStorage.setItem('quality', globalScale);
localStorage.setItem('qualityKey', qualitySetting);
var C = {
 "game": {
   "versionNumber": "1.0.8",
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
   "battleSpeed": 3*globalScale,
   "colorCards": {
    "redfile": "assets/CoralRed.jpg",
    "greenfile": "assets/CrystalGreen.jpg",
    "yellowfile": "assets/MarbleYellow.jpg",
    "bluefile": "assets/CarbonBlue.jpg",
    "red": "redCard",
    "green": "greenCard",
    "yellow": "yellowCard",
    "blue": "blueCard"
   }
 },
 "destroyed": {
   "scale": 1.8 * globalScale
 },

 "monster": {
   "width": 72,
   "height": 72,
   "scale": 1.3 * globalScale,
   "cards": {
     "initialMonster": "initialCard",
     "growingMonster": "growingCard",
     "extinctionMonster": "extinctionCard"
   },
   "names": {
     "initialMonster": "Initial Threat",
     "growingMonster": "Growing Threat",
     "extinctionMonster": "Extinction Threat"
   }
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
  "width": 5750,
  "height": 7833,
  "scale": globalScale/2
 
 },
 "icons": {
  "width": (1348/7),
  "height": (749/4)
 }
}
var firstRunPortrait;
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
 destroyedCityIcons,
 upgradeTokens,
 mrTokens,
 heldSprite,
 monsterResources = 0,
 monsterResearchTrack = 0,
 mrConfirmButton,
 upgradeTokensList = [],
 upgradeExample,
 helpButton,
 howToDisplay
var options = ["Electric Fists","Targeting Computer","Siege Mode","Nullifier Shield","The Payload",
"Bigger Fists","Weakpoint Analysis","Weaponized Research","Nullifier Shield Unlock","The Payload",
"Mines","Drop Wall","Fortified Cities","Obliteration Ray","Super Go Fast",
"More Armor","Field Repair","Even More Armor","Obliteration Ray","Super Go Fast Unlock",
"5D Accelerators","Autododge","Emergency Jump Jets","Fusion Cannon","Mind-Machine Interface",
"Hyper Caffeine","Monster Bait","Chaos Systems","Fusion Cannon Unlock","Mind-Machine Interface Unlock"
]
var unlocks = ["Nullifier Shield", "Obliteration Ray", "Fusion Cannon", "The Payload", "Super Go Fast", "Mind-Machine Interface"];
var boss = {};
var battleSpeedDecrease = 0;
var boughtBool;
var upgradeState;
var confirmState;
var confirmText;
var battleTexts = [];
var rerollTexts = [];
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
var extrasDisplay;
var destroyedCities = [];
destroyedCities.addHoverInfo = addHoverInfo;
var obj_keys = Object.keys(Space);
var viewRect;
var zoomIn;
var zoomOut;
var focusSpace;
var battlePlayer = null;
var battleMonster = null;
var battleTurn = null;
var monsterAttackText;
var monsterAttackButton;
var battleStarting = false;
var pendingBattles = [];
var threatLevel = 0;
var menuBar;
var mrMenuFreezeFrame
var monsterDonerList = [];
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
var pilotIcon;
var corpIcon;
var monstersMoving = false;

class Boot {
  init() {

  }
  preload() {
    this.scale.pageAlignHorizontally = true;
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.scale.pageAlignVertically = true;
    if (Phaser.Device.desktop) {
      //document.getElementById("attackonmars").requestFullscreen();
      /*if (window.innerWidth < C.game.width) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      } else {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setUserScale((window.innerWidth)/2800,(window.innerHeight)/1280);
      }*/
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    } else {
      game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
      var viewportWidth  = screen.width;
      var viewportHeight = screen.height;
      //screen.orientation.addEventListener('change', function() {
        //console.log('new orientation is ', screen.orientation.type);
        alignGameOrientation();
      //});
    }
    game.load.bitmapFont('attackfont','assets/attackfont.png', 'assets/attackfont.fnt');
    game.load.bitmapFont('font','assets/font.png', 'assets/font.fnt');
  }
  create() {
    this.state.start("Load");
  }
}

class Load {
  preload() { 
  game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
  game.kineticScrolling.configure({
      kineticMovement: false,
      timeConstantScroll: 700*globalScale, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });
    var loadingText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'font', "Loading", 120*globalScale);
    loadingText.anchor.setTo(.5);
    console.log("Loading.");
    //this.load.spritesheet('icons', "assets/Icons.png", C.icons.width, C.icons.height)
    game.load.atlasJSONArray('icons', 'assets/Icons.png', 'assets/icons.json');
    //game.load.atlasJSONArray('upgradeMatIcons', 'assets/UpgradeMatSpritesheet.png', 'assets/UpgradeMatSpritesheet.json');
    game.load.spritesheet('upgradeMatIcons','assets/UpgradeMatIconsSheet-min.png', 5048/5, 4888/6);
    if (globalScale == 1) {
      this.load.image("upgradeMat","assets/IMG_0021.JPG",2875*2,3917*2);
    } else {
      this.load.image("upgradeMat","assets/rsz_img_0021_1.jpg",2875,3917);
      C.upgradeMenu.width = C.upgradeMenu.width/2
      C.upgradeMenu.height = C.upgradeMenu.height/2
      C.upgradeMenu.scale = globalScale;
    }
    this.load.image("howto","assets/howto.png",1920,1080);
    this.load.image("blackground","assets/blackbox.png",512,512);
    this.load.image("pleaseRotate","assets/rotatepic.png",320,568);
    this.load.image("redCard",C.mech.colorCards.redfile,520,791);
    this.load.image("blueCard",C.mech.colorCards.bluefile,520,791);
    this.load.image("greenCard",C.mech.colorCards.greenfile,520,791);
    this.load.image("yellowCard",C.mech.colorCards.yellowfile,520,791);
    this.load.image("gameboard",C.bg.file,C.bg.width,C.bg.height);
    this.load.image("background",C.mbg.file,C.mbg.width,C.mbg.height);
    this.load.image("bgtile","assets/rsz_img_0021_2.jpg");
    this.load.image("blue", "assets/PlayerIcon1.png",C.mech.width,C.mech.height);
    this.load.image("red", "assets/PlayerIcon2.png",C.mech.width,C.mech.height);
    this.load.image("green", "assets/PlayerIcon3.png",C.mech.width,C.mech.height);
    this.load.image("yellow", "assets/PlayerIcon4.png",C.mech.width,C.mech.height);
    this.load.image("yellowsquare", "assets/yellowsquare.jpg", 72, 72);
    this.load.image("destroyedCity", "assets/destroyedcity.png", 66, 124);
    this.load.image("initialMonster", "assets/InitialIcon.png", C.monster.width, C.monster.height);
    this.load.image("growingMonster", "assets/GrowingIcon.png", C.monster.width, C.monster.height);
    this.load.image("extinctionMonster", "assets/ExtinctionIcon.png", C.monster.width, C.monster.height);
    this.load.image("Co-ordinator", "assets/Co-ordinator.jpg", 827, 1299);
    this.load.image("Media Star", "assets/Media Star.jpg", 827, 1299);
    this.load.image("Teen Prodigy", "assets/Teen Prodigy.jpg", 827, 1299);
    this.load.image("Bounty Hunter", "assets/BountyHunter.jpg", 827, 1299);
    this.load.image("Engineer", "assets/Engineer.jpg", 827, 1299);
    this.load.image("GenericorpCard", "assets/genericorp.png", 560, 880);
    this.load.image("initialCard", "assets/Initial.jpg", 520, 791);
    this.load.image("growingCard", "assets/Growing.jpg", 520, 791);
    this.load.image("extinctionCard", "assets/Extinction.jpg", 520, 791);
    this.load.image("menubar","assets/menubar.png",C.menuBar.width,C.menuBar.height);
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
    firstRunPortrait = game.scale.isGamePortrait;
    game.scale.forceOrientation(true,false);
    game.scale.enterIncorrectOrientation.add(function() {
    if (!Phaser.Device.desktop){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        document.getElementById("turn").style.display="block";
    }
    });
    game.scale.leaveIncorrectOrientation.add(function() {
    if (!Phaser.Device.desktop){
          if (firstRunPortrait){
            game.renderer.resize(game.width,game.height);
          }
          document.getElementById("turn").style.display="none";
        }
    });
  }

  create() {
    game.mbg = game.add.sprite(game.world.centerX, game.world.centerY, "background");
    game.mbg.anchor.setTo(.5);
    game.mbg.scale.setTo(C.mbg.scale, C.mbg.scale);
    var titleText = game.add.bitmapText(game.world.centerX, game.world.centerY - game.height/2.5, 'attackfont', "ATTACK ON MARS", 90*globalScale);
    titleText.anchor.set(0.5);
    var tutorialText = game.add.bitmapText(game.width - 280*globalScale, game.world.centerY - game.height/2.5, 'attackfont', "Tutorial: OFF", 90*globalScale);
    if (firstTime) {
      tutorialText.text = "Tutorial: ON";
    }
    tutorialText.inputEnabled = true;
    tutorialText.events.onInputUp.add(function() {
      if (firstTime) {
        firstTime = false;
        tutorialText.text = "Tutorial: OFF";
      } else {
        firstTime = true;
        tutorialText.text = "Tutorial: ON";
      }
        localStorage.setItem('firstTime',firstTime);
    });
    tutorialText.anchor.set(0.5);
    playerCount = 4;
    //Allow players to change playercount. Disabled.
    //var countNumber = game.add.bitmapText(game.world.centerX, game.world.centerY + game.height/9, 'attackfont', playerCount, 90*globalScale) 
    //countNumber.anchor.set(0.5);
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
    right.events.onInputDown.add(changePlayerCount,]() {action: 1, display: countNumber});
    */
    var versionText = game.add.text(100*globalScale, 80*globalScale, "Version: "+C.game.versionNumber, C.game.smallStyle);
    //var playerCountText = game.add.bitmapText(game.world.centerX, countNumber.y - 140*globalScale, 'attackfont', "Player Count (Locked)", 90*globalScale);
    //playerCountText.anchor.set(.5);
    //game.input.onUp.add(checkButtons, {left: left, right: right});
    var playButton = game.add.bitmapText(game.world.centerX, game.world.centerY + game.height/9 + 20*globalScale, 'attackfont', "Play Game", 90*globalScale);
    playButton.anchor.set(.5);
    playButton.inputEnabled = true;
    playButton.events.onInputUp.add(clickFade, {inorout:"out", state: "Setup"});
    var settingsButton = game.add.bitmapText(game.world.centerX, playButton.y + 140*globalScale, 'attackfont', "Settings", 90*globalScale);
    settingsButton.anchor.set(.5);
    settingsButton.inputEnabled = true;
    var howtoButton = game.add.bitmapText(game.world.centerX, settingsButton.y + 140*globalScale, 'attackfont', "How to Play", 90*globalScale);
    howtoButton.anchor.set(.5);
    howtoButton.inputEnabled = true;
    var creditsButton = game.add.bitmapText(game.world.centerX, howtoButton.y + 140*globalScale, 'attackfont', "Credits", 90*globalScale);
    creditsButton.anchor.set(.5);
    creditsButton.inputEnabled = true;
    var menuList = [/*left,*/ /*countNumber,*/ /*right,*/ /*playerCountText,*/ playButton, settingsButton, howtoButton, creditsButton];
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
      if (settingsList[i] != qualityDisplay) {
        settingsList[i].inputEnabled = true;
      }
      settingsList[i].anchor.setTo(.5);
      settingsList[i].events.onInputUp.add(changeQuality, {quality: settingsList[i].text});
    }
    settingsButton.events.onInputUp.add(shiftSettings, {menuList: menuList, settingsList:settingsList});
    howtoButton.events.onInputUp.add(clickFade, {inorout: "out", state: "HowToMenu"});
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
      var credits = "Illustration:                     Alice Bessoni\n\nGame Design:                 Paul Ference\n\nGame Programming:         Benjamin Muhlestein\n\nGraphical Design:             Helen Tian";
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

class HowToMenu {
  preload() {
      var howToMenu = game.add.sprite(game.world.centerX,game.world.centerY,"howto");
      howToMenu.width = howToMenu.width * (game.height/howToMenu.height); 
      howToMenu.height = game.height;
      howToMenu.anchor.setTo(.5);
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
    fadeTween.onComplete.add(changeState, {state: state});
  }
}

function completeKill() {
  document.location.href = ""; 
}

function shiftSettings() {
    console.log("Shifting");
    game.input.enabled = false;
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
    game.time.events.add(700, reEnableInput, this);
}

function reEnableHover(sprite) {
  //Change as need be, some of these are probably redundant
  sprite.events.onInputDown._bindings = [];
  sprite.events.onInputOver._bindings = [];
  sprite.events.onInputOut._bindings = [];
  sprite.events.onInputUp._bindings = [];
  sprite.input.draggable = true; 
  sprite.events.onDragStop._bindings = [];
  sprite.events.onDragStop.add(attachClosestSpace, sprite);
  sprite.events.onDragStop.add(reduceScale, {sprite:sprite});
  sprite.events.onDragStop.add(sprite.glow, {sprite:sprite,fadeOut:true});
  sprite.events.onInputDown.add(setLastClicked, {lastClicked:sprite});
  sprite.events.onInputDown.add(hoverScale, {sprite:sprite});
  sprite.events.onInputOver.add(sprite.glow, {sprite:sprite});
  sprite.events.onInputOver.add(hoverScale, {sprite:sprite});
  sprite.events.onInputOver.add(setLastClicked, {lastClicked:sprite});
  sprite.events.onInputOut.add(reduceScale,{sprite:sprite});
  sprite.events.onInputOut.add(sprite.glow, {sprite:sprite,fadeOut:true});
}
function disableHover(sprite) {
  sprite.events.onInputDown._bindings = [];
  sprite.events.onInputOver._bindings = [];
  sprite.events.onInputOut._bindings = [];
  sprite.events.onDragStop._bindings = [];
}

function reEnableInput() {
  game.input.enabled = true;
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
    game.firstTurnPassed = false;
    game.firstMonsterTurnPassed = false;
    //game.tilebg = game.add.tileSprite(0,0,600,202,'bgtile')
    //game.tilebg.width = game.width*5;
    //game.tilebg.height = game.height*5;
    //game.tilebg.tileScale = .5;
    game.bg = game.add.sprite(0, game.world.centerY - game.height / 2, "gameboard");
    game.bg.disableBoard = disableBoard;
    game.bg.enableBoard =enableBoard;
    game.bg.disabledValues = [];
    game.bg.pendingRebuilt = [];
    game.bg.highlightOptions = function(player) {
      game.world.bringToTop(player);
      var quadrant = String.fromCharCode(96 + player.sprite.number);
      var row = "0";
      game.bg.highlightedSpaces = []
      for (i = 0; i < obj_keys.length; i++) {
        var key = obj_keys[i];
        if (key.charAt(0) == quadrant && key.charAt(2) == row && !Space[key].occupied) {
          var highlightX = Space[key].x*C.bg.scale*C.bg.resizeX + game.bg.position.x
          var highlightY = Space[key].y*C.bg.scale*C.bg.resizeY + game.bg.position.y
          var highlightSprite = game.add.sprite(highlightX,highlightY,"yellowsquare");
          highlightSprite.alpha = 0;
          highlightSprite.anchor.setTo(.5);
          highlightSprite.width = player.sprite.width;
          highlightSprite.height = player.sprite.height;
          var highlightTween = game.add.tween(highlightSprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true,100,-1,true)
          highlightSprite.space = Space[key];
          game.bg.highlightedSpaces.push(highlightSprite);
        }
      }
    }
    game.bg.scale.setTo(C.bg.scale, C.bg.scale);
    upgradeMenu = game.add.sprite(game.world.centerX, game.world.centerY + C.game.height/2 + (C.upgradeMenu.height*C.upgradeMenu.scale)/2 + 200*globalScale, 'upgradeMat');
    upgradeMenu.anchor.setTo(.5,.5);
    upgradeMenu.scale.x = C.upgradeMenu.scale;
    upgradeMenu.scale.y = C.upgradeMenu.scale;
    var upgradeDescription = game.add.text(upgradeMenu.x, upgradeMenu.y - upgradeMenu.height/2 - 100*globalScale, "Click on an upgrade to see its details, scroll up to return to the game", C.game.textStyle);
    upgradeDescription.anchor.setTo(.5,.5);
    game.coverbg = game.add.sprite(game.bg.width, 0, 'blackground');
    game.coverbg.width = game.width - game.bg.width;
    game.coverbg.height = game.height;
    game.coverbg.text = game.add.text(game.coverbg.x + game.coverbg.width/2, game.coverbg.y + game.coverbg.height/2,"Place each mecha in a valid city space.",C.game.textStyle);
    game.coverbg.text.anchor.setTo(.5);
    game.world.bringToTop(game.coverbg.text);
  }

  create() {
  console.log(playersList);
  //if (playersList.length === 0) {
  for (var i = 0; i < obj_keys.length; i++) {
    Space[obj_keys[i]].occupied = false;
  }   
  game.stage.smoothed = true;
/*if (Phaser.Device.desktop) {
  //this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
  //this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
  /*if (window.innerWidth < C.game.width) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  } else {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale((window.innerWidth)/2800,(window.innerHeight)/1280);
  }
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
} else {
  game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
  //screen.orientation.addEventListener('change', function() {
    //console.log('new orientation is ', screen.orientation.type);
     alignGameOrientation();
  //});
}*/
  game.camera.bounds = null;
  console.log("Placing Board");
  if (!playerCount || Number.isInteger(playerCount) == false || playerCount < 2) {
    playerCount = 2;
  } else if (playerCount > 4) {
    playerCount = 4;
  }
  //May change this to after mechas are placed.
  //game.time.events.add(Phaser.Timer.SECOND * 1, spawnBoss, this);
  var pilotList = ["Bounty Hunter", "Teen Prodigy", "Co-ordinator", "Engineer"]
  for (var i = 1; i <= playerCount; i++) {
    console.log(i);
    var destroyedCityColumn = spawnRandom("destroyedCity", i, "0", false);
    destroyedCities[i-1] = destroyedCityColumn;
    //playersList[i] = spawnRandom(playerNames[i-1], i, "0", true); 
    playersList[i] = spawnPlayer(i);
    playersList[i].sprite.number = i;
    playersList[i].pilot = pilotList[i-1];
    playersList[i].upgrades = [];
    playersList[i].tiersOwned = [0,0,0,0];
    playersList[i].colorDiscounts = [
      {color: "red", discount: 0 },
      {color: "blue", discount: 0},
      {color: "green", discount: 0},
      {color: "yellow",discount: 0},
      {color: "purple", discount: 0},
      {color: "black", discount: 0}
    ]
    playersList[i].rerollUses = {
      "Mind-Machine Interface": {
        "maxCharges": 0,
        "charges": 0,
      },
      "Mind-Machine Interface Unlock": {
        "maxCharges": 0,
        "charges": 0,
      },
      "Chaos Systems": {
        "maxCharges": 0,
        "charges": 0,
      } 
    }
    playersList[i].rerollUses.colors = [];
    playersList[i].sprite.inputEnabled = true;
    //playersList[i].sprite.input.enableDrag(true);
    //playersList[i].sprite.events.onInputDown.add(setLastClicked, this);
    //Add these back as need be
    //closestSpaces = getClosestSpaces(playersList[i].key);
    //playersList[i].sprite.closestSpaces = closestSpaces;
    //playersList[i].sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
    //reEnableHover(playersList[i].sprite);
  }
  for (var i = 0; i <= 5; i++) {
    if (i <= 3) {
      monstersList[i] = spawnRandom("monster", i + 1, "3", true);
      monstersList[i].sprite.number =  i;
    } else {
      monstersList[i] = spawnRandom("monster", "random", "3");
      monstersList[i].sprite.number =  i;
    }
  }

  // Add in text that is displayed.
  
  extrasDisplay = game.add.text(game.width*1.5, 20*globalScale, "", C.game.textStyle);
  extrasDisplay.anchor.setTo(.5);
  var extrasReturnButton = game.add.button(extrasDisplay.x,extrasDisplay.y + game.width/2.5 + 50*globalScale,'icons',function() {
    game.camera.x = 0;
  });
  extrasReturnButton.frame = 13
  extrasReturnButton.anchor.setTo(.5);
  extrasReturnButton.scale.setTo(globalScale*.7);
  var extrasReturnText = game.add.text(extrasReturnButton.x,extrasReturnButton.y - extrasReturnButton.height/1.5,"Return to Movement Screen",C.game.textStyle);
  extrasReturnText.anchor.setTo(.5);
  menuBar = game.add.sprite(0,game.height - game.camera.width/5,"blackground");
  menuBar.width = game.camera.width;
  menuBar.height = game.camera.width/5;
  game.world.bringToTop(menuBar);
  menuBar.kill();
  actionIcons = game.add.group();
  destroyedCityIcons = game.add.group();
  var destroyedCityIcon = destroyedCityIcons.create((40*globalScale), 30*globalScale,'destroyedCity');
  destroyedCityIcon.scale.setTo(.7*globalScale);
  //NOTE: Currently 7 tokens. May change with different player sizes
  //enabled.
  for (i = 0; i < 6; i++) {
      var destroyedCityIcon = destroyedCityIcons.create((destroyedCityIcons.children[destroyedCityIcons.length-1].x+(30*globalScale)), 30*globalScale,'destroyedCity');
      destroyedCityIcon.scale.setTo(.7*globalScale);
  }
  upgradeTokens = game.add.group();
  mrTokens = game.add.group();
  mrTokens.pos = [
    {x: 1036*globalScale, y: 5098*globalScale},
    {x: 1678*globalScale, y: 5098*globalScale},
    {x: 2364*globalScale, y: 5098*globalScale}
  ];
  if (firstTime) {
    game.bg.disableBoard();
  }
  game.time.events.add(Phaser.Timer.SECOND * 1, showSplash, this, [{text: "Thanks for playing Attack on Mars! This is a limited version of the board game with the Rift Guardian, Pilots, Corporations, and difficulty level locked, and some upgrade options are not available. Your objective in the game is to protect the coastal cities while defeating the threats that come out from the rift in the center until you can research a way to close the rift. You win by progressing the Monster Research track up to level 3, then defeating the Rift Guardian in the center. You can lose if all of the Mechas are destroyed, or if your twelfth city would be destroyed.\n\nYour initial cities have been destroyed, and the initial wave of threats has been placed. Select a starting spot for each of your Mecha (typically a good idea to put them in the same column as a threat), then pick a Mecha to start the game!"}]);
  fade("in");  
}
update() {


  //Set ZoomIn to true or ZoomOut to false to enable zoom. It will
  //reset itself.
  //
  //Disables scrolling when upgrading is done
  //game.camera.focusOnXY(playersList[1].sprite.x, playersList[1].sprite.y);
  if (heldSprite && !battleStarting && !zoomIn && !battleState) {
    heldSprite.x = game.input.mousePointer.x;
    heldSprite.y = game.input.mousePointer.y;
    game.world.bringToTop(heldSprite);
  }
  if (game.splash && game.splash.alive) {
    game.world.bringToTop(game.splash);
    game.world.bringToTop(game.splash.text);
    game.world.bringToTop(game.splash.next);
    game.world.bringToTop(game.splash.previous);
    if (game.splash.icon) {
      game.world.bringToTop(game.splash.icon);
    }
  }
  if (game.camera.y <= 0) {
    if (!howToDisplay || !howToDisplay.alive) {
      game.camera.y = 0;
    }
    if (upgradeState === true) {
      upgradeState = false;
      game.input.onTap._bindings = [];  
      game.bg.enableBoard();
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
  if (!heldSprite && game.bg.pendingRebuilt.length > 0) {
    var pendingPlayer = game.bg.pendingRebuilt.shift();
    pendingPlayer.rbTokens = undefined;
    pendingPlayer.sprite.reset(game.input.mousePointer.x, game.input.mousePointer.y);
    heldSprite = pendingPlayer.sprite;
    pendingPlayer.hp = pendingPlayer.maxhp;
    game.bg.disableBoard();
    game.bg.highlightOptions(pendingPlayer);
    pendingPlayer.sprite.inputEnabled = true;
    pendingPlayer.sprite.tint = 0xffffff;
    pendingPlayer.sprite.events.onInputDown._bindings = [];
    pendingPlayer.sprite.events.onInputOver._bindings = [];
    pendingPlayer.sprite.events.onInputOut._bindings = [];
    pendingPlayer.sprite.events.onDragStop._bindings = [];
    pendingPlayer.sprite.events.onInputUp.add(placeRebuilt,{obj:pendingPlayer, quadrant:String.fromCharCode(96 + pendingPlayer.sprite.number),column:false,row:"0"})
    var reviveTween = game.add.tween(pendingPlayer.sprite).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
    globalList.push(pendingPlayer);
  }
  if (monstersMoving == false && hoverSprite && actionPointsRecord != actionPoints) {
    if (actionPointsRecord != actionPoints && actionPointsRecord != 0) {
      actionIcons.children[actionPointsRecord-1].kill();
      actionPointsRecord -= 1;
    }
  }
  if (!heldSprite && actionPoints <= 0 && pendingBattles.length === 0 && zoomOut !== true && zoomOut !== true) {
    if (firstTime && (!game.splash || !game.splash.alive) && !game.firstTurnPassed) {
      showSplash([
        {text: "At the end of your turn, it's the Threat's turn. All Threats will move one space out, unless they are adjacent to another Mecha, in which case they'll move towards the Mecha or unless they are on the edge of the board, in which case they'll move towards the nearest undestroyed city.\n\nAfter that, a new Threat will spawn. Threats will never spawn in a column that has a destroyed city, and will only spawn in a column that has another monster in it if there are no empty columns. If you are in the Extinction Threat phase, a second Threat will spawn as well!\n\nFinally, all destroyed Mechas will remove one of their rebuild tokens. Gameplay will then move to the next Mecha.", icon: 'initialMonster'}
      ],"firstTurnPassed");
    } else if (game.firstTurnPassed) {
      changeTurn();
    }
  }

    if (focusSpace && focusX) {
      //findIncrementsTo(focusSpace);
      var xMenu = focusX; 
      var yMenu = focusY;
    }
     if (zoomIn === true) {
       game.input.enabled = false;
      // Temporary for testing. Change this later.
      if (!zoomInTweens) {
        zoomInTweens = true;
        game.bg.disableBoard("buttons");
        var zoomTween = game.add.tween(game.camera).to( { x: focusX*3 - game.camera.width/2 , y: focusY*3 - game.camera.height/2 + game.camera.height/8 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        //zoomTween.onComplete.add(zoomWorld, {zoomScale: C.game.zoomScale});
        var scaleTween = game.add.tween(game.world.scale).to( { x: C.game.zoomScale, y: C.game.zoomScale }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
        scaleTween.onComplete.add(zoomFalse, this);
        for (i = 0; i < buttonsTextList.length; i++) {
          buttonsTextList[i].kill();
       }
        for (i = 1; i < playersList.length; i++) {
          playersList[i].sprite.scale.setTo(C.mech.scale);
          if (playersList[i] !== battlePlayer) {
            playersList[i].sprite.inputEnabled = false;
          }
        }
        for (i = 1; i < monstersList.length; i++) {
          monstersList[i].sprite.scale.setTo(C.mech.scale);
          monstersList[i].tint = 0xffffff;
          }
        }
        /*
        menuBar.width = C.game.width / game.world.scale.x;
        menuBar.height = (C.game.height/10) / game.world.scale.y;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        */
        game.world.bringToTop(menuBar);
        if (monsterBar) {
          game.world.bringToTop(monsterBar);
        }
        if (playerBar) {
          game.world.bringToTop(playerBar);
        }
    } else if (zoomOut === true) {
      if (menuBar.alive) {   
          var zoomTween = game.add.tween(game.camera).to( { x: 0, y: 0 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
          var scaleTween = game.add.tween(game.world.scale).to( { x: 1, y: 1 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
          game.bg.enableBoard();
          scaleTween.onComplete.add(zoomFalse, this);
          killBattleInfo();
      }
        /*menuBar.width = C.game.width / game.world.scale.x;
        menuBar.height = (C.game.height/10) / game.world.scale.y;
        menuBar.width = Phaser.Math.clamp(menuBar.width, C.menuBar.width/C.game.zoomScale, C.menuBar.width);
        menuBar.height = Phaser.Math.clamp(menuBar.height, C.menuBar.height/C.game.zoomScale, C.menuBar.height);
        game.world.bringToTop(menuBar);*/
        menuBar.attachedToCamera = false;
    } if (battleStarting) {
      game.world.bringToTop(battleMonster);
      game.world.bringToTop(battlePlayer);
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
            playerBar = game.add.sprite(focusX + game.camera.width/2, game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale, 'blackground');
            playerBar.height = (game.camera.width/C.game.zoomScale)/5;
            playerBar.width = game.camera.height/10;
            playerBar.playerCard = game.add.sprite(focusX + game.camera.width/2, battlePlayer.sprite.y, C.mech.colorCards[battlePlayer.sprite.key]);
            playerBar.playerCard.anchor.setTo(.5);
            playerBar.playerCard.scale.setTo(globalScale*.35);
          } else if (playerBar.alive === false) {
            playerBar.reset(focusX + game.camera.width/2, game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale);
            playerBar.playerCard.reset(focusX + game.camera.width/2, battlePlayer.sprite.y);
            playerBar.playerCard.loadTexture(C.mech.colorCards[battlePlayer.sprite.key]);
          }
          playerBattleTexts.x = game.camera.x/C.game.zoomScale + game.camera.width/C.game.zoomScale - (300*globalScale)/C.game.zoomScale;
          /* old increments.
          playerBattleTexts.yincrement = -130*globalScale;
          playerBattleTexts.xincrement = -130*globalScale;*/
          playerBattleTexts.yincrement = -130*globalScale;
          playerBattleTexts.xincrement = -150*globalScale;
          var playerBarTween = game.add.tween(playerBar).to({ x: playerBattleTexts.x + playerBattleTexts.xincrement, y: playerBar.y + playerBattleTexts.yincrement}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          var playerBarTween2 = game.add.tween(playerBar.playerCard).to({ x: game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - playerBar.playerCard.width/2, y: game.camera.y/C.game.zoomScale + playerBar.playerCard.height/2 }, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          playerBarTween.onComplete.add(allowBattle,this);
          playerBar.anchor.setTo(.5);
          game.world.bringToTop(playerBar);
          if (!monsterBar) {
            monsterBar = game.add.sprite(focusX - game.camera.width/2, game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale, 'blackground');
            console.log("MonsterBar.y: " + monsterBar.y);
            monsterBar.displayInfo = function() {
              var barxpos = game.camera.x/C.game.zoomScale + game.input.mousePointer.x/C.game.zoomScale;
              var barypos = game.camera.y/C.game.zoomScale + game.input.mousePointer.y/C.game.zoomScale;
              if (!monsterBar.upgradeDisplay) {
                monsterBar.upgradeDisplay = game.add.sprite(barypos, barxpos, 'blackground');
                monsterBar.upgradeDisplay.height = (game.camera.width/C.game.zoomScale)/7;
                monsterBar.upgradeDisplay.width = game.camera.height/9
                var monsterUpgradeTextContent = "";
                for (var t = 0; t < battleMonster.upgrades.length; t++) {
                  if (MU[battleMonster.upgrades[t]]) {
                  monsterUpgradeTextContent = monsterUpgradeTextContent + battleMonster.upgrades[t] + ": " + MU[battleMonster.upgrades[t]].desc + "\n";
                  } else {
                  monsterUpgradeTextContent = monsterUpgradeTextContent + battleMonster.upgrades[t] + "\n";
                  }
                }
                monsterBar.upgradeDisplay.text = game.add.bitmapText(0, 0, 'font', monsterUpgradeTextContent, 15*globalScale); 
                monsterBar.upgradeDisplay.text.anchor.setTo(.5)
                //monsterBar.upgradeDisplay.addChild(monsterUpgradeText);
              } else {
                monsterBar.upgradeDisplay.reset(barxpos,barypos);
                game.world.bringToTop(monsterBar.upgradeDisplay);
                game.world.bringToTop(monsterBar.upgradeDisplay.text);
                var monsterUpgradeTextContent = "";
                for (var t = 0; t < battleMonster.upgrades.length; t++) {
                  if (MU[battleMonster.upgrades[t]]) {
                  monsterUpgradeTextContent = monsterUpgradeTextContent + battleMonster.upgrades[t] + ": " + MU[battleMonster.upgrades[t]].desc + "\n";
                  } else {
                  monsterUpgradeTextContent = monsterUpgradeTextContent + battleMonster.upgrades[t] + "\n";
                  }
                }
                monsterBar.upgradeDisplay.text.text = monsterUpgradeTextContent;
                monsterBar.upgradeDisplay.width = monsterBar.upgradeDisplay.text.width + 20; 
                monsterBar.upgradeDisplay.height = monsterBar.upgradeDisplay.text.height + 20; 
                monsterBar.upgradeDisplay.text.reset(barxpos + monsterBar.upgradeDisplay.width/2,barypos + monsterBar.upgradeDisplay.height/2);
              }
            }
            monsterBar.height = (game.camera.width/C.game.zoomScale)/7;
            monsterBar.width = game.camera.height/10;
            monsterBar.monsterCard = game.add.sprite(focusX - game.camera.width/2, battleMonster.sprite.y, C.monster.cards[battleMonster.sprite.spriteName]);
            monsterBar.monsterCard.anchor.setTo(.5);
            monsterBar.monsterCard.scale.setTo(globalScale*.35);
          } else if (monsterBar.alive === false) {
            monsterBar.reset(focusX - game.camera.width/2, game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale);
            monsterBar.monsterCard.reset(focusX - game.camera.width/2, battleMonster.sprite.y);
            monsterBar.monsterCard.loadTexture(C.monster.cards[battleMonster.sprite.spriteName]);
          }
          monsterBattleTexts.x = game.camera.x/C.game.zoomScale + ((300*globalScale)/C.game.zoomScale);
          monsterBattleTexts.yincrement = -150*globalScale;
          monsterBattleTexts.xincrement = 150*globalScale;
          var monsterBarTween = game.add.tween(monsterBar).to({ x: monsterBattleTexts.x + monsterBattleTexts.xincrement, y: monsterBar.y + monsterBattleTexts.yincrement}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          var monsterBarTween2 = game.add.tween(monsterBar.monsterCard).to({ x: game.camera.x/C.game.zoomScale + monsterBar.monsterCard.width/2, y: game.camera.y/C.game.zoomScale + monsterBar.monsterCard.height/2 }, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
          monsterBar.anchor.setTo(.5);
          game.world.bringToTop(monsterBar);
          monsterBar.inputEnabled = true;
          monsterBar.events.onInputOver._bindings = [];
          monsterBar.events.onInputOver.add(monsterBar.displayInfo, battleMonster);
          battleMonster.addBattleInfo("HP",8,"hp", "maxhp");
          battlePlayer.addBattleInfo("HP",8,"hp", "maxhp");
          battleMonster.addBattleInfo("Blue Attack",5,"batk", "batkGoal" || 5);
          battlePlayer.addBattleInfo("Blue Attack",5,"batk", "batkGoal" || 5);
          battlePlayer.addBattleInfo("Red Attack",9,"ratk","ratkGoal" || 5);
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
            printBattleResults("Threat reduced " + battlePlayer.sprite.key.capitalizeFirstLetter() + " Mecha's " + battleMonster.upgrades[i].substring(8) + " by 1!");
          } else if (battleMonster.upgrades[i].indexOf("-2 Mech") > -1) {
            MU["Dice -#"].active(battlePlayer,battleMonster.upgrades[i].substring(8),2);
            printBattleResults("Threat reduced " + battlePlayer.sprite.key.capitalizeFirstLetter() + " Mecha's " + battleMonster.upgrades[i].substring(8) + " by 2!");
          }
          if (battleMonster.upgrades[i].indexOf("+1 Mecha") > -1) {
            MU["Dice Target +#"].active(battlePlayer,battleMonster.upgrades[i].substring(9),1);
            printBattleResults("Threat raised " + battlePlayer.sprite.key.capitalizeFirstLetter() + " Mecha's " + battleMonster.upgrades[i].substring(9) + " by 1!");
          }
        }
        if (battleMonster.upgrades.indexOf("First Attack") === -1) {
          battleTurn = battlePlayer;
        } else {
          battleTurn = battleMonster;
          printBattleResults(C.monster.names[battleMonster.sprite.spriteName] + " attacks first!");
        }
        Pilots["Co-ordinator"].passive(battlePlayer);
        attackText = game.add.bitmapText(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale, menuBar.y,'font', "Attack!",20*globalScale);
        attackText.anchor.set(0.5);
        attackText.inputEnabled = true;
        attackText.events.onInputDown.add(queAttack, {attacker: battlePlayer});
        battleTexts.push(attackText);
        game.add.tween(attackText).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + 20*globalScale}, C.game.zoomSpeed*2, Phaser.Easing.Back.InOut, true);
        if (!monsterAttackButton) {
          monsterAttackButton = game.add.button(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale, game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + 80*globalScale,'icons', allowMonsterTurn);
          monsterAttackButton.scale.setTo(.4*globalScale);
          monsterAttackButton.anchor.setTo(.5);
          monsterAttackButton.frame = 12;
          monsterAttackText = game.add.bitmapText(monsterAttackButton.x, monsterAttackButton.y + 60*globalScale, 'font', "Click for Monster's attack.", 13*globalScale);
          monsterAttackText.anchor.setTo(.5) 
          monsterAttackButton.kill();
          monsterAttackText.kill();
        }
        if (battlePlayer.upgrades.indexOf("Emergency Jump Jets") > -1) {  
          addBattleText("Run",attemptEscape, "Emergency Jump Jets");
        } else if (battleMonster != boss && battlePlayer.key.charAt(2) != "0" ){
          addBattleText("Run",attemptEscape, null);
        }
        if (battlePlayer.canSiege) {
          addBattleText("Siege Mode",queAttack,"Siege Mode");
        }
        if (battlePlayer.weaponizedResearchCharges && battlePlayer.weaponizedResearchCharges > 0) {
          addBattleText("Wp Rsrch: " + battlePlayer.weaponizedResearchCharges,changeDieMenu,"Weaponized Research");
        }
        barsMoving = false;
        game.input.enabled = true;
    } else if (battleState === true) {
      battle(battlePlayer,battleMonster);
      if (battlePlayer.pilot === "Teen Prodigy" && battlePlayer.hp === 1) {
        Pilots["Teen Prodigy"].active(battlePlayer);
      }
      if (monsterBar && monsterBar.alive && monsterBar.input.pointerOver()) {
        monsterBar.displayInfo();  
      } else if (monsterBar && monsterBar.upgradeDisplay) {
        monsterBar.upgradeDisplay.kill();
        monsterBar.upgradeDisplay.text.kill();
      }
      // Change this, placeholder ending.
    }
    // set a minimum and maximum scale value
    //worldScale = Phaser.Math.clamp(worldScale, 1, C.game.zoomScale);
    //game.world.scale.set(worldScale);
    if (monstersMoving == "moving" && game.input.enabled == true && pendingBattles.length == 0 && game.world.scale.x == 1) {
      monstersMoving = "moved";
    }
    for (var i = 0; i < globalList.length; i++) {
      if (destroyedCities.indexOf(globalList[i]) === -1 && globalList[i].sprite.input && globalList[i].sprite.input.pointerOver()) {
        var over = globalList[i]; 
      } 
    }
    if (over && !heldSprite && game.bg.pendingRebuilt.length == 0) {
      setAttributeDisplay(over);
    }
  }
}

function setAttributeDisplay(obj) {
 if (obj.sprite.key === "threat") {
    var spriteName = obj.sprite.spriteName;
 } else {
    var spriteName = obj.sprite.key;
  }
  if (!hoverSprite) {
    spawnBoss();
    game.coverbg.text.text = "Click on any mecha to start.";
    helpButton = game.add.text(game.width - 20,20,"?", {
      align: 'center',
      fill: "#ffffff",
      font: 80*globalScale + 'px Poiret One'
   });
    helpButton.anchor.x = 1;
    helpButton.inputEnabled = true;
    helpButton.events.onInputUp.add(function() {
      game.bg.disableBoard();
      game.input.enabled = true;
      if (!howToDisplay) {
        howToDisplay = game.add.sprite(game.world.centerX,game.world.centerY - game.height,"howto");
        howToDisplay.width = howToDisplay.width * (game.height/howToDisplay.height); 
        howToDisplay.height = game.height;
        howToDisplay.anchor.setTo(.5);
      } else {
        howToDisplay.revive();
      }
      howToDisplay.alpha = 0;
      var howToTween = game.add.tween(howToDisplay).to( { alpha: 1 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
      game.camera.y -= game.height;
      game.input.onTap.add(game.bg.enableBoard,game.bg);
      game.input.onTap.add(function() {
        howToDisplay.kill();
        game.camera.y = 0;
        game.input.onTap._bindings = [];  
      },{helpButton: helpButton});
    }, helpButton);
    hoverSprite = game.add.sprite(game.bg.width,0,spriteName);
   //if (obj.addHoverInfo) {
    if (hoverSprite.key === "The Bloat") {
      hoverSprite.scale.setTo( .16*globalScale);
    } else {
      hoverSprite.scale.setTo(2*globalScale);
    }
    batkDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 100*globalScale, hoverSprite.y,5,"batk","batkGoal");
    ratkDisplay = obj.addHoverInfo(hoverSprite.x + hoverSprite.width + 100*globalScale, hoverSprite.y + batkDisplay.valueIcon.width,9,"ratk","ratkGoal");
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

function pullInInfo() {
    playerBattleTexts.forEach(function(text) {
      if (!text.valueIcon.Tween) {
        text.valueIcon.Tween = game.add.tween(text.valueIcon).to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
        text.valueDisplay.Tween = game.add.tween(text.valueDisplay).to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
      playerBar.Tween = game.add.tween(playerBar).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
      } else {
        text.valueIcon.Tween.stop();
        text.valueDisplay.Tween.stop();
        playerBar.Tween.stop();
        text.valueIcon.Tween = game.add.tween(text.valueIcon).to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
        text.valueDisplay.Tween = game.add.tween(text.valueDisplay).to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
      playerBar.Tween = game.add.tween(playerBar).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)
        /*text.valueIcon.Tween.to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true);
        text.valueDisplay.Tween.to({ y: text.originalY + text.list.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true);
      playerBar.Tween.to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement - game.camera.height/C.game.zoomScale/2}, C.game.zoomSpeed/1.5, Phaser.Easing.Linear.None, true)*/
      }
    });

}

function pullOutInfo() {
    playerBattleTexts.forEach(function(text) {
      if (!text.valueIcon.Tween) {
      text.valueIcon.Tween = game.add.tween(text.valueIcon).to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
      text.valueDisplay.Tween = game.add.tween(text.valueDisplay).to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
      playerBar.Tween = game.add.tween(playerBar).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
      } else {
        text.valueIcon.Tween.stop();
        text.valueDisplay.Tween.stop();
        playerBar.Tween.stop();
      text.valueIcon.Tween = game.add.tween(text.valueIcon).to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
      text.valueDisplay.Tween = game.add.tween(text.valueDisplay).to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
      playerBar.Tween = game.add.tween(playerBar).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement}, C.game.zoomSpeed/2, Phaser.Easing.Linear.None, true)
        /*text.valueIcon.Tween.to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
        text.valueDisplay.Tween.to({ y: text.originalY + text.list.yincrement}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true);
        playerBar.Tween.to({ y: game.camera.y/C.game.zoomScale + game.camera.height/2/C.game.zoomScale + playerBattleTexts.yincrement}, C.game.zoomSpeed*2, Phaser.Easing.Linear.None, true)*/
      }
    });

}

function allowBattle() {
  battlePlayer.sprite.events.onDragStop._bindings = [];
  //battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
  //battlePlayer.sprite.events.onInputOut.add(pullInInfo, this.sprite);
  battlePlayer.sprite.events.onInputOver.add(pullOutInfo, this.sprite);
  //battlePlayer.sprite.input.enableDrag(false);
  battlePlayer.sprite.input.draggable = false; 
  battleStarting = false;
  battleState = true;
  battlePlayer.sprite.inputEnabled = true;
  for (i = 0; i < extraBattleTexts.length; i++) {
    extraBattleTexts[i].valueIcon.x = extraBattleTexts[i].list.x - 20*globalScale + extraBattleTexts[i].list.xincrement;
    extraBattleTexts[i].valueIcon.y = extraBattleTexts[i].originalY + extraBattleTexts[i].list.yincrement;
    extraBattleTexts[i].valueDisplay.x = extraBattleTexts[i].list.x + 20*globalScale + extraBattleTexts[i].list.xincrement;
    extraBattleTexts[i].valueDisplay.y = extraBattleTexts[i].originalY + extraBattleTexts[i].list.yincrement;
    game.add.tween(extraBattleTexts[i].valueIcon).to({ x: extraBattleTexts[i].list.x - 20*globalScale + extraBattleTexts[i].list.xincrement, y: extraBattleTexts[i].originalY + extraBattleTexts[i].list.yincrement}, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true);
    var valueTween2 = game.add.tween(extraBattleTexts[i].valueDisplay).to({ x: extraBattleTexts[i].list.x + 20*globalScale + extraBattleTexts[i].list.xincrement, y: extraBattleTexts[i].originalY + extraBattleTexts[i].list.yincrement}, C.game.zoomSpeed*1, Phaser.Easing.Back.InOut, true);
    //valueTween2.onComplete.add(pullInInfo, this);
    }
}

function addBattleText(text, action, modifier, listName) {
  if (!listName) {
    var list = battleTexts;
  } else {
    var list = rerollTexts;
  }
  if (list.length >= 1) {
    var battleText = game.add.bitmapText(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale, list[list.length - 1].y + 60*globalScale, 'font', text, 20*globalScale);
  } else {
    var battleText = game.add.bitmapText(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale, menuBar.y + menuBar.height, 'font', text, 20*globalScale);
  }
  battleText.anchor.setTo(0.5);
  battleText.inputEnabled = true;
  battleText.events.onInputDown.add(action, {attacker: battlePlayer, modifier: modifier});
  if (battleTurn == battleMonster && !listName) {
    battleText.inputEnabled = false;
  }
  list.push(battleText);
  var yincrement = list.indexOf(battleText)*30*globalScale;
  game.add.tween(battleText).to({ y: game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + yincrement + 20*globalScale}, C.game.zoomSpeed*2, Phaser.Easing.Back.InOut, true)
  game.world.bringToTop(battleText);
}
//'value' is the name of the changed value as a string.

function addHoverInfo(x,y,frame,value,secondaryValue,subtractedValue) {
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
    valueName: value.toString()
  }
  if (secondaryValue === "liveCities") {
    var liveValue = (playerCount*4) - infoDescObj.parent[value] 
    infoDescObj.valueDisplay.text = liveValue.toString();
  } else if (secondaryValue && infoDescObj.parent[value]) {
    infoDescObj.valueDisplay.text = infoDescObj.parent[value].toString() + " [" + infoDescObj.parent[secondaryValue].toString() + "]";
  } else if (!infoDescObj.parent[infoDescObj.valueName]) {
    infoDescObj.valueDisplay.text = "";
  }
  infoDescObj.update = function(obj) {
    this.parent = obj;
    if (obj[this.valueName]) {
      if (this.value != obj[this.valueName].toString() || (this.secondaryValue && this.parent[secondaryValue] && this.secondaryValue != this.parent[secondaryValue].toString())) {
        this.value = obj[value].toString();
        this.valueDisplay.text = obj[value].toString();
        if (this.secondaryValue) {
          if (this.secondaryValue === "maxhp") {
            this.valueDisplay.text = obj[value].toString() + " / " + obj[secondaryValue].toString();
          } else if (this.secondaryValue === "liveCities") {
            this.valueDisplay.text = (playerCount*4) - obj[value].toString()
          } else {
            this.valueDisplay.text = obj[value].toString() + " [" + obj[secondaryValue].toString() + "]";
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
    var valueDisplay = game.add.bitmapText(x + 150*globalScale + 20*globalScale,iconY, 'font', this[value], 20*globalScale);
  } else if (bar === monsterBar) {
    if (list.length > 0) {
      var iconX = x - 150*globalScale;
      var iconY = list[list.length - 1].valueDisplay.y + 40*globalScale;
    } else {
      var iconX = x - 150*globalScale;
      var iconY = monsterBar.y - monsterBar.height/3;
    }
    var valueDisplay = game.add.bitmapText(x - 150*globalScale + 20*globalScale,iconY, 'font', this[value], 20*globalScale);
  }
  var valueIcon = game.add.sprite(iconX - 20*globalScale,iconY, 'icons',frame);
  valueIcon.scale.setTo(.18*globalScale);
  valueDisplay.anchor.setTo(.5);
  valueIcon.anchor.setTo(.5);
  battleDescObj = {
    parent: this,
    valueIcon: valueIcon,
    valueDisplay: valueDisplay,
    value: value,
    secondaryValue,
    valueName: value.toString(),
    bar: bar,
    list: list,
    originalY: iconY
  }
  console.log(battleDescObj.parent);
  if (secondaryValue) {
    battleDescObj.valueDisplay.text = battleDescObj.parent[value].toString() + " [" + battleDescObj.parent[secondaryValue].toString() + "]";
  }
  battleDescObj.update = function() {
    //this.description.x = this.bar.x;
    //this.valueDisplay.x = this.bar.x;
    if (this.value != this.parent[value].toString() || (this.secondaryValue && this.parent[secondaryValue] && this.secondaryValue != this.parent[secondaryValue].toString())) {
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
  if (drawnMonster.defGoal) {
    boss.defGoal = drawnMonster.defGoal
  }
  if (drawnMonster.batkGoal) {
    boss.batkGoal = drawnMonster.batkGoal
  }
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

function growSprite(sprite,newWidth,newHeight) {
  var scaleTween = game.add.tween(sprite).to({width: newWidth, height: newHeight}, 1000, Phaser.Easing.Back.InOut, true);
}

function enableBossInput(boss) {
 this.boss.sprite.inputEnabled = true; 

}

function glow() {
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
    for (var i = 0; i < globalList.length; i++) {
      if (globalList[i].sprite.key != battlePlayer.sprite.key) {
        globalList[i].sprite.inputEnabled = false;
      } else {
        battlePlayer.sprite.input.draggable = false; 
      }
    }
}
  if (zoomOut === true) { 
    zoomOut = false;
    for (var i = 0; i < globalList.length; i++) {
      globalList[i].sprite.inputEnabled = true;
      if (globalList[i].sprite.key === battlePlayer.sprite.key) {
        globalList[i].sprite.input.enableDrag(true);
      }
    }
    /*for (i = 0; i < buttonsList.length; i++) {
      if (buttonsList[i]) {
        game.world.bringToTop(buttonsList[i]);
      }
    }*/
    /*for (i = 0; i < buttonsTextList.length; i++) {
      buttonsTextList[i].reset(buttonsTextList[i].x,buttonsTextList[i].y);
    }*/
    game.world.scale.set(1);
  }
}

function changeDieMenu(attacker,modifier) {
  attacker = this.attacker || attacker;
  method = this.modifier || method; 
  if (method === "Weaponized Research") {
    pullOutInfo();
    battlePlayer.sprite.inputEnabled = false;
    var currentRPDisplay = battlePlayer.addHoverInfo(game.camera.x/C.game.zoomScale + 60*globalScale, game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale*.7,6,"rp");
    printBattleResults("Click on a die color to add one to it for this round at the cost of one RP.");
    printBattleResults("Click on the Weaponized Research button to return.");
    battleTexts.forEach(function(battleText) {
      if (battleText.text.indexOf("Wp Rsrch:") != 0) {
        battleText.inputEnabled = false;
      } else {
        battleText.events.onInputDown._bindings = [];
        battleText.events.onInputDown.add(returnToBattle, {infoDisplay: currentRPDisplay});
      }
    });
    playerBattleTexts.forEach(function(battleText) {
      if (battleText.valueName != "hp") {
        battleText.valueIcon.inputEnabled = true;
        battleText.valueIcon.events.onInputDown.add(U["Weaponized Research"].active, {display: currentRPDisplay, player: battlePlayer, value: battleText.valueName, obj: battleText}); 
      }
    });
  }
}

function returnToBattle(infoDisplay) {
  var infoDisplay = this.infoDisplay || infoDisplay;
  if (battlePlayer.sprite.input.enabled === false) {
    battlePlayer.sprite.inputEnabled = true;
  }
  //pullInInfo();
  if (infoDisplay) {
    infoDisplay.valueIcon.destroy();
    infoDisplay.valueDisplay.destroy();
  }
    playerBattleTexts.forEach(function(battleText) {
      if (battleText.valueName != "hp") {
        battleText.valueIcon.inputEnabled = false;
        battleText.valueIcon.events.onInputDown._bindings = [];
      }
    });
    battleTexts.forEach(function(battleText) {
      if (battleText.text.indexOf("Wp Rsrch:") != 0 && battleText.inputEnabled === false) {
        battleText.inputEnabled = true;
      } else {
        battleText.events.onInputDown._bindings = [];
        battleText.events.onInputDown.add(changeDieMenu, {attacker: battlePlayer, modifier: "Weaponized Research"});
      }
    });
}

String.prototype.capitalizeFirstLetter = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
}

function queAttack() {
  battlePlayer.rerollValues = null;
  if (battleTurn === this.attacker) {
    this.attacker.attacking = true;
    for (i = 0; i < resultsList.length; i++) {
      if (resultsList[i].rerollButton) {
        resultsList[i].rerollButton.destroy();
        resultsList[i].rerollText.destroy();
      }
    }
    if (this.modifier && this.modifier === "Siege Mode") {
      this.attacker.siegeMode = true;
      printBattleResults(battlePlayer.sprite.key.capitalizeFirstLetter() +  " Mecha has activated Siege Mode!");
    } else if (this.modifier && this.modifier === "Weaponized Research") {
    }
  }
}

var destroyedMechDisplays = [];

function makeButton(position,frame) {
  var num = position%3
  var x = hoverSprite.x + hoverSprite.width + (430*globalScale*num);
  var y = hoverSprite.y + 600*globalScale + (Math.floor(i/3)*200*globalScale);
  var button = game.add.sprite(x, y, 'icons', frame);
  button.anchor.set(0.5);
  button.inputEnabled = true;
  button.width = 80;
  button.height = 80;
  button.scale.setTo(globalScale);
  button.battleButton = false;
  buttonsList[position] = button;
  return button;
}

function setLastClicked(sprite) {
  console.log("Test conditions:")
  console.log(!turn);
  console.log(!this.lastClicked);
  console.log(sprite.key != "monster");
  if (!turn && !this.lastClicked && sprite.key != "threat") {
    game.coverbg.text.alpha = 0;
    game.coverbg.alpha = 0;
    //setAttributeDisplay(playersList[sprite.number]);
    turn = playersList[sprite.number];
    turn.rp += turn.rpPerTurn;
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
    buttonsList[0] = upgradeButton;
    upgradeButton.events.onInputUp.add(upgrade, {upgrading: turn}); 
    waitButton = game.add.button(game.world.centerX + game.world.width/2 - 90*globalScale, 140*globalScale, 'icons', waitOneAction);
    waitButton.frame = 2;
    waitButton.anchor.x = .5;
    waitButton.anchor.y = .5;
    waitButton.battleButton = false;
    buttonsList[1] = waitButton;
    game.world.bringToTop(waitButton);
    waitButton.scale.setTo(globalScale);
    repairButton = makeButton(2,8);
    repairButton.events.onInputDown.add(repair, {repairing: lastClicked});
    generateButton = makeButton(3,6);
    generateButton.events.onInputDown.add(generateRP, {generating: lastClicked}); 
    wallButton = makeButton(4,19);
    wallButton.input.enableDrag();
    wallButton.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: null, player: lastClicked, sprite: wallButton});
    mineButton = makeButton(5,11);
    mineButton.events.onInputDown.add(U.Mines.active, {player: lastClicked});
    extrasButton = makeButton(10, 10);
    mineButton.events.onInputDown.add(displayExtras, {player: lastClicked});
    fusionButton = makeButton(7, 9)
    fusionButton.events.onInputDown.add(U["Fusion Cannon"].active, {player: lastClicked});
    showSplash([
      {text: "On your turn, you have three actions, signified by the battery bar. Each action will remove one segment. You can move a Mecha one space by clicking on it and dragging it to an adjacent space (in, out, clockwise, or counterclockwise).", icon: 'icons', frame: 0},
      {text: "If a Mecha is in a city, it can repair to full health...", icon: 'icons', frame: 8},
      {text: "..or generate a research point. Several actions are granted by upgrades you can purchase in the game, and you can upgrade the Mecha whose turn it currently is (signified by the icon above the Generate Research action), but the Mecha whose turn it is must be selected first.", icon: 'icons', frame: 6},
      {text: "If a Mecha has been destroyed, you can spend an action to help rebuild it.", icon: 'icons', frame: 21},
      {text: "Finally, if you have nothing to do, you can pass.", icon: 'icons', frame: 2}
    ]);
  } else if (!turn /*&& this.lastClicked*/) {
    return;
  }
  if (playerNames.indexOf(sprite.key) > -1) {
    lastClicked = playersList[this.lastClicked] || playersList[sprite.number];
    var normalState = !battleState && !zoomIn && !zoomOut;
    if (turn.sprite === sprite && normalState && (turn.upgrades.length < 12 || monsterResearchTrack < 3)) {
      upgradeButton.inputEnabled = true;
      upgradeButton.tint = 0xffffff;
      upgradeButton.events.onInputUp._bindings = [];
      upgradeButton.events.onInputUp.add(upgrade, {upgrading: turn}); 
    } else {
      upgradeButton.tint = 0x3d3d3d;
      upgradeButton.inputEnabled = false;
    }
    waitButton.inputEnabled = true;
    waitButton.tint = 0xffffff;
    extrasButton.inputEnabled = true;
    extrasButton.tint = 0xffffff;
    extrasButton.events.onInputDown._bindings = [];
    extrasButton.events.onInputDown.add(displayExtras, {player: lastClicked});
    for (i = 1; i < playersList.length; i++) {
      if (destroyedPlayersList.length > 0 && (playersList[i].rbTokens || playersList[i].hp <= 0) && normalState) {
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
    if (lastClicked.key.indexOf("0") === 2 && lastClicked.hp < lastClicked.maxhp && normalState) {
      repairButton.inputEnabled = true;
      repairButton.tint = 0xffffff;
      repairButton.events.onInputDown._bindings = [];
      repairButton.events.onInputDown.add(repair, {repairing: lastClicked, amount: undefined});
    } else if (repairButton) {
      repairButton.tint = 0x3d3d3d;
      repairButton.inputEnabled = false;
    }
    if (lastClicked.key.indexOf("0") === 2 && normalState) {
      generateButton.inputEnabled = true;
      generateButton.tint = 0xffffff;
      generateButton.events.onInputDown._bindings = [];
      generateButton.events.onInputDown.add(generateRP, {generating: lastClicked, amount: undefined});
    } else if (generateButton) {
      generateButton.tint = 0x3d3d3d;
      generateButton.inputEnabled = false;
    }
    
    if (normalState && lastClicked.upgrades.indexOf("Drop Wall") > -1 && !lastClicked.wallDeployed) {
      wallButton.tint = 0xffffff;
      wallButton.inputEnabled = true;
      wallButton.events.onDragStop._bindings = [];
      wallButton.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: null, player: lastClicked, sprite: wallButton});
    } else if (wallButton) {
      wallButton.tint = 0x3d3d3d;
      wallButton.inputEnabled = false;
    }

    if (normalState && lastClicked.upgrades.indexOf("Fusion Cannon") > -1 && fusionButton.activated != true) {
      fusionButton.tint = 0xffffff;
      fusionButton.inputEnabled = true;
      fusionButton.events.onInputDown._bindings = [];
      fusionButton.events.onInputDown.add(U["Fusion Cannon"].active, {player: lastClicked});
    } else if (fusionButton && fusionButton.activated != true) {
      fusionButton.tint = 0x3d3d3d;
      fusionButton.inputEnabled = false;
    }

    if (normalState && lastClicked.upgrades.indexOf("Mines") > -1) {
      mineButton.tint = 0xffffff;
      mineButton.inputEnabled = true;
      mineButton.events.onInputDown._bindings = [];
      mineButton.events.onInputDown.add(U.Mines.active, {player: lastClicked});
    } else if (mineButton) {
      mineButton.tint = 0x3d3d3d;
      mineButton.inputEnabled = false;
    }
   for (i = 0; i < buttonsList.length; i++) {
     if (buttonsList[i] && buttonsList[i].alive) {
        var num = i%3
        buttonsList[i].x = hoverSprite.x + hoverSprite.width + (430*globalScale*num);
        buttonsList[i].y = hoverSprite.y + 600*globalScale + (Math.floor(i/3)*200*globalScale);
     }
   }
  } else if (sprite.key === "threat") {
    buttonsList.forEach(function(button) {    
      if (!fusionButton.activated) {
        button.events.onInputDown._bindings = [];
        button.tint = 0x3d3d3d;
        button.inputEnabled = false;
      }
    });
    }
    /*if (upgradeText) {
      upgradeText.kill();
      //buttonsList.splice(upgradeButton, 1);
      upgradeButton.kill();
    }*/
  //}
  
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
  for (i = 0; i < resultsList.length; i++) {
    if (resultsList[i].rerollButton) {
      resultsList[i].rerollButton.destroy();
      resultsList[i].rerollText.destroy();
    }
    resultsList[i].destroy();
  }
  /*
  battlePlayer.sprite.events.onDragStop._bindings = [];
  battlePlayer.sprite.events.onDragStop.add(attachClosestSpace, this.sprite);
  */
  winner = this.winner;
  var plusorneg = 1;
  var increment = 1;
  var monsterTween = game.add.tween(monsterBar).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  var cardTween = game.add.tween(playerBar.playerCard).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  var winTween = game.add.tween(playerBar).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  monstersList.forEach(function(monster) {
    var dyingTweens = game.add.tween(monster).to( { alpha: 0 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  });
  if (isOdd(playerCount)=== 1) {
    var victoryTween = game.add.tween(winner.sprite).to({ x: focusX, y: focusY }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  } else {
    var victoryTween = game.add.tween(winner.sprite).to({ x: focusX - 100*globalScale, y: focusY }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
  }
  victoryTween.onComplete.add(victoryScreen, this);
  for (i = 1; i < playersList.length; i++) {
    if (!playersList[i].alive) {
      playersList[i].revive();
      playersList[i].alpha = 0;
      var reviveTween = game.add.tween(playersList[i].sprite).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
    }
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
  var victoryText = game.add.bitmapText(focusX,focusY - game.camera.height/C.game.zoomScale, 'font', "YOU WIN!", 70*globalScale);
  victoryText.anchor.setTo(.5);
  game.add.tween(victoryText).to( { y: menuBar.y + menuBar.height/2 }, 1500, Phaser.Easing.Bounce.Out, true);   
  victoryText.inputEnabled = true;
  victoryText.events.onInputDown.add(completeKill, this);
}

class GameOver {
    create() {
        fade("in");
        game.world.scale.set(1);
        console.log("YOU LOSE.");
        game.input.enabled = true;
        var gg = game.add.text(game.world.centerX, game.world.centerY + 100*globalScale, "GAME\nOVER",C.game.textStyle);
        if (destroyedCities.length >= (playerCount * 4) - 4) {
          var ggreason = game.add.text(game.world.centerX, game.world.centerY, "You lost too many cities.", C.game.textStyle);
        } else {
          var ggreason = game.add.text(game.world.centerX, game.world.centerY, "You lost all your mechas.", C.game.textStyle);
        }
        var restart = game.add.text(game.world.centerX, game.world.centerY + 200*globalScale, "Restart?",C.game.textStyle);
        gg.anchor.setTo(.5);
        ggreason.anchor.setTo(.5);
        restart.anchor.setTo(.5);
        restart.inputEnabled = true;
        restart.events.onInputDown.add(completeKill, this);
        game.world.pivot.x = 0;
        game.world.pivot.y = 0;
        game.camera.x = 0;
        game.camera.y = 0;
      }
   
}

function scrubList(list) {
  var tempList = []
  if (list && list.length) {
    for (i = 0; i < list.length; i++) {
      if (list[i] && list[i].hp > 0) {
        tempList.push(list[i]);
      }
    }
  }
  return tempList;
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

function showSplash(pages,passCondition) {
  var pageNumber = 0;
  if (firstTime) {
    game.bg.disableBoard();
    if (turn) {
      turn.sprite.inputEnabled = false;
    }
    if (!game.splash) {
      game.splash = game.add.sprite(game.width/2, game.height/2, 'blackground');
      game.splash.anchor.setTo(.5);
    } else {
      game.splash.revive();
    }
    game.splash.height = 1;
    game.splash.width = 1;
    growSprite(game.splash,game.width,game.height);
    if (!game.splash.text) {
      game.splash.text = game.add.text(game.world.centerX, game.world.centerY - game.world.height/5,pages[0].text,C.game.textStyle);
      game.splash.text.anchor.setTo(.5);
      game.splash.text.wordWrap = true;
      game.splash.text.wordWrapWidth = game.width - 100*globalScale;
    } else {
      game.splash.text.text = pages[0].text;
      game.splash.text.revive();
    }
    game.splash.text.alpha = 0;
    game.time.events.add(Phaser.Timer.SECOND * .6, function(text) {
      game.add.tween(text).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
    }, this, game.splash.text);
    game.world.bringToTop(game.splash.text);

    if (!game.splash.next) {
      game.splash.next = game.add.sprite(game.world.centerX + 200*globalScale, game.camera.height - 100*globalScale, 'leftright', 1);
      game.splash.previous = game.add.sprite(game.world.centerX - 200*globalScale, game.camera.height - 100*globalScale, 'leftright', 2);
      game.splash.icon = game.add.sprite(game.world.centerX, game.camera.height - 500*globalScale, 'red');

      game.splash.next.anchor.setTo(.5);
      game.splash.previous.anchor.setTo(.5);
      game.splash.icon.anchor.setTo(.5);

    } else {
      game.splash.next.revive();
      game.splash.next.tint = 0xffffff;
      game.splash.next.angle = 0;
      game.splash.next.finishState = false;
      game.splash.previous.revive();
      game.splash.previous.tint = 0xffffff;
      game.splash.icon.revive();
      if (pages[0].icon) {
        game.splash.icon.loadTexture(pages[0].icon);
      }
      if (pages[0].frame) {
        game.splash.icon.frame = pages[0].frame;
      }
    }
    game.splash.next.events.onInputUp._bindings = [];
    game.splash.next.events.onInputUp.add(function() {
      pageNumber += 1;
      if (pageNumber == pages.length) {
        game.bg.enableBoard();
        game.splash.kill();
        game.splash.text.kill();
        game.splash.next.kill();
        game.splash.previous.kill();
        game.splash.icon.kill();
        if (passCondition) {
          game[passCondition] = true;
        }
      } else {
        game.splash.text.text = pages[pageNumber].text;
        if (pages[pageNumber].icon) {
          game.splash.icon.loadTexture(pages[pageNumber].icon);
          if (pages[pageNumber].frame) {
            game.splash.icon.frame = pages[pageNumber].frame;
          }
          game.splash.icon.alpha = 1;
        } else {
          game.splash.icon.alpha = 0;
        }
        game.splash.previous.alpha = 1;
        game.splash.previous.inputEnabled = true;
        if (pageNumber == pages.length - 1) {
          game.splash.next.angle -= 90;
          game.splash.next.finishState = true;
        }
      }
    }, this);

    game.splash.previous.events.onInputUp._bindings = [];
    game.splash.previous.events.onInputUp.add(function() {
      pageNumber -= 1;
      game.splash.text.text = pages[pageNumber].text;
      if (pages[pageNumber].icon) {
        game.splash.icon.loadTexture(pages[pageNumber].icon);
        if (pages[pageNumber].frame) {
          game.splash.icon.frame = pages[pageNumber].frame;
        }
        game.splash.icon.alpha = 1;
      } else {
        game.splash.icon.alpha = 0;
      }
      if (pageNumber == 0) {
        game.splash.previous.alpha = 0;
        game.splash.previous.inputEnabled = false;
      }
      if (game.splash.next.finishState) {
        game.splash.next.angle += 90;
        game.splash.next.finishState = false;
      }
    }, this);
    game.splash.next.alpha = 0;
    game.splash.previous.alpha = 0;
    game.splash.icon.alpha = 0;
    game.time.events.add(Phaser.Timer.SECOND * .6, function(nextArrow,icon) {
      game.add.tween(nextArrow).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
      if (pages[0].icon) {
        game.add.tween(icon).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
      }
    }, this, game.splash.next, game.splash.icon);
      game.splash.next.inputEnabled = true;
  } 
}
function printBattleResults(text,position) {
  if (resultsList.length > 0) {
    for (i = 0; i < resultsList.length; i++) {
      resultsList[i].y += globalScale*23;
      if (resultsList[i].rerollButton) {
        resultsList[i].rerollButton.y += globalScale*23;
        resultsList[i].rerollText.y += globalScale*23;
      }
    }
  }
  if (!position) {
    var battleResults = game.add.bitmapText(Math.round(focusX),Math.round(game.camera.y/C.game.zoomScale + 282*globalScale), 'font', text, 20*globalScale);
  } else {
    var battleResults = game.add.bitmapText(Math.round(position.x),Math.round(position.y + 60*globalScale), 'font', text, 20*globalScale);
  }
  battleResults.anchor.x = .5;
  battleResults.anchor.y = .5;
  game.world.bringToTop(battleResults);
  if (battlePlayer.canReroll) {
      var rerollableColor = false;
      length = battlePlayer.rerollUses.colors.length;
      while(length--) {
      if (battleResults.text.indexOf(battlePlayer.rerollUses.colors[length])!=-1 && battleResults.text.indexOf("Threat") == -1) {
          // one of the substrings is in yourstring
        var rerollableColor = true;
      }
    } 
    if (rerollableColor) {
      battleResults.rerollButton = game.add.button(battleResults.x - battleResults.width/2 - 40*globalScale, battleResults.y, 'icons', function() {
        console.log("Value Rerolled!");
        displayRerollOptions(battlePlayer, battleResults.text);
      });
      battleResults.rerollButton.frame = 16
      battleResults.rerollButton.scale.setTo(.18*globalScale);
      battleResults.rerollButton.anchor.setTo(0,.5);
      game.world.bringToTop(battleResults.rerollButton);
      battleResults.rerollText = game.add.bitmapText(battleResults.rerollButton.x - 60*globalScale, battleResults.y, 'font', "Reroll?", 20*globalScale);
      battleResults.rerollText.anchor.setTo(0,.5);
    }
  }
  resultsList.push(battleResults);
  return battleResults;
}

function displayRerollOptions(player,text) {
  console.log(text);
  for (i = 0; i < player.upgrades.length; i++) {
    console.log("Tick.");
    if (U[player.upgrades[i]] && U[player.upgrades[i]].allowsReroll && player.rerollUses[player.upgrades[i]].charges > 0) {
      var length = U[player.upgrades[i]].colorsChanged.length;
      while(length--) {
        console.log(length + " iteration check.");
        if (text.indexOf(U[player.upgrades[i]].colorsChanged[length])!=-1 && text.indexOf("Threat") == -1) {
          // one of the substrings is in yourstring
          if (player.upgrades[i] == "Mind-Machine Interface Unlock") {
            var upgradetext = "MMI Unlock: " + player.rerollUses[player.upgrades[i]].charges;
          } else {
            var upgradetext = player.upgrades[i] + ": " + player.rerollUses[player.upgrades[i]].charges;
          }
          addBattleText(upgradetext, U[player.upgrades[i]].active, text, "rerollTexts");
          break;
        }
      } 
    }
  }
  addBattleText("Return", U["Reroll"], 0, "rerollTexts");
  if (rerollTexts.length > 0) {
    //printBattleResults("Rerolling. Click a valid option to reroll with.")
    resultsList.disabledButtons = [];
    for (i = 0; i < battleTexts.length; i++) {
        battleTexts[i].kill();
    }
    for (i = 0; i < resultsList.length; i++) {
      if (resultsList[i].rerollButton) {
        resultsList[i].rerollButton.kill();
        resultsList[i].rerollText.kill();
        resultsList.disabledButtons.push(resultsList[i]);
      }
    }
    if (monsterAttackButton && monsterAttackButton.alive) {
      monsterAttackButton.kill();
      monsterAttackButton.disabled = true;
      monsterAttackText.kill();
    }
    console.log(player.upgrades);
  } else {
    printBattleResults("You're all out of reroll charges!");
  }
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
  battlePlayer.rerollValues = null;
  killBattleInfo();
  console.log(method);
  if (method === "Emergency Jump Jets") {
    var twoAwayList = U["Emergency Jump Jets"].active(battlePlayer);
    return
  } else if (method === null) {
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
      var deathCase = "poisoned";
    }
  if (damaged && damaged.hp <= 0) {
    handleDeath(damaged,attacker,deathCase);   
  } else {
    move(battlePlayer,destination);
    focusSpace.occupied = removeFromList(playersList[battlePlayer.sprite.number], focusSpace);
    pendingBattles.forEach(function(i) {
      if (i.pendingPlayer.sprite.key === battlePlayer.sprite.key) {
        pendingBattles.splice(i,1);
      }
    });
    finishBattle("Running");
  }
  battleTexts = [];
  var attackerTween = game.add.tween(attacker.sprite).to( { x: changeValueScale(Space[attacker.key].x,"x"), y: changeValueScale(Space[attacker.key].y,"y")}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
}

function attack(attacker,defender) {
  if (!attacker.rerollValues && !defender.rerollValues) {
    var bhits = 0;
    if (attacker.batk) {
      var bhits = rollDie(attacker.batk - (defender.batkDecrease || 0), attacker.batkGoal || 5);
    }
    var rhits = 0;
    if (attacker.ratk) {
      rhits = rollDie(attacker.ratk - (defender.ratkDecrease || 0), attacker.ratkGoal || 5);
    }
    var defences = 0;
    if (defender.def) {
      var defences = rollDie(defender.def, defender.defGoal || 5);
    }
  } else {
    if (attacker.canReroll) {
      var bhits = attacker.rerollValues.bhits;
      var rhits = attacker.rerollValues.rhits;
      var defences = attacker.rerollValues.enemydef;
    } else if (defender.canReroll) {
      var bhits = defender.rerollValues.bhits;
      var rhits = defender.rerollValues.rhits;
      var defences = defender.rerollValues.def;
      console.log(defences);
    }
  }
  console.log("rhits for attacker: " + rhits.hits);
  console.log("bhits for attacker: " + bhits.hits);

  if (Number.isInteger(rhits)) {
    var rhittext = "0" 
    var rhits = {};
    rhits.results = [0];
    rhits.hits = 0;
  } else {
    var rhittext = rhits.results.join(",");
  }
  if (Number.isInteger(bhits)) {
    var bhittext = "0" 
    var bhits = {};
    bhits.results = [0];
    bhits.hits = 0;
  } else {
    var bhittext = bhits.results.join(",");
  }
  if (Number.isInteger(defences)) {
    var defencestext = "0" 
    var defences = {};
    defences.results = [0];
    defences.hits = 0;
  } else {
    var defencestext = defences.results.join(",");
  }

  if (playersList.indexOf(attacker) > -1 ) {
    printBattleResults(attacker.sprite.key.capitalizeFirstLetter() + " Mecha rolled " + bhittext + " on Physical Die and " + rhittext + " on Energy Die!");
  } else {
    printBattleResults(C.monster.names[attacker.sprite.spriteName] + " rolled " + bhittext + " on Attack Die!");
  }
  if (playersList.indexOf(defender) > -1 ) {
    printBattleResults(defender.sprite.key.capitalizeFirstLetter() + " Mecha rolled " + defencestext + " on Defence Die!");
  } else {
    printBattleResults(C.monster.names[defender.sprite.spriteName] + " rolled " + defencestext + " on Defence Die!");
  }
  if (attacker.upgrades.indexOf("Reroll Blue") != -1 && (defender.hp - bhits.hits + defences.hits > 0) && attacker.rerollTokens > 0 && bhits.hits != attacker.batk) {
    bhits = MU["Reroll"].active(attacker,"batk",bhits);
  } else if (defender.upgrades.indexOf("Reroll Def") != -1 && defences.hits != defender.def && defender.rerollTokens > 0) {
    defences = MU["Reroll"].active(defender,"def",defences);
  }
  var successes = (rhits.hits || 0) + bhits.hits;
  if (defender.guarenteedDef && successes > 0) {
    successes -= defender.guarenteedDef;
  }
  if (attacker.siegeMode) {
    printBattleResults(defender.sprite.key.capitalizeFirstLetter() + " Mecha has activated siege mode, guaranteeing one hit..")
    successes += 1;
    attacker.def -= 1;
    // attacker.canSiege = false;
  }
  console.log(attacker.sprite.key + " hit " +successes + " hit/hits!");
  console.log(defender.sprite.key + " defended " + defences.hits + " hit/hits!");
  if (successes > defences.hits) {
    var damageTaken = successes - defences.hits;
    damageTaken = shieldDamage(defender,damageTaken)
    defender.hp -= damageTaken;
    var damaged = defender;
    var text = defender.sprite.key.capitalizeFirstLetter() + " took " + damageTaken.toString() + " damage from " + attacker.sprite.key.capitalizeFirstLetter() + ".";
  } else if (defences.hits > successes) {
    var damageTaken = defences.hits - successes;
    damageTaken = shieldDamage(attacker,damageTaken)
    attacker.hp -= damageTaken;
    var damaged = attacker;
    var text = attacker.sprite.key.capitalizeFirstLetter() + " took " + damageTaken.toString() + " damage from " + defender.sprite.key.capitalizeFirstLetter() + "'s defences!";
  } else {
    var damaged = undefined;
    var damageTaken = undefined;
    console.log("No damage.");
    var text = defender.sprite.key.capitalizeFirstLetter() + " blocked every hit from " + attacker.sprite.key.capitalizeFirstLetter() + "!";
  }
    printBattleResults(text); 
    if (damaged && damaged != battlePlayer && battlePlayer.pilot === "Teen Prodigy") {
      damaged.hp -= Pilots["Teen Prodigy"].passive(battlePlayer);
    }
    var stacks = 0;
    if (attacker.upgrades.indexOf("Poison Aura") > -1) {
      var stacks = countInArray(attacker.upgrades,"Poison Aura");
      if (damageTaken) {
        damageTaken += stacks;
      } else {
        damageTaken = stacks;
        damaged = defender;
      }
      MU["Poison Aura"].active(attacker,defender,stacks);
      var deathCase = "poisoned";
    }
    if (attacker.canReroll) {
      attacker.rerollValues = {rhits: rhits, bhits: bhits, enemydef: defences, enemy: defender, damageDealt: 0, damageTaken: 0};
      if (damaged && damaged == defender) {
        attacker.rerollValues.damageDealt += damageTaken;
      } else if (damaged) {
        attacker.rerollValues.damageTaken += damageTaken;
      }
      if (deathCase == "poisoned") {
        attacker.rerollValues.damageTaken += stacks;
        attacker.rerollValues.damageDealt += stacks;
      }
    } else if (defender.canReroll) {
        defender.rerollValues = {rhits: rhits, bhits: bhits, def: defences, enemy: attacker, damageDealt: 0, damageTaken: 0};
        if (damaged && damaged == attacker) {
          defender.rerollValues.damageDealt += damageTaken;
        } else if (damaged) {
          defender.rerollValues.damageTaken += damageTaken;
        }
        if (deathCase == "poisoned") {
          defender.rerollValues.damageTaken += stacks;
          defender.rerollValues.damageDealt += stacks;
        }
    }
    if (defender.hp <= 0) {
      if (defender.canReroll && defender.rerollUses.colors.indexOf("Defence Die") > -1) {
        promptSave(defender,attacker);
      } else {
        handleDeath(defender,attacker);
      }
    }
    if (attacker.hp <= 0) {
    if (attacker.canReroll && (attacker.rerollUses.colors.indexOf("Physical Die") > -1 || attacker.rerollUses.colors.indexOf("Energy Die") > -1)) {
        promptSave(attacker,defender);
      } else {
        handleDeath(attacker,defender);
      }
    }
    if (!damaged || damaged.hp > 0) {
      battleTurn = defender;
    }

}
function promptSave(player,monster,deathCase) {
  var canSave = false;
  for (i = 0; i < player.upgrades.length; i++) {
    console.log("Tick.");
    if (U[player.upgrades[i]].allowsReroll && player.rerollUses[player.upgrades[i]].charges > 0) {
      canSave = true;
      break;
    }
  }
  if (canSave) {
    printBattleResults("This mecha is about to die, would you like to reroll?");
    //displayRerollOptions(player);
  } else {
    printBattleResults("This mecha cannot save itself, it is all out of reroll charges!");
    handleDeath(player,monster);
  }
}
function handleDeath(damaged,survivor,deathCase) {
  battlePlayer.attacking = false;
  if (battlePlayer.truePower) {
    battlePlayer.truePower === false;
  }
  globalList = scrubList(globalList);
  if (deathCase === "poisoned" && !battleMonster.alive && !battlePlayer.alive) {
    if (battleMonster.upgrades.indexOf("Feign Death") > -1 && battleMonster.feigned === false) {
      MU["Feign Death"].active(battleMonster);
      return;
    }
    battleMonster.sprite.x = focusX;
    if (battleMonster.key.charAt(2) === "0") {
      destroyCity(battleMonster.key);
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
      game.bg.disableBoard();
      fade("out","GameOver");
      game.state.start("GameOver");
    }
    focusSpace.occupied = scrubList(focusSpace.occupied);
    battlePlayer.rp += battleMonster.rp;
    if (battlePlayer.pilot === "Bounty Hunter") {
      var chr = String.fromCharCode(96 + battlePlayer.sprite.number);
      if (battleMonster.key.charAt(0) !== chr) {
        battlePlayer.rp += 2;
      }
    }
    battlePlayer.mr += battleMonster.mr;
    monstersList.splice(monstersList.indexOf(battleMonster), 1);
    battleMonster.sprite.destroy();
    battlePlayer.sprite.x = focusX;
  } else {
  if (damaged.upgrades.indexOf("Feign Death") > -1 && damaged.feigned === false) {
    MU["Feign Death"].active(damaged);
    return;
  }
  if (damaged === battlePlayer) {
    var monsterWinTween = game.add.tween(battleMonster.sprite).to( { x: focusX }, 1000, Phaser.Easing.Linear.None, true);
    var deathTween = game.add.tween(damaged.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    deathTween.onComplete.add(function() {
      this.damaged.sprite.kill()
    }, {damaged: damaged});
    if (damaged.key.charAt(2) === "0") {
      destroyCity(damaged.key);
    }
    focusSpace.occupied = scrubList(focusSpace.occupied);
    playersList[damaged.sprite.number].rbTokens = 6;
    //playersList[damaged.sprite.number].sprite.kill();
    destroyedPlayersList.push(playersList[damaged.sprite.number])
    var destroyedPlayers = 0;
    for (var i = 1; i < playersList.length; i++) {
      if (!playersList[i].sprite.alive) {
        destroyedPlayers += 1;
      }
    }
    console.log("There are " + destroyedPlayers + " mechas destroyed.")
    if (destroyedPlayers === playerCount || destroyedPlayersList.length >= playerCount) {
      zoomOut = true;
      game.bg.disableBoard();
      fade("out","GameOver");
      //game.state.start("GameOver");
    }
  } else if (damaged === battleMonster && damaged != boss) {
    focusSpace.occupied = scrubList(focusSpace.occupied);
    battlePlayer.rp += damaged.rp;
    if (battlePlayer.pilot === "Bounty Hunter") {
      var chr = String.fromCharCode(96 + battlePlayer.sprite.number);
      if (damaged.key.charAt(0) !== chr) {
        battlePlayer.rp += 2;
      }
    }
    battlePlayer.mr += damaged.mr;
    monstersList.splice(monstersList.indexOf(damaged), 1);
    //damaged.sprite.destroy();
    for (i = 0; i < resultsList.length; i++) {
      if (resultsList[i].rerollButton) {
        resultsList[i].rerollButton.destroy();
        resultsList[i].rerollText.destroy();
      }
    }
    var deathTween = game.add.tween(damaged.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    deathTween.onComplete.add(function() {
      this.damaged.sprite.destroy 
    }, {damaged: damaged});
    var playerTween = game.add.tween(battlePlayer.sprite).to( { x: focusX }, 1000, Phaser.Easing.Linear.None, true);
    console.log("Monster died, moving back to position " + focusX )
  } else if (damaged === boss) {
    var winTween = game.add.tween(damaged.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    winTween.onComplete.add(winGame, {winner: survivor});
    return
  }
  }
  //Deals with making the button for a mech who has died.
      if (!battlePlayer.rebuildButton && destroyedPlayersList.length > 0 && battlePlayer.hp <= 0) {
        if (destroyedMechDisplays.length === 0) {
          var x = hoverSprite.x + hoverSprite.width/2 - 10*globalScale;
        } else {
          var x = destroyedMechDisplays[destroyedMechDisplays.length-1].valueIcon.x + 300*globalScale;
        }
        battlePlayer.rebuildButton = battlePlayer.addHoverInfo(x, hoverSprite.y + batkDisplay.valueIcon.width*3,21,"rbTokens");
        battlePlayer.rebuildButton.mechSprite = game.add.sprite(battlePlayer.rebuildButton.valueIcon.x + 9*globalScale, battlePlayer.rebuildButton.valueIcon.y + 50*globalScale, battlePlayer.sprite.key)
        battlePlayer.rebuildButton.mechSprite.scale.setTo(globalScale);
        battlePlayer.rebuildButton.valueIcon.inputEnabled = true;
        battlePlayer.rebuildButton.valueIcon.width = 160*globalScale;
        battlePlayer.rebuildButton.valueIcon.height = 160*globalScale;
        battlePlayer.rebuildButton.valueDisplay.x = battlePlayer.rebuildButton.valueIcon.x  + 40 + 90*globalScale;
        battlePlayer.rebuildButton.valueDisplay.y = battlePlayer.rebuildButton.valueIcon.y + 40;
        battlePlayer.rebuildButton.valueIcon.battleButton = false;
        destroyedMechDisplays.push(battlePlayer.rebuildButton);
        battlePlayer.rebuildButton.valueIcon.events.onInputDown.add(rebuild, {rebuilding: battlePlayer});
        console.log("Created a button for a dead mech.");
      }
  monsterAttackButton.endState = true; 
}

function shieldDamage(obj,damage) {
  if (obj.upgrades.indexOf("Nullifier Shield") > -1 && obj.shields === true) {
    damage -= 1;
    printBattleResults(obj.sprite.key.capitalizeFirstLetter() + " blocked 1 damage with Nullifier Shield.");
    obj.shields = false;
  }
  return damage;
}

function resetDie(player,monster) {
  var playerDie = {
    "Blue Attack": "batk",
    "Red Attack": "ratk",
    "Defense": "def",
    "Blue Target": "batkGoal",
    "Red Target": "ratkGoal",
    "Defense Target": "defGoal"
  };
  var playerPools = {
    "Blue Target": "batkGoal",
    "Red Target": "ratkGoal",
    "Defense Target": "defGoal"
  }
  if (player.tempStolen) {
    for (i = 0; i < player.tempStolen.length; i++) {
      if (playerDie[player.tempStolen[i].pool]) {
        player[playerDie[player.tempStolen[i].pool]] += player.tempStolen[i].amount;
      }
    }
  }
  player.tempStolen = [];
  if (player.siegeMode) {
    player.siegeMode = false;
    player.def += 1;
  }

}

function finishBattle(exception) {
  battlePlayer.rerollValues = null;
  console.log(exception);
  if (exception != "Running") {
    pendingBattles.splice(0,1);
    if (battlePlayer.sprite) {
      battlePlayer.sprite.x = focusX;
    }
    if (battleMonster.sprite) {
      battleMonster.sprite.x = focusX;
    }
  } 
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
  extraBattleTexts.forEach(function(battleText) {
    if (battleText.parent === battlePlayer) {
      
    }
  });
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
    if (!pendingBattles[0].pendingMonster.sprite.alive || !pendingBattles[0].pendingPlayer.sprite.alive || pendingBattles[i].pendingPlayer.hp <= 0 || pendingBattles[i].pendingMonster.hp <= 0 || pendingBattles[i].pendingMonster.key != pendingBattles[i].pendingPlayer.key) {
      pendingBattles.splice(pendingBattles[i], 1);
    }
  }
  /*for (i = 0; i < monstersList.length; i++) {
    checkBattle(monstersList[i].space);
  }*/
  if (pendingBattles.length == 0) {
    playersList.forEach(function(player) {
      console.log("Checking player.");
      if (player) {
        checkBattle(player.space);
      }
    });
  }
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
    game.input.enabled = true;
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
  monsterAttackButton.endState = false;
  monsterAttackText.text = "Click for Monster's Attack.";
  monsterAttackButton.disabled = false;
  monsterAttackButton.frame = 12; 
  monsterAttackButton.events.onInputUp._bindings = [];
  monsterAttackButton.events.onInputUp.add(allowMonsterTurn, this);
  monsterAttackButton.kill();
  monsterAttackText.kill();
}

function killBattleInfo() {
  menuBar.kill();
  playerBar.kill();
  playerBar.playerCard.kill();
  monsterBar.kill();
  monsterBar.monsterCard.kill();
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
    if (resultsList[i].rerollButton) {
      resultsList[i].rerollButton.destroy();
      resultsList[i].rerollText.destroy();
    }
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
  var results = [];
  for (i = 1; i < count + 1; i++) {
    rollResult = Math.floor(Math.random() * ((6-1)+1) + 1);
    if (rollResult >= goal) {
      hits += 1;
    }
    results.push(rollResult);
  }
  return {
    hits: hits,
    results: results
  }
} 
/*
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
*/
function updateOccupiedRows() {
   occupiedRows = ['center'];
   for (var key in Space) {
    if (Space.hasOwnProperty(key)) {
      var obj = Space[key];
      if (obj.hasOwnProperty("occupied") && obj["occupied"] != false && obj["occupied"]) {
        console.log(obj);
        for (mc = 0; mc < obj["occupied"].length; mc++) {
          if (monstersList.indexOf(obj["occupied"][mc]) > -1 || (obj["occupied"][mc].sprite && obj["occupied"][mc].sprite.key === "destroyedCity")) {
           var rowKey = obj["occupied"][mc].key.substring(0,2);
           console.log(rowKey);
           if (occupiedRows.indexOf(rowKey) === -1) {
            occupiedRows.push(rowKey);
           }
          } 
        }
      }
    }
  }
}
function allowMonsterTurn() {
  battleMonster.attacking = true;
  battlePlayer.rerollValues = null;
  monsterAttackButton.kill();
  monsterAttackText.kill();
  for (i = 0; i < resultsList.length; i++) {
    if (resultsList[i].rerollButton) {
      resultsList[i].rerollButton.destroy();
      resultsList[i].rerollText.destroy();
    }
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
  if (monsterAttackButton.endState) {
    for (i = 0; i < battleTexts.length; i++) {
      battleTexts[i].kill();
    }
    monsterAttackButton.reset(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale,game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + 50*globalScale);
    monsterAttackText.reset(monsterAttackButton.x, monsterAttackButton.y + 60*globalScale);
    game.world.bringToTop(monsterAttackButton);
    game.world.bringToTop(monsterAttackText);
    monsterAttackButton.frame = 13;
    monsterAttackButton.events.onInputUp._bindings = [];
    monsterAttackButton.events.onInputUp.add(finishBattle,undefined);
    monsterAttackText.text = "Click to finish battle."
  }
  if (battleTurn === battleMonster && battleMonster.sprite) {
      if (attackText) {
        if (battleMonster.upgrades.indexOf("Regeneration") > -1) {
          var stacks = battleMonster.regenTokens;   
          var maxRegen = battleMonster.maxhp - battleMonster.hp;
          var regenstacks = Math.min(stacks, maxRegen);
          if (regenstacks > 0) {
            MU["Regeneration"].active(battleMonster, regenstacks);
          }
        }
        for (i = 0; i < battleTexts.length; i++) {
          battleTexts[i].kill();
        }
        battlePlayer.sprite.events.onDragStop._bindings = [];
        //var increment = C.game.moveSpeed/10
        //game.time.events.repeat(increment, 5, updateRollText, this,battleMonster,"atk");
      }
      if (battleMonster.attacking) {
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
            battleMonster.attacking = false;
            battlePlayer.sprite.events.onDragStop.add(checkAttack, this.sprite);
          }
        }
      } else if (monsterAttackButton && !monsterAttackButton.disabled && !monsterAttackButton.alive && !monsterAttackButton.endState) {
        monsterAttackButton.reset(game.camera.width/C.game.zoomScale + game.camera.x/C.game.zoomScale - 100*globalScale,game.camera.y/C.game.zoomScale + game.camera.height/C.game.zoomScale - (game.camera.height/8) + 50*globalScale);
        monsterAttackText.reset(monsterAttackButton.x, monsterAttackButton.y + 60*globalScale);
        game.world.bringToTop(monsterAttackButton);
        game.world.bringToTop(monsterAttackText);
        monsterAttackButton.events.frame = 12;
        monsterAttackButton.events.onInputUp = [];
        monsterAttackButton.events.onInputUp.add(allowMonsterTurn,this);
        monsterAttackText.text = "Click for Threat's Attack.";
      }
    } else if (battleTurn === battlePlayer && battlePlayer.attacking === true) {
      if (attackText) {
        for (i = 0; i < battleTexts.length; i++) {
          battleTexts[i].kill();
        }
        battlePlayer.sprite.events.onDragStop._bindings = [];
        battlePlayer.sprite.inputEnabled = false;
        //var increment = C.game.moveSpeed/10
        //game.time.events.repeat(increment, 5, updateRollText, this,battlePlayer,"atk");
      }

      battlePlayer.sprite.x -= C.mech.battleSpeed - battleSpeedDecrease;
      battleSpeedDecrease += .02;
      if (battlePlayer.sprite.x <= focusX) {
        battleSpeedDecrease = 0;
        attack(battlePlayer,battleMonster);
        if (battleState === true) {
          if (!monsterAttackButton.endState) {
            battlePlayer.sprite.x = focusX + C.mech.battleSpacing;
          }
          for (i = 0; i < battleTexts.length; i++) {
            battleTexts[i].reset(battleTexts[i].x, battleTexts[i].y);
            //battleTexts[i].inputEnabled = true;
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
    if (lastClicked && lastClicked.pilot === "Engineer") {
      repair(lastClicked,null,1);
    }
  }
  
  function destroyCity(newDestination) {
      var newDestination = this.key || newDestination;
      if (fortifiedList.indexOf(newDestination.charAt(0)) === -1 || Space[newDestination].damage === 1) {
        //var destroyedCityColumn = spawnSpecific("destroyedCity", newDestination);
      
        targetSpace = Space[newDestination];
        var spawn = game.add.sprite(targetSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,targetSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"destroyedCity"); 
        spawn.anchor.x = .5;
        spawn.anchor.y = .5;
        spawn.scale.x = C.destroyed.scale;
        spawn.scale.y = C.destroyed.scale;
        spawn.angle = Math.atan2(game.bg.y + game.bg.height/2 - spawn.y, game.bg.x + game.bg.width/2 - spawn.x );
        spawn.angle = spawn.angle * (180/Math.PI) - 10;
        if(spawn.angle < 0)
          {
            spawn.angle = 360 - (-spawn.angle);
          }
        console.log(random.angle);
        occupiedRows.push(newDestination.substring(0,2));
        spawn.smoothed = true;
        addToOccupied(targetSpace,spawn);
        var destroyedCityColumn = {
          space: targetSpace,
          key: newDestination,
          sprite: spawn
        }

        destroyedCities.push(destroyedCityColumn);
        occupiedRows.push(destroyedCityColumn.key.substring(0,2));
        Space[newDestination].damage = 2;
        if (destroyedCityIcons.children.length > 0) {
          destroyedCityIcons.children[destroyedCityIcons.children.length-1].destroy();
        }
        //var destroyedCityIcon = destroyedCityIcons.create((destroyedCityIcons.children[destroyedCityIcons.length-1].x+(30*globalScale)), 30*globalScale,'destroyedCity');
        //destroyedCityIcon.scale.setTo(.7*globalScale);
      } else {
        Space[newDestination].damage = 1;
      }
      for (i = 0; i < monstersList.length; i++) {
        game.world.bringToTop(monstersList[i].sprite);
      }
  }
  function cycleQuadrant(letter, direction) {
    if (letter === "d" && direction === "clockwise") {
      return "a";
    } else if (letter === "a" && direction === "counter-clockwise") {
      return "d";
    } else if (direction === "clockwise" ) {
      return findNextLetter(letter); 
    } else if (direction === "counter-clockwise") {
      return findPreviousLetter(letter);
    } 
  }

  function moveMonsters() {
   monstersMoving = "moving";
   updateOccupiedRows();
   monstersList = scrubList(monstersList);
   var unmovedMonsters = [];

   //Check if someone with Monster Bait is two upgrades away. 2nd
   //priority  
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
          if (parseInt(monstersList[i].key.charAt(2)) === 0 )  {
            if (Space[newDestination].damage && Space[newDestination].damage === 1) {
              newDestination = monstersList[i].key;
              unmovedMonsters.push(monstersList[i]);
            } else {
              var okCount = 1;
              var checkedCity = monstersList[i].key;
              var checkDirections = [checkedCity.charAt(0) + (parseInt(checkedCity.charAt(1))+1) + checkedCity.charAt(2), checkedCity.charAt(0) + (parseInt(checkedCity.charAt(1))-1) + checkedCity.charAt(2)]
              var destroyedCitiesKeys = [];
              destroyedCities.forEach(function(city) {
                destroyedCitiesKeys.push(city.key);
              });
              while (destroyedCitiesKeys.indexOf(checkedCity) > -1 && checkedCity === monstersList[i].key) { 
                if (checkDirections[0].charAt(1) === "5") {
                  checkDirections[0] = cycleQuadrant(checkDirections[0].charAt(0), "clockwise") + "1" + checkedCity.charAt(2);
                } else if (checkDirections[1].charAt(1) === "0") {
                  checkDirections[1] = cycleQuadrant(checkDirections[1].charAt(0), "counter-clockwise") + "4" + checkedCity.charAt(2);
                }
                console.log("Tick direciton check: ");
                console.log(checkDirections);
                  if (destroyedCitiesKeys.indexOf(checkDirections[0]) === -1) { 
                    checkedCity = checkDirections[0]; 
                    var direction = 0;
                  } else if (destroyedCitiesKeys.indexOf(checkDirections[1]) === -1) { 
                    checkedCity = checkDirections[1]; 
                    var direction = 1;
                  } else {
                    var checkDirections = [checkDirections[0].charAt(0) + (parseInt(checkDirections[0].charAt(1))+1) + checkDirections[0].charAt(2), checkDirections[1].charAt(0) + (parseInt(checkDirections[1].charAt(1))-1) + checkDirections[1].charAt(2)]
                  }
              }
              console.log("Monster is moving along a path of destruction to " + checkedCity);
              checkedCity = monstersList[i].key;
              var finalDirections = [checkedCity.charAt(0) + (parseInt(checkedCity.charAt(1))+1) + checkedCity.charAt(2), checkedCity.charAt(0) + (parseInt(checkedCity.charAt(1))-1) + checkedCity.charAt(2)]
             if (finalDirections[0].charAt(1) === "5") {
                finalDirections[0] = cycleQuadrant(finalDirections[0].charAt(0), "clockwise") + "1" + checkedCity.charAt(2);
              } else if (finalDirections[1].charAt(1) === "0") {
                finalDirections[1] = cycleQuadrant(finalDirections[1].charAt(0), "counter-clockwise") + "4" + checkedCity.charAt(2);
              }
              newDestination = finalDirections[direction];
              console.log("direction was " + direction);
              console.log("Monster at city is moving to " + newDestination);
            }
          }

        //Checks to see if a player is nearby. 1st priority
        
        var foundPlayers = [];
        for (y = 0; y < monstersList[i].sprite.closestSpaces.selectedSpaces.length; y++) {
          if (monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied) {
            var len = monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied.length;
          } else {
            var len = 0;
          }
          for (o = 0; o < len; o++) {
            if (playersList.indexOf(monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o]) > -1) {
              var foundPlayer = monstersList[i].sprite.closestSpaces.selectedSpaces[y].occupied[o];  
              foundPlayers.push(foundPlayer);
            }
          }
        }
          console.log(foundPlayers);
          var monstersKey = monstersList[i].key
          var directionPriorities = [monstersList[i].key.substring(0,2) + parseInt(Number(monstersKey.charAt(2))-1), monstersList[i].key.charAt(0) + (parseInt(monstersList[i].key.charAt(1))+1) + monstersList[i].key.charAt(2), monstersList[i].key.charAt(0) + (parseInt(monstersList[i].key.charAt(1))-1) + monstersList[i].key.charAt(2), monstersList[i].key.substring(0,2) + parseInt(Number(monstersKey.charAt(2))+1)]
          if (monstersKey.charAt(1) === "4") {
            directionPriorities[1] = cycleQuadrant(directionPriorities[1].charAt(0), "clockwise") + "1" + monstersKey.charAt(2);
          } else if (monstersKey.charAt(1) === "1") {
            directionPriorities[2] = cycleQuadrant(directionPriorities[2].charAt(0), "counter-clockwise") + "4" + monstersKey.charAt(2);
          }
          if (monstersKey.charAt(2) === "3") {
            directionPriorities[3] = "center";
          }
          console.log(directionPriorities);
        for (p = 0; p < directionPriorities.length; p++) {
          for (f = 0; f < foundPlayers.length; f++) {
            if (foundPlayers[f].key === directionPriorities[p]) {
              var newDestination = foundPlayers[f].key;
              var foundAPlayer = true; 
              break;
            }
          }
          if (foundAPlayer) {
            foundAPlayer = false
            break;
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
            unmovedMonsters.push(monstersList[i]);
          }    
        console.log("Monster is moving to " + newDestination);
        move(monstersList[i], newDestination);
        monstersList[i].movingTo = newDestination;
      } else {
        console.log("Broken destination was " + newDestination);
      }
    }
    if (destroyedCities.length >= (playerCount * 4) - 4){
      game.bg.disableBoard();
      fade("out","GameOver");
      //game.state.start("GameOver");
    } else {
      var newMonster = monstersList.push(spawnRandom("monster", "random", "3")) - 1;
      console.log("New Monster is: ");
      console.log(newMonster);
      checkBattle(monstersList[newMonster].space);
    }
   console.log(unmovedMonsters);
}

function destroyWall() {
    this.wallSpace.wall.owner.wallDeployed = false;
    this.wallSpace.wall.destroy();
    this.wallSpace.wall = false;
    var moveTween = game.add.tween(this.object.sprite).to( { x: changeValueScale(this.formerSpace.x,"x"), y: changeValueScale(this.formerSpace.y,"y") }, 500, Phaser.Easing.Back.InOut, true);
    console.log(this.formerSpace);
}

function explode(sprite) { 
    if (this.mineSpace) {
      this.mineSpace.mine.destroy();
      this.mineSpace.mine = false;
    }
    var dieTween = game.add.tween(this.sprite).to( { x: game.world.centerX + game.width/2 + this.sprite.width*2, angle: 720}, 700, Phaser.Easing.Linear.None, true);
    dieTween.onComplete.add(this.sprite.kill, this);
}

function move(object,destination,escaping) {
  console.log(object);
  var object = this.object || object;
  var destination = this.destination || destination;
  var escaping = this.escaping || escaping ;
  game.input.enabled = false;
  if (playersList.indexOf(object) > -1) {
    setLastClicked(object.sprite);
  }
  console.log(destination);
  var destinationX = Space[destination].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
  var destinationY = Space[destination].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;  
  if (escaping) {
    if (escaping === "running") {
      if (this.method && this.method === "Emergency Jump Jets") {
        var destination = getClosestByDistance(object).spaceKey;
        var destinationX = Space[destination].x*C.bg.scale*C.bg.resizeX + game.bg.position.x;
        var destinationY = Space[destination].y*C.bg.scale*C.bg.resizeY + game.bg.position.y;  
        battlePlayer.sprite.events.onInputUp._bindings[0].context.destination = destination;
        console.log(this.list);
        if (this.list.indexOf(destination) > -1) {
          var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(reEnable,this);
          move(battleMonster,destination,"chasing");
          heldSprite = null;
        } else {
          battlePlayer.sprite.events.onInputUp._bindings[0].context.destination = getClosestByDistance(object).spaceKey;
          game.input.enabled = true;
        }
      } else {
        var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
        moveTween.onComplete.add(reEnable,this);
      }
      return;
    } else if (escaping === "chasing") {
      var moveTween = game.add.tween(object.sprite).to( { x: destinationX, y: destinationY}, C.game.moveSpeed, Phaser.Easing.Linear.None, true);
      moveTween.onComplete.add(attackOfOppertunity, {attacker: battleMonster, defender: battlePlayer, destination: destination});
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
        object.space.occupied = removeFromList(monstersList[monstersList.indexOf(object)], object.space);
        Space[destination].mine.owner.rp += object.rp;
        if (Space[destination].mine.owner.pilot === "Bounty Hunter") {
          var chr = String.fromCharCode(96 + Space[destination].mine.owner.sprite.number);
          if (destination.charAt(0) !== chr) {
            Space[destination].mine.owner.rp += 2;
          }
        }
        Space[destination].mine.owner.mr += object.mr;
        monstersList.splice(monstersList.indexOf(object), 1);
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
    if (destination.charAt(2) === "0" && (Space[destination].occupied === false || Space[destination].occupied === null || Space[destination].occupied === undefined)) {
      moveTween.onComplete.add(destroyCity,{key:destination}); 
    }
    for (i = 1; i < playersList.length; i++) {
      if (playersList[i] && playersList[i].sprite) {
        playersList[i].sprite.inputEnabled = false;
      }
    }
  }
  Space[object.key].occupied = removeFromList(object, Space[object.key]);
  if (playersList.indexOf(object) > -1) {
    Space[object.key].occupied = removeFromList(playersList[object.sprite.number], Space[object.key]);
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

  //This happens when the monster's turn is over.
function reEnable() {
    game.input.enabled = true;
    actionIcons.callAll('revive');
    actionPointsRecord = 3;
}

function getClosestByDistance(obj) {
  var obj = obj || this.obj;
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
  return {
    space: space,
    spaceKey: spaceKey,
    closestDistance: closestDistance
  }
}

function placeRebuilt(player) {
  var player = this.obj || player;
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
    var distanceTo = distance(spaceObjX,spaceObjY,player.sprite.x,player.sprite.y)
    if (!spaceObj.wall && !spaceObj.occupied && distanceTo < closestDistance) {
      closestDistance = distanceTo;
      space = spaceObj;
      closestX = spaceObjX;
      closestY = spaceObjY;
      spaceKey = obj_keys[i];
    }
  }
  game.world.bringToTop(player);
  var quadrant = String.fromCharCode(96 + player.sprite.number);
  var row = "0";
  if (spaceKey.charAt(0) == quadrant && spaceKey.charAt(2) == row && !space.wall && !space.occupied) {
    heldSprite = null;
    var normalState = !battleState && !zoomIn && !zoomOut;
    for (i = 1; i < playersList.length; i++) {
      if (destroyedPlayersList.length > 0 && playersList[i].rbTokens && normalState) {
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
    game.bg.enableBoard();
    for (i = 0; i < game.bg.highlightedSpaces.length; i++) {
      game.bg.highlightedSpaces[i].destroy();
    }
    game.bg.highlightedSpaces = [];
    var moveTween = game.add.tween(player.sprite).to( { x: closestX, y: closestY}, C.game.moveSpeed/2, Phaser.Easing.Linear.None, true);
    //player.sprite.x = closestX;
    //player.sprite.y = closestY;
    player.key = spaceKey;
    player.space = space;
    if (this.array) {
      move(battleMonster,player.key,"chasing");
    }
    addToOccupied(player, Space[spaceKey]);
    player.sprite.closestSpaces = getClosestSpaces(player.key);
    game.time.events.add(500, reEnableHover, this, player.sprite);
    //reEnableHover(player.sprite);
    if (playersList.indexOf(player) > -1) { 
      return spaceKey;
    }
  }
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
  if (!this.array) {
    var check = (!quadrant || spaceKey.charAt(0) === quadrant) && (!column || spaceKey.charAt(1) === column) && (!row || spaceKey.charAt(2) === row);
  } else {
    var check = (this.array.indexOf(spaceKey) > -1);
  }
  if (!space.wall && !space.occupied && check) {
    heldSprite = null;
    game.bg.enableBoard();
    obj.sprite.x = closestX;
    obj.sprite.y = closestY;
    obj.key = spaceKey;
    if (this.array) {
      move(battleMonster,obj.key,"chasing");
    }
    addToOccupied(obj, Space[spaceKey]);
    obj.sprite.closestSpaces = getClosestSpaces(obj.key);
    reEnableHover(obj.sprite);
    if (playersList.indexOf(obj) > -1) { 
      return spaceKey;
    }
  }
}

function rebuild(rebuilding, pointer, free) {
  var rebuilding = this.rebuilding || rebuilding;
  rebuilding.rbTokens -= 1;
  rebuilding.rebuildButton.update(rebuilding);
  if (rebuilding.rbTokens <= 0 && !heldSprite) {
    rebuilding.rbTokens = undefined;
    rebuilding.sprite.revive(pointer.x, pointer.y);
    rebuilding.hp = rebuilding.maxhp;
    game.bg.disableBoard();
    game.bg.highlightOptions(rebuilding);
    heldSprite = rebuilding.sprite;
    rebuilding.sprite.inputEnabled = true;
    rebuilding.sprite.tint = 0xffffff;
    rebuilding.sprite.events.onInputDown._bindings = [];
    rebuilding.sprite.events.onInputOver._bindings = [];
    rebuilding.sprite.events.onInputOut._bindings = [];
    rebuilding.sprite.events.onDragStop._bindings = [];
    rebuilding.sprite.events.onInputUp.add(placeRebuilt,{obj:rebuilding, quadrant:String.fromCharCode(96 + rebuilding.sprite.number),column:false,row:"0"})
    var reviveTween = game.add.tween(rebuilding.sprite).to( { alpha: 1 }, C.game.zoomSpeed*2.5, Phaser.Easing.Linear.None, true);
    globalList.push(rebuilding);
  } else if (rebuilding.rbTokens <=0) {
    game.bg.pendingRebuilt.push(rebuilding);
  }
  if (!free) {
    actionPoints -= 1;
  }
}

function generateRP(generating) {
  var generating = this.generating || generating;
  generating.rp += 1;
  actionPoints -= 1;
  rpDisplay.update(generating);
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
      //repairButton.kill();
      repairButton.inputEnabled = false;
      repairButton.tint = 0x3d3d3d
      actionPoints -= 1;
    }
  }
    tweenTint(repairing.sprite, 0xffffff, 0x98FB98, 500, true);
    hpDisplay.update(repairing);
}

function displayExtras() {
  console.log("Displaying Extras for: " + this.player.sprite.key);
  var cameraTween = game.add.tween(game.camera).to( { x: game.width }, C.game.moveSpeed, Phaser.Easing.Back.InOut, true);
  extrasDisplay.setText("Upgrades and extras for " + this.player.sprite.key + ":");
  upgradeTokensList.forEach(function(upgrade) {
    upgrade.destroy();
  });
  upgradeTokensList = [];
  if (this.player.upgrades.length >= 12) {
    var target = 12;
  } else {
    var target = this.player.upgrades.length;
  }
  for (i = 0; i < target; i++) {
    if (this.player.upgrades[i] && this.player.upgrades[i].indexOf("LOCKED") === -1) {
      var num = i%4
      var upgradeToken = game.add.sprite(0,0,'upgradeMatIcons', options.indexOf(this.player.upgrades[i]));
      upgradeToken.scale.setTo(globalScale/3);
      upgradeToken.anchor.setTo(.5);
      upgradeToken.x = game.width + game.camera.width/1.9 - upgradeToken.width*2 + (upgradeToken.width*num);
      upgradeToken.y = extrasDisplay.y + 200*globalScale + (Math.floor(i/4)*upgradeToken.height);
      upgradeTokensList[i] = upgradeToken;
    } else if (this.player.upgrades[i] && this.player.upgrades[i].indexOf("LOCKED") === 0) {
      var num = i%4
      var upgradeToken = game.add.sprite(0,0,'upgradeMatIcons', options.indexOf(this.player.upgrades[i].substring(7)) + 5);
      upgradeToken.scale.setTo(globalScale/3);
      upgradeToken.anchor.setTo(.5);
      upgradeToken.x = game.width + game.camera.width/1.9 - upgradeToken.width*2 + (upgradeToken.width*num);
      upgradeToken.y = extrasDisplay.y + 200*globalScale + (Math.floor(i/4)*upgradeToken.height);
      upgradeToken.tint = 0x3d3d3d
      upgradeTokensList[i] = upgradeToken;
    }
  }
  if (!pilotIcon) {
    pilotIcon = game.add.sprite(game.width*2 - 750*globalScale, game.world.centerY - 60*globalScale, this.player.pilot);
  } else {
    pilotIcon.destroy();
    pilotIcon = game.add.sprite(game.width*2 - 750*globalScale, game.world.centerY - 60*globalScale, this.player.pilot);
  }
  pilotIcon.scale.setTo(.8*globalScale)
  pilotIcon.anchor.y = .5
  if (!corpIcon) {
    corpIcon = game.add.sprite(game.width + 54*globalScale, game.world.centerY - 60*globalScale, this.player.corp + "Card");
  } else {
    corpIcon.destroy();
    corpIcon = game.add.sprite(game.width + 54*globalScale, game.world.centerY - 60*globalScale, this.player.corp + "Card");
  }
  corpIcon.scale.setTo(.9*globalScale)
  corpIcon.anchor.y = .5
}

  function upgrade(upgrading) {
    var upgrading = this.upgrading || upgrading;
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
          for (i = 0; i < upgrading.upgrades.length; i++) {
            if (!upgrading.upgrades[i]) {
              upgrading.upgrades[i] = this.boughtUpgrade;
              break
            }
          }
          if (unlocks.indexOf(this.boughtUpgrade) > -1) {
            U[this.boughtUpgrade].taken = true;
            upgrading.upgrades.unshift(this.boughtUpgrade);
            if (upgrading.upgrades.length >= 5) {
              for (i = upgrading.upgrades.length; i >= 4; i--) {
               upgrading.upgrades[i+1] = upgrading.upgrades[i];
              }
            }
            upgrading.upgrades[4] = "LOCKED " + this.boughtUpgrade;
          } else if (upgrading.upgrades.indexOf(this.boughtUpgrade) === -1) {
            upgrading.upgrades.push(this.boughtUpgrade);
          }
          for (u = 0; u < unlocks.length; u++) {
            if (upgrading.upgrades.indexOf(unlocks[u]) > -1 && upgrading.upgrades.indexOf(unlocks[u]+" Unlock") === -1 ) {
              for (i = 0; i < upgrading.colorDiscounts.length; i++) {
                if (upgrading.colorDiscounts[i].color === U[unlocks[u]+" Unlock"].unlockColor && upgrading.colorDiscounts[i].discount >= 3) { 
                  if (U[unlocks[u]+" Unlock"].passive) {
                    U[unlocks[u]+" Unlock"].passive(upgrading);
                  }
                    upgrading.upgrades[upgrading.upgrades.indexOf(unlocks[u]) + 4] = unlocks[u]+" Unlock";
                }
              }
          }
        }
          boughtBool = true;
          upgrading.tiersOwned[(boughtUpgrade.cost/2)-1] += 1;
          for (i = 0; i < upgrading.upgrades.length; i++) {
             if (upgrading.upgrades[i] == undefined) {
              upgrading.upgrades.splice(i,1);
             }
          }
          console.log(upgrading.tiersOwned[(boughtUpgrade.cost/2)-1]);
          var timesBought = 0;
          for (i = 1; i < playersList.length; i++) {
            if (playersList[i].upgrades.indexOf(this.boughtUpgrade) > -1) {
              timesBought += 1;
              if (timesBought >= 3) {
                console.log("Ran out of " + this.boughtUpgrade);
                U[this.boughtUpgrade].taken = true;
                break;
              }
            }
          }
        }
      setAttributeDisplay(upgrading);
    }
    if (upgrading.upgrades.length >= 12 && monsterResearchTrack >= 3) {
      game.camera.y = 0;
      game.bg.enableBoard();
      upgradeButton.tint = 0x3d3d3d;
      upgradeButton.inputEnabled = false;
      return
    }
    console.log("Upgrading " + upgrading.sprite.key);
  upgradeTokens.callAll('kill');
  var x1 = 149 * globalScale, x2 = 2660 * globalScale,
  y1 = 2032 * globalScale, y2 = 4489 * globalScale;
  for (i = 0; i < upgrading.upgrades.length; i++) {
    if (options.indexOf(upgrading.upgrades[i]) > -1) {
      var upgradeLocation = options.indexOf(upgrading.upgrades[i]);
      var upX = x1 + (501/2)*globalScale + (501*globalScale)*upgradeLocation;
      var upY = y1 + ((407/2)*globalScale);
      while (upX > x2) {
        upX -= (501*globalScale)*5;
        upY += (407*globalScale);
      }
      if (upgradeTokens.getFirstDead()) {
        upgradeTokens.getFirstDead().reset(upX,upY);
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
    game.bg.disableBoard();
    upgradeState = true;
}

function chooseUpgrade(event) {
  if (game.camera.y >= 430) {
    console.log(event);
    var x1 = 149 * globalScale, x2 = 2660 * globalScale,
    y1 = 2032 * globalScale, y2 = 4480 * globalScale;
    console.log("Points are at " + x1 + "," + x2 + "," + y1 + "," + y2 + ".");
    console.log(event.worldX + " " + event.worldY);
    if (event.worldX > x1 && event.worldX < x2 && event.worldY > y1 && event.worldY < y2 && turn.upgrades.length < 12){
      var x = event.worldX - x1,
          y = event.worldY - y1;
      var choice = options[Math.floor(x / (501*globalScale)) + 5*Math.floor(y /(407*globalScale))];
      console.log(choice);
      console.log("Event was at " + x + " " + y);
      if (turn.upgrades.length >= 11 && unlocks.indexOf(choice) > -1 ) {
        return
      } else {
        game.camera.y = game.camera.y;
        game.input.onTap._bindings = [];
        confirmUpgrade(turn,choice);
      }
    } else if (monsterResearchTrack < 3 && event.worldX > x1 && event.worldX < x2 && event.worldY > 4680*globalScale && event.worldY < y2 + 830*globalScale) { 
      var mrProviders = [];
      game.kineticScrolling.stop();
      if (!mrMenuFreezeFrame) {
        monsterResources = 0;
        game.camera.x += game.camera.width + 100;
        mrMenuFreezeFrame = { x: game.camera.x, y: game.camera.y};
        var colortext = game.add.text(game.camera.x + 50*globalScale, game.camera.y + 500*globalScale, "Mech:",C.game.textStyle);
        colortext.anchor.y = .5
        var maxtext = game.add.text(game.camera.x + 50*globalScale, game.camera.y + 750*globalScale, "Contributed MR:",C.game.textStyle);
        maxtext.anchor.y = .5
        var totalContributions = game.add.text(game.camera.x + 1600*globalScale, game.camera.y + 500*globalScale, "8 MR needed to reach tier 1:",C.game.textStyle);
        totalContributions.anchor.y = .5
        totalContributions.anchor.x = .5
        var mrReturnButton = game.add.button(game.camera.x + 1600*globalScale, game.camera.y + 900*globalScale,'icons',function() {
          game.camera.x = 0;
          game.kineticScrolling.start();
        });
        mrReturnButton.frame = 13
        mrReturnButton.anchor.setTo(.5);
        mrReturnButton.scale.setTo(globalScale*.7);
        var mrReturnText = game.add.text(mrReturnButton.x,mrReturnButton.y - mrReturnButton.height,"Return to Upgrade Menu",C.game.textStyle);
        mrReturnText.anchor.setTo(.5);
        for (i = 1; i < playersList.length; i++) {
          var uparrow = game.add.sprite(game.camera.x + 300*globalScale + 200*globalScale*i, game.camera.y + 300*globalScale, 'leftright', 1);
          uparrow.angle = 270;
          uparrow.inputEnabled = true;
          var downarrow = game.add.sprite(uparrow.x, game.camera.y + game.camera.height - 300*globalScale, 'leftright', 2);
          downarrow.angle = 270;
          downarrow.inputEnabled = true;
          var monsterDoner  = game.add.sprite(uparrow.x, uparrow.y + 200*globalScale, playerNames[i-1]);
          uparrow.anchor.setTo(.5);
          downarrow.anchor.setTo(.5);
          monsterDoner.anchor.setTo(.5);
          monsterDoner.totalResources = playersList[i].mr;
          monsterDoner.contributedResources = 0;
          monsterDoner.contributedText = game.add.text(uparrow.x, game.camera.y + 750*globalScale, monsterDoner.contributedResources + "\n-\n" + monsterDoner.totalResources,C.game.textStyle);
          monsterDoner.contributedText.anchor.setTo(.5)
          //Add in the arrow's functions
          uparrow.events.onInputDown.add(function() {
            if (this.monsterDoner.contributedResources < this.monsterDoner.totalResources && monsterResources != 8) {
              this.monsterDoner.contributedResources += 1;
              this.monsterDoner.contributedText.text = this.monsterDoner.contributedResources + "\n-\n" + this.monsterDoner.totalResources; 
              monsterResources += 1;
              if (monsterResources < 8) {
                totalContributions.text = (8 - monsterResources) + " MR needed to reach Level " + (monsterResearchTrack + 1);
              } else { 
                totalContributions.text = "Confirm Threat Research Upgrade?";
                mrConfirmButton.revive(); 
              }
            }
          }, {monsterDoner: monsterDoner}); 
          downarrow.events.onInputDown.add(function() {
            if (this.monsterDoner.contributedResources > 0) {
              this.monsterDoner.contributedResources -= 1;
              this.monsterDoner.contributedText.text = this.monsterDoner.contributedResources + "\n-\n" + this.monsterDoner.totalResources; 
              monsterResources -= 1;
              totalContributions.text = (8 - monsterResources) + " MR needed to reach Level " + (monsterResearchTrack + 1);
              mrConfirmButton.kill(); 
            }
          }, {monsterDoner: monsterDoner}); 
          monsterDonerList.push(monsterDoner);
        }
        mrConfirmButton = game.add.button(totalContributions.x, totalContributions.y + 100*globalScale, 'icons', function() {
            game.camera.x = 0;
            game.kineticScrolling.start();
            monsterResearchTrack += 1;
            boughtBool = true;
            for (i = 0; i < monsterDonerList.length; i++) {
             playersList[i+1].mr -= monsterDonerList[i].contributedResources; 
             monsterDonerList[i].contributedResources = 0;
             monsterResources = 0;
             totalContributions.text = (8 - monsterResources) + " MR needed to reach Level " + (monsterResearchTrack + 1);
             monsterDonerList[i].contributedText.text = monsterDonerList[i].contributedResources + "\n-\n" + monsterDonerList[i].totalResources; 
            }
              mrConfirmButton.kill(); 
              //var token = mrTokens.create((x1+(255*globalScale))+(585*globalScale*(monsterResearchTrack)), y2 + 615*globalScale,'icons',18);
              var token = mrTokens.create(mrTokens.pos[monsterResearchTrack-1].x, mrTokens.pos[monsterResearchTrack-1].y,'icons',18);
              token.scale.setTo(globalScale);
              token.anchor.setTo(.5);
              for (i = 1; i < playersList.length; i++) { 
                if (monsterResearchTrack >= 3) {
                  playersList[i].sprite.closestSpaces = getClosestSpaces(playersList[i].key); 
                  if (turn.upgrades.length >= 12 && monsterResearchTrack >= 3) {
                    game.camera.y = 0;
                    game.bg.enableBoard();
                    upgradeButton.tint = 0x3d3d3d;
                    upgradeButton.inputEnabled = false;
                  }
                } else {
                  Corp[playersList[i].corp].trackUpgrade(playersList[i],monsterResearchTrack);
                }
              }
          });
          mrConfirmButton.frame = 22;
          mrConfirmButton.anchor.setTo(.5);
          mrConfirmButton.scale.setTo(globalScale*.7);
          mrConfirmButton.kill();
      } else {
          game.camera.x = mrMenuFreezeFrame.x;
          game.camera.y = mrMenuFreezeFrame.y;
          for (i = 0; i < monsterDonerList.length; i++) {
            monsterDonerList[i].totalResources = playersList[i+1].mr;
            monsterDonerList[i].contributedText.text = monsterDonerList[i].contributedResources + "\n-\n" + monsterDonerList[i].totalResources; 
          }
        }
    }
  }
}

function disableBoard(section) {
  console.log(this);
  for (var i = 0; i < game.world.children.length; i++) {
    if (!section) {
      var condition = game.world.children[i].y && game.world.children[i].y < this.height && game.world.children[i].inputEnabled == true
    } else if (section == "buttons") {
      var condition = game.world.children[i].y && game.world.children[i].y < this.height && game.world.children.x > (game.bg.x + game.bg.width) && game.world.children[i].inputEnabled == true
    }
    if (condition) {
      game.world.children[i].inputEnabled = false;
      game.world.children[i].tint = 0x3d3d3d;
      this.disabledValues.push(game.world.children[i]);
    }
  }
}

function enableBoard() {
  for (var i = 0; i < this.disabledValues.length; i++) {
    this.disabledValues[i].tint = 0xffffff;
    console.log(this.disabledValues[i]);
    this.disabledValues[i].inputEnabled = true;
  }
  this.disabledValues = [];
}
function confirmUpgrade(player,upgradeName) {
      var consideredUpgrade = U[upgradeName];
      consideredUpgrade.tier = consideredUpgrade.cost/2;
      if ((player.upgrades.indexOf(upgradeName) === -1) && consideredUpgrade && consideredUpgrade.desc) {
      game.kineticScrolling.stop();
      confirmState = true;
      game.camera.y = upgradeMenu.y + upgradeMenu.height/2 + game.camera.height/2;
      var index = options.indexOf(upgradeName);
      var timesBought = 0;
      if (!upgradeExample) {
        var upgradeExample = game.add.sprite(game.world.centerX, game.height/2 + game.camera.y, 'upgradeMatIcons', index);
        upgradeExample.scale.setTo(globalScale/2);
        upgradeExample.anchor.setTo(.5);
      } else {
        upgradeExample.frame = index;
      }
      if (confirmText && consideredUpgrade && consideredUpgrade.desc) {
        confirmText.setText("Are you sure you would like to purchase " + upgradeName + " on " + turn.sprite.key.capitalizeFirstLetter() + " Mecha?\n\n" + consideredUpgrade.desc);
      } else if (consideredUpgrade && consideredUpgrade.desc){
        confirmText = game.add.text(game.camera.x + game.camera.width/2,game.camera.y + game.camera.height/2 - 460*globalScale,"Are you sure you would like to purchase " + upgradeName + " on " + turn.sprite.key.capitalizeFirstLetter() + " Mecha?\n\n" + consideredUpgrade.desc, C.game.textStyle);
        confirmText.anchor.setTo(.5,.5);
      } else {
        if (!confirmText) {
          confirmText = game.add.text(game.camera.x + game.camera.width/2,game.camera.y + game.camera.height/2 - 460*globalScale,"Currently a WIP! Check back later to access this upgrade!", C.game.textStyle);
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
      if (!priceText) {
        priceText = game.add.text(confirmText.x, confirmText.y + 800*globalScale,"",C.game.smallStyle)
        priceText.anchor.setTo(.5,.5);
      }
      if (player.upgrades.indexOf(upgrade) > -1) {
        priceText.setText("This mecha already owns this upgrade!");
        for (i = 0; i < game.world.children.length; i++) {
          if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
            game.world.children[i].destroy();
          }
        }
        var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
        back.anchor.setTo(.5,.5);
        back.inputEnabled = true;
        back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
        return;
      } else if (consideredUpgrade.color === "black" || consideredUpgrade.color === "purple") {
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
        var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
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
          priceText.setText(upgradeName + " is an unlock upgrade.\nPurchase " + (consideredUpgrade.cost - discountValue) + " more " + consideredUpgrade.unlockColor + " upgrades and " + upgradeName.replace(' Unlock','')  + " to unlock this.");
        } else {
          priceText = game.add.text(confirmText.x, confirmText.y + 400, upgradeName + " is an unlock upgrade.\nPurchase " + (consideredUpgrade.cost - discountValue) + " more " + consideredUpgrade.unlockColor + " upgrades and " + upgradeName.replace(' Unlock','')  + " to unlock this.", C.game.smallStyle);
          priceText.anchor.setTo(.5,.5);
        }
        var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
        for (i = 0; i < game.world.children.length; i++) {
          if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
            game.world.children[i].destroy();
          }
        }
        back.anchor.setTo(.5,.5);
        back.inputEnabled = true;
        back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
        return;
      } else if (consideredUpgrade.taken) {
        if (unlocks.indexOf(upgradeName) > -1) {
          priceText.setText("Another mecha has already purchased this unique upgrade.");
        } else {
          priceText.setText("This upgrade is out of stock. Three other Mechas have purchased it.");
        }
        var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
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
        if (consideredUpgrade.tier == 1 || player.tiersOwned[consideredUpgrade.tier-2] >= 2) {
          priceText.setText(upgradeName + " is a tier " + consideredUpgrade.tier + " upgrade.\nOther " + consideredUpgrade.color + " upgrades you have purchased have reduced the cost to " + (consideredUpgrade.cost - discountValue) + "\nCurrent RP: " + player.rp);
          if (player.rp < (consideredUpgrade.cost - discountValue)) {
            var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
            for (i = 0; i < game.world.children.length; i++) {
              if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
                game.world.children[i].destroy();
              }
            }
            back.anchor.setTo(.5,.5);
            back.inputEnabled = true;
            back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
            return;
          }
        } else {
          priceText.setText(upgradeName + " is a tier " + consideredUpgrade.tier + " upgrade, and you currently own " + player.tiersOwned[consideredUpgrade.tier-2] + " tier " + (consideredUpgrade.tier-1) + " upgrades.\nYou need 2 upgrades from the previous tier to purchase from this tier."); 
        var back = game.add.text(confirmText.x, priceText.y + 200*globalScale, "Back", C.game.ynStyle);
        for (i = 0; i < game.world.children.length; i++) {
          if (game.world.children[i].text && (game.world.children[i].text === "Yes"  || game.world.children[i].text === "No")) {
            game.world.children[i].destroy();
          }
        }
        back.anchor.setTo(.5,.5);
        back.inputEnabled = true;
        back.events.onInputUp.add(upgrade, {upgrading: turn, yn: "no"});
        return;
        }
      }
      for (i = 0; i < game.world.children.length; i++) {
        if (game.world.children[i].text && game.world.children[i].text === "Back") {
          game.world.children[i].destroy();
        }
      }
      var yes = game.add.text(confirmText.x - 150, priceText.y + 200*globalScale, "Yes", C.game.ynStyle);
      yes.anchor.setTo(.5,.5);
      yes.inputEnabled = true;
      yes.events.onInputUp.add(upgrade, {upgrading: turn, yn: "yes", boughtUpgrade: upgradeName});
      var no = game.add.text(confirmText.x + 150, priceText.y + 200*globalScale, "No", C.game.ynStyle);
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
    if (playersList[i] && playersList[i].sprite && (!game.splash || !game.splash.alive)) {
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
      if (space.occupied[i] && space.occupied[i].sprite.key.indexOf('threat') > -1) {
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
              console.log("Found a copy.")
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
          game.input.enabled = true;
          battleStarting = true;
          buttonsList.forEach(function(button) {
            button.inputEnabled = false;
            button.tint = 0x3d3d3d;
          });
      }
    }
  }
}
}


function changeTurn() {
    if (!heldSprite) {
      if (turn && monstersMoving == false) {
        moveMonsters();
      } else if (monstersMoving == "moved") {
        if (firstTime && !game.firstMonsterTurnPassed) {
          showSplash([
            {text: "Finally, you can mouse over any Threat or Mecha to see its stats. The number out of the brackets is how many dice that are rolled, and the number in brackets is the target number that you (or the threats) need to equal or beat on the dice.", icon: turn.sprite.key},
            {text: " In combat you roll both Energy dice...", icon: 'icons', frame: 9},
            {text: "...And Physical dice, adding the successes together.", icon: 'icons', frame: 5},
            {text: "You roll these against the enemy's Defense dice. The side that has the most success deals damage equal to the difference to the side that has the least successes.\n\nIf you rolled three successes on your attack dice against a monster's two successes on their defence dice, you would deal one damage.", icon: 'icons', frame: 7},
            {text: "If you have any further questions or suggestions, feel free to send an email to tastycookiegames@gmail.com and we'll help you out as best we can!"}
          ],"firstMonsterTurnPassed");
          firstTime = false;
          localStorage.setItem('firstTime', firstTime);
        }
        monstersMoving = false;
        actionPoints = 3;
        playersList.forEach(function(player) {
          if (player.rbTokens) {
            rebuild(player, game.input.mousePointer,true);
          }
        });
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
              if (playersList[i].upgrades.indexOf("Weaponized Research") > -1) {
                playersList[i].weaponizedResearchCharges = 3;
              }
              if (playersList[i].changedDie) {
                playersList[i].changedDie.forEach(function(changed) {
                  playersList[i][changed.value] -= changed.count;
                });
              }
              playersList[i].upgrades.forEach(function(upgrade) {
                if (playersList[i].rerollUses[upgrade]) {
                  playersList[i].rerollUses[upgrade].charges = playersList[i].rerollUses[upgrade].maxCharges;
                }
              });
            }
            for (i = 0; i < monstersList.length; i++) {
              if (monstersList[i].rerollTokens) {
                monstersList[i].rerollTokens += 1;
              }
              if (monstersList[i].regenTokens) {
                monstersList[i].regenTokens += countInArray(monstersList[i].upgrades,"Regeneration");
              }
            }
            turn = playersList[1];
          } 
        } while (turn === undefined)
          console.log("Switching to this turn:");
          console.log(turn);
          if (turn.rpPerTurn && turn.sprite.alive) {
            turn.rp += turn.rpPerTurn;
            console.log(turn.sprite.key + " gained " + turn.rpPerTurn + " RP.");
          }
          upgradeButton.reset(upgradeButton.x, upgradeButton.y);
          upgradeButton.events.onInputUp._bindings = [];
          upgradeButton.loadTexture(turn.sprite.key);
          upgradeButton.events.onInputUp.add(upgrade, {upgrading: turn});
      }
    }
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
   if (obj.upgrades.indexOf("Super Go Fast") > -1) { 
        var availableSpaces = closestSpaces.keys;
        //Finds the closest spaces from two spaces away in case of
        //super go fast upgrade
        var twoAwayList = [];
        for (m = 0; m < closestSpaces.keys.length; m++) {
            //monstersList[i].sprite.closestSpaces.selectedSpaces[m].closestSpaces = getClosestSpaces(monstersList[i].sprite.closestSpaces.keys[m]) 
            var checkKeys = getClosestSpaces(closestSpaces.keys[m]).keys;
            for (l = 0; l < checkKeys.length; l++) {
              checkKeys[l] = {key: checkKeys[l], parent: closestSpaces.keys[m], space: Space[checkKeys[l]]}
              twoAwayList.push(checkKeys[l]);
            }
          }
        twoAwayList.forEach(function(i) {
          if (closestSpaces.keys.indexOf(i.key) === -1) {
            closestSpaces.selectedSpaces.push(i.space);
            closestSpaces.keys.push(i.key);
          }
        });

      }
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
    setLastClicked(sprite);
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

function getRandomSpace(notOccupied) {
  var obj_keys = Object.keys(Space);
  if (notOccupied) {
    obj_keys.forEach(function(key) {
      if (Space[key].occupied) {
        obj_keys.splice(key,1);
      }
    });
  }
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

function hoverScale() {
  var scaleTween = game.add.tween(this.sprite.scale).to( { x: C.mech.scale + .3, y: C.mech.scale + .3 }, C.game.zoomSpeed, Phaser.Easing.Linear.None, true);
}

function spawnPlayer(number) {
  var player = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,playerNames[number-1]); 
  player.kill();
  player.anchor.x = .5;
  player.anchor.y = .5;
  player.scale.x = C.mech.scale;
  player.scale.y = C.mech.scale;
  player.glow = glow;
  var obj =  {
    sprite: player
  };
  obj.addBattleInfo = addBattleInfo;
  obj.addHoverInfo = addHoverInfo;
  do {
    var drawnMech = MechDeck[Math.floor(Math.random() * MechDeck.length)];
  } while (drawnMech.drawn)
  drawnMech.drawn = true;
  obj.rp = 3;
  obj.rpPerTurn = 3;
  //Test for now. Everyone is Genericorp
  obj.corp = "Genericorp";
  obj.mr =  0;
  obj.hp = drawnMech.hp;
  obj.maxhp = drawnMech.hp;
  obj.def = drawnMech.def;
  obj.ratk = drawnMech.ratk;
  obj.batk = drawnMech.batk;
  obj.batkGoal = 5;
  obj.ratkGoal = 5;
  obj.defGoal = 5;
  Corp[obj.corp].starting(obj);
  obj.sprite.inputEnabled = true;
  obj.sprite.input.enableDrag(true);
  player.parentobj = obj;
  game.bg.pendingRebuilt.push(obj);
  globalList.push(obj);
  return obj
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
  if (occupiedRows.length === playerCount*4 + 1) {
    var fullyOccupied = true;
  } 
  while (condition === true) {
    failSafe += 1;
    var space = getRandomSpace(true);
    if (quadrant === "random" && occupiedCheck === true) {
        if (row === "random") {
          if (!fullyOccupied) {
            condition = space.key.indexOf("0") || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
          } else {
            condition = space.key.indexOf("0") || space.selectedSpace.occupied === true;
          }
        } else {
          condition = space.key.indexOf("0") || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1 || space.key.charAt(2) != "3";
        }
    } else if (quadrant && row && occupiedCheck === true) {
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.indexOf(row) !== 2 || space.key.indexOf(chr) !== 0 || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
    } else if (quadrant && row && quadrant === "random") {
        //var chr = String.fromCharCode(96 + Math.floor(Math.random() * (playerCount)) + 1);
        if (!fullyOccupied) {
          condition = space.key.charAt(2) !== row || space.selectedSpace.occupied === true || occupiedRows.indexOf(space.key.substring(0,2)) > -1;
        } else {
          condition = space.key.charAt(2) !== row || space.selectedSpace.occupied === true;
        }
    } else if (quadrant === "random") {
        condition = space.key.indexOf("0") != -1;
    } 
    else if (quadrant && row) { 
        var chr = String.fromCharCode(96 + quadrant);
        condition = space.key.charAt(2) !== row || space.key.indexOf(chr) !== 0;
    } 
    if (failSafe >= 700) {
      condition = false;
        var tempSpace = {
          selectedSpace: space.selectedSpace,
          key: space.key
        };
        do {
          var rand = monstersList[Math.floor(Math.random() * monstersList.length)];
          tempSpace.selectedSpace = rand.space;
          tempSpace.key = rand.key.substring(0,2) + "3";
          console.log(tempSpace.selectedSpace.occupied + tempSpace.key);
          console.log(tempSpace);
        } while (tempSpace.selectedSpace.occupied && tempSpace.key.charAt(2) != "3")
        space = tempSpace;
      }
    console.log(condition);
  }   
  console.log(object + " found a home");
  if (object !== "monster") {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,object); 
  } else {
    if (threatLevel < 12) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"initialMonster"); 
    } else if (threatLevel < 18) {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"growingMonster"); 
    } else {
  random = game.add.sprite(space.selectedSpace.x*C.bg.scale*C.bg.resizeX + game.bg.position.x,space.selectedSpace.y*C.bg.scale*C.bg.resizeY + game.bg.position.y,"extinctionMonster"); 
    }
    random.spriteName = random.key;
    random.key = "threat";
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
    occupiedRows.push(space.key.substring(0,2));
  } else {
    random.scale.x = C.mech.scale;
    random.scale.y = C.mech.scale;
    random.glow = glow;
    random.events.onInputOut.add(reduceScale,{sprite:random});
    random.events.onInputOver.add(hoverScale, {sprite:random});
    random.events.onInputOut.add(random.glow, {sprite:random,fadeOut:true});
    random.events.onInputOver.add(random.glow, {sprite:random});
    random.events.onInputOver.add(setLastClicked, {lastClicked:random});
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
      obj.mr = 1;
    } else if (threatLevel <= 18) { 
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
      obj.mr = 2;
    } else {
      if (threatLevel >= 30) {
        threatLevel = 18;
        for (i = 0; i < MonstersDeck.extinctionMonsters.length; i++) {
          MonstersDeck.extinctionMonsters.drawn = false;
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
      obj.mr = 3;
    }
    if (drawnMonster.defGoal) {
      obj.defGoal = drawnMonster.defGoal
    }
    if (drawnMonster.batkGoal) {
      obj.batkGoal = drawnMonster.batkGoal
    }
    if (drawnMonster.rerollTokens) {
      obj.rerollTokens = drawnMonster.rerollTokens
    }
    if (drawnMonster.regenTokens) {
      obj.regenTokens = drawnMonster.regenTokens
    }
    drawnMonster.drawn = true;
    
  }
  random.parentobj = obj;
  return obj
}

function addToOccupied(object,space) {
  if (space.occupied === false || space.occupied === undefined) {
    space.occupied = [object];
  } else {
    space.occupied.push(object);
  }
}

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
game.state.add("HowToMenu",HowToMenu);
game.state.start("Boot");

