var Cell = {
  init: function(x, y, obsChance) {
    this.x = x;
    this.y = y;
    this.isObs = (helpers.randRange(0, 100) > (100 - obsChance)) ? true : false;
    // walls along the border
    if (this.x === 0 || this.y === 0 || this.x === Board.width - 1 || this.y === Board.height - 1) {
      this.isObs = true;
    }
    this.hasWeapon = false;
    this.weaponId;
    this.hasPlayer = false;
    this.playerId;
  },

  isClear: function() {
    if (!this.isObs && !this.hasPlayer) {
      return true;
    } else return false;
  },

  addPlayer: function(id) {
    this.playerId = id;
    this.hasPlayer = true;
  },

  removePlayer: function() {
    this.playerId = null;
    this.hasPlayer = false;
  }


}