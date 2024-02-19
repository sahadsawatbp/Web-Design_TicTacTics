const joinBtn = document.getElementById("option-join")
const gameRef = firebase.database().ref("Game")

let joinGame = (event) =>{
    const currentUser = firebase.auth().currentUser;
    console.log("Join ",currentUser)
    if(currentUser){
        const btnJoinID = currentUser.email;
        const player = btnJoinID[btnJoinID.length-1];
        
    }
}





if(joinBtn){
    joinBtn.addEventListener("click",joinGame)
}