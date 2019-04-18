// Letting JSHint know that everything is ok and letting it know that variables are declared elsewhere
/*jslint node: true */
/*jshint browser: true */
'use strict';
//Library
/*global Synth*/
// simon-game.js
/*global startFlag:true*/
/*global notes*/
// simon-graphics.js
/*global dialogue*/
/*global buttonFlag:true*/
/*global generateRoom*/
/*global gameOverGraphics*/

// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoveCount: 0,
  userMoves: [],
  userMovesQ: [],
  gameMoves: [],
  typeMoves: [],
  hazdMoves: [],
  typeMovesTrack: [],
  typeMoveQ: [],
  bagofMoves: [],
  validMoves: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
};

// Function returns a random move
// The previous random move function used to generate a random number between 0-3 and return the corresponding move. The problem with this approach is that there is no memory of previous moves, leading to games with little variability (~12 round game of only ups and downs was the record). This version of the function uses a 'shuffle bag' approach. If the 'bag' is empty the function fills it with multiple shuffled copies of the valid move array then pops a move from the 'bag' till it's emptied and refilled again. This means that long streaks of the same move or games that never feature one of the moves shouldn't happen.
//https://gamedevelopment.tutsplus.com/tutorials/shuffle-bags-making-random-feel-more-random--gamedev-1249
function nextmoveRandom() {
  // If the bag is empty, refill the bag
  if (gameState.bagofMoves.length === 0) {
    var handfull = gameState.validMoves; // 1 set

    // Duplicate the following line if you want more sets of valid moves in the bag, be warned though, the more duplicates in the bag then the longer a streak of the same move can be. The max streak will be twice the number of sets in the bag
    handfull = handfull.concat(gameState.validMoves); // 2 sets
    // handfull = handfull.concat(gameState.validMoves); // 3 sets felt like too many

    // Add the handful of moves to the bag then shuffle
    gameState.bagofMoves = handfull;
    shuffleArray(gameState.bagofMoves);
  }

  // Once the bag has moves then take a move from the bag and return it
  var move = gameState.bagofMoves.pop();
  return move;
}

// This function shuffles an array using the Fisher-Yates method of shuffling which works by walking the array in reverse order and swapping each element with a random one before it.
// https://javascript.info/task/shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}

// Function used to start game with given number of moves, at the moment the game only starts with 1 hazard but in the future should a difficulty setting be added then this can start a game with arbitrarily many hazards
function gameStart(num) {
  console.log('New Game');

  // Clearing gameState arrays
  gameReset();

  // Adding moves for the number of hazards to game arrays
  for (let i = 0; i < num; i++) {
    var move = nextmoveRandom();
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.gameMoves.push(move);
    gameState.hazdMoves.push(move);
    gameState.typeMoves.push('Hazard');
  }

  // Adding the final button moves
  gameState.gameMoves.push('ArrowRight');
  gameState.typeMoves.push('Jump');

  // When duplicating an array this notation needs to be used as JavaScript is a reference based language
  //https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array
  gameState.typeMovesTrack = [...gameState.typeMoves];

  // Generate a room for the start of the game
  generateRoom(num + 2);

  // 'Press' the button to reset the stage in the loopDraw
  buttonFlag = true;

  // Print game moves to console for cheaters
  console.log(gameState.gameMoves);

  // Lower the volume so that the sound doesn't clip
  Synth.setVolume(0.4);
  // Play the initial jingle, each simon note in succession
  setTimeout(function() {
    notes.play('G#', 4, 0.7);
  }, 320);
  setTimeout(function() {
    notes.play('D#', 4, 0.9);
  }, 440);
  setTimeout(function() {
    notes.play('B', 3, 1.1);
  }, 560);
  setTimeout(function() {
    notes.play('G#', 3, 1.3);
  }, 680);
  setTimeout(function() {
    Synth.setVolume(0.75);
  }, 800);
}

// Function to check if the player has entered a correct move
// If the move is wrong gameOver is triggered
function gameCheck(move, text) {
  var gm = gameState.gameMoves; // Game moves
  var um = gameState.userMoves; // User moves

  // If the user has entered more moves than there are gameMoves they are immediately removed
  gameOverflow();

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset
  if (um[move] !== gm[move]) {
    // If text was given as an input then pass it on to gameOver
    if (text) {
      gameOver(text);
    }

    // Otherwise pass the default game over text
    else {
      gameOver(dialogue.go);
    }
  }

  // If the check has passed, the length of the two arrays are checked to be equal. If they are and the button has been presed then userMoves is reset and one extra move it added to gameMoves
  else if (um.length === gm.length && buttonFlag === true) {
    var newmove = nextmoveRandom();
    gameState.userMoves = [];
    gameState.gameMoves.push(newmove);
    gameState.hazdMoves.push(newmove);
    gameState.typeMoves.push('Hazard');
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.typeMovesTrack = [...gameState.typeMoves];
    generateRoom((gameState.gameMoves.length - 1) / 2 + 2); //+2 for start and end platforms
    console.log(gameState.gameMoves);
  }
}

// This function checks if the user has entered more moves than there are game moves, if they have the extra moves are removed
function gameOverflow() {
  var gm = gameState.gameMoves; // Game moves
  var um = gameState.userMoves; // User moves

  while (um.length > gm.length) {
    gameState.userMoves.pop();
  }
}

// This function ends and resets the game.
function gameOver(text) {
  gameOverGraphics(text);
  startFlag = false;
  gameReset();
}

function gameReset() {
  // Clear the gameState arrays
  gameState.userMoveCount = 0;
  gameState.userMoves = [];
  gameState.userMovesQ = [];
  gameState.gameMoves = [];
  gameState.typeMoves = [];
  gameState.hazdMoves = [];
  gameState.typeMovesTrack = [];
  gameState.typeMoveQ = [];
}
