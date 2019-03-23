// Initilising the game Canvas
var canvas = document.getElementById("maincanvas");
var ctx = canvas.getContext("2d");

// This function adds a move U,D,L or R to the move list
// Not sure how this will feel, might need to implement a psudorandom function 
function nextmoveRandom(movelist) {
  var move = parseInt((Math.random() * 4) + 1)
  if (move == 1) {
    movelist.push('U');
  } else if (move == 2) {
    movelist.push('D');
  } else if (move == 3) {
    movelist.push('L');
  } else {
    movelist.push('R');
  }
  return movelist
}

// Create the game array 
var gamemoves = new Array();
var loseState = false;

// Start game with 3 moves
for (var i = 0; i < 3; i++) {
  gamemoves = nextmoveRandom(gamemoves);
}

while (loseState == false) {

  loseState = true;
}

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