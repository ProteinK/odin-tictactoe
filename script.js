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
    if (_marked || !game.isRunning() || game.isOver()) {
      return;
    }

    setState(game.getCurrentPlayer().getMark());
    game.nextTurn();
    _marked = true;
  });

  const reset = () => {
    _state = '';
    _element.textContent = '';
    _marked = false;
  };

  return { getState, setState, reset };
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

const game = (() => {
  let _currentPlayer = null;
  let _players = [];
  let _turn = 0;
  let _winner = undefined;
  let _running = false;
  let _over = false;

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
        _winner = _currentPlayer;
        return true;
      }
    }

    if (_turn === 9) {
      return true;
    }

    return false;
  };

  const _endGame = () => {
    const winnerH1 = document.querySelector('#winner');
    _running = false;
    if (_winner === undefined) {
      winnerH1.textContent = "It's a tie!";
    } else {
      winnerH1.textContent = _winner.getName() + ' won';
    }
    _over = true;
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

  const isOver = () => {
    return _over;
  };

  return { setupBoard, getCurrentPlayer, nextTurn, isRunning, isOver };
})();

game.setupBoard();
