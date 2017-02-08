var helpers = {
  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// cell.js


// board.js
var Board = {
  grid: [],
  width: 9,
  height: 9,
  obstacleChance: 15,

  // remplit le tableau d'instances de Cell
  fill: function() {
    for (var x = 0; x < this.width; x++) {
      this.grid.push([]);
      for (var y = 0; y < this.height; y++) {
        var cell = Object.create(Cell);
        cell.init(y, x, this.obstacleChance)
        this.grid[x].push(cell);
      }
    }
  },

  getEmptyCell: function() {
    var board = this;
    // position aléatoire jusqu'à trouver une case vide
    function randCell() {
      x = helpers.randRange(0, board.width - 1);
      y = helpers.randRange(0, board.height - 1);
      if (board.grid[x][y].isObs || board.grid[x][y].hasWeapon || board.grid[x][y].hasPlayer
      // pas de joueur autour, temporaire
      || board.grid[x + 1][y].hasPlayer
      || board.grid[x][y + 1].hasPlayer
      || board.grid[x - 1][y].hasPlayer
      || board.grid[x][y - 1].hasPlayer
      ) {
        randCell();
      }
    }
    randCell();
    return board.grid[x][y];
  },

  placeWeapons: function() {
    for (var i = 1; i < Game.weapons.length; i++) {
      var cell = this.getEmptyCell();
      cell.hasWeapon = true;
      cell.weapon = Game.weapons[i];
    }
  },

  placePlayers: function() {
    for (var i = 0; i < Game.playersNb; i++) {
      var cell = this.getEmptyCell();
      cell.hasPlayer = true;
      cell.player = Game.players[i];
      cell.player.x = cell.x;
      cell.player.y = cell.y;
    }
  },

  moveCoords: function(direction, x, y, steps) {
    if (direction === "N") {
      return [x, (y - steps)];
    } else if (direction === "E") {
      return [(x + steps), y];
    } else if (direction === "S") {
      return [x, (y + steps)];
    } else {
      return [(x - steps), y];
    }
  },

  render: function(table) {
    for (var i = 0; i < this.width; i++) {
      // colonnes, position x en id
      table.append(`<tr id="${i}"></tr>`);
      for (var j = 0; j < this.height; j++) {
        var currentRow = `tr[id="${i}"]`;
        var currentCell = this.grid[i][j];
        var imgUrl;
        if (currentCell.hasPlayer) {
          imgUrl = `img/player${currentCell.player.id + 1}.png`;
        } else if (currentCell.isObs) {
          imgUrl = 'img/obstacle.png';
        }
        else if (currentCell.hasWeapon) {
          imgUrl = `img/weapon${currentCell.weapon.id}.png`;
        } else {
          imgUrl = 'img/empty.png';
        }

        var cell = `<td><img src="${imgUrl}"/></td>`;
        $(currentRow).append(cell);
      }
    }
  },
  //testing
  renderMoves: function() {
    var moves = Game.players[0].getAvailableMoves();
    var table = $('#board')[0];
    for (var i = 0; i < moves.length; i++) {
      var cell = table.rows[moves[i][1]].cells[moves[i][0]];
      var $cell = $(cell);
      $cell.append('<img src="img/test.png"/>');
    }
  }
}