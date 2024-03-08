// import {get,child,getDatabase,set,ref,update,remove} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
var turn = 'O'
var win = false;
var winner = '';
var cardList = [
    { src: 'img/Swap.png', effect: 'swapSymbol' },
    { src: 'img/Destroy.png', effect: 'destroySymbol' },
    { src: 'img/Shield.png', effect: 'shieldSymbol' },
    { src: 'img/Draw.png', effect: 'drawCard' }
];
var cardBoxes = document.querySelectorAll('.cardbox-your .card-container');
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');
var round = document.getElementById('round');
var roundcount = 1;
var roundcheck = 0;
var turncount = 0;
var cardactive = false;
var protection = false;
var protectedBlock = null;
var mycard1 = document.getElementById('cy1');
var selected_card;
newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {
        roundcheck = Math.ceil(roundcount / 2);

        // modify the condition here to continue the game play as long as there is no winner
        if (!win && event.target.innerHTML === '' && cardactive === false) {
            // 4. Modify the code here to check whether the clicking block is avialable.         
            roundcount += 1;
            event.target.innerHTML = turn;
            if (turn === 'O') {
                event.target.style.color = '#1F34B8';
            }
            else if (turn === 'X') {
                event.target.style.color = '#D61A3C';
            }
            checkResult();

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

        if (cardactive === true) {
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
        }


        // if (cardactive === true && event.target.innerHTML !== '') {
        //     if (document.querySelector("#cy1").src === 'img/Swap.png') {
        //         // ทำการสลับสัญลักษณ์ในช่องบนกระดาน
        //         swapSymbol(event.target);
        //     }
        //     if (cardImageSrc.includes('Destroy.png')) {
        //         // ทำการลบ xo ในช่องบนกระดาน
        //         destroySymbol(event.target);
        //     }

        //     mycard1.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
        //     mycard1.style.transform = '';
        //     mycard1.style.filter = '';
        //     mycard1.style.transition = "all 0.5s";
        //     mycard1.style.transform = "translateY(0px)";
        // }
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
    // var cardBoxes = document.querySelectorAll('.cardbox-your .card-container');

    // cardBoxes.forEach(function (cardContainer) {
    //     var card = cardContainer.querySelector('.card');
    //     if (!card || (card && card.src.includes('img/Card.png'))) {
    //         var cardInfo = getRandomCard(cardList);
    //         card.setAttribute("src",`${cardInfo.src}`)
    //         card.setAttribute("onclick",`${cardInfo.effect}`)
    //         // cardContainer.innerHTML = `<img src="${cardInfo.src}" alt="Card" class="card" onclick="${cardInfo.effect}(this)">`;
    //     }
    // });

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
        card.setAttribute("onclick", `${cardInfo.effect}`);
    }
}

function resetCardImage() {
    cardBoxes.forEach(function (cardContainer) {
        var card = cardContainer.querySelector('.card');
        if (card === selected_card) {
            card.setAttribute("src", "img/Card.png");
            card.removeAttribute("onclick");
        }
    });
}

function swapSymbol(block) {
    if (block !== protectedBlock) {
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
    cancelcardeffect()
    console.log(cardactive)
}

function destroySymbol(block) {
    if (block !== protectedBlock) {
        if (block.innerHTML !== '') {
            block.innerHTML = '';
        }
    }
    cardactive = false;
    resetCardImage()
    cancelcardeffect()
    console.log(cardactive)
}

function shieldSymbol(block) {
    protectedBlock = block; // กำหนดบล็อกที่ถูกป้องกัน
    cardactive = false;
    resetCardImage()
    cancelcardeffect()
    console.log(cardactive)
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
    cardactive = false;
    cancelcardeffect()
    console.log(cardactive)
}

function usecard(cardContainer) {
    var card = cardContainer.querySelector('.card');
    selected_card = card
    if (cardactive === false && !card.src.includes('img/Card.png')) {
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
    }
    else {
        CancelCard(cardContainer)
    }

}

function CancelCard(cardContainer) {
    var card = cardContainer.querySelector('.card');
    if (cardactive === true) {
        cardactive = false; // กำหนดว่าการ์ดถูกคลิกแล้ว
        card.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
        card.style.transform = '';
        card.style.filter = '';
        card.style.transition = "all 0.5s";
        card.style.transform = "translateY(0px)";
        var cardEffect = cardList.find(cardInfo => cardInfo.id === card.id)?.effect; // ค้นหาเอฟเฟคของการ์ดที่ถูกใช้งาน
        if (cardEffect) {
            window[cardEffect](card);
        }
    }
}

function cancelcardeffect() {
    selected_card.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
    selected_card.style.transform = '';
    selected_card.style.filter = '';
    selected_card.style.transition = "all 0.5s";
    selected_card.style.transform = "translateY(0px)";
}
