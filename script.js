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

  const getState = () => _state;

  const setState = state => {
    _state = state;
    _element.textContent = _state;
  };

  return { getState, setState };
};

const game = (() => {
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

  return { setupBoard };
})();

game.setupBoard();
