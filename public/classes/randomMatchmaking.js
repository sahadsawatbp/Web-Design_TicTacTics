//npm install --save @google-cloud/storage
import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const iconImg = document.getElementById("icon-img");
const strangerRoomRef = firebase.database().ref("StrangerRoom");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");
const playWithFriend = document.getElementById("play-with-friend");
const playWithStranger = document.getElementById("play-with-stranger");
const logoutBtn = document.getElementById("logout-btn")
const popupScreen = document.getElementById("popup-container")
const editProfile = document.getElementById("edit-profile")
const profileName = document.getElementById("profile-name")
const popupSave = document.getElementById("popup-save")
const popupCancel = document.getElementById("popup-cancel")
const currentUser = firebase.auth().currentUser
const userListRef = firebase.database().ref("UserList");
const fileBtn = document.getElementById("fileInp")
const profileImg = document.querySelectorAll(".profile-img")
const gameRef = firebase.database().ref("Room");

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

function createRoom(){
    var roomID = 1;
    var randomNum = randomNumber()
    const user = firebase.auth().currentUser;
    strangerRoomRef.once("value",(snapshot)=>{
        //เพิ่มจำนวนการนับห้อง
        if(snapshot.child("room_count").val() === 0 || !snapshot.child("room_count").exists()){
            strangerRoomRef.update({
                room_count:1
            })
        }else{
            roomID = snapshot.val().room_count + 1
            strangerRoomRef.update({
                room_count:roomID,
            })
        }
        //สร้างห้องใหม่
        strangerRoomRef.child("R"+randomNum).set({
            [`player_x_email`]:user.email,
            [`player_x_id`]:user.uid,
            [`player_o_email`]:"",
            [`player_o_id`]:"",
            [`room_id`]:roomID
        })
        let temp_roomCode = "R"+randomNum
        setLastestThatPlayerIn(user, temp_roomCode)
        setTimeout(() => {
            // window.location = "waitingroom.html"
        }, 1000);
    })
}

function setLastestThatPlayerIn(user, roomid){
    userListRef.child(user.uid).update({
        [`lastestRoom`]:roomid
    })
    console.log(user)
}


function joinRandomRoom(){
    strangerRoomRef.once("value",(snapshot)=>{
        if(snapshot.numChildren() === 1){
            createRoom();
        }
        else{
            let snapChildrenLength = snapshot.numChildren();
            console.log('length: ' + snapChildrenLength);
            let availableRooms = [];
            

            snapshot.forEach((childSnapshot) => {
                const player_O_ID = childSnapshot.child("player_o_id").val();
                console.log("Player O ID: ", player_O_ID);
                let roomId = childSnapshot.key;
                if (player_O_ID === ""){
                    availableRooms.push(roomId);
                }
            })
            console.log(availableRooms)
            console.log('room: ' + availableRooms[0])
            console.log('ID: ' + availableRooms[1])
            if (availableRooms.length > 0) {
                let randomRoomId = availableRooms[Math.floor(Math.random() * availableRooms.length)];
                joinRoom(randomRoomId);
            }
        }
    })
};

// function joinRoom(roomId) {
//     const currentUser = firebase.auth().currentUser;
//     let temp_roomCode = "R" + roomId;

//     gameRef.once('value', (snapshot) => {
//         snapshot.forEach((childSnapshot) => {
//             let roomData = childSnapshot.key;
//             if (temp_roomCode === roomData) {
//                 let room = childSnapshot.val();
//                 if (room.playerCount < MAX_ROOM_CAPACITY) {
//                     gameRef.child(roomData).update({
//                         [`player_o_email`]: currentUser.email,
//                         [`player_o_id`]: currentUser.uid,
//                         playerCount: room.playerCount + 1 // เพิ่มจำนวนผู้เล่นในห้อง
//                     });
//                     setLastestThatPlayerIn(currentUser, temp_roomCode);
//                     setTimeout(() => {
//                         window.location = "waitingroom.html";
//                     }, 1000);
//                 } else {
//                     // ห้องเต็ม ให้เรียกฟังก์ชัน joinRandomRoom() เพื่อหาห้องใหม่
//                     joinRandomRoom();
//                 }
//             }
//         });
//     });
// }



playWithFriend.addEventListener("click",()=>{
    window.location = "friendoption.html"
});
playWithStranger.addEventListener("click", joinRandomRoom)

editProfile.addEventListener("click",()=>{
    popupScreen.style.display = "flex"
})
