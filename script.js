const board = document.getElementById("game-board");
const statusDiv = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = "pvp"; // default

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createBoard() {
    board.innerHTML = "";
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    gameMode = modeSelect.value;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (gameActive && gameMode === "ai" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    document.querySelector(`.cell[data-index='${index}']`).textContent = player;

    if (checkWinner(player)) {
        statusDiv.textContent = `🎉 ${player === "X" ? "Player X" : (gameMode === "ai" && player === "O") ? "Computer" : "Player O"} wins!`;
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusDiv.textContent = "🤝 It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = player === "X" ? "O" : "X";
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O";
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, "O");
}

function minimax(boardState, depth, isMaximizing) {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    if (!boardState.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "O";
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "X";
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    return winningConditions.some(combination =>
        combination.every(index => gameState[index] === player)
    );
}

restartBtn.addEventListener("click", createBoard);
modeSelect.addEventListener("change", createBoard);

createBoard();
