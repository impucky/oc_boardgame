var Player = {
  init: function(id, weapon) {
    this.id = id;
    this.weapon = weapon;
  }
}

var player1 = Object.create(Player);
Player.initPlayer = function(id) {
  this.init(1);
}

var player2 = Object.create(Player);
Player.initPlayer = function(id) {
  this.init(2);
}