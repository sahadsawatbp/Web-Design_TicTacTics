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
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        updatePlayerProfile(user)   
    }
})

let updatePlayerProfile = (user) =>{
    let roomAs;
    var player = (player_x_id, username, img) =>{
        gameRef.once("value").then((snapshot)=>{
            roomAs = snapshot.child("room_count").val();
            get(child(gameRef, `Room `+roomAs)).then((snapshot)=>{5
                console.log("From mathmaking.js: ",snapshot.child(player_x_id).val())
                if(snapshot.child(player_x_id).val()){
                    let playerID = snapshot.child(player_x_id).val();
                    get(child(userListRef, playerID)).then((snapshot)=>{
                        console.log(snapshot.val().username)
                        username.innerHTML = snapshot.val().username;
                        img.setAttribute('src',snapshot.val().img);
                    })
                }
            })
        })
        var onlineState
    };
    player("player_x_id", playerXUsername, playerXImg);
    player("player_o_id", playerOUsername, playerOImg);
}


let joinRoom = (event) =>{
    event.preventDefault();
    const currentUser = firebase.auth().currentUser;
    console.log("Join ",currentUser)
    gameRef.child("Room 1").once('value',(snapshot)=>{
        if (snapshot.exists()) {
            gameRef.child("Room 1").update({
                [`player_o_email`]:currentUser.email,
                [`player_o_id`]:currentUser.uid,
            })
            window.location = "waitingroom.html"
          } 
        }).catch((error) => {
            console.error(error);
        });
}

let createRoom = () =>{
    var roomID=1;
    var codeRoomText="";
    let codeRoom = [];
    let num;
    const user = firebase.auth().currentUser;
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
        gameRef.child("Room "+roomID).on("value",(snapshot)=>{
            if(snapshot.val().room_code == ""){ 
                for(let i=0;i<6;i++){
                    num = Math.floor(Math.random() * 10);
                    codeRoom.push(num);
                }
                codeRoomText = codeRoom.join("")
                console.log(codeRoomText) 
                gameRef.child("Room "+roomID).update({
                    [`room_code`]:codeRoomText
                })
            }
        })
        gameRef.child("Room "+roomID).update({
            [`player_x_email`]:user.email,
            [`player_x_id`]:user.uid,
            [`player_o_email`]:"",
            [`player_o_id`]:"",
            [`room_code`]:""
        })
    })
    window.location = "waitingroom.html"
}

if(startBtn){
    startBtn.addEventListener("click",()=>{
        window.location = "game.html"
    })
}
if(joinBtn){
    joinBtn.addEventListener("click",joinRoom)
}
if(createBtn){
    createBtn.addEventListener("click",createRoom)
}