function GameBoard() {
  const board = Array(9).fill(null);

  const getBoard = () => board;

  const makeMove = (index, value) => {
    if (board[index] !== null) {
      return false;
    } else {
      board[index] = value;
      return true;
    }
  };

  return { getBoard, makeMove };
}

function GameController(player1 = 'Player 1', player2 = 'Player 2') {
  const board = GameBoard();
  let winner;
  let isDraw;

  const players = [
    { name: player1, token: 'X' },
    { name: player2, token: 'O' },
  ];

  let activePlayer = players[0];

  const changeActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  function calculateWinner(squares) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function calculateDraw(squares) {
    return !squares.includes(null);
  }

  const getWinner = () => winner;
  const getIsDraw = () => isDraw;

  const playRound = (index) => {
    if (!winner) {

      if (board.makeMove(index, getActivePlayer().token)) {
        winner = calculateWinner(board.getBoard());
        isDraw = calculateDraw(board.getBoard());
        if (!winner) {
          changeActivePlayer();
        }
      } else if (!board.getBoard().includes(null)) {
        isDraw = true;
      }
    }
  };

  return { playRound, getBoard: board.getBoard, getActivePlayer, getWinner, getIsDraw };
}

(function ScreenContoller() {
  const game = GameController();
  const gameDiv = document.querySelector('.game__cells');
  const turnText = document.querySelector('.game__turn-title');

  const renderGame = () => {
    gameDiv.innerHTML = '';
    const board = game.getBoard();
    const winner = game.getWinner();
    const isDraw = game.getIsDraw();

    if (winner) {
      turnText.textContent = `${game.getActivePlayer().name} is WIN!`;
    } else if (isDraw) {
      turnText.textContent = `IT'S A DRAW!`;
    } else {
      turnText.textContent = `${game.getActivePlayer().name} turn!`;
    }

    board.forEach((cell, index) => {
      const cellBtn = document.createElement('button');
      cellBtn.classList.add('game__cell');
      cellBtn.textContent = cell;
      cellBtn.dataset.index = index;
      gameDiv.appendChild(cellBtn);
    });
  };

  function clickHandler(event) {
    const currentIndex = event.target.dataset.index;
    if (!currentIndex) return;
    game.playRound(currentIndex);
    renderGame();
  }

  gameDiv.addEventListener('click', clickHandler);

  // initial render
  renderGame();
})();
