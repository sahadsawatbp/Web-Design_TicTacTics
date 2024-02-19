//npm install --save @google-cloud/storage
const iconImg = document.getElementById("icon-img");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");
const playWithFriend = document.getElementById("play-with-friend");
const playWithStranger = document.getElementById("play-with-stranger");
const logoutBtn = document.getElementById("logout-btn")
const popupScreen = document.getElementById("popup-container")
const editProfile = document.getElementById("edit-profile")
const popupSave = document.getElementById("popup-save")
const popupCancel = document.getElementById("popup-cancel")
const currentUser = firebase.auth().currentUser
const userListRef = firebase.database().ref("UserList");
const fileBtn = document.getElementById("fileInp")
var fileName;
var fileItem;

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
        console.log("Eroor is ",error);
    },() =>{
        uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
            console.log("URL",url);
        })
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
        console.log(currentUser)
    }).catch((error)=>{

    })
}



playWithFriend.addEventListener("click",()=>{
    window.location = "friendoption.html"
});
playWithStranger.addEventListener("click",()=>{
    window.location = "index.html"
})
editProfile.addEventListener("click",()=>{
    popupScreen.style.display = "flex"
})
popupCancel.addEventListener("click",()=>{
    popupScreen.style.display = "none"
})
popupSave.addEventListener("click",uploadImage)
fileBtn.addEventListener("change",getFile)
iconImg.addEventListener("click",toggleBox)
if(logoutBtn){
    logoutBtn.addEventListener("click", signOut)
}