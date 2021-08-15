var config = {
    apiKey: "AIzaSyCPMNowtEiT0Z3tSFoZwkAOE6KgnkCzNkE",
    authDomain: "caro-5c82f.firebaseapp.com.firebaseapp.com",
    databaseURL: "https://caro-5c82f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "caro-5c82f",
    storageBucket: "caro-5c82f.appspot.com",
};
firebase.initializeApp(config);
var room = "room1";
var user = prompt('nhập x hoặc o')
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


var game = new Game(15, 15, user, dbRoom)
