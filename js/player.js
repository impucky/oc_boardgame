var Player = {
  init: function(id, weapon) {
    this.id = id;
    this.weapon = weapon;
    this.x;
    this.y;
  },
  // returns an array of coords the player can move to
  getAvailableMoves: function() {
    var directions = ['N', 'E', 'S', 'W'];
    var moves = []
    for (var dir = 0; dir < directions.length; dir++) {
      for (var step = 1; step <= 3; step++) {
        var target = Board.moveCoords(directions[dir], this.x, this.y, step);
        var targetCell = Board.grid[target[1]][target[0]];
        if (targetCell.isClear()) {
          moves.push(target);
        } else break;
      }
    }
    return moves;
  },
  movePlayer: function() {

  }
}