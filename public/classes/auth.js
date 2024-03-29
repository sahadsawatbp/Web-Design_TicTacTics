import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
// -------------------------references----------------------------//
const beginBtn = document.getElementById('Begin');
const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");
const signupEmail = document.getElementById("signup-email");
const signupFeedback = document.getElementById("feedback-signup")
const subBtn = document.getElementById("Submit");
const userListRef = firebase.database().ref("UserList")
// -------------------------Store to Firebase----------------------------//
function UserRegister(event){
    event.preventDefault();
    const email = signupEmail.value;
    const password = signupPassword.value;
    const username = signupUsername.value;
    
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(()=>{
        signupFeedback.style = "color:green";
        signupFeedback.innerHTML = `Signup completed.`
        addUser()
    })
    .catch((error)=>{
        signupFeedback.style = "color:crimson";
        signupFeedback.innerHTML = `${error.message}`
    })
    // if(!Validation()){
    //     return;
    // };
    // const dbRef = ref(db);
    // get(child(dbRef, "UsersList/"+username)).then((snapshot)=>{
    //     if(snapshot.exists()){
    //         alert("Account already exists!");
    //     }
    //     else{
    //         set(ref(db,"UsersList/"+username),
    //         {
    //             username:username,
    //             password: password,
    //             email:email,
    //             win_count:0,
    //             room_code:null,
    //             img:""
    //         })
    //         .then(()=>{
    //             alert("User added successfully!");
    //             window.location = "authentication.html"
    //         })
    //         .catch((error)=>{
    //             alert("error "+ error);
    //         })
    //     }
    // })
    
}
let addUser = () =>{
    var email = signupEmail.value;
    var password = signupPassword.value;
    var username = signupUsername.value;
    const currentUser = firebase.auth().currentUser;
    userListRef.child(currentUser.uid).update({
        username: username,
        password: password,
        email:email,
        win_count:0,
        room_code:null,
        img:"",
        lastestRoom:"",
    })
    window.location = "authentication.html"
}
// -------------------------User Login---------------------------//
// const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const loginEmail = document.getElementById("login-email")
const loginBtn = document.getElementById("Login");
const loginFeedback = document.getElementById("feedback-login")
const currentUser = firebase.auth().currentUser;
function UserLogin(event){
    event.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(()=>{
        loginFeedback.style = "color:green";
        loginFeedback.innerHTML = "Login succeed!.";
        login()
        
    }).catch((error)=>{
        loginFeedback.style = "color:crimson";
        loginFeedback.innerHTML = `${error.message}`;
    })
}
function login(user){
    let keepLogin = document.getElementById('Checkbox').checked
    if(!keepLogin){
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location="option.html"
    }
    else{
        localStorage.setItem('KeepLogin','Yes')
        localStorage.setItem('User',JSON.stringify(user))
        window.location="option.html"
    }
    console.log("Yes")
}

// -------------------------Validate----------------------------//
function isEmptySpace(str){
    return str==null || str.match(/^ *$/) !== null;
}
function Validation(){
    let usernamereg = /^[a-zA-z\s]+$/;
    let passwordreg = /^[a-zA-z0-9.*+?^${}()|[\]\\]{5,}$/;
    let emailreg = /^[a-zA-z0-9.*+?^${}()|[\]\\]+@(gmail|yahoo|hotmail|outlook)\.(com|co.th)$/;
    if( isEmptySpace(signupUsername.value) || isEmptySpace(signupPassword.value) || isEmptySpace(signupEmail.value)){
        alert("You can not have white space in any field")
        return false;
    }
    if(!usernamereg.test(signupUsername.value)){
        alert("The name should only contain alphabets!");
        return false;
    }
    if(!passwordreg.test(signupPassword.value)){
        alert("A password should have at least 5 lengths!");
        return false;
    }
    if(!emailreg.test(signupEmail.value)){
        alert("Enter a valid E-mail!!");
        return false;
    }
    return true;
}
//-----------------Index Page---------------//
function BeginPlay(){
    window.location = 'authentication.html'
}


//-----------------Assign Event to Btn---------------//
if(subBtn){
    subBtn.addEventListener('click',UserRegister);
}
if(loginBtn){
    loginBtn.addEventListener('click',UserLogin);
}
if(beginBtn){
    beginBtn.addEventListener('click',BeginPlay)
}



