const iconImg = document.getElementById("icon-img");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");
const playWithFriend = document.getElementById("play-with-friend");
const playWithStranger = document.getElementById("play-with-stranger");
const logoutBtn = document.getElementById("logout-btn")
const currentUser = firebase.auth().currentUser
const userListRef = firebase.database().ref("UserList");

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
    window.location = "game.html"
});
playWithStranger.addEventListener("click",()=>{
    window.location = "index.html"
})
iconImg.addEventListener("click",toggleBox)
if(logoutBtn){
    logoutBtn.addEventListener("click", signOut)
}