// import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
let gameRef = firebase.database().ref("StrangerRoom");
let userListRef = firebase.database().ref("UserList");

// var turn = 'O'
var turn;
var win = false;
var winner = '';
var cardList = [
    { src: 'img/Swap.png', effect: 'swapSymbol' },
    { src: 'img/Destroy.png', effect: 'destroySymbol' },
    { src: 'img/Shield.png', effect: 'shieldSymbol' },
    { src: 'img/Draw.png', effect: 'drawCard' },
    { src: 'img/Deny.png', effect: 'denyCard' }
];
const cardbox1 = document.getElementById('cardbox1');
const cardbox2 = document.getElementById('cardbox2');
const cardbox3 = document.getElementById('cardbox3');
var cardBoxes = document.querySelectorAll('.cardbox-your .card-container');
var exitRoom = document.getElementById("exit-room");
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');
var round = document.getElementById('round');
var winner_container = document.getElementById("winner-container");
var winner_text = document.getElementById("winner-text");
var winner_back = document.getElementById("winner-back");
var won_text = document.getElementById("won-text");
var winnerimg2 = document.getElementById("winnerimg2");
var roundcount = 1;
var roundcheck = 0;
var turncount = 0;
var turncountfordeny = 0;
var cardactive = false;
var cardUsed = false;
var isdeny = false;
var protectedBlock = null;
var mycard1 = document.getElementById('cy1');
var selected_card;
var roomID = document.getElementById('room-id');
var phase = 1;
var yourTurn


newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {

        //By mai
        var user = firebase.auth().currentUser;
        let temp_roomID = roomID.innerHTML.replace("Room ID : ", "R")
        gameRef.child(temp_roomID + "/turn").once("value", (snapshot) => {
            turn = snapshot.val()
            roundcheck = Math.ceil(roundcount / 2);
            // modify the condition here to continue the game play as long as there is no winner
            console.log("Turn : " + turn + " Your Turn : " + yourTurn)
            if (!win && event.target.innerHTML === '' && cardactive === false && turn === yourTurn) {
                // 4. Modify the code here to check whether the clicking block is avialable.         
                roundcount += 1;
                event.target.innerHTML = turn;
                console.log(turn)

                if (turn == 'O') {
                    event.target.style.color = '#1F34B8';

                    //By mai
                    saveXOToDB(user, event.target.id, yourTurn)

                }
                else if (turn == 'X') {
                    event.target.style.color = '#D61A3C';

                    //By mai
                    saveXOToDB(user, event.target.id, yourTurn)

                }

            }
            console.log('roundcheck : ' + roundcheck)
            console.log('round : ' + Math.ceil(roundcount / 2))
            if (roundcheck !== Math.ceil(roundcount / 2)) {
                setTimeout(function () {
                    newTurn();
                }, 1000); // 1 วินาที = 1000
            }

            if (roundcount >= turncount + 2) {
                protectedBlock = null;
            }

            if (roundcount >= turncountfordeny + 2) {
                isdeny = false;
            }

            if (cardactive === true && isdeny === false) {
                if (event.target.innerHTML !== '') {
                    if (selected_card.src.includes('Swap.png')) {
                        // ทำการสลับสัญลักษณ์ในช่องบนกระดาน
                        swapSymbol(event.target);
                    }
                    if (selected_card.src.includes('Destroy.png')) {
                        // ทำการลบ xo ในช่องบนกระดาน
                        destroySymbol(event.target);
                    }
                    if (selected_card.src.includes("Shield.png")) {
                        // ทำการปกป้อง XO ในช่องบนกระดาน
                        turncount = roundcount;
                        shieldSymbol(event.target)
                    }
                }
                if (selected_card.src.includes("Draw.png")) {
                    drawCard()
                }
                if (selected_card.src.includes("Deny.png")) {
                    turncountfordeny = roundcount;
                    denyCard()
                }
            }
            else if (cardactive === true && isdeny === true) {
                alert('คุณถูกห้ามใช้การ์ด!');
            }
        })
    }
}

function checkResult(user, turn, currentRoom) {
    var size = 5;
    // 2. Modify the code here to check whether someone win the game
    // ตรวจสอบการชนะในแถวแนวนอน
    for (var i = 0; i < size; i++) {
        if (blocks[i * size].innerHTML !== '') {
            var rowWin = true;
            for (var j = 1; j < size; j++) {
                if (blocks[i * size].innerHTML !== blocks[i * size + j].innerHTML) {
                    rowWin = false;
                    break;
                }
            }
            if (rowWin) {
                win = true;
                break;
            }
        }
    }

    // ตรวจสอบการชนะในแถวแนวตั้ง
    for (var i = 0; i < size; i++) {
        if (blocks[i].innerHTML !== '') {
            var colWin = true;
            for (var j = 1; j < size; j++) {
                if (blocks[i].innerHTML !== blocks[i + j * size].innerHTML) {
                    colWin = false;
                    break;
                }
            }
            if (colWin) {
                win = true;
                break;
            }
        }
    }

    // ตรวจสอบการชนะในแถวแนวทแยงซ้ายไปขวา
    if (blocks[0].innerHTML !== '') {
        var diagonalWin = true;
        for (var i = 1; i < size; i++) {
            if (blocks[0].innerHTML !== blocks[i * (size + 1)].innerHTML) {
                diagonalWin = false;
                break;
            }
        }
        if (diagonalWin) {
            win = true;
        }
    }

    // ตรวจสอบการชนะในแถวแนวทแยงขวาไปซ้าย
    if (blocks[size - 1].innerHTML !== '') {
        var revDiagonalWin = true;
        for (var i = 1; i < size; i++) {
            if (blocks[size - 1].innerHTML !== blocks[(i + 1) * (size - 1)].innerHTML) {
                revDiagonalWin = false;
                break;
            }
        }
        if (revDiagonalWin) {
            win = true;
        }
    }
    function isBoardFull() {
        for (var block of blocks) {
            if (block.innerHTML === '') {
                return false;
            }
        }
        return true;
    }

    if (win) {
        //Game end and someone wins the game
        winner = turn;
        winner = winner === "X" ? turnObject.innerHTML = "Game win by O" : turnObject.innerHTML = "Game win by X";
        winner = winner.replace("Game win by ","");
        winner_container.style.display = "flex";
        winner_back.addEventListener("click",()=>{
            exitRooms();
        })
        updateScore(user, winner, currentRoom)
    } else if (isBoardFull()) {
        // Game end and no-one wins the game
        turnObject.innerHTML = "Game draw";
    } else {
        // turn = turn === 'O' ? 'X' : 'O';
        turnObject.innerHTML = "Turn: " + turn;
        round.innerHTML = 'Round: ' + Math.ceil(roundcount / 2);
    }
}
function newGame() {
    turn = 'O';
    round.innerHTML = 'Round: ' + Math.ceil(roundcount / 2);
    turnObject.innerHTML = "Turn: " + turn;
    winner = '';
    win = false;
    // 3. Modify the code here to reset the game to initial state
    for (var block of blocks) {
        block.innerHTML = '';
    }
    for (var i = 0; i < 2; i++) {
        newTurn();
    }
}

// ฟังก์ชันสุ่มรูปภาพจากอาร์เรย์ของการ์ด
function getRandomCard() {
    var randomIndex = Math.floor(Math.random() * cardList.length);
    return cardList[randomIndex];
}

// ฟังก์ชันที่ใช้ในการกำหนดการ์ดให้กับการ์ดในแต่ละช่อง
function setCardImage() {
    var cards = document.querySelectorAll('.card'); // เลือกการ์ดทั้งหมด
    cards.forEach(function (card) {
        card.style.backgroundImage = getRandomImage(); // กำหนดรูปภาพสุ่มให้กับการ์ดแต่ละใบ
    });
}

function newTurn() {
    // สร้างการ์ดใหม่เพิ่ม 1 ใบบนช่องที่ไม่มีการ์ดอยู่
    var emptyCardBoxes = Array.from(cardBoxes).filter(cardContainer => {
        var card = cardContainer.querySelector('.card');
        return !card || (card && card.src.includes('img/Card.png'));
    });

    if (emptyCardBoxes.length > 0) {
        var randomIndex = Math.floor(Math.random() * emptyCardBoxes.length);
        var cardContainer = emptyCardBoxes[randomIndex];
        var card = cardContainer.querySelector('.card');
        var cardInfo = getRandomCard(cardList);
        card.setAttribute("src", `${cardInfo.src}`);
        card.addEventListener("click", ()=>{
            `${cardInfo.effect}()`
        })
    }
}

function resetCardImage() {
    cardBoxes.forEach(function (cardContainer) {
        var card = cardContainer.querySelector('.card');
        var cardInfo = getRandomCard(cardList);
        if (card === selected_card) {
            card.setAttribute("src", "img/Card.png");
            card.removeEventListener("click", ()=>{
                `${cardInfo.effect}()`});
        }
    });
}

function swapSymbol(block) {
    let currentRoom;
    console.log(block.id)
    const user = firebase.auth().currentUser
    userListRef.child(user.uid).once("value", (snapshot) => {
        currentRoom = snapshot.val().lastestRoom;
        gameRef.child(currentRoom).child("table/"+block.id).once("value", (tableSnapshot) => {
            if(block !== protectedBlock){
                if(tableSnapshot.val() == "X"){
                    gameRef.child(currentRoom).child("table").update({
                        [block.id]:"O"
                    })
                }if(tableSnapshot.val() == "O"){
                    gameRef.child(currentRoom).child("table").update({
                        [block.id]:"X"
                    })
                }
            }
        })
    })

    // if (block !== protectedBlock) {
    //     if (block.innerHTML === 'X') {
    //         block.innerHTML = 'O';
    //         block.style.color = '#1F34B8';
    //     }
    //     else if (block.innerHTML === 'O') {
    //         block.innerHTML = 'X';
    //         block.style.color = '#D61A3C';
    //     }
    // }
   
    cardUsed = false;
    cardactive = false;
    resetCardImage();
    cancelcardeffect()
    console.log("Active ",cardactive)
    console.log("Used ",cardUsed)
}

function destroySymbol(block) {
    let currentRoom;
    console.log(block.id)
    const user = firebase.auth().currentUser
    userListRef.child(user.uid).once("value", (snapshot) => {
        currentRoom = snapshot.val().lastestRoom;
        gameRef.child(currentRoom).child("table/"+block.id).once("value", (tableSnapshot) => {
            if(block !== protectedBlock){
                if(tableSnapshot.val() !== ""){
                    gameRef.child(currentRoom).child("table").update({
                        [block.id]:""
                    })
                }
            }
        })
    })
    // if (block !== protectedBlock) {
    //     if (block.innerHTML !== '') {
    //         block.innerHTML = '';
    //     }
    // }
    cardUsed = false;
    cardactive = false;
    resetCardImage()
    cancelcardeffect()
    console.log("Active ",cardactive)
    console.log("Used ",cardUsed)
}

function shieldSymbol(block) {
    protectedBlock = block; // กำหนดบล็อกที่ถูกป้องกัน
    cardUsed = false;
    cardactive = false;
    resetCardImage()
    cancelcardeffect()
    console.log("Active ",cardactive)
    console.log("Used ",cardUsed)
    // setTimeout(function () {
    //      // หลังจากผ่านไปเวลา 1 วินาที บล็อกที่ถูกป้องกันจะถูกปลดป้อง
    // }, 10000); // 1 วินาที
}

function drawCard() {
    resetCardImage();
    setTimeout(function () {
        for (var i = 0; i < 2; i++) {
            newTurn();
        }
    }, 500);
    cardUsed = false;
    cardactive = false;
    cancelcardeffect()
    console.log("Active ",cardactive)
    console.log("Used ",cardUsed)
}

function denyCard() {
    isdeny = true;
    resetCardImage();
    cardUsed = false;
    cardactive = false;
    cancelcardeffect()
    console.log("Active ",cardactive)
    console.log("Used ",cardUsed)
}

function useCards(cardContainer) {
    var card = cardContainer.querySelector('.card');
    selected_card = card
    console.log("b Active "+cardactive)
    console.log("b Used ",cardUsed)
    if (cardactive === false && !card.src.includes('img/Card.png') && cardUsed === false) {
        cardactive = true; // กำหนดว่าการ์ดถูกคลิกแล้ว
        // สามารถคลิกที่ช่องบนกระดานได้
        card.style.backgroundColor = 'hsl(263, 90%, 51%)';
        card.style.transform = 'scale(1.1)';
        card.style.filter = 'drop-shadow(0 0px 12px hsl(263, 90%, 51%))';
        card.style.transition = "all 0.5s";
        card.style.transform = "translateY(-15px)";
        var cardEffect = cardList.find(cardInfo => cardInfo.id === card.id)?.effect; // ค้นหาเอฟเฟคของการ์ดที่ถูกใช้งาน
        if (cardEffect) {
            window[cardEffect](card);
        }
        // console.log(" 344 use "+cardactive)
        
    }
    else if(cardactive === true && cardUsed === false){
        console.log("yes")
        CancelCard(cardContainer)
        cancelcardeffect()
        cardactive = false;
    }
    else{

    }
    console.log("a Active "+cardactive)
    console.log("a Used ",cardUsed)
}

function CancelCard(cardContainer) {
    var card = cardContainer.querySelector('.card');
    if (cardactive === true && cardUsed === true) {
        card.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
        card.style.transform = '';
        card.style.filter = '';
        card.style.transition = "all 0.5s";
        card.style.transform = "translateY(0px)";
        var cardEffect = cardList.find(cardInfo => cardInfo.id === card.id)?.effect; // ค้นหาเอฟเฟคของการ์ดที่ถูกใช้งาน
        if (cardEffect) {
            window[cardEffect](card);
        }
        cardactive = false; // กำหนดว่าการ์ดถูกคลิกแล้ว
        cardUsed = false;
        console.log(" 374 Cancel "+cardactive)
    }
}

function cancelcardeffect() {
    selected_card.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
    selected_card.style.transform = '';
    selected_card.style.filter = '';
    selected_card.style.transition = "all 0.5s";
    selected_card.style.transform = "translateY(0px)";
}





//By mai
var currentUser;
firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
})

gameRef.on("value", (snapshot) => {
    updateRoomID(currentUser)
    updateTable(currentUser);
    checkStateRoom(snapshot, currentUser)
})


//Multiplayer
function saveXOToDB(user, blockID, side) {
    let currentRoom;
    userListRef.child(user.uid).once("value",(snapshot)=>{
        currentRoom = snapshot.val().lastestRoom;
        gameRef.child(currentRoom).child("table").update({
            [blockID]: side,
        })
        if (side == "O") {
            gameRef.child(currentRoom).update({
                turn: "X"
            })
        }
        else if (side == "X") {
            gameRef.child(currentRoom).update({
                turn: "O"
            })
        }
    })

}


function updateTable(user) {
    let currentRoom;
    userListRef.child(user.uid).once("value", (snapshot) => {
        currentRoom = snapshot.val().lastestRoom;
        gameRef.child(currentRoom).child("table").on("value", (tableSnapshot) => {
            tableSnapshot.forEach((col) => {
                for (block of blocks) {
                    if (block.id == col.key) {
                        block.innerHTML = col.val()
                        block.style.color = col.val() == "X" ? block.style.color = '#D61A3C' : block.style.color = '#1F34B8';
                    }
                }
            })
        })
        gameRef.child(currentRoom + "/turn").once("value", (turnSnapshot) => {
            checkResult(user, turnSnapshot.val(), currentRoom);
        })

        gameRef.child(currentRoom).child("card").on("value", (tableSnapshot) => {

        })
    })
}


function updateRoomID(user) {
    userListRef.child(user.uid).once("value", (snapshot) => {
        let temp_roomID = snapshot.val().lastestRoom.replace("R", "");
        roomID.innerHTML = `Room ID : ${temp_roomID}`
        checkYourSide(user);
    })
}

function checkYourSide(user) {
    let temp_roomID = roomID.innerHTML.replace("Room ID : ", "R");
    gameRef.child(temp_roomID).once("value", (snapshot) => {
        yourTurn = snapshot.val().player_x_id == user.uid ? "X" : "O";
        let turn_o = snapshot.val().player_o_id == user.uid ? "O" : "X";
        return turn;
    })
}

function updateScore(user, winner, currentRoom){
    let winner_email;
    let winner_winCount
    userListRef.child(user.uid).endAt(1).once("value",(userSnapshot)=>{
        winner_email = userSnapshot.val().email
        winner_winCount = userSnapshot.val().win_count + 1
        gameRef.child(currentRoom+"/player_"+winner.toLowerCase()+"_email").once("value",(snapshot)=>{
            console.log(snapshot.val())
        
            if(snapshot.val() ==  winner_email){
                userListRef.child(user.uid).update({
                [`win_count`]:winner_winCount
                })
            }
            if(snapshot.val() === user.email){
                // winner_container.innerHTML 
                winnerimg2.setAttribute("src","img/winner.png")
                winner_text.innerHTML = `Congratulation, <b>${userSnapshot.val().username}</b>`
                won_text.innerHTML = `You are winner`
                
            }else if(snapshot.val() !== user.email){
                winnerimg2.setAttribute("src","img/laurel.png")
                winner_text.innerHTML = `Sorry, <b>${userSnapshot.val().username}</b>`
                won_text.innerHTML = `You are loser`
                console.log("You are loser")
            }
        })
    })
}

exitRoom.addEventListener("click",function(){
    exitRooms()
})
function exitRooms(){
    let currentRoom;
    console.log(yourTurn)
    const user = firebase.auth().currentUser
    userListRef.child(user.uid).once("value", (snapshot) => {
        currentRoom = snapshot.val().lastestRoom;
        gameRef.child(currentRoom).update({
            [`/state`]:"on hold"
        })
        updateTable(currentUser);
    })
    
}
function checkStateRoom(snapshot, user){
    console.log("check state")
    let currentRoom;
    let state;
    userListRef.child(user.uid).once("value",(ssnapshot)=>{
        currentRoom = ssnapshot.val().lastestRoom;
        state = snapshot.child(currentRoom).val().state
        if(state == "on hold"){
            gameRef.child(currentRoom).remove()
            setTimeout(() => {
                window.location = "option.html"
            }, 500); // .5 วินาที
        }
    })
}

cardbox1.addEventListener("click", function() {
    useCards(this);
});
cardbox2.addEventListener("click", function() {
    useCards(this);
});
cardbox3.addEventListener("click", function() {
    useCards(this);
});