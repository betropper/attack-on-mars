
var Corp = {
  "Genericorp": {
    "desc": "A default corporation. Doesn't specialize in anything, jack of all trades.",
    starting: function(player) {
      if (player.rpPerTurn) {
        player.rpPerTurn += 1 
      } else {
        player.rpPerTurn = 1;
      }
    },
    trackUpgrade: function(player,number) {
      if (number === 1) {
        player.def += 1;
      } else if (number === 2) {
        player.ratk += 1;
        player.batk += 1;
      }
    }
  }

}


var U = {
  "Electric Fists": {
    "desc": "Increases max red (attack) die by one.",
    "color": "red",
    "cost": 2,
    passive: function(player) { player.ratk += 1 }
  },
  "Bigger Fists": {
    "desc": "Increases max blue (attack) die by one.",
    "color": "blue",
    "cost": 2,
    passive: function(player) { player.batk += 1 }
  },
  "Mines": {
    "desc": "Allows player to set a mine that deals one damage to a single monster.",
    "color": "purple",
    "cost": 2,
    passive: function(player) { },
    active: function() {
      var player = this.player;
      console.log(player);
      if (player.upgrades.indexOf("Mines") > -1 && !Space[player.key].mine) {
        var mine = game.add.sprite(player.sprite.x, player.sprite.y, "mine");
        mine.anchor.setTo(.5);
        mine.scale.setTo(1.6*globalScale);
        mine.owner = player;
        Space[player.key].mine = mine;
        actionPoints -= 1;
      } else {
        console.log("Failed to build a mine.");
      }
    }
  },
  "More Armor": {
    "desc": "Increases max health and current health by one.",
    "color": "yellow",
    "cost": 2,
    passive: function(player) { player.hp +=1; player.maxhp += 1; }
  },
  "5D Accelerators": {
    "desc": "Increases max green (defence) die by one.",
    "color": "green",
    "cost": 2,
    passive: function(player) { player.def += 1 }
  },
  "Hyper Caffeine": {
    "desc": "Gain one additional Research Point at the start of your turn.",
    "color": "black",
    "cost": 2,
    passive: function(player) { 
      if (player.rpPerTurn) {
        player.rpPerTurn += 1 
      } else {
        player.rpPerTurn = 1;
      }
    }
  },
  "Targeting Computer": {
    "desc": "Decreases target red (attack) die by one.",
    "color": "red",
    "cost": 4,
    passive: function(player) { 
      if (player.ratkGoal) {
        player.ratkGoal -= 1 
      } else {
        player.ratkGoal = 4;
      }
    }
  },
  "Weakpoint Analysis": {
    "desc": "Decreases target blue (attack) die by one.",
    "color": "blue",
    "cost": 4,
    passive: function(player) { 
      if (player.batkGoal) {
        player.batkGoal -= 1 
      } else {
        player.batkGoal = 4;
      }
    }
  },
  "Drop Wall": {
    "desc": "Allows player to drop a wall on any space that a monster must destroy before moving to.",
    "color": "purple",
    "cost": 4,
    passive: function(player) { },
    active: function() {
      var player = this.player;
      var sprite = this.sprite;
      console.log(player);
      if (player.upgrades.indexOf("Drop Wall") > -1) {
        //buttonsList.splice(sprite,1)
        //sprite.deployed = true;
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
          var distanceTo = distance(spaceObjX,spaceObjY,sprite.x,sprite.y)
          if (distanceTo < closestDistance) {
            closestDistance = distanceTo;
            space = spaceObj;
            closestX = spaceObjX;
            closestY = spaceObjY;
          }
        }
        if (!player.wallDeployed) {
          sprite.kill();
          var wall = game.add.sprite(closestX, closestY, "dropwall");
          wall.anchor.setTo(.5);
          wall.inputEnabled = true;
          wall.input.enableDrag(true);
          wall.owner = player;
          player.wallDeployed = true;
        } else {
          var wall = sprite;
          wall.owner = player;
        }
        if ((space.wall || space.occupied) && this.spaceStart) {
          /*wall.destroy();
          var wall = game.add.sprite(changeValueScale(this.spaceStart.x), changeValueScale(this.spaceStart.y), "dropwall");
          wall.anchor.setTo(.5);
          wall.inputEnabled = true;
          wall.input.enableDrag(true);
          wall.owner = player;
          player.wallDeployed = true;*/
          wall.x = changeValueScale(this.spaceStart.x, "x");
          wall.y = changeValueScale(this.spaceStart.y, "y");
          console.log(wall);
          console.log(this.spaceStart);
          wall.events.onDragStop._bindings = [];
          wall.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: this.spaceStart, player: player, sprite: wall});
          return
        } else if ((space.wall || space.occupied) && !this.spaceStart) {
          wall.destroy();
          player.wallDeployed = false;
          console.log("wall destroyed");
          return
        } else if (this.spaceStart) {
          this.spaceStart.wall = false;
        }

        console.log(closestX + " " + closestY);
        wall.x = closestX;
        wall.y = closestY;
        wall.scale.setTo(1.5*globalScale);
        space.wall = wall;
        actionPoints -= 1;
        wall.events.onDragStop._bindings = [];
        wall.events.onDragStop.add(U["Drop Wall"].active, {spaceStart: space, player: player, sprite: wall});

      } else {
        console.log("Failed to build a wall.");
      }
    }
    },
    "Field Repair": {
      "desc": "Gain the ability to spend one action to repair one point of damage.\nHit the wait button after selecting this mech to activate.",
      "color": "yellow",
      "cost": 4,
      passive: function(player) {
        player.canRepair = true;
      }
    },
    "Autododge": {
    "desc": "Decreases target number to defend green die by one.",
    "color": "green",
    "cost": 4,
    passive: function(player) { 
        if (player.guarenteedDef) {
          player.defGoal -= 1 
        }   else {
          player.defGoal = 4;
        }
      }
    },
    "Monster Bait": {
    "desc": "Player attracts monsters from two spaces away instead of one.",
    "color": "black",
    "cost": 4,
    passive: function(player) { }
    },
    
    "Siege Mode": {
      "desc": "Once per round, while attacking, you can spend one green (defence) die to get one guarenteed hit.",
      "color": "red",
      "cost": 6,
      passive: function(player) { player.canSiege = true; }
    },

    "Weaponized Research": {
      "desc": "Up to three times per round, spend one research point to gain a die color of your choice.",
      "color": "blue",
      "cost": 6,
      passive: function(player) { player.weaponizedResearchCharges = 3; }
    }, 
  
    "Fortified Cities": {
      "desc": "Cities in this mech's home quadrant take two turns to destroy",
      "color": "purple",
      "cost": 6,
      passive: function(player) {
        var chr = String.fromCharCode(96 + player.sprite.number);
        console.log(chr + " is now fortified");
          fortifiedList.push(chr)
        console.log(fortifiedList);
      }
    },

    "Even More Armor": {
      "desc": "Increase current and max health by 2", 
      "color": "yellow",
      "cost": 6,
      passive: function(player) {
        player.maxhp += 2;
        player.hp += 2;
      }
    },

    "Emergency Jump Jets": {
      "desc": "When escaping combat, this mech can flee two spaces in any direction.\nYou may also spend an action point to return to any home quadrant city.",
      "color": "green",
      "cost": 6,
      passive: function(player) {
        
      }
    },

    "Chaos Systems": {
      "desc": "Up to twice per round, you may turn one dice from one color into one dice of another color.\nCannot turn dice that have already been rolled into another color.",
      "color": "black",
      "cost": 6,
      passive: function(player) {
      }
    },
    
    "Nullifier Shield": {
      "desc": "Ignore the first point of damage you take in a round.",
      "color": "yellow",
      "cost": 8,
      passive: function(player) {
        player.shields = true
      }
    },

    "Nullifier Shield Unlock": {
      "desc": "Regenerate one hp at the start of a round.",
      "color": "yellow",
      "cost": 3,
      "unlock": true,
      "unlockColor": "green",
      active: function(healing, stacks) {
        if (healing.hp < healing.maxhp) {
          healing.hp += stacks || 1;
          tweenTint(healing.sprite, 0xffffff, 0x98FB98, 500, true);
          //printBattleResults(healing.sprite.key + " regenerated " + (stacks || 1) + " hp.")
        }
      }
  },
  "Obliteration Ray": {
    "desc": "Spend an action to place an Obliteration Ray in an adjacent space.\nThis ray fires in a row after monsters spawn, dealing 3 defendable damage to anything in the row.",
    "color": "purple",
    "cost": 8
  },
  "Fusion Cannon": {
    "desc": "Spend an action to attack an adjacent monster with Red Die. This cannot cause counter damage.",
    "color": "red",
    "cost": 8
  }
}
