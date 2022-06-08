const gameBoard = (() => {
  let _tiles = [[], [], []];
  let _currentTile = 0;

  const getTiles = () => _tiles;
  const addTile = tile => {
    _tiles[Math.floor(_currentTile / 3)].push(tile);
    _currentTile++;
  }

  return { getTiles, addTile };
})();

const Tile = element => {
  let _state = '';
  const _element = element;
  let _marked = false;

  const getState = () => _state;

  const setState = state => {
    _state = state;
    _element.textContent = _state;
  };

  const mark = () => {
    if (_marked || game.isOver()) {
      return;
    }

    if (!game.isRunning()) {
      alert('Press the START button.');
      return;
    }

    setState(game.getCurrentPlayer().getMark());
    _marked = true;
    game.nextTurn();
  };

  _element.addEventListener('click', mark);

  const reset = () => {
    _state = '';
    _element.textContent = '';
    _marked = false;
  };

  return { getState, setState, reset, mark };
};

const Player = (mark, name) => {
  const getMark = () => {
    return mark;
  };

  const getName = () => {
    return name;
  };

  return { getMark, getName };
};

const bot = (() => {
  const _getUnmarkedTiles = () => {
    let unmarkedTiles = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let tile = gameBoard.getTiles()[i][j];
        if (tile.getState() === '') {
          unmarkedTiles.push([tile, i, j]);
        }
      }
    }
    return unmarkedTiles;
  }

  const _isLosingTile = t => {
    t.setState(game.getPlayers()[0].getMark());
    let result = false;

    if (game.isGameEnd()) {
      result = true;
    }

    t.reset();

    return result;
  };

  const _isWinningTile = t => {
    t.setState(game.getPlayers()[1].getMark());
    let result = false;

    if (game.isGameEnd()) {
      result = true;
    }

    t.reset();

    return result;
  };

  const _assignTileValues = () => {
    let unmarkedTiles = _getUnmarkedTiles();
    let valuedTiles = unmarkedTiles.map(t => {
      let [tile, i, j] = t;
      // default value
      let value = 2;

      if (i === 1 && j === 1) {
        // center
        value = 4;
      } else if ((i === 0 && j === 0) || (i === 0 && j === 2) || (i === 2 && j === 0) || (i === 2 && j === 2)) {
        // corners
        value = 3;
      }

      if (_isLosingTile(tile)) {
        value = 5;
      }

      if (_isWinningTile(tile)) {
        value = 6;
      }

      return [tile, value];
    });

    return valuedTiles;
  };

  const _getMaxValueTile = tiles => {
    let max;
    let highest = 0;
    tiles.forEach(t => {
      let [tile, value] = t;
      if (value > highest) {
        highest = value;
        max = tile;
      }
    });

    return max;
  }

  const _getRandomTile = () => {
    let unmarkedTiles = _getUnmarkedTiles();
    return unmarkedTiles[Math.floor(Math.random() * unmarkedTiles.length)][0];
  };

  const move = () => {
    // let tile = _getRandomTile();
    let tile = _getMaxValueTile(_assignTileValues());
    tile.mark();
  };

  return { move };
})();

const game = (() => {
  let _currentPlayer = null;
  let _players = [];
  let _turn = 0;
  let _winner = undefined;
  let _running = false;
  let _over = false;
  let _AI = false;

  const getCurrentPlayer = () => {
    return _currentPlayer;
  };

  const setupBoard = () => {
    const container = document.querySelector('.container');
    for (let i = 0; i < 9; i++) {

      const div = document.createElement('div');
      div.classList.add('tile');
      container.appendChild(div);

      const tile = Tile(div);
      gameBoard.addTile(tile);
    }

    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', e => {
      const p1Name = document.querySelector('#player1').value || 'Player 1';
      const p2Name = document.querySelector('#player2').value || 'Player 2';
      if (_running || _over) {
        _restart(p1Name, p2Name);
      } else {
        _start(p1Name, p2Name);
      }
    });
  };

  const _restart = (p1Name, p2Name) => {
    _turn = 0;
    _over = false;
    _players = [];
    const winnerH1 = document.querySelector('#winner');
    winnerH1.textContent = '';
    let tiles = gameBoard.getTiles();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let tile = tiles[i][j];
        tile.reset();
      }
    }
    _start(p1Name, p2Name);
  };

  const _start = (p1Name, p2Name) => {
    const p1 = Player('X', p1Name);
    _players.push(p1);
    const p2 = Player('O', p2Name);
    _players.push(p2);

    _currentPlayer = _players[0];
    _running = true;

    _AI = document.querySelector('#AI').checked;
  };

  const _checkRow = row => {
    if (row[0].getState() === '') {
      return false;
    }
    return row[0].getState() === row[1].getState() && row[1].getState() === row[2].getState();
  }

  const isGameEnd = () => {
    for (let i = 0; i < 3; i++) {
      let row = gameBoard.getTiles()[i];
      if (_checkRow(row)) {
        return true;
      }
    }

    // transpose array to switch columns with rows
    let array = gameBoard.getTiles();
    let transposed = array[0].map((_, colIndex) => array.map(row => row[colIndex]));

    for (let i = 0; i < 3; i++) {
      let row = transposed[i];
      if (_checkRow(row)) {
        return true;
      }
    }

    let tiles = gameBoard.getTiles();
    if (tiles[0][0].getState() !== '') {
      if (tiles[0][0].getState() === tiles[1][1].getState() && tiles[1][1].getState() === tiles[2][2].getState()) {
        return true;
      }
    }

    if (tiles[0][2].getState() !== '') {
      if (tiles[0][2].getState() === tiles[1][1].getState() && tiles[1][1].getState() === tiles[2][0].getState()) {
        return true;
      }
    }

    return false;
  };

  const _endGame = () => {
    const winnerH1 = document.querySelector('#winner');
    _running = false;
    if (_winner === null) {
      winnerH1.textContent = "It's a tie!";
    } else {
      winnerH1.textContent = _winner.getName() + ' won';
    }
    _over = true;
  };

  const nextTurn = () => {
    _turn++;

    if (isGameEnd()) {
      _winner = _currentPlayer;
      _endGame();
      return;
    }
    if (_turn === 9) {
      _winner = null;
      _endGame();
      return;
    }

    _currentPlayer = _players[_turn % 2];
    if (_AI && _turn % 2 === 1) {
      bot.move();
    }
  };

  const isRunning = () => {
    return _running;
  };

  const isOver = () => {
    return _over;
  };

  const getPlayers = () => {
    return _players;
  }

  return { setupBoard, getCurrentPlayer, nextTurn, isRunning, isOver, isGameEnd, getPlayers };
})();

game.setupBoard();
