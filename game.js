class Game {

    constructor() {
        this.row = 20
        this.col = 20
        this.result = document.getElementById('result')
        this.listRoom = document.getElementById('listRoom')
        document.getElementById('msg').addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("send").click();
            }
        })
        var config = {
            apiKey: "AIzaSyCPMNowtEiT0Z3tSFoZwkAOE6KgnkCzNkE",
            authDomain: "caro-5c82f.firebaseapp.com.firebaseapp.com",
            databaseURL: "https://caro-5c82f-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "caro-5c82f",
            storageBucket: "caro-5c82f.appspot.com",
        }
        firebase.initializeApp(config)
        this.initUser()

        this.db = firebase.database().ref()
        this.dbRoom = this.db.child('room1')
        this.dbChat = this.db.child('chat1')
        document.getElementById('reset').onclick = this.resetGame.bind(this)
        document.getElementById('send').onclick = this.sendMessage.bind(this, this)


        this.resetGame()
        this.dbRoom.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data.data == "null") {
                this.resetGame()
            }
            else {
                try {
                    this.setData(JSON.parse(data.data))
                    this.setTurn(data.turn)
                    if (data.lastUser != null) {
                        this.markCell(document.getElementById("cell_" + data.lastRow + "_" + data.lastCol), data.lastUser)
                    }
                    if (data.win != null) {
                        if (data.win == this.user)
                            var win = "Thắng rồi! "
                        else
                            var win = "Thua rồi... :("
                        alert(win)
                        this.result.innerText = win
                        this.result.classList.remove('hidden')
                    }
                }
                catch (e) { }
            }
        });

        // .orderByKey()
        this.dbChat.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                // var key = childSnapshot.key;
                var chatHTML = document.getElementById('chat')
                var childData = childSnapshot.val();
                var node = document.createElement("DIV")
                var textnode = document.createTextNode(childData)
                node.appendChild(textnode)

                chatHTML.appendChild(node)
            });
        }, function (error) {
            console.error(error);
        });
    }

    initUser() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("user") == "null") {
                this.user = prompt('nhập x hoặc o')
                localStorage.setItem("user", this.user)
            }
            else {
                this.user = localStorage.getItem("user")

            }
        } else {
            var a = prompt('nhập x hoặc o')
            this.user = a
        }
    }

    resetGame() {
        console.log("reset")
        this.dbRoom.set({ data: "null" })
        this.createData(this.row, this.col)
        this.createBroad(this.row, this.col)
        this.setTurn('x')
        var cell = document.getElementsByClassName('cell')
        for (var i = 0; i < cell.length; i++) {
            cell[i].onclick = this.checkCell.bind(this, cell[i])
        }
        this.result.classList.add('hidden')
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
                data.win = this.user
            }
            this.dbRoom.set(data)
        }
    }

    win(row, col, x) {
        let endCol = col + 4
        for (let i = col - 4; i < col; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.getData(row, i + j) == x) {
                    count++;
                }
            }
            if (count == 5) {
                return true;
            }
        }

        //check col
        for (let i = row - 4; i < row; i++) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.getData(i + j, col) == x) {
                    count++;
                }
            }
            if (count == 5) {
                return true;
            }
        }

        // check duong \ 
        for (let i = 4; i >= 0; i--) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.getData(row - i + j, col - i + j) == x) {
                    count++;
                }
            }
            if (count == 5) {
                return true;
            }
        }

        // check duong /
        for (let i = 4; i >= 0; i--) {
            let count = 0;
            for (let j = 0; j < 5; j++) {
                if (this.getData(row - i + j, col + i - j) == x) {
                    count++;
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


    getData(row, col) {
        if (this.data[row])
            if (this.data[row][col])
                return this.data[row][col]
        return undefined
    }

    sendMessage(game) {
        console.log(game)
        var msg = document.getElementById('msg')
        if (msg.value != "") {
            var time = new Date().getTime();
            var data = new Object()
            data[time] = game.user + ": " + msg.value
            game.dbChat.set(data)
            msg.value = ""
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight
        }
    }


}
