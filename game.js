class Game {
    constructor(row, col) {
        this.row = row
        this.col = col
        this.data = this.createData(row, col)
        this.x = 1
        this.broad = this.createBroad(row, col)
        document.getElementById("main").innerHTML = this.broad
        var input = document.getElementsByClassName('check')
        for (var i = 0; i < input.length; i++) {
            input[i].onclick = this.checkCell.bind(this, input[i])
        }

    }

    checkCell(input) {
        let row = Number(input.getAttribute("data-row"));
        let col = Number(input.getAttribute("data-col"));
        let x = "x"
        if (this.x != 1) {
            x = 'o'
            input.classList.add('active')
        }
        this.data[row][col] = x
        var end = this.win(row, col, x)
        if (end) {
            alert(x + " Thắng! ")
        }
        this.x = -this.x
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
        return data
    }

    createBroad(row, col) {
        var broad = ""
        for (let r = 0; r < row; r++) {
            broad += '<div class="table-row">'
            for (let c = 0; c < col; c++) {
                broad += '<label class="cell"><input type="checkbox" class="check" id="cell_' + r + '_' + c + '" data-row="' + r + '" data-col="' + c + '"><span class="checkmark"></span></label>'
            }
            broad += '</div>'
        }
        return broad

    }

}

