// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas
var canvas = document.getElementById("maincanvas");
var ctx = canvas.getContext("2d");file://

// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoves:[], 
  gameMoves:[], 
  validMoves:["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]};

// startFlag is used to trigger the game on and off
var startFlag = false;

// Functions used to dynamically resize the canvas to the device size
// http://htmlcheats.com/html/resize-the-html5-canvas-dyamically/
// I should use the screensize to create a global multiplicitive variable to dynamically resize the game elements also 

// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initialize() {

  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

}
  
// Display custom canvas.
// resizes along with the browser window.         
function redraw() {
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
  redraw();
}

// Function returns a random move
// It generates a random number between 0 and 3 and returns a move based on that number
// Played a ~12 round game and only got up and downs... I think this should be psudorandom
// Idea: Add a check function that looks at the last 4 moves and removes and option from the pool if it comes up 3/4 of the moves
// Could possibly use Shuffle bag implementation but I think that might be overkill as all particular directions are equal, unlike tetris 
// 
//https://gamedevelopment.tutsplus.com/tutorials/shuffle-bags-making-random-feel-more-random--gamedev-1249
function nextmoveRandom() {
  var num = parseInt((Math.random() * 4));
  var move;
  if (num == 0) {
    move = 'ArrowUp';
  } else if (num == 1) {
    move = 'ArrowDown';
  } else if (num == 2) {
    move = 'ArrowLeft';
  } else {
    move = 'ArrowRight';
  }
  return move;
}

// Function used to start game with certain number of moves
function gameStart(num, game){
  console.log("New Game");

  // Clearing gameState arrays
  game.userMoves = [];
  game.gameMoves = [];

  // Adding number of moves to game array
  for (var i = 0; i < num; i++) {
    game.gameMoves.push(nextmoveRandom());
  }

  // Print game moves to console
  console.log(game.gameMoves);

  return game;
}

// Function to check if the player has entered a correct move
// If the move is wrong the game is reset
function checkGame(game){
  // makes the code a little easier to read and makes sure the gameState isn't overwritten
  const gm = game.gameMoves;
  const um = game.userMoves;

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset 
  if (um[um.length - 1] != gm[um.length - 1]){
    alert('Game Over - Press Space to start again');
    startFlag = false;
  }
  
  // If the check is passed and the length of the two arrays are equal then userMoves is reset and one extra move it added to gameMoves
  if (um.length == gm.length) {
    game.userMoves = [];
    game.gameMoves.push(nextmoveRandom());
    console.log(game.gameMoves);
  }

  return game;
}

// Function activated when a keyboard button is pressed
function keyDownHandler(e) {
  console.log(e.code);
  var moveFlag = false; 

  // If the Space button is pressed the game is restarted
  if (e.code == 'Space'){
    console.log("Game started");
    gameState = gameStart(3, gameState);
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
    gameState = checkGame(gameState);
  }
  
  // Reset flag
  moveFlag = false;
}

// Start listening to resize events and draw canvas.
initialize();

// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");