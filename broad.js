class Broad {
    constructor(row, col) {
        document.getElementById("main").innerHTML = this.createBroad(row, col)
        // var game = new Game(row, col)
        var input = document.getElementsByClassName('check')
        for (var i = 0; i < input.length; i++) {
            input[i].onclick = this.checkCell.bind(this)
        }
    }
    checkCell() {
        console.log(this)
        // let row = this.getAttribute("data-row");
        // let col = this.getAttribute("data-col");
        // game.checkCell(row, col)
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

