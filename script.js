const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const modeSelect = document.getElementById("mode");

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

let gameMode = modeSelect.value; // "pvp" or "ai"

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

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (boardState[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (gameMode === "ai" && gameActive && currentPlayer === "O") {
        // AI turn after a short delay
        setTimeout(() => {
            const aiMove = getAIMove();
            if (aiMove !== null) {
                makeMove(aiMove, "O");
            }
        }, 400);
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

    currentPlayer = player === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === player);
    });
}

function getAIMove() {
    // Simple AI: pick a random empty cell
    const emptyIndices = boardState
        .map((val, idx) => val === "" ? idx : null)
        .filter(idx => idx !== null);

    if (emptyIndices.length === 0) return null;

    // For a smarter AI, you can implement minimax here.
    // For now, random choice:
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return randomIndex;
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

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    status.textContent = "Player X's turn";

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}

restartBtn.addEventListener("click", resetGame);

// Initialize status text
status.textContent = "Player X's turn";
