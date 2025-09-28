const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

const xWinsSpan = document.getElementById("x-wins");
const oWinsSpan = document.getElementById("o-wins");
const drawsSpan = document.getElementById("draws");

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

let scores = {
    X: 0,
    O: 0,
    draws: 0
};

// Create cells
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
}

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (boardState[index] !== "" || !gameActive) return;

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    if (checkWin()) {
        status.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameActive = false;
        updateScores(currentPlayer);
        return;
    }

    if (!boardState.includes("")) {
        status.textContent = "It's a Draw! 😮";
        gameActive = false;
        updateScores("draw");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === currentPlayer);
    });
}

function updateScores(winner) {
    if (winner === "X") {
        scores.X++;
        xWinsSpan.textContent = scores.X;
    } else if (winner === "O") {
        scores.O++;
        oWinsSpan.textContent = scores.O;
    } else if (winner === "draw") {
        scores.draws++;
        drawsSpan.textContent = scores.draws;
    }
}

restartBtn.addEventListener("click", () => {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    status.textContent = "Player X's turn";

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
});
