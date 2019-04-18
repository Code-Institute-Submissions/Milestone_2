// Letting JSHint know that everything is ok and letting it know that variables are declared elsewhere
/*jslint node: true */
/*jshint browser: true */
'use strict';
// Library
/*global createjs*/
/*global bodyScrollLock*/
/*global Hammer*/
/*global Synth*/
// simon-logic.js
/*global gameStart*/
// simon-graphics.js
/*global gameState*/
/*global animationFlag*/
/*global initializeG*/
// simon-audio.js
/*global initializeS*/

// Initializing the game Canvas and Stage
var canvas = document.getElementById('maincanvas');
var stage = new createjs.Stage(canvas);

// simon, room and hazards are global objects so they're easier to keep track of
var simon = {};
var room = new createjs.Container();
room.name = 'room';
var hazards = new createjs.Container();
hazards.name = 'hazards';

// startFlag is used to trigger the game on and off
var startFlag = false;

// initialize the generated sounds object and set the volume
var notes = Synth.createInstrument('organ');
Synth.setVolume(0.75);

// Using the body-scroll-lock library to lock the canvas so that on iOS devices the game doesn't overscroll
bodyScrollLock.disableBodyScroll(canvas);

// Using Hammer JS create a manager to watch the canvas for touch events
var manager = new Hammer.Manager(canvas);

// Create a recognizer for a swipe and tap event
var Swipe = new Hammer.Swipe();
var tap2 = new Hammer.Tap({ event: 'doubletap', taps: 2 });
var tap1 = new Hammer.Tap({ event: 'singletap' });

// Add the recognizers to the manager
manager.add(tap2);
manager.add(tap1);
manager.add(Swipe);

// If you want to recognize both a single and double tap separately then the two events need to be recognized together, a single tap executes when a double tap fails
manager.get('doubletap').recognizeWith('singletap');
manager.get('singletap').requireFailure('doubletap');

// When the Hammer manager detects a swipe the appropriate direction is added to the userMove array
manager.on('swipe', function(e) {
  var direction = e.offsetDirection;
  console.log('Swipe');
  // Only when the animation has finished will another swipe be accepted
  if (animationFlag === false){
    if (direction === 8) {
      gameState.userMoves.push('ArrowUp');
    }
    else if (direction === 16) {
      gameState.userMoves.push('ArrowDown');
    }
    else if (direction === 2) {
      gameState.userMoves.push('ArrowLeft');
    }
    else if (direction === 4) {
      gameState.userMoves.push('ArrowRight');
    }
  }
});

// When the Hammer manager detects a doubletap the game is started/restarted
manager.on('doubletap', function(e) {
  console.log('Tap');
  gameStart(1);
  startFlag = true;
});

// Function activated when a keyboard button is pressed
function keyDownHandler(e) {
  // If the Space button is pressed the game is restarted
  if (e.code === 'Space') {
    gameStart(1);
    startFlag = true;
  }

  // If the key is a valid Simon move and the game has started then add the move to the userMoves array
  for (let i = 0; i < gameState.validMoves.length; i++) {
    if (e.code === gameState.validMoves[i] && startFlag && animationFlag === false) {
      console.log(e.code);
      gameState.userMoves.push(e.code);
    }
  }
}

// Initializing graphics and sounds
initializeG();
initializeS();

// Start listening for button press
document.addEventListener('keydown', keyDownHandler);
console.log('Press space to start');
