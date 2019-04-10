// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas and Stage
var canvas = document.getElementById("maincanvas");
var stage = new createjs.Stage(canvas);
var room = new createjs.Container();
var hazards = new createjs.Container();
var simon; // simon is a global object so he's easier to keep track of


// startFlag is used to trigger the game on and off
var startFlag = false;

// Function activated when a keyboard button is pressed
function keyDownHandler(e) {

  // console.log(e.code);
  var moveFlag = false; 

  // If the Space button is pressed the game is restarted
  if (e.code == 'Space'){
    gameStart(3);
    startFlag = true;
  }

  // Checks if the move is a valid Simon move and sets the flag true
  for (let i = 0; i < gameState.validMoves.length; i++) {
    if (gameState.validMoves[i] == e.code) {
      moveFlag = true;
    }
  }

  // If the games has started and the move is valid then the key is added to the gameState and the gameState checked
  if (moveFlag && startFlag){
    gameState.userMoves.push(e.code);
  }

}


// Start listening to resize events and draw canvas.
initialize();

// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");


// Examples of lines of dialogue to use
// Hello simon, I need your help to push that big red button over there. If you do as I say you will make it there safely

// Hello simon, I need you to push that button. Just do as I say and you will be safe

// Simon, just do as I say

// Do what I say

// Simon, you need to be quicker than that

// Now simon, did I tell you to change the size of the browser? 

// I'm sorry simon, you need to do exactly what I say if you want to make out of here alive