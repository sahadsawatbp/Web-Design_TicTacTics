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
            var randomRoom = Math.ceil(Math.random() * (snapChildrenLength - 1) + 1) ;
            let array=[];
            strangerRoomRef.endAt(snapChildrenLength).limit.once("value",(snapshot_random)=>{
                console.log(snapshot_random.val())
                snapshot_random.forEach((childSnapshot_random)=>{
                    // if(childSnapshot_random.key !== "room_count"){
                    //     array.push(childSnapshot_random.key)
                    // }
                })
               
            })
            
        }
    })
    
    
};




playWithFriend.addEventListener("click",()=>{
    window.location = "friendoption.html"
});
playWithStranger.addEventListener("click", joinRandomRoom)

editProfile.addEventListener("click",()=>{
    popupScreen.style.display = "flex"
})
