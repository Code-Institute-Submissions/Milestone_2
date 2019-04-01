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
var roomSize = simonSize * 4; // This is a function of Simon size where 1 = simonSize
var pillarSizeW = 200 * mult;
var pillarSizeH = 0; // Value depends on the canvas size which is calculated in draw function in simon-graphics
var pillarGap = 0.5; // This is a function of pillar width where 1 = pillarSizeW
var pillarGapW = pillarGap*pillarSizeW;
var pillarNum = 0; // Value depends on the canvas size which is calculated in draw function in simon-graphics
var pillarArray = [];
var cent = 0; // Value depends on the canvas size which is calculated in draw function in simon-graphics
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
      move = parseInt(gameState.userMoves.length/2) + 1;
      console.log('Pillar ' + move);
      draw(move);

    }

    checkGame();
  }

}


// Start listening to resize events and draw canvas.
initialize();
// setInterval(draw, 10);
// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");
