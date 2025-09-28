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

// Handle human clicks
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive) return;
    if (boardState[index] !== "") return;
    if (gameMode === "ai" && currentPlayer === "O") return; // prevent clicking during AI turn

    playerMove(index);
}

function playerMove(index) {
    makeMove(index, currentPlayer);

    // If PvC and game still active, trigger AI after human move
    if (gameMode === "ai" && gameActive) {
        currentPlayer = "O"; // explicitly set AI as current
        status.textContent = `Player ${currentPlayer}'s turn`;

        setTimeout(() => {
            const aiIndex = getAIMove();
            if (aiIndex !== null && gameActive) {
                makeMove(aiIndex, "O");
                if (gameActive) {
                    currentPlayer = "X"; // back to human
                    status.textContent = `Player ${currentPlayer}'s turn`;
                }
            }
        }, 400);
    } else {
        // PvP: just switch turn
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Perform a move for any player
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

// Win checking
function checkWin(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(i => boardState[i] === player));
}

// Simple AI: random empty cell
function getAIMove() {
    const empty = boardState.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
}

// Update scoreboard
function updateScores(winner) {
    if (winner === "X") scores.X++;
    else if (winner === "O") scores.O++;
    else scores.draws++;

    xWinsSpan.textContent = scores.X;
    oWinsSpan.textContent = scores.O;
    drawsSpan.textContent = scores.draws;
}

// Reset game
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
