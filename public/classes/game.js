// import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
var turn = 'O'
var win = false;
var winner = '';
var cardList = [
    { src: 'img/Swap.png', effect: 'swapSymbol' },
    { src: 'img/Destroy.png', effect: 'destroySymbol' },
    { src: 'img/Shield.png', effect: 'shieldSymbol' }
];
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');
var round = document.getElementById('round');
var roundcount = 1;
var cardactive = false;
var turncount = 0;
var protection = false;
var protectedBlock = null;

var mycard1 = document.getElementById('cy1');

newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {
        roundcount += 1;
        // modify the condition here to continue the game play as long as there is no winner
        if (!win && event.target.innerHTML === '' && cardactive === false) {
            // 4. Modify the code here to check whether the clicking block is avialable.         

            event.target.innerHTML = turn;
            if (turn === 'O') {
                event.target.style.color = '#1F34B8';
            }
            else if (turn === 'X') {
                event.target.style.color = '#D61A3C';
            }
            checkResult();
        }
        
        if (cardactive === true && event.target.innerHTML !== '') {
            if (document.querySelector("#cy1").src === 'img/Swap.png') {
                // ทำการสลับสัญลักษณ์ในช่องบนกระดาน
                swapSymbol(event.target);
            }
            if (cardImageSrc.includes('Destroy.png')) {
                // ทำการลบ xo ในช่องบนกระดาน
                destroySymbol(event.target);
            }

            mycard1.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
            mycard1.style.transform = '';
            mycard1.style.filter = '';
            mycard1.style.transition = "all 0.5s";
            mycard1.style.transform = "translateY(0px)";
        }
    }
}

function checkResult() {
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
        turnObject.innerHTML = "Game win by " + winner;
    } else if (isBoardFull()) {
        // Game end and no-one wins the game
        turnObject.innerHTML = "Game draw";
    } else {
        // The game is on going
        turn = turn === 'O' ? 'X' : 'O';
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
    newTurn();
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
    var cardBoxes = document.querySelectorAll('.cardbox-your .card-container');

    cardBoxes.forEach(function (cardContainer) {
        var card = cardContainer.querySelector('.card');
        if (!card || (card && card.src.includes('img/Card.png'))) {
            var cardInfo = getRandomCard(cardList);
            cardContainer.innerHTML = `<img src="${cardInfo.src}" alt="Card" class="card" onclick="${cardInfo.effect}(this)">`;
        }
    });
}

function resetCardImage() {
    var cardBoxes = document.querySelectorAll('.cardbox-your .card-container'); // เลือกช่องสำหรับการ์ดที่ต้องการให้สุ่ม

    cardBoxes.forEach(function (cardContainer) {
        var card = cardContainer.querySelector('.card'); // ตรวจสอบว่ามีการ์ดในช่องนี้หรือไม่
        if (card && card.src.includes('img/')) {
            // เช็คว่าการ์ดนี้ถูกใช้งานหรือไม่
            var isCardActive = card.classList.contains('active-card');
            if (isCardActive) {
                cardContainer.innerHTML = `<img src="img/Card.png" alt="Card" class="card" onclick="usecard()">`; // ใส่รูปภาพ card.png ในช่องการ์ดแต่ละช่อง
            }
        }
    });
}

function swapSymbol(block) {
    if (protection === false && cardactive === true) {
        if (block.innerHTML === 'X') {
            block.innerHTML = 'O';
            block.style.color = '#1F34B8';
        }
        else if (block.innerHTML === 'O') {
            block.innerHTML = 'X';
            block.style.color = '#D61A3C';
        }
    }
    cardactive = false;
    resetCardImage();
    console.log(cardactive)
}

function destroySymbol(block) {
    if (protection === false) {
        if (block.innerHTML !== '') {
            block.innerHTML = '';
        }
    }
    cardactive = false;
    console.log(cardactive)
}

function destroySymbol(block) {
    if (protection === false) {
        if (block.innerHTML !== '') {
            block.innerHTML = '';
        }
    }
    cardactive = false;
    console.log(cardactive)
}

function shieldSymbol(block) {
    protectedBlock = block; // กำหนดบล็อกที่ถูกป้องกัน
    setTimeout(function () {
        protectedBlock = null; // หลังจากผ่านไปเวลา 1 วินาที บล็อกที่ถูกป้องกันจะถูกปลดป้อง
    }, 10000); // 1 วินาที
}

function usecard(cardContainer) {
    var card = cardContainer.querySelector('.card');
    if (cardactive === false) {
        cardactive = true; // กำหนดว่าการ์ดถูกคลิกแล้ว
        // สามารถคลิกที่ช่องบนกระดานได้
        mycard1.style.backgroundColor = 'hsl(263, 90%, 51%)';
        mycard1.style.transform = 'scale(1.1)';
        mycard1.style.filter = 'drop-shadow(0 0px 12px hsl(263, 90%, 51%))';
        mycard1.style.transition = "all 0.5s";
        mycard1.style.transform = "translateY(-15px)";
        var cardEffect = cardList.find(cardInfo => cardInfo.id === card.id)?.effect; // ค้นหาเอฟเฟคของการ์ดที่ถูกใช้งาน
        if (cardEffect) {
            window[cardEffect](card);
        }
    }
    console.log(cardactive);
}
