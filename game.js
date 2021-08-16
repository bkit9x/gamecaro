class Game {

    constructor() {
        this.row = 20
        this.col = 20
        this.result = document.getElementById('result')
        this.listRoom = document.getElementById('listRoom')
        var config = {
            apiKey: "AIzaSyCPMNowtEiT0Z3tSFoZwkAOE6KgnkCzNkE",
            authDomain: "caro-5c82f.firebaseapp.com.firebaseapp.com",
            databaseURL: "https://caro-5c82f-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "caro-5c82f",
            storageBucket: "caro-5c82f.appspot.com",
        };
        firebase.initializeApp(config);
        this.user = "Kha";

        this.db = firebase.database().ref()
        this.room = []

        this.listRoom.onchange = this.selectRooom.bind(this)



        document.getElementById('reset').onclick = this.resetGame.bind(this)
        this.initRoom()
        // db.child('game').on('value', (snapshot) => {
        //     const data = snapshot.val();
        //     if (data == null) {
        //         this.resetGame()
        //     }
        //     else {
        //         this.setData(JSON.parse(data.data))
        //         this.setTurn(data.turn)
        //         if (data.lastUser != null) {
        //             this.markCell(document.getElementById("cell_" + data.lastRow + "_" + data.lastCol), data.lastUser)
        //         }
        //         if (data.win != null) {
        //             if (data.win == this.user)
        //                 var win = "Thắng rồi nhe"
        //             else
        //                 var win = "Thua rồi... :("
        //             result.innerText = win
        //             result.classList.remove('hidden')
        //         }

        //     }

        // });
        // document.getElementById('chonphong').onChange = a;


    }

    initRoom() {
        this.db.child('room').on('value', (snapshot) => {
            var option = ''
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                try {
                    console.log((new Date().getTime()))

                    if (new Date().getTime() - childData.time > 180) {
                        option += '<option value="' + childSnapshot.key + '" data-user="0">' + childSnapshot.key + ' (trống)' + '</option>'
                    }
                    else {
                        if (childData.user.o && childData.user.x) {
                            option += '<option value="' + childSnapshot.key + '" data-user="2">' + childSnapshot.key + ' (đủ người)' + '</option>'
                        }
                        else {
                            option += '<option value="' + childSnapshot.key + '" data-user="1">' + childSnapshot.key + ' (thiếu người)' + '</option>'
                        }
                    }
                }
                catch (e) { console.error(e) };
            });
            this.listRoom.innerHTML = option
        });
    }
    selectRooom(game) {
        console.error(game)
        console.log(this)
        game.db.child('room').child(this.value).child('user').get().then((snapshot) => {
            if (snapshot.exists()) {
                var snapData = snapshot.val()
                console.log(snapData)
                // if (snapData.x ) {

                // }
            } else {
                console.log("No data available");
            }
            //     if ()
            //         game.db.child('room').child(this.value).update({ time: new Date().getTime(), user{ o: }})
            // console.log(this.options[this.selectedIndex].getAttribute('data-user'))

            console.log(this.value)
        })
    }

    resetGame() {
        console.log("reset")
        this.createData(this.row, this.col)
        this.createBroad(this.row, this.col)
        this.dbRoom.child('game').set({ data: JSON.stringify(this.data), turn: 'x' })
        this.turn = 'x'
        var cell = document.getElementsByClassName('cell')
        for (var i = 0; i < cell.length; i++) {
            cell[i].onclick = this.checkCell.bind(this, cell[i])
        }
        result.classList.add('hidden')

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
            var win = this.win(row, col, this.user)
            var data = { data: JSON.stringify(this.data), turn: this.turn, lastRow: row, lastCol: col, lastUser: this.user, time: new Date().getTime() }
            if (win) {
                data.push({ win: this.user })
            }
            dbRoom.child('game').set(data)
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
                    if (this.data[row + i + j][col - i - j] == x) {
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
    setRoom(room) {
        this.room = room
    }
}

