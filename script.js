const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

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
        return;
    }

    if (!boardState.includes("")) {
        status.textContent = "It's a Draw! 😮";
        gameActive = false;
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
