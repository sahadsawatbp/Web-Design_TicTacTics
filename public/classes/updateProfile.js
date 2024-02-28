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

let updatePlayerProfile = (user) =>{
    let roomAs;
    let userRoom;
    userListRef.child(user.uid).child("lastestRoom").once("value",(snapshot)=>{
        console.log(snapshot.val())
    })
    userListRef.child(user.uid)
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
                            textRoomID.innerHTML = "Room ID : " + roomAs.replace("R","");
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