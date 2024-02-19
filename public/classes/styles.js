const iconImg = document.getElementById("icon-img");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");


let toggleBox = () => {
    if(profileBox.style.display == "none"){
        profileBox.style.display = "flex";
        userName.style.display = "none";
    }else{
        profileBox.style.display = "none";
        userName.style.display = "flex";
    }
    
}
iconImg.addEventListener("click",toggleBox)