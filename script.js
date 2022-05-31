const gameBoard = (() => {
  let _tiles = [[], [], []];
  let _currentTile = 0;

  const getTiles = () => _tiles;
  const getTile = index => _tiles[index];
  const addTile = tile => {
    _tiles[Math.floor(_currentTile / 3)].push(tile);
    _currentTile++;
  }

  return { getTiles, getTile, addTile };
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

  _element.addEventListener('click', e => {
    if (_marked || !game.isRunning()) {
      return;
    }

    setState(game.getCurrentPlayer().getMark());
    game.nextTurn();
    _marked = true;
  });

  return { getState, setState };
};

const Player = mark => {
  const getMark = () => {
    return mark;
  };

  return { getMark };
};

const game = (() => {
  let _currentPlayer = null;
  const _players = [];
  let _turn = 0;
  let _winner = undefined;
  let _running = false;

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
  };

  const start = () => {
    const p1 = Player('X');
    _players.push(p1);
    const p2 = Player('O');
    _players.push(p2);

    _currentPlayer = _players[0];
    _running = true;
  };

  const _checkRow = row => {
    if (row[0].getState() === '') {
      return false;
    }
    return row[0].getState() === row[1].getState() && row[1].getState() === row[2].getState();
  }

  const _isGameEnd = () => {
    for (let i = 0; i < 3; i++) {
      let row = gameBoard.getTiles()[i];
      if (_checkRow(row)) {
        _winner = row[0];
        return true;
      }
    }

    // transpose array to switch columns with rows
    let array = gameBoard.getTiles();
    let transposed = array[0].map((_, colIndex) => array.map(row => row[colIndex]));

    for (let i = 0; i < 3; i++) {
      let row = transposed[i];
      if (_checkRow(row)) {
        _winner = row[0];
        return true;
      }
    }

    if (_turn === 9) {
      return true;
    }

    return false;
  };

  const _endGame = () => {
    _running = false;
    if (_winner === undefined) {
      console.log('nobody won');
    } else {
      console.log(_winner.getState() + ' won');
    }
  };

  const nextTurn = () => {
    _turn++;

    if (_isGameEnd()) {
      _endGame();
      return;
    }

    _currentPlayer = _players[_turn % 2];
  };

  const isRunning = () => {
    return _running;
  };

  return { setupBoard, start, getCurrentPlayer, nextTurn, isRunning };
})();

game.setupBoard();
game.start();
