var MonstersDeck = {
 "initialMonsters": [
   {
   "batk": 2,
   "def": 2,
   "hp": 4,
   "upgrades": ["Poison Aura","-1 Mech Defense"]
   },
   {
   "batk": 4,
   "def": 2,
   "hp": 1,
   "upgrades": ["Feign Death","-1 Mech Red Attack"]
   },

   {
   "batk": 2,
   "def": 4,
   "hp": 1,
   "upgrades": ["Feign Death","-1 Mech Blue Attack"]
   },

   {
   "batk": 4,
   "def": 1,
   "hp": 1,
   "upgrades": ["First Attack"]
   },

   {
   "batk": 4,
   "def": 1,
   "hp": 1,
   "upgrades": ["First Attack"]
   },

   {
   "batk": 4,
   "def": 1,
   "hp": 1,
   "upgrades": ["First Attack"]
   },

   {
   "batk": 3,
   "def": 2,
   "hp": 4,
   "upgrades": ["-1 Mech Red Attack"]
   },
    
   {
   "batk": 4,
   "def": 2,
   "hp": 3,
   "upgrades": ["-1 Mech Defense"]
   },

   {
   "batk": 4,
   "def": 3,
   "hp": 1,
   "upgrades": ["-1 Mech Blue Attack"]
   },

  {
   "batk": 4,
   "def": 4,
   "hp": 2,
   "upgrades": []
  },

  {
   "batk": 3,
   "def": 4,
   "hp": 3,
   "upgrades": []
  },

  {
   "batk": 3,
   "def": 3,
   "hp": 4,
   "upgrades": []
  }
 ],
 "growingMonsters": [
   {
   "batk": 4,
   "def": 4,
   "hp": 4,
   "upgrades": ["Regeneration","Poison Aura"]
   },
   {
   "batk": 4,
   "def": 4,
   "hp": 4,
   "upgrades": ["Regeneration","Poison Aura"]
   },
   {
   "batk": 6,
   "def": 5,
   "hp": 4,
   "upgrades": ["Feign Death"]
   },
   {
   "batk": 6,
   "def": 4,
   "hp": 3,
   "upgrades": ["First Attack"]
   },
   {
   "batk": 6,
   "def": 3,
   "hp": 4,
   "upgrades": ["First Attack"]
   },
   {
   "batk": 6,
   "def": 6,
   "hp": 3,
   "upgrades": ["Feign Death"]
   },
   {
   "batk": 5,
   "def": 5,
   "hp": 4,
   "upgrades": ["+1 Mecha Red Target"]
   },
   {
   "batk": 4,
   "def": 4,
   "hp": 6,
   "upgrades": ["+1 Mecha Defense Target"]
   },
   {
   "batk": 5,
   "def": 5,
   "hp": 4,
   "upgrades": ["+1 Mecha Blue Target"]
   },
   {
   "batk": 6,
   "def": 4,
   "hp": 3,
   "batkGoal": 4,
   "defGoal": 4,
   "upgrades": ["-1 Monster Target Attack", "-1 Monster Target Defense"]
   },
   {
   "batk": 6,
   "def": 3,
   "hp": 4,
   "batkGoal": 4,
   "defGoal": 4,
   "upgrades": ["-1 Monster Target Attack", "-1 Monster Target Defense"]
   },
 ],
 "extinctionMonsters": [
   {
   "batk": 8,
   "def": 4,
   "hp": 5,
   "upgrades": ["-1 Mech Blue Attack"]
   },
   {
   "batk": 8,
   "def": 5,
   "hp": 4,
   "upgrades": ["-1 Mech Red Attack"]
   },
   {
   "batk": 7,
   "def": 4,
   "hp": 3,
   "upgrades": ["-2 Mech Defense", "Feign Death"]
   },
   {
   "batk": 6,
   "def": 4,
   "hp": 4,
   "upgrades": ["-2 Mech Red Attack", "-2 Mech Blue Attack"]
   },
   {
   "batk": 6,
   "def": 5,
   "hp": 4,
   "upgrades": ["+1 Mecha Blue Target"]
   },
   {
   "batk": 6,
   "def": 4,
   "hp": 5,
   "upgrades": ["+1 Mecha Red Target"]
   },
   {
   "batk": 6,
   "def": 4,
   "hp": 6,
   "upgrades": ["Poison Aura", "Poison Aura"]
   },
   {
   "batk": 7,
   "def": 3,
   "hp": 4,
   "upgrades": ["Reroll Red"]
   },
   {
   "batk": 6,
   "def": 5,
   "hp": 3,
   "upgrades": ["Reroll Def"]
   },
   {
   "batk": 7,
   "def": 4,
   "hp": 4,
   "upgrades": ["Feign Death"]
   },
   {
   "batk": 7,
   "def": 5,
   "hp": 4,
   "upgrades": ["Feign Death"]
   },
   {
   "batk": 7,
   "def": 4,
   "hp": 5,
   "upgrades": ["Feign Death"]
   }
 ],
 "bossMonsters": [
   {
    "name": "The Bloat",
    "file": "assets/bloat.jpg",
    "batk": 9,
    "def": 7,
    "hp": 6,
    "batkGoal": 4,
    "defGoal": 4,
    "upgrades": ["-1 Monster Blue Target", "-1 Monster Defense Target", "+1 Mecha Blue Target", "+1 Mecha Red Target", "+1 Mecha Defense Target"]
   }
  ]

}


var MU = {
  "Feign Death": {
    "desc": "After a monster is first \n reduced below 1 hp,  \n it is restored to 1 hp.",
    "cost": 2,
    passive: function(monster) { 
      monster.feigned = false;
    },
    active: function(monster) {
      for (i = 0; i < resultsList.length; i++) {
        if (resultsList[i].rerollButton) {
          resultsList[i].rerollButton.destroy();
          resultsList[i].rerollText.destroy();
        }
      }
      var feignTween = game.add.tween(monster.sprite).to( { alpha: .3 }, 700, Phaser.Easing.Linear.None, true);
      feignTween.onComplete.add(MU["Feign Death"].revive, {monster:monster});
      battleTurn = battlePlayer;
      battlePlayer.inputEnabled = false;
      game.input.enabled = false;
    },
    revive: function(monster) {
      monster = this.monster || monster;
      var feignTween = game.add.tween(monster.sprite).to( { alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
      printBattleResults("The monster feigned its death!");
      monster.hp = 1;
      monster.feigned = true;
      battlePlayer.inputEnabled = true;
      battleTurn = battleMonster;
      game.input.enabled = true;
    }
  },
  "Poison Aura": {
    "desc": "Both Monster and Mech suffer 1 point of damage after combat",
    "cost": 1,
    active(attacker,defender,stacks) {
      var attackerDamage = stacks;
      var defenderDamage = shieldDamage(defender,stacks);
      attacker.hp -= attackerDamage
      defender.hp -= defenderDamage;
      if (attackerDamage === defenderDamage) {
        printBattleResults(attacker.sprite.key + " poisoned itself and " + defender.sprite.key + " for " + (stacks || 1) + " damage.");
      } else {
        printBattleResults(attacker.sprite.key + " poisoned itself for " + attackerDamage + " damage, and " + defender.sprite.key + " for " + defenderDamage + " damage.");
      }
    }
  },
  "Regeneration": {
    "desc": "Before attacking, this monster regenerates 1 hp.",
    "cost": 4,
    active: function(healing, stacks) {
      if (healing.hp < healing.maxhp) {
        healing.hp += stacks || 1;
        tweenTint(healing.sprite, 0xffffff, 0x98FB98, 500, true);
        printBattleResults(healing.sprite.key + " regenerated " + (stacks || 1) + " hp.")
      }
    }
  },
  "First Attack": {
    "desc": "This monster always attacks first when combat is initiated.",
    "cost": 2,
    },
  "Dice -#": {
    "desc": "The Mecha fighting this monster has less die from the listed pool",
    "cost": 2,
    active: function(mech,pool,amount) {
      console.log(mech + pool + amount);
      var playerDie = {
        "Blue Attack": "batk",
        "Red Attack": "ratk",
        "Defense": "def"
      };
      if (mech[playerDie[pool]] > 0) {
        console.log(mech[playerDie[pool]]);
        mech[playerDie[pool]] -= amount;
        console.log("DRAINED");
        if (mech.tempStolen) {
          mech.tempStolen.push({pool: pool, amount: amount});
        } else {
          mech.tempStolen = [{pool: pool, amount: amount}];
        }
      }
    },
    returnStolen: function(mech,pool,amount) {
      var playerDie = {
        "Blue Attack": "batk",
        "Red Attack": "ratk",
        "Defense": "def"
      };
      mech[playerDie[pool]] += amount;
      mech.tempStolen.splice({pool: pool, amount: amount},1);
    }
  },
  "Dice Target +#": {
    "desc": "The Mecha fighting this monster has to hit a higher target goal",
    "cost": 2,
    active: function(mech,pool,amount) {
      console.log(mech + pool + amount);
      var playerDie = {
        "Blue Target": "batkGoal",
        "Red Target": "ratkGoal",
        "Defense Target": "defGoal"
      };
      if (mech[playerDie[pool]] > 0) {
        console.log(mech[playerDie[pool]]);
        mech[playerDie[pool]] += amount;
        console.log("GOAL CHANGED");
        if (mech.tempStolen) {
          mech.tempStolen.push({pool: pool, amount: -amount});
        } else {
          mech.tempStolen = [{pool: pool, amount: -amount}];
        }
      }
      for (i = 0; i < playerBattleTexts.length; i++) {
        playerBattleTexts[i].update();
      }
    },
    returnStolen: function(mech,pool,amount) {
      var playerDie = {
        "Blue Target": "batkGoal",
        "Red Target": "ratkGoal",
        "Defense Target": "defGoal"
      };
      mech[playerDie[pool]] -= amount;
      mech.tempStolen.splice({pool: pool, amount: amount},1);
    }
  }
}
