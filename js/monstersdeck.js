var MonstersDeck = {
 "initialMonsters": [
   {
   "batk": 2,
   "def": 2,
   "hp": 4,
   "upgrades": ["Poison Aura","-1 Mech Def"]
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
   "upgrades": ["-1 Mech Def"]
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
   }
 ],
 "extinctionMonsters": [
   {
   "batk": 8,
   "def": 4,
   "hp": 5,
   "upgrades": ["-1 Mech Blue Attack"]
   }

 ],
 "bossMonsters": [
   {
    "name": "The Bloat",
    "file": "assets/bloat.jpg",
    "batk": 9,
    "def": 7,
    "hp": 6,
    "upgrades": ["-1 Monster Target Attack", "-1 Monster Target Defense", "+1 Mecha Target Blue", "+1 Mecha Target Red", "+1 Mecha Target Green"]
   }
  ]

}


var MU = {
  "Feign Death": {
    "desc": "After a monster is first reduced below 1 hp, it is restored to 1 hp.",
    "cost": 2,
    passive: function(monster) { 
      monster.feigned = false;
    },
    active: function(monster) {
      var feignTween = game.add.tween(monster.sprite).to( { alpha: .3 }, 700, Phaser.Easing.Linear.None, true);
      feignTween.onComplete.add(MU["Feign Death"].revive, {monster:monster});
      battleTurn = battlePlayer;
      battlePlayer.inputEnabled = false;
    },
    revive: function(monster) {
      monster = this.monster || monster;
      var feignTween = game.add.tween(monster.sprite).to( { alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
      printBattleResults(monster.sprite.key + " feigned its death!");
      monster.hp = 1;
      monster.feigned = true;
      battlePlayer.inputEnabled = true;
      battleTurn = battleMonster;
    }
  },
  "Poison Aura": {
    "desc": "Both Monster and Mech suffer 1 point of damage after combat",
    "cost": 1,
    active(attacker,defender,stacks) {
      attacker.hp -= stacks || 1;
      defender.hp -= stacks || 1;
      printBattleResults(attacker.sprite.key + " poisoned itself and " + defender.sprite.key + " for " + (stacks || 1) + " damage!");
    }
  },
  "Regeneration": {
    "desc": "Before attacking, this monster regenerates 1 hp.",
    "cost": 4,
    active: function(healing, stacks) {
      if (healing.hp > healing.maxhp) {
        healing.hp += stacks || 1;
        printBattleResults(monster.sprite.key + " regenerated " + (stacks || 1) + " hp.")
      }
    }
  },
  "First Attack": {
    "desc": "This monster always attacks first when combat is initiated.",
    "cost": 2,
    }
  
}
