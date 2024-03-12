import {get,child,getDatabase,set,ref,update,remove, onValue} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const gameRef = firebase.database().ref("Room");
const textRoomID = document.getElementById("room-id");
const strangerRoomRef = firebase.database().ref("StrangerRoom");
const playerXUsername = document.getElementById("player-x-username");
const playerOUsername = document.getElementById("player-o-username");
const playerXImg = document.getElementById("player-x-img");
const playerOImg = document.getElementById("player-o-img");
const userListRef = firebase.database().ref("UserList");
const startBtn = document.getElementById("start-button");
const backBtn = document.getElementById("back-button")
var currentUser;
firebase.auth().onAuthStateChanged((user)=>{
    currentUser = user;
})
strangerRoomRef.on("value",(snapshot)=>{
    const user = firebase.auth().currentUser;
    getInfo(snapshot,user , playerXUsername, playerXImg, playerOUsername, playerOImg);
    checkStateRoom(snapshot, user);
    if(startBtn){
        startBtn.addEventListener("click",()=>{
            startGame(snapshot, user)
        })
    }
})

function getInfo(snapshot,user , username, img, username2, img2){
    let roomAs;
    userListRef.child(user.uid+"/lastestRoom").once("value",(xx)=>{
            roomAs = xx.val()
            if(snapshot.child(roomAs).child("player_x_id").val() !== ""){
                let player1ID = snapshot.child(roomAs).child("player_x_id").val();
                get(child(userListRef, player1ID)).then((snapshot)=>{
                    username.innerHTML = snapshot.val().username;
                    img.setAttribute('src',snapshot.val().img);
                    textRoomID.innerHTML = "Room ID : " + snapshot.val().lastestRoom.replace("R","");
                })
            }else{
                username.innerHTML = "";
                img.setAttribute('src',"");
            }
            if(snapshot.child(roomAs).child("player_o_id").val()){
                let player2ID = snapshot.child(roomAs).child("player_o_id").val();
                get(child(userListRef, player2ID)).then((snapshot)=>{
                    username2.innerHTML = snapshot.val().username;
                    img2.setAttribute('src',snapshot.val().img);
                })
            }else{
                username2.innerHTML = "";
                img2.setAttribute('src',"");
            }
        
    })
}

if(backBtn){
    
    backBtn.addEventListener("click",()=>{
        quitRoom();
    })
}

function quitRoom(){
    let temp_player_id;
    let  temp_player_email;
    userListRef.child(currentUser.uid).child("lastestRoom").once("value",(snapshot)=>{
        strangerRoomRef.child(snapshot.val()).once("value",(roomSnapshot)=>{
            if(roomSnapshot.val().player_x_id === currentUser.uid){
                temp_player_id = roomSnapshot.val().player_o_id;
                temp_player_email = roomSnapshot.val().player_o_email;
            }                    
            else if(roomSnapshot.val().player_o_id === currentUser.uid){
                temp_player_id = roomSnapshot.val().player_x_id;
                temp_player_email = roomSnapshot.val().player_x_email;
                
            }
            strangerRoomRef.child(snapshot.val()).update({
                [`player_x_id`]:temp_player_id,
                [`player_x_email`]:temp_player_email,
                [`player_o_id`]:"",
                [`player_o_email`]:"",
            })
            if(roomSnapshot.child('player_o_id').val() == ""){
                firebase.database().ref('StrangerRoom/'+snapshot.val()).remove();
                strangerRoomRef.once("value",(snapshot)=>{
                    let roomID = snapshot.val().room_count - 1
                    strangerRoomRef.update({
                        room_count:roomID,
                    })
                })
            }
            getInfo(snapshot, playerXUsername, playerXImg, playerOUsername, playerOImg);
        })
    
    });
    setTimeout(() => {
        window.location = "option.html"
    }, 500);
}


function startGame(snapshot, user){
    let currentRoom;
    currentRoom = textRoomID.innerHTML.replace("Room ID : ","R");
    let state = snapshot.child(currentRoom).val().state;
    strangerRoomRef.child(currentRoom+"/player_o_id").once("value",(snap)=>{
        if(snap.val() != ""){
            strangerRoomRef.child(currentRoom).update({
                [`state`]:"start"
            })
        }
    })
}

function checkStateRoom(snapshot, user){
    let currentRoom;
    let state;
    userListRef.child(user.uid).once("value",(ssnapshot)=>{
        currentRoom = ssnapshot.val().lastestRoom;
        state = snapshot.child(currentRoom).val().state
        if(state == "start"){
                window.location = "game2.html"
        }
    })
}