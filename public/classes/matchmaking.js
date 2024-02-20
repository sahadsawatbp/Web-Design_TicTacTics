const joinBtn = document.getElementById("option-join");
const createBtn = document.getElementById("option-create");
const gameRef = firebase.database().ref("Room");

var roomID;
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
    const currentUser = firebase.auth().currentUser;
    console.log("Join ",currentUser)
    gameRef.child("Room "+roomID).once('value',(snapshot)=>{
        if (snapshot.exists()) {
            gameRef.child("Room "+(roomID)).update({
                [`player-o-email`]:currentUser.email,
                [`player-o-id`]:currentUser.uid,
            })
            gameRef.child("Room Count").update({
                times:(roomID+1)
            })
          } 
        //   else {
        //     console.log("No data available");
        //     createRoom(currentUser);
        //   }
        }).catch((error) => {
          console.error(error);
        });
       
    if(currentUser){
        const btnJoinID = currentUser.email;
        const player = btnJoinID[btnJoinID.length-1];
        
    }
    roomSetup();
    console.log(roomID)
}

let createRoom = () =>{
    const user = firebase.auth().currentUser;
    gameRef.child("Room "+roomID).update({
        [`player-x-email`]:user.email,
        [`player-x-id`]:user.uid,
        [`player-o-email`]:"",
        [`player-o-id`]:"",
    })
    window.location = "playVSfriend.html"
}



if(joinBtn){
    joinBtn.addEventListener("click",joinRoom)
}
if(createBtn){
    createBtn.addEventListener("click",createRoom)
}