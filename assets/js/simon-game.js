// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas and Stage
var canvas = document.getElementById("maincanvas");
var stage = new createjs.Stage(canvas);
var room = new createjs.Container();
var simon;


// startFlag is used to trigger the game on and off
var startFlag = false;

// Functions used to dynamically resize the canvas to the device size
// http://htmlcheats.com/html/resize-the-html5-canvas-dyamically/
// I should use the screensize to create a global multiplicitive variable to dynamically resize the game elements also 
// Also is this expensive to run constantly? 

// Function activated when a keyboard button is pressed
function keyDownHandler(e) {
  console.log(e.code);
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

    if (gameState.userMoves.length % 2 != 0){
      move = parseInt(gameState.userMoves.length/2);
    }
    else{

    }

    checkGame();
  }

}


// Start listening to resize events and draw canvas.
initialize();

// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");
