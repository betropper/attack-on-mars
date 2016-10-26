var U = {
  "Electric Fists": {
    "desc": "Increases max red (attack) die by one.",
    "color": "red",
    "cost": 1,
    passive: function(player) { player.ratk += 1 }
  },
  "Bigger Fists": {
    "desc": "Increases max blue (attack) die by one.",
    "color": "blue",
    "cost": 1,
    passive: function(player) { player.batk += 1 }
  },
  "Mines": {
    "desc": "Allows player to set a mine that deals one damage to a single monster.",
    "color": "purple",
    "cost": 1,
    passive: function(player) { },
    active: function() {
      var player = this.player;
      console.log(player);
      if (player.upgrades.indexOf("Mines") > -1 && !Space[player.key].mine) {
        var mine = game.add.sprite(changeValueScale(player.space.x), changeValueScale(player.space.y), "mine");
        mine.anchor.setTo(.5);
        mine.scale.setTo(.7);
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
    "cost": 1,
    passive: function(player) { player.hp +=1; player.maxhp += 1; }
  },
  "5D Accelerators": {
    "desc": "Increases max green (defence) die by one.",
    "color": "green",
    "cost": 1,
    passive: function(player) { player.def += 1 }
  },
  "Hyper Caffeine": {
    "desc": "Gain one additional Research Point at the start of your turn.",
    "color": "black",
    "cost": 1,
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
    "cost": 2,
    passive: function(player) { 
      if (player.ratkDecrease) {
        player.ratkDecrease += 1 
      } else {
        player.ratkDecrease = 1;
      }
    }
  },
  "Weakpoint Analysis": {
    "desc": "Decreases target blue (attack) die by one.",
    "color": "blue",
    "cost": 2,
    passive: function(player) { 
      if (player.batkDecrease) {
        player.batkDecrease += 1 
      } else {
        player.batkDecrease = 1;
      }
    }
  },
  "Drop Wall": {
    "desc": "Allows player to drop a wall on a space that a monster must destroy before moving to.",
    "color": "purple",
    "cost": 2,
    passive: function(player) { },
    active: function() {
      var player = this.player;
      console.log(player);
      if (player.upgrades.indexOf("Drop Wall") > -1 && !Space[player.key].wall) {
        var wall = game.add.sprite(changeValueScale(player.space.x), changeValueScale(player.space.y), "dropwall");
        wall.anchor.setTo(.5);
        wall.scale.setTo(.6);
        Space[player.key].wall = wall;
        actionPoints -= 1;
      } else {
        console.log("Failed to build a wall.");
      }
    }
    },
    "Field Repair": {
      "desc": "Gain the ability to spend one action to repair one point of damage.\nHit the wait button after selecting this mech to activate.",
      "color": "yellow",
      "cost": 2,
      passive: function(player) {
        player.canRepair = true;
      }
    },
    "Autododge": {
    "desc": "Decreases target number of green die by one.",
    "color": "green",
    "cost": 2,
    passive: function(player) { 
        if (player.guarenteedDef) {
          player.guarenteedDef += 1 
        }   else {
          player.guarenteedDef = 1;
        }
      }
    },
    "Monster Bait": {
    "desc": "Player attracts monsters from two spaces away instead of one.",
    "color": "black",
    "cost": 2,
    passive: function(player) { }
    }

}
