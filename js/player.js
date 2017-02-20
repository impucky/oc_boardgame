var Player = {
  init: function(id, weapon, hp) {
    this.id = id;
    this.weapon = weapon;
    this.hp = hp;
    this.isMoving = false;
    this.x;
    this.y;
  },

  getAvailableMoves: function() {
    var directions = ['N', 'E', 'S', 'W'];
    var moves = []
    for (var dir = 0; dir < directions.length; dir++) {
      for (var step = 1; step <= 3; step++) {
        var target = Board.moveCoords(directions[dir], this.x, this.y, step);
        var targetCell = Board.grid[target.y][target.x];
        if (targetCell.isClear()) {
          moves.push(target);
        } else break;
      }
    }
    return moves;
  },

  move: function(x, y) {
    var player = this;
    var originCell = Board.grid[player.y][player.x];
    var targetCell = Board.grid[y][x];
    var dir;
    var steps;

    if (originCell.x < targetCell.x) {
      dir = 'E';
      steps = targetCell.x - originCell.x;
    } else if (originCell.x > targetCell.x) {
      dir = 'W';
      steps = originCell.x - targetCell.x;
    } else if (originCell.y > targetCell.y) {
      dir = 'N';
      steps = originCell.y - targetCell.y;
    } else if (originCell.y < targetCell.y) {
      dir = 'S';
      steps = targetCell.y - originCell.y;
    }

    var moveInterval = setInterval(function() {

      var currentCell = Board.grid[player.y][player.x]
      var newCoords = Board.moveCoords(dir, player.x, player.y, 1);
      var newCell = Board.grid[newCoords.y][newCoords.x];

      currentCell.removePlayer();
      newCell.addPlayer(player.id);

      // pickup weapon
      if (newCell.hasWeapon) {
        var oldWeapon = player.weapon.id;
        player.weapon = Game.weapons[newCell.weaponId];
        newCell.weaponId = oldWeapon;
      }

      player.x = newCoords.x;
      player.y = newCoords.y;
      Board.render();
      steps --;

      if (steps === 0) {
        clearInterval(moveInterval);
        player.isMoving = false;
        Game.currentTurn = (Game.currentTurn === 0) ? 1 : 0;
        Board.renderMoves();
      }

    }, 300);

  }
}