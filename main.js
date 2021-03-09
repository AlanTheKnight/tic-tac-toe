"use strict"

function changeFieldCell(n, val) {
    document.querySelectorAll("#field td")[n].innerHTML = val;
}

// Рандомно выбираем первого игрока
let currentMove = Boolean(Math.round(Math.random())) ? "bot" : "human";
let botVal = (currentMove === "bot") ? "❌" : "⭕";
let humanVal = (currentMove === "human") ? "❌" : "⭕";
let game = [0, 0, 0, 0, 0, 0, 0, 0, 0];


function isWin(board, n){
    for (let i = 0; i < 3; i++){
        if (board[i] + board[i+3]+board[i+6] === n){
            return "You've lost";
        }
        else if(board[i*3]+board[i*3+1]+board[i*3+2] === n){
            return "You've lost";
        }
    }
    if (board[0]+board[4]+board[8] === n){
        return "You've lost";
    }
    if (board[2]+board[4]+board[6] === n){
        return "You've lost";
    }
    if (board.every(item => item !== 0)){
        return 'Draw';
    }
    return undefined;
}

let infinities = {
    1: -Infinity,
    '-1': Infinity
};

let funcs = {
    1: Math.max,
    '-1': Math.min
};

function botMakeMove() {
    let bestScore = -Infinity, move;
    for (let i = 0; i < 9; i++) {
        if (game[i] === 0) {
            game[i] = 1;
            let score = recursion(game, -1);
            game[i] = 0;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    game[move] = 1;
    console.log(move, botVal);
    changeFieldCell(move, botVal);
    currentMove = "human";
}

function recursion(board, n){
    if (isWin(board, 3) === "You've lost"){
        return 1;
    }
    if (isWin(board, -3) === "You've lost"){
        return -1;
    }
    if (isWin(board, -3) === 'Draw'){
        return 0;
    }
    let bestScore = infinities[n];
    for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
            board[i] = Number(n);
            let score = recursion(board, Number(n)*(-1));
            board[i] = 0;
            bestScore = funcs[n](score, bestScore);
        }
    }
    return bestScore;
}

function checkForWin() {
    let result = isWin(game, 3)
    if (result !== undefined){
        document.getElementById("field").style.display = "none";
        let rHTML = document.getElementById("result");
        document.getElementById("result-text").innerHTML = result;
        rHTML.style.display = "block";
    }
}

function showField() {
    document.getElementById("game-start").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("field").style.display = "block";
}


if (currentMove === "bot") {
    botMakeMove();
    checkForWin();
}


let availableToMove = true;
let buttons = Array.from(document.querySelectorAll("#field td"));
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(e) {
        let move = buttons.indexOf(e.target);
        if (game[move] === 0 && availableToMove) {
            e.target.innerHTML = humanVal;
            game[move] = -1;
            availableToMove = false;
            checkForWin();
            setTimeout(function() {
                botMakeMove();
                checkForWin();
                availableToMove = true;
            }, 1000);
        }
    })
}
