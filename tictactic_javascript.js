// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNHATSXeQJSvwU_fRlqAHJMwqi40ePsj0",
  authDomain: "fir-tictactic.firebaseapp.com",
  projectId: "fir-tictactic",
  storageBucket: "fir-tictactic.appspot.com",
  messagingSenderId: "469562598973",
  appId: "1:469562598973:web:375815c759c23d7806ac54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase,ref,set,child,get,update,remove}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase();


// -------------------------references----------------------------//
var usernameBox = document.getElementById("Usernamebox");
var passwordBox = document.getElementById("Passwordbox");
var emailBox = document.getElementById("Emailbox");
var subBtn = document.getElementById("Submit");
var loginBtn = document.getElementById("Login");
let beginBtn = document.getElementById('Begin');


// -------------------------Validate----------------------------//
function isEmptySpace(str){
    return str==null || str.match(/^ *$/) !== null;
}
function Validation(){
    let usernamereg = /^[a-zA-z\s]+$/;
    let passwordreg = /^[a-zA-z0-9.*+?^${}()|[\]\\]{5,}$/;
    let emailreg = /^[a-zA-z0-9.*+?^${}()|[\]\\]+@(gmail|yahoo|hotmail|outlook)\.(com|co.th)$/;
    if( isEmptySpace(usernameBox.value) || isEmptySpace(passwordBox.value) || isEmptySpace(emailBox.value)){
        alert("You can not have white space in any field")
        return false;
    }
    if(!usernamereg.test(usernameBox.value)){
        alert("The name should only contain alphabets!");
        return false;
    }
    if(!passwordreg.test(passwordBox.value)){
        alert("A password should have at least 5 lengths!");
        return false;
    }
    if(!emailreg.test(emailBox.value)){
        alert("Enter a valid E-mail!!");
        return false;
    }
    return true;
}


// -------------------------Store to Firebase----------------------------//
function UserRegister(){
    if(!Validation()){
        return;
    };
    const dbRef = ref(db);
    get(child(dbRef, "UsersList/"+usernameBox.value)).then((snapshot)=>{
        if(snapshot.exists()){
            alert("Account already exists!");
        }
        else{
            set(ref(db,"UsersList/"+usernameBox.value),
            {
                username:usernameBox.value,
                password: passwordBox.value,
                email:emailBox.value,
                win_count:0
            })
            .then(()=>{
                alert("User added successfully!");
                window.location = "authentication.html"
            })
            .catch((error)=>{
                alert("error "+ error);
            })
        }
    })
}


// -------------------------User Login---------------------------//
function UserLogin(){
    const dbRef = ref(db);
    get(child(dbRef, "UsersList/"+usernameBox.value)).then((snapshot)=>{
        if(snapshot.exists()){
            let dbpass = snapshot.val().password;
            if(dbpass == passwordBox.value){
                login()
            }
            else{
                alert("User does not exists")
            }
        }
        else{
            alert("Username or password is invalid")
        }
       
    })
}
function login(user){
    let keepLogin = document.getElementById('Checkbox').checked
    if(!keepLogin){
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location="home.html"
    }
    else{
        localStorage.setItem('KeepLogin','Yes')
        localStorage.setItem('User',JSON.stringify(user))
        window.location="home.html"
    }
    console.log("Yes")
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



