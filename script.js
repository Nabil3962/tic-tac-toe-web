const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const modeSelect = document.getElementById("mode");

const xWinsSpan = document.getElementById("x-wins");
const oWinsSpan = document.getElementById("o-wins");
const drawsSpan = document.getElementById("draws");

let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill("");

let scores = { X: 0, O: 0, draws: 0 };
let gameMode = modeSelect.value;

// Create cells
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
}

modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    resetGame();
});

// Handle player click
function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);

    if (!gameActive) return;
    if (boardState[index] !== "") return;
    if (gameMode === "ai" && currentPlayer === "O") return; // Prevent clicking during AI turn

    makeMove(index, currentPlayer);

    // AI turn after player move
    if (gameMode === "ai" && gameActive) {
        currentPlayer = "O";
        status.textContent = `Player ${currentPlayer}'s turn`;

        setTimeout(() => {
            const aiIndex = getBestMove(boardState);
            if (aiIndex !== null && gameActive) {
                makeMove(aiIndex, "O");
                if (gameActive) {
                    currentPlayer = "X";
                    status.textContent = `Player ${currentPlayer}'s turn`;
                }
            }
        }, 400);
    } else if (gameActive) {
        // PvP turn switch
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    const cell = board.querySelector(`.cell[data-index='${index}']`);
    cell.textContent = player;
    cell.classList.add("taken");

    if (checkWin(player)) {
        status.textContent = `Player ${player} Wins! 🎉`;
        gameActive = false;
        updateScores(player);
        return;
    }

    if (!boardState.includes("")) {
        status.textContent = "It's a Draw! 😮";
        gameActive = false;
        updateScores("draw");
        return;
    }
}

// Check win
function checkWin(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(i => boardState[i] === player));
}

// Scoreboard
function updateScores(winner) {
    if (winner === "X") scores.X++;
    else if (winner === "O") scores.O++;
    else scores.draws++;

    xWinsSpan.textContent = scores.X;
    oWinsSpan.textContent = scores.O;
    drawsSpan.textContent = scores.draws;
}

function resetGame() {
    boardState.fill("");
    currentPlayer = "X";
    gameActive = true;
    status.textContent = "Player X's turn";

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}

restartBtn.addEventListener("click", resetGame);

// -------------------------
// Minimax AI for Tic Tac Toe
// -------------------------
function getBestMove(board) {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinBoard(board, "O")) return 10 - depth;
    if (checkWinBoard(board, "X")) return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinBoard(board, player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(i => board[i] === player));
}
