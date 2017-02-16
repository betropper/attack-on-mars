
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

var Pilots = { 
  "Bounty Hunter": {
    "desc": "Gain two additional Research Points for each monster you defeat outside of your home quadrant.",
    passive: function(player) {
    }
  },
  "Teen Prodigy": {
    "desc": "When at two or less health, deal one extra damage whenever you deal one or more damage. When at one health, reduce all target dice numbers by one.",
    passive: function(player) {
      if (player.hp <= 2) {
        printBattleResults("The Teen Prodigy " + player.sprite.key.capitalizeFirstLetter() + " Mecha dealt 1 extra damage for hitting at low health!");
        return 1;
      } else {
        return 0;
      }
    },
    active: function(player) {
      if (!player.truePower) {
        player.truePower = true;
        MU["Dice Target +#"].active(player,"Red Target",-1);
        MU["Dice Target +#"].active(player,"Blue Target",-1);
        MU["Dice Target +#"].active(player,"Defense Target",-1);
        printBattleResults("The Teen Prodigy " + player.sprite.key.capitalizeFirstLetter() + " Mecha's targets are boosted for being at death's door!");
      }
    }
  },
  "Co-ordinator": {
      "desc": "When in the same quadrant as another Mecha, all Mecha in that quadrant gain one die of each die type.",
      passive: function(player) {
        for (i = 1; i < playersList.length; i++) {
          if (playersList[i].pilot === "Co-ordinator" && playersList[i].key.charAt(0) === player.key.charAt(0) && playersList[i].sprite.key != player.sprite.key) {
          printBattleResults("The Co-ordinator " + playersList[i].sprite.key.capitalizeFirstLetter() + " Mech is boosting the fighting " + player.sprite.key.capitalizeFirstLetter() + " Mech!");
          player.def++
          player.batk++
          player.ratk++
          if (player.changedDie) {
            player.changedDie.push({value:"def", count:1});
            player.changedDie.push({value:"batk", count:1});
            player.changedDie.push({value:"ratk", count:1});
          } else {
            player.changedDie = [{value:"def", count:1},{value:"batk", count:1},{value:"ratk", count:1}];
          }
          break
          } 
        }
      }
    },
    "Media Star": {
      "desc": "Once per turn, for one action, drag all Monsters within three spaces one space closer to the mecha.",
      active: function(player) {       
      }
    },
    "Profiteer": {
      "desc": "Sell Monster Resources for three Research Points"
    },
    "Engineer": {
      "desc": "You may spend one action to restore one health. This increases to two health if the mecha has the Field Repair upgrade.",
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
      passive: function(player) { player.weaponizedResearchCharges = 3; },
      active: function(player) {
        if (battlePlayer.rp > 0) {
          var player = this.player || player;
          var value = this.value;
          player.rp--
          this.display.update(player);
          player[value]++
          if (player.changedDie) {
            player.changedDie.push({value:value, count:1});
          } else {
            player.changedDie = [{value:value, count:1}];
          }
          player.weaponizedResearchCharges--;
          for (i = 0; i < battleTexts.length; i++) {
            if (battleTexts[i].text.indexOf("Wp Rsrch:") === 0) {
              if (player.weaponizedResearchCharges <= 0) {
                battleTexts[i].destroy();
                returnToBattle(this.display);
              } else {
                battleTexts[i].text = ("Wp Rsrch: " + player.weaponizedResearchCharges);
              }
            }
          }

        } else { return }
      }
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
      passive: function(player) { },
      active: function(player) {
        zoomOut = true;
        for (i = 0; i < battleTexts.length; i++) {
          battleTexts[i].kill();
        }
        player.sprite.closestSpaces = getClosestSpaces(player.key);
        var availableSpaces = player.sprite.closestSpaces.keys;
        //Finds the closest spaces from two spaces away in case of
        //monster bait upgrade
        var twoAwayList = [];
        for (m = 0; m < player.sprite.closestSpaces.keys.length; m++) {
            //monstersList[i].sprite.closestSpaces.selectedSpaces[m].closestSpaces = getClosestSpaces(monstersList[i].sprite.closestSpaces.keys[m]) 
            var checkKeys = getClosestSpaces(player.sprite.closestSpaces.keys[m]).keys;
            for (l = 0; l < checkKeys.length; l++) {
              checkKeys[l] = {key: checkKeys[l], parent: player.sprite.closestSpaces.keys[m]}
              twoAwayList.push(checkKeys[l]);
            }
          }
        twoAwayList.forEach(function(i) {
          if (availableSpaces.indexOf(i.key) === -1) {
            availableSpaces.push(i.key);
          }
        });
        heldSprite = player.sprite;
        disableHover(player.sprite);
        //player.space.occupied = removeFromList(player,player.space);
        player.sprite.inputEnabled = true
        spaceKey = getClosestByDistance(player).spaceKey;
        console.log(spaceKey);
        player.sprite.events.onInputUp._bindings = [];
        player.sprite.events.onInputUp.add(move,{object:player,destination:spaceKey,escaping:"running",method:"Emergency Jump Jets",list:availableSpaces});
       return 
      }
    },

    "Chaos Systems": {
      "desc": "Up to twice per round, you may turn one dice from one color into one dice of another color.\nCannot turn dice that have already been rolled into another color.",
      "color": "black",
      "cost": 6,
      "allowsReroll": true,
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
  "Obliteration Ray Unlock": {
    "desc": "Increses the max capacity of the Mecha for all equipment by one.",
    "color": "purple",
    "unlock": true,
    "unlockColor": "purple",
    "cost": 3
  },
  "Fusion Cannon": {
    "desc": "Spend an action to attack an adjacent monster with Red Die. This cannot cause counter damage.",
    "color": "red",
    "cost": 8,
    active: function() {
      console.log("Select a monster to attack.");
      fusionButton.activated = true;
      var foundMonsters = [];
      if (!game.coverbg) {
        game.coverbg = game.add.sprite(game.bg.width, 0, 'blackground');
        game.coverbg.width = game.width - game.bg.width;
        game.coverbg.height = game.height;
        game.coverbg.text = game.add.text(game.coverbg.x + game.coverbg.width/2, game.coverbg.y + game.coverbg.height/2,"Select an adjacent monster to use the Fusion Cannon on.\nHit the Fusion Cannon button again to cancel.",C.game.textStyle);
        game.coverbg.text.anchor.setTo(.5);
        game.coverbg.alpha = 0;
        game.coverbg.text.alpha = 0;
      } else {
        game.coverbg.text.text = "Select an adjacent monster to use the Fusion Cannon on.\nHit the Fusion Cannon button again to cancel.";
      }
      game.add.tween(game.coverbg).to( { alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
      game.add.tween(game.coverbg.text).to( { alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
      game.world.bringToTop(fusionButton);
      game.world.bringToTop(game.coverbg.text);
      var disabledInputs = [];
      for (var i = 0; i < game.world.children.length; i++) {
        if (game.world.children[i].inputEnabled) {
          disabledInputs.push(game.world.children[i]);
          game.world.children[i].inputEnabled = null;
        } 
      }
      console.log(disabledInputs);
      for (y = 0; y < this.player.sprite.closestSpaces.selectedSpaces.length; y++) {
        if (this.player.sprite.closestSpaces.selectedSpaces[y].occupied) {
          var len = this.player.sprite.closestSpaces.selectedSpaces[y].occupied.length;
        } else {
          var len = 0;
        }
        for (o = 0; o < len; o++) {
          if (monstersList.indexOf(this.player.sprite.closestSpaces.selectedSpaces[y].occupied[o]) > -1) {
            var foundMonster = this.player.sprite.closestSpaces.selectedSpaces[y].occupied[o];  
            foundMonster.sprite.inputEnabled = true;
            foundMonsters.push(foundMonster);
            foundMonster.sprite.events.onInputDown.add(function() {
              console.log(this.monster);
              tweenTint(this.monster.sprite, 0xffffff, 0xef0202, 100, true);
              this.monster.scale = C.mech.scale;
              var rhits = rollDie(this.player.ratk - (this.monster.ratkDecrease || 0), this.player.ratkGoal || 5);
              var defences = rollDie(this.monster.def, this.monster.defGoal || 5);
              var successes = rhits.hits - defences.hits;
              if (successes > 0) {
                this.monster.hp -= successes; 
              game.coverbg.text.text = this.player.sprite.key.capitalizeFirstLetter() + " fired and rolled " + rhits.results.join(", ") + ".\nMonster rolled " + defences.results.join(", ") + ".\n" + successes + " damage done.\nHit the Fusion Cannon button again to return."
              } else {
              game.coverbg.text.text = this.player.sprite.key.capitalizeFirstLetter() + " fired and rolled " + rhits.results.join(", ") + ".\nMonster rolled " + defences.results.join(", ") + ".\nNo damage done.\nHit the Fusion Cannon button again to return."
              }
              if (this.monster.hp <= 0) {
                this.monster.space.occupied = removeFromList(monstersList[monstersList.indexOf(this.monster)], this.monster.space);
                this.player.rp += this.monster.rp;
                if (this.player.pilot === "Bounty Hunter") {
                  var chr = String.fromCharCode(96 + this.player.sprite.number);
                  if (destination.charAt(0) !== chr) {
                    this.player.rp += 2;
                  }
                }
                this.player.mr += this.monster.mr;
              } 
              if (actionPoints <= 1 || this.monster.hp <= 0) {
                U["Fusion Cannon"].end(this.player, this.disabledInputs, this.foundMonsters)
              }
              actionPoints -= 1;
            }, {player: this.player, monster: foundMonster, disabledInputs: disabledInputs, foundMonsters: foundMonsters});
          }
        }
      }
      fusionButton.inputEnabled = true;
      fusionButton.events.onInputDown._bindings = [];
      fusionButton.events.onInputDown.add(U["Fusion Cannon"].end, {disabledInputs: disabledInputs, player: this.player, foundMonsters: foundMonsters});
    },
    end: function(player, disabledInputs, foundMonsters) {
        var player = this.player || player;
        var disabledInputs = this.disabledInputs || disabledInputs;
        var foundMonsters = this.foundMonsters || foundMonsters;
        for (i = 0; i < disabledInputs.length; i++) {
          disabledInputs[i].inputEnabled = true;
        }
        for (i = 0; i < foundMonsters.length; i++) {
          if (foundMonsters[i] && foundMonsters[i].hp > 0) {
            foundMonsters[i].sprite.events.onInputDown._bindings = [];
            foundMonsters[i].sprite.events.onInputDown.add(setLastClicked, {lastClicked:foundMonsters[i].sprite});
            foundMonsters[i].sprite.events.onInputDown.add(hoverScale, {sprite:foundMonsters[i].sprite});
          } else if (foundMonsters[i].sprite) {
            monstersList.splice(monstersList.indexOf(foundMonsters[i]), 1);
            foundMonsters[i].sprite.destroy();
          }
        }
        game.coverbg.alpha = 0;
        game.coverbg.text.alpha = 0;
        fusionButton.activated = false;
        fusionButton.events.onInputDown._bindings = [];
        fusionButton.events.onInputDown.add(U["Fusion Cannon"].active, {player: this.player});
      }
  },
  "Fusion Cannon Unlock": {
    "desc": "Increses Fusion Cannon range to two spaces.",
    "color": "red",
    "unlock": true,
    "unlockColor": "purple",
    "cost": 3
  },
  "The Payload": {
    "desc": "If this Mecha hits 0 health, roll its max health against the monster that killed\nit as an attack, target number 4.",
    "color": "black",
    "cost": 8
  },
  "The Payload Unlock": {
    "desc": "Once per round, you may spend one health for an automatic success.",
    "color": "black",
    "unlock": true,
    "unlockColor": "red",
    "cost": 3
  },
  "Super Go Fast": {
    "desc": "Spend an action to move two spaces in any direction",
    "color": "green",
    "cost": 8
  },
  "Super Go Fast Unlock": {
    "desc": "Reduces green (defence) dice target number by one.",
    "color": "green",
    "unlock": true,
    "unlockColor": "black",
    "cost": 3
  },
  "Mind-Machine Interface": {
    "desc": "This mech may re-roll all missed Blue Attack die once per round.",
    "color": "blue",
    "cost": 8,
    "allowsReroll": true,
    passive: function(player) {
      player.canReroll = true;
    },
    active: function() {
      var player = this.attacker;
      console.log("Chose the Mind Machine Interface.")
      for (i = 0; i < rerollTexts.length; i++) {
          rerollTexts[i].destroy();
      }
      rerollTexts = [];
      if (battleTurn == battlePlayer) {
        for (i = 0; i < battleTexts.length; i++) {
            battleTexts[i].revive();
        }
      } else if (monsterAttackButton && !monsterAttackButton.alive) {
        monsterAttackButton.disabled = false;
      }

    }
  },
  "Mind-Machine Interface Unlock": {
    "desc": "This mech may spend 4 MR once per round to re-roll all missed die.",
    "color": "blue",
    "unlock": true,
    "unlockColor": "yellow",
    "allowsReroll": true,
    "cost": 3
  }
}
