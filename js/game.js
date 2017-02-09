var Game = {
  currentTurn: 0,
  playersNb: 2,
  players: [],
  playerSprites: {
    0: 'img/player1.png',
    1: 'img/player2.png'
  },
  weapons: [
    {id: 0, name: "Dagger",dmg: 10},
    {id: 1, name: "Longsword", dmg: 20},
    {id: 2, name: "Hammer", dmg: 25},
    {id: 3, name: "Axe", dmg: 20},
    {id: 4, name: "Rolling Pin", dmg: 30}
  ],
  weaponSprites: {
    0: "img/weapon0.png",
    1: "img/weapon1.png"
  },
  initWeapons: function() {
    this.weapons.map(function(el) {
      el = Object.create(Weapon);
      el.init(el.id, el.name, el.dmg);
    });
  },

  initPlayers: function() {
    for (var i = 0; i < this.playersNb; i++) {
      var player = Object.create(Player);
      player.init(i, this.weapons[0]);
      this.players.push(player);
    }
  },

  startGame: function() {
    this.initWeapons();
    this.initPlayers()
    Board.fill();
    Board.placeWeapons();
    Board.placePlayers();
    Board.render();
  }
}

$(document).ready(function() {
  Game.startGame();
  Board.renderMoves();
});