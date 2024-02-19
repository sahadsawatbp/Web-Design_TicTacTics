var ref = firebase.database().ref("UserList");
var img = document.getElementById("profile-img")
var id = 0;
var username = "";
const userListRef = firebase.database().ref("UserList");
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        console.log(user.uid);
        id = user.uid
        getList(user)
    }
    setupUI(user)
})

let getList = (user) =>{
    if(user){
        userListRef.child(user.uid).on("value",(snapshot)=>{
            readList(snapshot);
        });
    };
};

let readList = () => {
    userListRef.child(id).once("value").then((snapshot) => {
        snapshot.forEach((data) => {
                var id = data.key;
                username = snapshot.child(id).val().username;
                document.querySelector("#user-name").innerHTML= username; 
                
        });    
    });
}


let setupUI = (user) =>{
    if(user){
        
    }
};