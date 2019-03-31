// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas
var canvas = document.getElementById("maincanvas");
var ctx = canvas.getContext("2d");
var cwidth;
var cheight;

// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoves:[], 
  gameMoves:[], 
  validMoves:["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]};

var mult = 1;
var simonSize = 100 * mult;
var pillarSizeW = 200 * mult;
var pillarSizeH = window.innerHeight/3;
var pillarGap = 0.5; // This is a function of pillar width where 1 = pillarSizeW
var pillarGapW = pillarGap*pillarSizeW;
var pillarNum = Math.ceil(window.innerWidth/(pillarSizeW + (pillarSizeW/4)));

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
    checkGame();
  }

}


// Start listening to resize events and draw canvas.
initialize();
// setInterval(draw, 10);
// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");
