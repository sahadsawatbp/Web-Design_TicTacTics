import {get,child,getDatabase,set,ref,update,remove, onValue} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const gameRef = firebase.database().ref("Room");
const textRoomID = document.getElementById("room-id");
const playerXUsername = document.getElementById("player-x-username");
const playerOUsername = document.getElementById("player-o-username");
const playerXImg = document.getElementById("player-x-img");
const playerOImg = document.getElementById("player-o-img");
const userListRef = firebase.database().ref("UserList");
const startBtn = document.getElementById("start-button");
const currentUser = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        updatePlayerProfile(user)   
    }
})

// let updatePlayerProfile = (user) =>{
//     let roomAs;
//     var player = (player_x_id, username, img) =>{
//         gameRef.once("value").then((snapshot)=>{
//             roomAs = snapshot.child("room_count").val();
//             get(child(gameRef, `Room `+roomAs)).then((snapshot)=>{
//                 console.log("From mathmaking.js: ",snapshot.child(player_x_id).val())
//                 if(snapshot.child(player_x_id).val()){
//                     let playerID = snapshot.child(player_x_id).val();
//                     get(child(userListRef, playerID)).then((snapshot)=>{
//                         console.log(snapshot.val().username)
//                         username.innerHTML = snapshot.val().username;
//                         img.setAttribute('src',snapshot.val().img);
//                     })
//                 }
//             })
//         })
//         var onlineState
//     };
//     player("player_x_id", playerXUsername, playerXImg);
//     player("player_o_id", playerOUsername, playerOImg);
// }
let updatePlayerProfile = (user) =>{
    let roomAs;
    var player = (player_x_id, username, img) =>{
        gameRef.once("value").then((snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.key != "room_count"){
                    roomAs = childSnapshot.key
                    console.log("From mathmaking.js: ",snapshot.child(roomAs).child(player_x_id).val())
                    if(snapshot.child(roomAs).child(player_x_id).val()){
                        let playerID = snapshot.child(roomAs).child(player_x_id).val();
                        get(child(userListRef, playerID)).then((snapshot)=>{
                            username.innerHTML = snapshot.val().username;
                            img.setAttribute('src',snapshot.val().img);
                        })
                    }
                }
            })
        })
        var onlineState
    };
    player("player_x_id", playerXUsername, playerXImg);
    player("player_o_id", playerOUsername, playerOImg);
}




if(startBtn){
    startBtn.addEventListener("click",()=>{
        window.location = "game.html"
    })
}