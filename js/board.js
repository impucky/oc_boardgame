var helpers = {
  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

var Board = {
  grid: [],
  width: 17,
  height: 17,
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
    return Board.grid[x][y];
  },

  placeWeapons: function() {
    for (var i = 1; i < Game.weapons.length; i++) {
      var cell = this.getEmptyCell();
      //
      cell.hasWeapon = true;
      cell.weaponId = Game.weapons[i].id;
    }
  },

  placePlayers: function() {
    for (var i = 0; i < Game.playersNb; i++) {
      var cell = this.getEmptyCell();
      cell.hasPlayer = true;
      cell.playerId = i;
      Game.players[i].x = cell.x;
      Game.players[i].y = cell.y;
    }
  },

  moveCoords: function(direction, x, y, steps) {
    var target = {x: x, y: y};
    if (direction === "N") {
      target.y -= steps;
      return target;
    } else if (direction === "E") {
      target.x += steps;
      return target;
    } else if (direction === "S") {
      target.y += steps;
      return target;
    } else {
      target.x -= steps;
      return target;
    }
  },

  render: function(table) {
    var table = $('#board');
    table.html('');
    for (var i = 0; i < this.width; i++) {
      // colonnes, position x en id
      table.append(`<tr id="${i}"></tr>`);
      for (var j = 0; j < this.height; j++) {
        var currentRow = `tr[id="${i}"]`;
        var currentCell = this.grid[i][j];
        var imgUrl;

        if (currentCell.hasPlayer) {
          imgUrl = `img/player${currentCell.playerId + 1}.png`;
        } else if (currentCell.isObs) {
          imgUrl = 'img/obstacle.png';
        }
        else if (currentCell.hasWeapon) {
          imgUrl = `img/weapon${currentCell.weaponId}.png`;
        } else {
          imgUrl = 'img/empty.png';
        }
        // remplacer id par data attr. pour stocker les coords?
        var cell = `<td class="cell" data-x="${j}" data-y="${i}"><img src="${imgUrl}"/></td>`;
        $(currentRow).append(cell);
      }
    }
    $('.cell').click(Board.handleCellClick);
    $('.cell').hover(Board.handleCellHover);

    // interface - a séparer
    var ui = $('#ui-left');
    ui.html('<h3>Player 1</h3>Weapon: ' + Game.players[0].weapon.name
      + '<h3>Player 2</h3>Weapon: ' + Game.players[1].weapon.name
    );

  },

  handleCellClick: function() {
    var coords = $(this).data();
    var targetCell = Board.grid[coords.y][coords.x];
    var canMoveTo = ($(this).children('.cell-move').length === 1) ? true : false;

    if (!Game.inBattle && canMoveTo) {
      Game.players[Game.currentTurn].movePlayer(targetCell.x, targetCell.y)
    }

  },

  handleCellHover: function() {
    var debug = $('#debug');
    var coords = $(this).data();
    var cell = Board.grid[coords.y][coords.x];
    var message = 'Cell at ' + coords.x + ' ' + coords.y;
    if (cell.isObs) {
      message += '<br>Obstacle'
    } else if (cell.hasWeapon) {
      message += '<br>Weapon: ' + Game.weapons[cell.weaponId].name;
    } else if (cell.hasPlayer) {
      message += '<br>Player' + cell.playerId;
    }
    debug.html(message);
  },

  //testing
  renderMoves: function() {
    var moves = Game.players[Game.currentTurn].getAvailableMoves();
    var table = $('#board')[0];
    for (var i = 0; i < moves.length; i++) {
      var tableCell = table.rows[moves[i].y].cells[moves[i].x];
      var $tableCell = $(tableCell);

      $tableCell.append('<img class="cell-move" src="img/move.png"/>');
    }
  }
}