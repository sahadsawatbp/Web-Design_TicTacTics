var turn = 'O'
var win = false;
var winner = '';
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');
var round = document.getElementById('round');
var roundcount = 1;

newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {
        roundcount += 1;
        // modify the condition here to continue the game play as long as there is no winner
        if (!win && event.target.innerHTML === '') {
            // 4. Modify the code here to check whether the clicking block is avialable.         
            
            event.target.innerHTML = turn;
            if (turn === 'O'){
                event.target.style.color = '#1F34B8';
            }
            else if (turn === 'X'){
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
        round.innerHTML = 'Round: ' + Math.ceil(roundcount/2);
    }
}
function newGame() {
    turn = 'O';
    round.innerHTML = 'Round: ' + Math.ceil(roundcount/2);
    turnObject.innerHTML = "Turn: " + turn;
    winner = '';
    win = false;
    // 3. Modify the code here to reset the game to initial state
    for (var block of blocks) {
        block.innerHTML = '';
    }
}