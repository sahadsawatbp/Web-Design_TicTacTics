import {get,child,getDatabase,set,ref,update,remove, onValue} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const joinBtn = document.getElementById("option-join");
const createBtn = document.getElementById("option-create");
const gameRef = firebase.database().ref("Room");
const playerXUsername = document.getElementById("player-x-username");
const playerOUsername = document.getElementById("player-o-username");
const playerXImg = document.getElementById("player-x-img");
const playerOImg = document.getElementById("player-o-img");
const userListRef = firebase.database().ref("UserList");
const startBtn = document.getElementById("start-button");
const currentUser = firebase.auth().currentUser;
const optionMenu = document.getElementById("option-menu");
const joinSaveBtn = document.getElementById("room-save");
const joinCancelBtn = document.getElementById("room-cancel");
const joinID = document.getElementById("join-id");
let roomCode;


function toggleOption(){
    optionMenu.style.display === "flex" ? optionMenu.setAttribute("style","display: none") : optionMenu.setAttribute("style","display: flex");
    
}

let joinRoom = (roomid) =>{
    let roomData;
    const currentUser = firebase.auth().currentUser;
    let temp_roomCode = "R"+roomid
    console.log(temp_roomCode)
    gameRef.on('value',(snapshot)=>{
        snapshot.forEach((childSnapshot)=>{
            roomData = childSnapshot.key
            if(temp_roomCode == roomData){
                gameRef.child(roomData).update({
                    [`player_o_email`]:currentUser.email,
                    [`player_o_id`]:currentUser.uid,
                })
                setTimeout(() => {
                    window.location = "waitingroom.html"
                }, 1000);
            }
            // if(roomData != "room_count"){
            //     gameRef.child(roomData).once('value',(snapshot)=>{
            //     if (snapshot.exists()) {
            //         gameRef.child(roomData).update({
            //             [`player_o_email`]:currentUser.email,
            //             [`player_o_id`]:currentUser.uid,
            //         })
            //         setTimeout(() => {
            //             window.location = "waitingroom.html"
            //         }, 1000);
            //     } 
            //     }).catch((error) => {
            //         console.error(error);
            //     });
            // }
            // gameRef.child("Room 1").once('value',(snapshot)=>{
            // if (snapshot.exists()) {
            //     gameRef.child("Room 1").update({
            //         [`player_o_email`]:currentUser.email,
            //         [`player_o_id`]:currentUser.uid,
            //     })
            //     window.location = "waitingroom.html"
            // } 
            // }).catch((error) => {
            //     console.error(error);
            // });
        })
        
    })
}
let createRoom = () =>{
    var roomID=1;
    var codeRoom="";
    let arrayCodeRoom = [];
    let num;
    const user = firebase.auth().currentUser;
    for(let i=0;i<6;i++){
        num = Math.floor(Math.random() * 10);
        arrayCodeRoom.push(num);
    }
    codeRoom = arrayCodeRoom.join("")
    console.log(codeRoom) 
    gameRef.once('value',(snapshot)=>{
        if (!snapshot.child("room_count").exists()) {
            gameRef.set({
                room_count:1,
            })
        }else{
            roomID = snapshot.val().room_count + 1
            gameRef.update({
                room_count:roomID,
            })
        }
        gameRef.child("R"+codeRoom).update({
            [`player_x_email`]:user.email,
            [`player_x_id`]:user.uid,
            [`player_o_email`]:"",
            [`player_o_id`]:"",
            [`room_id`]:roomID
        })
    })
    setTimeout(() => {
        window.location = "waitingroom.html"
    }, 1000);
}

joinSaveBtn.addEventListener("click",() => joinRoom(roomCode));

joinCancelBtn.addEventListener("click",()=>{
    optionMenu.setAttribute("style","display: none");
})

if(joinID){
    joinID.addEventListener("input",()=>{
        roomCode = joinID.value;
    })
}
if(joinBtn){
    joinBtn.addEventListener("click",toggleOption)
}
if(createBtn){
    createBtn.addEventListener("click",createRoom)
    
}