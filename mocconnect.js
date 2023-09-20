class Player {
    constructor(color) {
        this.color = color;
    }
}

class ConnectFour {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.board = this.createBoard();
        this.currentPlayer = 1;
        this.isGameOver = false;
        this.initBoard();
        this.player1 = new Player('#ff5733');
        this.player2 = new Player('#33b5e5');
        this.boardElement = document.getElementById('board');
        this.messageElement = document.getElementById('message');
        this.resetButton = document.getElementById('reset-button');
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.setupEventListeners();
    }

    createBoard() {
        const board = [];
        for (let row = 0; row < this.height; row++) {
            const newRow = [];
            for (let col = 0; col < this.width; col++) {
                newRow.push(null);
            }
            board.push(newRow);
        }
        return board;
    }

    initBoard() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        for (let col = 0; col < this.width; col++) {
            const topCell = document.createElement('div');
            topCell.classList.add('top-cell');
            topCell.dataset.col = col;
            topCell.addEventListener('click', () => this.handleCellClick(col));
            this.boardElement.appendChild(topCell);
        }
    }

    handleCellClick(col) {
        if (this.isGameOver) {
            return;
        }

        const row = this.findSpotForCol(col);

        if (row === null) {
            return; // Column is full, do nothing
        }

        this.board[row][col] = this.currentPlayer;
        this.placeInTable(row, col);

        if (this.checkForWin(row, col)) {
            this.isGameOver = true;
            this.messageElement.textContent = `Player ${this.currentPlayer} wins!`;
        } else {
            if (this.checkForTie()) {
                this.isGameOver = true;
                this.messageElement.textContent = "It's a tie!";
            } else {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            }
        }
    }

    findSpotForCol(col) {
        for (let row = this.height - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                return row;
            }
        }
        return null;
    }

    placeInTable(row, col) {
        const cell = document.createElement('div');
        cell.classList.add('cell', `player${this.currentPlayer}`);
        cell.dataset.row = row;
        cell.dataset.col = col;
        this.boardElement.appendChild(cell);
        cell.style.transform = `translateY(${(row + 1) * 50}px)`;

        setTimeout(() => {
            cell.style.transform = 'translateY(0)';
        }, 100);
    }

    checkForWin(row, col) {
        const currentPlayer = this.board[row][col];
    
        // Check horizontal win
        let count = 1;
        for (let c = col + 1; c < this.width; c++) {
            if (this.board[row][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let c = col - 1; c >= 0; c--) {
            if (this.board[row][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) {
            return true;
        }
    
        // Check vertical win
        count = 1;
        for (let r = row + 1; r < this.height; r++) {
            if (this.board[r][col] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let r = row - 1; r >= 0; r--) {
            if (this.board[r][col] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) {
            return true;
        }
    
        // Check diagonal win (from top right to bottom left)
        count = 1;
        for (let r = row - 1, c = col + 1; r >= 0 && c < this.width; r--, c++) {
            if (this.board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let r = row + 1, c = col - 1; r < this.height && c >= 0; r++, c--) {
            if (this.board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) {
            return true;
        }
    
        // Check anti-diagonal win (from top left to bottom right)
        count = 1;
        for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
            if (this.board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let r = row + 1, c = col + 1; r < this.height && c < this.width; r++, c++) {
            if (this.board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) {
            return true;
        }
    
        return false;
    }
    

    checkForTie() {
        // Check if there are any empty cells in the top row
        for (let col = 0; col < this.width; col++) {
            if (this.board[0][col] === null) {
                // There is an empty cell, so the game is not a tie
                return false;
            }
        }
        
        // If there are no empty cells in the top row, the game is a tie
        return true;
    }
    

    resetGame() {
        // Clear the game board by setting all cells to null
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.board[row][col] = null;
            }
        }
    
        // Reset game state variables
        this.currentPlayer = 1;
        this.isGameOver = false;
    
        // Clear the HTML board by removing all children
        const boardElement = document.getElementById('board');
        while (boardElement.firstChild) {
            boardElement.removeChild(boardElement.firstChild);
        }
    
        // Reinitialize the HTML board and event listeners
        this.initBoard();
    }
    
}

const game = new ConnectFour(6, 7);
