var U = {
  "Electric Fists": {
    "desc": "Increases max red (attack) die by one.",
    passive: function(player) { player.ratk += 1 }
  },
  "Bigger Fists": {
    "desc": "Increases max blue (attack) die by one.",
    passive: function(player) { player.batk += 1 }
  },
  "Mines": {
    "desc": "Allows player to set a mine that deals one damage to a single monster.",
    passive: function(player) { player.canBuildMines = true },
    active: function(player) {
      if (player.canBuildMines && !Space[player.key].mine) {
        var mine = game.add.sprite(changeValueScale(player.space.x), changeValueScale(player.space.y), "mine");
        Space[player.key].mine = mine;
        actionPoints -= 1;
      }
    }
  }


}
