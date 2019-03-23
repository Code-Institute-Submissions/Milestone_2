// Initilising the game Canvas
var canvas = document.getElementById("maincanvas");
var ctx = canvas.getContext("2d");

// This function adds a move U,D,L or R to the move list
// Not sure how this will feel, might need to implement a psudorandom function 
function nextmoveRandom(movelist) {
  var move = parseInt((Math.random() * 4) + 1)
  if (move == 1) {
    movelist.push('ArrowUp');
  } else if (move == 2) {
    movelist.push('ArrowDown');
  } else if (move == 3) {
    movelist.push('ArrowLeft');
  } else {
    movelist.push('ArrowRight');
  }
  return movelist;
}

function checkGame(user, game){
  userIndex = user.length - 1;
  console.log(user[userIndex]);
  if (user[userIndex] != game[userIndex]){
    alert('Game Over');
  }
  if (user.length == game.length) {
    userMoves = new Array();
    nextmoveRandom(gameMoves);
    console.log(gameMoves);
  }

}

function keyDownHandler(e) {
  console.log(e.key);
  userMoves.push(e.key);
  checkGame(userMoves, gameMoves);

}

document.addEventListener("keydown", keyDownHandler);

// Create the game array 
var gameMoves = new Array();
var loseState = false;
var testState = false;
var userMoves = new Array();
// Start game with 3 moves
for (var i = 0; i < 3; i++) {
  gameMoves = nextmoveRandom(gameMoves);
}
console.log(gameMoves);

// while (loseState == false) {

//   if (testState == true) {
//     loseState = true;
//     alert ("You pressed the down key!");

//   }

// }

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();