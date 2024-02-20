const joinBtn = document.getElementById("option-join");
const createBtn = document.getElementById("option-create");
const gameRef = firebase.database().ref("Room");
const playerXUsername = document.getElementById("player-x-username");
const playerOUsername = document.getElementById("player-o-username");
const playerXImg = document.getElementById("player-x-img");
const playerOImg = document.getElementById("player-o-img");
const userListRef = firebase.database().ref("UserList");
const startBtn = document.getElementById("start-button");
var roomID;
const currentUser = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        if(playerXUsername){
            updatePlayerProfile(user)   
        }
    }
})
let roomSetup = () =>{
    gameRef.child("Room Count").once('value',(snapshot)=>{
        if (!snapshot.exists()) {
            gameRef.child("Room Count").update({
                times:1,
            })
        }
        roomID = snapshot.val().times;
    })
}
roomSetup();

let joinRoom = (event) =>{
    event.preventDefault();
    const currentUser = firebase.auth().currentUser;
    console.log("Join ",currentUser)
    gameRef.child("Room "+roomID).once('value',(snapshot)=>{
        if (snapshot.exists()) {
            gameRef.child("Room "+(roomID)).update({
                [`player-o-email`]:currentUser.email,
                [`player-o-id`]:currentUser.uid,
            })
            gameRef.child("Room Count").update({
                times:(roomID+1)
            })
            window.location = "waitingroom.html"
          } 
        }).catch((error) => {
          console.error(error);
        });
    roomSetup();
    console.log(roomID)
    
}

let createRoom = () =>{
    const user = firebase.auth().currentUser;
    gameRef.child("Room "+roomID).update({
        [`player-x-email`]:user.email,
        [`player-x-id`]:user.uid,
        [`player-o-email`]:"",
        [`player-o-id`]:"",
    })
    window.location = "waitingroom.html"
}

let updatePlayerProfile = (user) =>{
    userListRef.child(user.uid).once("value",(snapshot)=>{
        playerXUsername.innerHTML = snapshot.val().username
    })
   
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