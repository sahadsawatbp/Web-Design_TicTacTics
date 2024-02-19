const iconImg = document.getElementById("icon-img");
const profileBox = document.getElementById("box-profile");
const userName = document.getElementById("user-name");


let toggleBox = () => {
    if(profileBox.style.display == "none"){
        profileBox.style.display = "flex";
    }else{
        profileBox.style.display = "none";
    }
    
}
iconImg.addEventListener("click",toggleBox)