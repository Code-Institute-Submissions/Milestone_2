// https://www.waitingforfriday.com/?p=586 - How Simon works 

// Initializing the game Canvas and Stage
var canvas = document.getElementById("maincanvas");
var stage = new createjs.Stage(canvas);
var room = new createjs.Container();
var hazards = new createjs.Container();
var simon; // simon is a global object so he's easier to keep track of

// startFlag is used to trigger the game on and off
var startFlag = false;

// Using the body-scroll-lock library to lock the canvas so that on iOS devices the game doesn't overscroll
bodyScrollLock.disableBodyScroll(canvas);

// Using Hammer JS create a manager to watch the canvas for touch events
var manager = new Hammer.Manager(canvas);

// Create a recognizer for a swipe
var Swipe = new Hammer.Swipe();
var tap1 = new Hammer.Tap({ event: 'singletap' });
var tap2 = new Hammer.Tap({ event: 'doubletap', taps: 2 });

// Add the recognizers to the manager
manager.add(Swipe);
manager.add(tap1);
manager.add(tap2);

// If you want to recognize both a single and double tap separately then the two events need to be recognized together and a single tap execute when a double tap fails 
manager.get('doubletap').recognizeWith('singletap');
manager.get('singletap').requireFailure('doubletap');

// Function activated when a keyboard button is pressed
function keyDownHandler(e) {

  // console.log(e.code);
  var moveFlag = false; 

  // If the Space button is pressed the game is restarted
  if (e.code === 'Space'){
    gameStart(1);
    startFlag = true;
  }

  // Checks if the move is a valid Simon move and sets the flag true
  for (let i = 0; i < gameState.validMoves.length; i++) {
    if (gameState.validMoves[i] === e.code) {
      moveFlag = true;
    }
  }

  // If the games has started and the move is valid then the key is added to the gameState and the gameState checked
  if (moveFlag && startFlag){
    gameState.userMoves.push(e.code);
  }

}

// When the Hammer manager detects a swipe the appropriate direction is added to the userMove array
manager.on('swipe', function(e) {
  var direction = e.offsetDirection;

  if (direction === 8){
    gameState.userMoves.push('ArrowUp');
  }
  else if (direction === 16){
    gameState.userMoves.push('ArrowDown');
  }
  else if (direction === 2){
    gameState.userMoves.push('ArrowLeft');
  }
  else if (direction === 4){
    gameState.userMoves.push('ArrowRight');
  }
});

// When the Hammer manager detects a doubletap the game is started
manager.on("doubletap", function(e) {
    gameStart(1);
    startFlag = true;
});

// Start listening to resize events and draw canvas.
initialize();

// Listening for button press
document.addEventListener("keydown", keyDownHandler);
console.log("Press space to start");
