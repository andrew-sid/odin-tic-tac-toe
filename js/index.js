function Gameboard() {
  const board = [];

  for (let i = 0; i < 9; i++) {
    board.push(Cell());
  }

  const getBoard = () => board;

  const choiceCell = (index, player) => {
    const availableCells = board.filter((cell) => cell.getValue() === null).map((cell) => cell);

    if (!availableCells.length) return;
    if (board[index].getValue() !== null) return;

    board[index].addToken(player);
  };

  return { getBoard, choiceCell };
}

function Cell() {
  let value = null;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'X',
    },
    {
      name: playerTwoName,
      token: 'O',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (index) => {
    if (calculateWinner(board.getBoard())) return;
    board.choiceCell(index, getActivePlayer().token);
    switchPlayerTurn();
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        board[a].getValue() &&
        board[a].getValue() === board[b].getValue() &&
        board[a].getValue() === board[c].getValue()
      ) {
        return board[a].getValue();
      }
    }
    return null;
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    calculateWinner
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnText = document.querySelector('.game__player-turn');
  const gameDiv = document.querySelector('.game__cells');

  const updateScreen = () => {
    gameDiv.innerHTML = '';

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    const winner = game.calculateWinner(board);
    if (winner) {
      playerTurnText.textContent = `The winner is: ${winner}`;
    } else {
      playerTurnText.textContent = `${activePlayer.name}\`s turn... `;
    }
    

    board.forEach((cell, index) => {
      const cellButton = document.createElement('button');
      cellButton.classList.add('game__cell');
      cellButton.dataset.index = index;
      cellButton.textContent = cell.getValue();
      gameDiv.appendChild(cellButton);
    });
  };

  function clickHandlerBoard(e) {
    const selectedIndex = e.target.dataset.index;
    if (!selectedIndex) return;

    game.playRound(selectedIndex);
    updateScreen();
  }

  gameDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

ScreenController();
