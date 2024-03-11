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
const optionMenu = document.getElementById("option-menu");
const joinSaveBtn = document.getElementById("room-save");
const joinCancelBtn = document.getElementById("room-cancel");
const joinID = document.getElementById("join-id");
const backBtn = document.getElementById("option-back");
let roomCode;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        
    }
})

function toggleOption(){
    optionMenu.style.display === "flex" ? optionMenu.setAttribute("style","display: none") : optionMenu.setAttribute("style","display: flex");
    
}

let joinRoom = (roomid) =>{
    let roomData;
    const currentUser = firebase.auth().currentUser;
    let temp_roomCode = "R"+roomid
    gameRef.on('value',(snapshot)=>{
        snapshot.forEach((childSnapshot)=>{
            roomData = childSnapshot.key
            console.log(roomData)
            if(temp_roomCode == roomData){
                gameRef.child(roomData).update({
                    [`player_o_email`]:currentUser.email,
                    [`player_o_id`]:currentUser.uid,
                })
                setLastestThatPlayerIn(currentUser, temp_roomCode)
                setTimeout(() => {
                    window.location = "waitingroom.html"
                }, 1000);
            }
        })  
    })
}
function randomNumber(){
    let arrayCodeRoom = [];
    let codeRoom;
    let num;
    for(let i=0;i<6;i++){
        num = Math.floor(Math.random() * 10);
        arrayCodeRoom.push(num);
    }
    codeRoom = arrayCodeRoom.join("")
    return codeRoom;
}

let createRoom = () =>{
    var roomID=1;
    var randomNum = randomNumber()
    var user = firebase.auth().currentUser;
    gameRef.once('value',(snapshot)=>{
        if (!snapshot.child("room_count").exists() || snapshot.child("room_count").val() === 0) {
            gameRef.set({
                room_count:1,
            })
        }else{
            roomID = snapshot.val().room_count + 1
            gameRef.update({
                room_count:roomID,
            })
            
        }
        gameRef.child("R"+randomNum).update({
            [`player_x_email`]:user.email,
            [`player_x_id`]:user.uid,
            [`player_o_email`]:"",
            [`player_o_id`]:"",
            [`room_id`]:roomID,
            ["state"]:"on hold",
            ["turn"]:"O"
        })
    })
    let temp_roomCode = "R"+randomNum
    setLastestThatPlayerIn(user, temp_roomCode)
    setTimeout(() => {
        window.location = "waitingroom.html"
    }, 1000);
}

function setLastestThatPlayerIn(user, roomid){
    userListRef.child(user.uid).update({
        [`lastestRoom`]:roomid
    })
    console.log(user)
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
if(backBtn){
    backBtn.addEventListener("click",()=>{
        window.location = "option.html"
    })
}