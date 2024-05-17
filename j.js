document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset");
    const playerVsPlayerButton = document.getElementById("player-vs-player");
    const playerVsAiButton = document.getElementById("player-vs-ai");
    let currentPlayer = "X";
    let board = Array(9).fill(null);
    let gameMode = null; // "PVP" or "AI"

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    playerVsPlayerButton.addEventListener("click", () => {
        gameMode = "PVP";
        resetGame();
    });

    playerVsAiButton.addEventListener("click", () => {
        gameMode = "AI";
        resetGame();
    });

    function handleClick(event) {
        const index = event.target.dataset.index;

        if (board[index] === null && (gameMode === "PVP" || (gameMode === "AI" && currentPlayer === "X"))) {
            board[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            if (checkWin()) {
                message.textContent = `${currentPlayer} wins!`;
                cells.forEach(cell => cell.removeEventListener("click", handleClick));
            } else if (board.every(cell => cell !== null)) {
                message.textContent = "It's a draw!";
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                if (gameMode === "AI" && currentPlayer === "O") {
                    aiMove();
                }
            }
        }
    }

    function aiMove() {
        const bestMove = findBestMove();
        board[bestMove] = "O";
        cells[bestMove].textContent = "O";
        if (checkWin()) {
            message.textContent = "O wins!";
            cells.forEach(cell => cell.removeEventListener("click", handleClick));
        } else if (board.every(cell => cell !== null)) {
            message.textContent = "It's a draw!";
        } else {
            currentPlayer = "X";
        }
    }

    function findBestMove() {
        let bestVal = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "O";
                let moveVal = minimax(board, 0, false);
                board[i] = null;
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;
    }

    function minimax(board, depth, isMax) {
        let score = evaluate(board);
        if (score === 10) return score - depth;
        if (score === -10) return score + depth;
        if (board.every(cell => cell !== null)) return 0;

        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "O";
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board[i] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "X";
                    best = Math.min(best, minimax(board, depth + 1, !isMax));
                    board[i] = null;
                }
            }
            return best;
        }
    }

    function evaluate(board) {
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (board[a] === board[b] && board[b] === board[c]) {
                if (board[a] === "O") return 10;
                else if (board[a] === "X") return -10;
            }
        }
        return 0;
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === currentPlayer);
        });
    }

    function resetGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = "";
            cell.addEventListener("click", handleClick);
        });
        currentPlayer = "X";
        message.textContent = "";
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    resetButton.addEventListener("click", resetGame);
});
