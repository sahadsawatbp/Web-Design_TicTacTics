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
let codeRoom = [];
let num;
const currentUser = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        updatePlayerProfile(user)   
        
    }
    
})

let updatePlayerProfile = (user) =>{
    let playerXID = user.uid
    userListRef.child(playerXID).once("value",(snapshot)=>{
        playerXUsername.innerHTML = snapshot.val().username
        playerXImg.setAttribute("src",snapshot.val().img)
    })
    let playerOID = () => {
        
    }
}

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
                [`player_o_email`]:currentUser.email,
                [`player_o_id`]:currentUser.uid,
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
    var codeRoomText="";
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
    const user = firebase.auth().currentUser;
    gameRef.child("Room "+roomID).update({
        [`player_x_email`]:user.email,
        [`player_x_id`]:user.uid,
        [`player_o_email`]:"",
        [`player_o_id`]:"",
       
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