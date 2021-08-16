class Game {
    constructor(row, col, user, dbRoom) {
        this.row = row
        this.col = col
        this.user = user
        this.dbRoom = dbRoom
        this.resetGame()
        document.getElementById('reset').onclick = this.resetGame.bind(this)

        dbRoom.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data == null) {
                this.resetGame()
            }
            else {
                this.setData(JSON.parse(data.data))
                this.setTurn(data.turn)
                if (data.lastUser != null) {
                    this.markCell(document.getElementById("cell_" + data.lastRow + "_" + data.lastCol), data.lastUser)
                }
                if (data.win != null) {
                    if (data.win == this.user)
                        var win = "Chúc mừng bạn đã thắng! :)"
                    else
                        var win = "Thua rồi... :("
                    document.getElementById('result').innerText = win
                }

            }

        });

    }

    resetGame() {
        console.log("reset")
        this.createData(this.row, this.col)
        this.createBroad(this.row, this.col)
        this.dbRoom.set({ data: JSON.stringify(this.data), turn: 'x' })
        this.turn = 'x'
        var cell = document.getElementsByClassName('cell')
        for (var i = 0; i < cell.length; i++) {
            cell[i].onclick = this.checkCell.bind(this, cell[i])
        }

    }

    markCell(cell, user) {
        let row = Number(cell.getAttribute("data-row"));
        let col = Number(cell.getAttribute("data-col"));
        console.log(row, col)
        if (user == 'o') {
            cell.classList.add('check-o')
            this.turn = 'x'
        }
        else {
            cell.classList.add('check-x')
            this.turn = 'o'
        }
        this.data[row][col] = user
    }

    checkCell(cell) {
        let row = Number(cell.getAttribute("data-row"));
        let col = Number(cell.getAttribute("data-col"));
        if (this.turn == this.user && this.data[row][col] == null) {
            this.markCell(cell, this.user)


            var end = this.win(row, col, this.user)
            if (end) {
                alert(user + " Thắng! ")
                dbRoom.set({ data: JSON.stringify(this.data), turn: this.turn, lastRow: row, lastCol: col, lastUser: this.user, win: this.user })
            }
            else {
                dbRoom.set({ data: JSON.stringify(this.data), turn: this.turn, lastRow: row, lastCol: col, lastUser: this.user })
            }
        }
    }

    win(row, col, x) {
        //check row 
        let startCol = col - 4
        startCol = startCol >= 0 ? startCol : 0
        let endCol = col + 4
        endCol = (endCol < this.col) ? endCol : this.col - 1
        for (let i = startCol; i <= endCol - 4; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.data[row][i + j] == x) {
                    count++;
                }
            }
            if (count == 5) {
                return true;
            }
        }

        //check col
        let startRow = row - 4
        startRow = startRow >= 0 ? startRow : 0
        let endRow = row + 4
        endRow = endRow < this.row ? endRow : this.row - 1

        for (let i = startRow; i <= endRow - 4; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.data[i + j][col] == x) {
                    count++;
                }
            }
            if (count == 5) {
                return true;
            }
        }

        // check col && row

        let start = startCol > startRow ? startCol : startRow
        let end = endCol < endRow ? endCol : endRow

        for (let i = -4; i <= 4; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if ((col + i) >= 0 && (col + i + j) < this.col && (row + i) >= 0 && (row + i + j) < this.row) {
                    if (this.data[row + i + j][col + i + j] == x) {
                        count++;
                    }
                }
            }
            if (count == 5) {
                return true;
            }
        }

        
        for (let i = -4; i <= 4; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if ((col + i) >= 0 && (col + i + j) < this.col && (row + i) >= 0 && (row + i + j) < this.row) {
                    console.log("i,j, row, col", i,j, row + i, col + 8 - i - j)
                    if (this.data[row + i][col + 8 - i - j] == x) {
                        count++;
                    }
                }
            }
            if (count == 5) {
                return true;
            }
        }

        return null;
    }
    //tạo mảng lưu các nước đi
    createData(row, col) {
        var data = []
        for (let r = 0; r < row; r++) {
            data[r] = []
            for (let c = 0; c < col; c++) {
                data[r][c] = null
            }
        }
        this.data = data
    }

    createBroad(row, col) {
        var broad = ""
        for (let r = 0; r < row; r++) {
            broad += '<div class="table-row">'
            for (let c = 0; c < col; c++) {
                broad += '<span class="cell" id="cell_' + r + '_' + c + '" data-row="' + r + '" data-col="' + c + '"></span>'
            }
            broad += '</div>'
        }
        document.getElementById("main").innerHTML = broad

    }

    setData(data) {
        this.data = data
    }
    setTurn(user) {
        this.turn = user
        if (user == this.user)
            var turnof = "Đến lượt bạn kìa!"
        else
            var turnof = "Chờ xíu nhé!"
        document.getElementById('turnof').innerText = turnof
    }
}

