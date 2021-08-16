var ua = navigator.userAgent;
var room = "room1";
var user = 'x'
// var user = prompt('nhập x hoặc o')
console.log("bạn chơi " + user)
const dbRef = firebase.database().ref();
var dbRoom = dbRef.child(room)
// dbRoom.child("user").get().then((snapshot) => {
//     if (snapshot.exists()) {
//         console.log(snapshot.val());
//     } else {
//         console.log("No data available");
//     }
// }).catch((error) => {
//     console.error(error);
// });

// dbRoom.child('data').set({ data: JSON.stringify(game.data) })


// dbRoom.on('value', (snapshot) => {
//     const data = snapshot.val();
//     game.setData(JSON.parse(data.data))
//     game.setTurn(data.turn)

// });


var game = new Game(30, 30, user, dbRoom)
