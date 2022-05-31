const gameBoard = (() => {
  let _tiles = [];

  const getTiles = () => _tiles;
  const getTile = index => _tiles[index];
  const addTile = tile => {
    _tiles.push(tile);
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
    if (_marked) {
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
  };

  const nextTurn = () => {
    _turn++;
    _currentPlayer = _players[_turn % 2];
  };

  return { setupBoard, start, getCurrentPlayer, nextTurn };
})();

game.setupBoard();
game.start();
