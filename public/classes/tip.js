var openbook = document.getElementById("openbook");
var currentTipIndex = 1;
var totalTips = 6;
var tip0 = document.getElementById("tip0");
var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");
var closepopup = document.getElementById("closepopup");

openbook.addEventListener("click", function() {
    tip0.style.display = "block";
    showTip(currentTipIndex);
});
closepopup.addEventListener("click", function() {
    for (var i = 0; i <= totalTips; i++) {
        var tip = document.getElementById("tip" + i);
        tip.style.display = "none";
    }
});
leftArrow.addEventListener("click", leftArrowHandler);
rightArrow.addEventListener("click", rightArrowHandler);

function hideTip(index) {
    var tip = document.getElementById("tip" + index);
    tip.style.display = "none";
}

function showTip(index) {
    var tip = document.getElementById("tip" + index);
    tip.style.display = "block";
}

function leftArrowHandler() {
    if (currentTipIndex > 1) {
        hideTip(currentTipIndex);
        currentTipIndex--;
        showTip(currentTipIndex);
    }
}

function rightArrowHandler() {
    if (currentTipIndex < totalTips) {
        hideTip(currentTipIndex);
        currentTipIndex++;
        showTip(currentTipIndex);
    }
}