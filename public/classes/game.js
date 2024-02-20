var turn = 'O'
var win = false;
var winner = '';
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');
var round = document.getElementById('round');
var roundcount = 1;
var cardactive = false;

var mycard1 = document.getElementById('cy1');

newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {
        roundcount += 1;
        // modify the condition here to continue the game play as long as there is no winner
        if (!win && event.target.innerHTML === '') {
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
}

function swapSymbol(block) {
    if (block.innerHTML === 'X') {
        block.innerHTML = 'O';
        block.style.color = '#1F34B8';
    }
    else if (block.innerHTML === 'O') {
        block.innerHTML = 'X';
        block.style.color = '#D61A3C';
    }
}

mycard1.addEventListener('click', function () {
    if (cardactive === false) {
        cardactive = true; // กำหนดว่าการ์ดถูกคลิกแล้ว
        // สามารถคลิกที่ช่องบนกระดานได้
        mycard1.style.backgroundColor = 'hsl(263, 90%, 51%)';
        mycard1.style.transform = 'scale(1.1)';
        mycard1.style.filter = 'drop-shadow(0 0px 12px hsl(263, 90%, 51%))';
        mycard1.style.transition = "all 0.5s";
        mycard1.style.transform = "translateY(-15px)";
        if (cardactive === true){
            for (var block of blocks) {
                block.addEventListener('click', function () {
                    // ตรวจสอบว่าช่องบนกระดานมีสัญลักษณ์หรือไม่
                    if (this.innerHTML !== '') {
                        // ทำการสลับสัญลักษณ์ในช่องบนกระดาน
                        swapSymbol(this);
                        mycard1.style.backgroundColor = ''; // ยกเลิกเอฟเฟคการ์ด
                        mycard1.style.transform = '';
                        mycard1.style.filter = '';
                        mycard1.style.transition = "all 0.5s";
                        mycard1.style.transform = "translateY(0px)";
                    }
                })
            }
            cardactive = false;
        }
        
    }
});