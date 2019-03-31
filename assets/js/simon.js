// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas
var canvas = document.getElementById("maincanvas");
var ctx = canvas.getContext("2d");

// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoves:[], 
  gameMoves:[], 
  validMoves:["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]};

var simonSize = 100;
// startFlag is used to trigger the game on and off
var startFlag = false;

// Functions used to dynamically resize the canvas to the device size
// http://htmlcheats.com/html/resize-the-html5-canvas-dyamically/
// I should use the screensize to create a global multiplicitive variable to dynamically resize the game elements also 
// Also is this expensive to run constantly? 

// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initialize() {

  window.addEventListener('resize', resizeCanvas, false);
  // Used to initialize the canvas on first loading the page
  resizeCanvas();

}
  
// Display custom canvas.
// resizes along with the browser window.         
function draw() {
  // Start by clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSimon(canvas.width/2, canvas.height/2);

  // Leaving this blue border here so that I can see the edge of the canvas 
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = '1';
  ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}



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
  for (var i = 0; i < gameState.validMoves.length; i++) {
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

function drawSimon(x, y) {
    x = x - simonSize/2;
    y = y - simonSize/2;
    ctx.beginPath();
    ctx.rect(x, y, simonSize, simonSize);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


// Start listening to resize events and draw canvas.
initialize();
// setInterval(draw, 10);
// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");
