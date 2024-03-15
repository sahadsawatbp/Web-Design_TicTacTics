//npm install --save @google-cloud/storage
import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const iconImg = document.getElementById("icon-img");
const gameRef = firebase.database().ref("Room");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn")
const popupScreen = document.getElementById("popup-container")
const editProfile = document.getElementById("edit-profile")
const profileName = document.getElementById("profile-name")
const popupSave = document.getElementById("popup-save")
const popupCancel = document.getElementById("popup-cancel")
var currentUser;
const userListRef = firebase.database().ref("UserList");
const fileBtn = document.getElementById("fileInp")
const profileImg = document.querySelectorAll(".profile-img")
const arrayScoreboard = [];

var fileName;
var fileItem;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        currentUser = user;
        
    }
})
userListRef.once("value",(snapshot)=>{
    updatePlayerProfile(currentUser)
    updateScoreboard(currentUser)
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
            }).then(() => {
                // เมื่ออัปเดตรูปภาพเสร็จสมบูรณ์ ให้อัปเดตโปรไฟล์ของผู้ใช้
                updatePlayerProfile(currentUser);
                popupScreen.style.display = "none"
            }).catch((error) => {
                console.log("Error updating profile:", error);
            });
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

function updateScoreboard(user){
    const scoreboardRef = firebase.database().ref("Scoreboard")
    const scorebardElem = document.querySelectorAll(".scoreboard");
    let tempArray = [];
    let item;
    let currentUserArray=[];
    let currentUserNo;
    let i = 1;
    userListRef.once("value",(snapshot)=>{
        snapshot.forEach(childSnapshot => {
            tempArray.push({
                name:childSnapshot.val().username, img:childSnapshot.val().img, score:childSnapshot.val().win_count, email:childSnapshot.val().email
            }) 
            if(childSnapshot.key === user.uid){
                currentUserArray.push({
                    name:childSnapshot.val().username, img:childSnapshot.val().img, score:childSnapshot.val().win_count, email:childSnapshot.val().email
                })
                
            }
            tempArray.sort((a,b)=> b.score - a.score)
           
        });
        for(let i = 0;i<tempArray.length;i++){
            scoreboardRef.update({
                [i+1]:tempArray[i]
            })
            if(i<5){
                if(tempArray[i].email == user.email){
                    console.log("Yes")
                    scorebardElem[i].classList.add("ifIsYou")
                }
                scorebardElem[i].childNodes[3].setAttribute("src",tempArray[i].img);
                scorebardElem[i].childNodes[5].innerHTML = tempArray[i].name;
                scorebardElem[i].childNodes[7].innerHTML = tempArray[i].score;
            }else if(i == 5){
                scorebardElem[i].childNodes[1].innerHTML = "You";
                scorebardElem[i].childNodes[3].setAttribute("src",currentUserArray[0].img);
                scorebardElem[i].childNodes[5].innerHTML = currentUserArray[0].name;
                scorebardElem[i].childNodes[7].innerHTML = currentUserArray[0].score;
            }

        }
        console.log(scorebardElem[1].childNodes[3].childNodes[3])
        console.log(currentUserNo, currentUserArray, tempArray)
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