//npm install --save @google-cloud/storage
import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const iconImg = document.getElementById("icon-img");
const gameRef = firebase.database().ref("Room");
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
var fileName;
var fileItem;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        updatePlayerProfile(user)
    }
})

function getFile(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
}
let uploadImage = () => {
    let storageRef = firebase.storage().ref("images/"+fileName);
    let uploadTask = storageRef.put(fileItem);

    uploadTask.on("state_changed",(snapshot)=>{
        console.log(snapshot);
    },(error)=>{
        console.log("Error is ",error);
    },() =>{
        const currentUser = firebase.auth().currentUser
        uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
            console.log("URL",url);

            userListRef.child(currentUser.uid).update({
                img:url
            })
        })
        
    })
}
let updatePlayerProfile = (user) =>{
    userListRef.child(user.uid).once("value",(snapshot)=>{
        profileName.innerHTML = snapshot.val().username;
        userName.innerHTML = snapshot.val().username
        for(let i=0;i<profileImg.length;i++){
            profileImg[i].setAttribute("src",snapshot.val().img)
            
        }
        // iconImg.setAttribute("src",snapshot.val().img)
        if(snapshot.val().img == ""){
            profileImg.setAttribute("src","img/user.png")
        }
    })
}


popupScreen.style.display = "none"
profileBox.style.display = "none";
userName.style.display = "flex";

let toggleBox = () => {
    if(profileBox.style.display == "none"){
        profileBox.style.display = "flex";
        userName.style.display = "none";
    }else{
        profileBox.style.display = "none";
        userName.style.display = "flex";
    }
}

let signOut = () => {
    firebase.auth().signOut().then(()=>{
        window.location = "authentication.html"
    }).catch((error)=>{

    })
}






editProfile.addEventListener("click",()=>{
    popupScreen.style.display = "flex"
})
fileBtn.addEventListener("change",getFile)
popupCancel.addEventListener("click",()=>{
    popupScreen.style.display = "none"
})
popupSave.addEventListener("click",uploadImage)

iconImg.addEventListener("click",toggleBox)
if(logoutBtn){
    logoutBtn.addEventListener("click", signOut)
}