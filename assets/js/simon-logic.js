// Letting JSHint know that everything is ok
/*jslint node: true */
/*jshint browser: true */
"use strict";
/*global generateRoom*/
/*global buttonFlag:true*/
/*global startFlag:true*/
/*global dialogue*/
/*global gameOverGraphics*/

// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoveCount:0,
  userMoves:[],
  userMovesQ:[],
  gameMoves:[],
  typeMoves:[],
  hazdMoves:[],
  typeMovesTrack:[],
  typeMoveQ:[],
  bagofMoves:[],
  validMoves:['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']};

// Function returns a random move
// The previous random move function used to generate a random number between 0-3 and return the corresponding move. The problem with this approach is that there is no memory of previous moves, leading to games with little variability (~12 round game of only ups and downs was the record). This version of the function uses a 'shuffle bag' approach. If the 'bag' is empty the function fills it with 3 shuffled copies of the valid move array then pops a move from the 'bag' till it's emptied and refilled again. This means that long streaks of the same move or games that never feature one of the moves should never happen.
//https://gamedevelopment.tutsplus.com/tutorials/shuffle-bags-making-random-feel-more-random--gamedev-1249
function nextmoveRandom(){


  if (gameState.bagofMoves.length === 0){
    var handfull = gameState.validMoves.concat(gameState.validMoves);
    handfull = handfull.concat(gameState.validMoves);
    gameState.bagofMoves = handfull;
    shuffleArray(gameState.bagofMoves);
  }

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

// Function used to start game with given number of moves
function gameStart(num){

  console.log('New Game');

  // Clearing gameState arrays
  gameReset();

  // Adding number of moves to game arrays
  for (let i = 0; i < num; i++) {
    var move = nextmoveRandom();
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.gameMoves.push(move);
    gameState.hazdMoves.push(move);
    gameState.typeMoves.push('Hazard');
  }
  gameState.gameMoves.push('ArrowRight');
  gameState.typeMoves.push('Jump');

  // When dupicating an array this notation needs to be used as JavaScript is a pointer based language
  //https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array
  gameState.typeMovesTrack = gameState.typeMoves.slice();

  // Generate a room for the start of the game
  generateRoom(num+2);

  // Press the button to reset the stage
  buttonFlag = true;

  // Print game moves to console
  console.log(gameState.gameMoves);

}

// Function to check if the player has entered a correct move
// If the move is wrong the game is reset
function gameCheck(move){

  var gm = gameState.gameMoves; // Game moves
  var um = gameState.userMoves; // User moves

  // If the user enter more moves than there are gameMoves they are immediately removed
  // I have no idea why but when I add or take away things from this loop the code breaks in the simon-graphics file, I get a gameState does not exist at line 154
  // ¯\_(ツ)_/¯
  if (um.length > gm.length){
    gameState.userMoves.pop();
  }
  // gameOverflow();
  // console.log('Test'); // Even adding this humble console log breaks the code, I have no idea why
  // var test = 1; // This too

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset
  else if (um[move] !== gm[move]){
    gameOver(dialogue.go);
  }

  // If the check is passed and the length of the two arrays are equal then userMoves is reset and one extra move it added to gameMoves
  else if (um.length === gm.length && buttonFlag === true) {
    var move = nextmoveRandom();
    gameState.userMoves = [];
    gameState.gameMoves.push(move);
    gameState.hazdMoves.push(move);
    gameState.typeMoves.push('Hazard');
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.typeMovesTrack = gameState.typeMoves.slice();
    generateRoom(((gameState.gameMoves.length-1)/2) + 2); //+2 for start and end platforms
    console.log(gameState.gameMoves);
  }

}

function gameOverflow(){

  var gm = gameState.gameMoves; // Game moves
  var um = gameState.userMoves; // User moves

  // If the user enter more moves than there are gameMoves they are immediately removed
  while (um.length > gm.length){
    gameState.userMoves.pop();
  }

}

// This function ends and resets the game.
function gameOver(){
  gameOverGraphics();
  // alert('Game Over - Press Space to start again');
  startFlag = false;

  gameReset();

}

function gameReset(){
  // Clearing gameState arrays
  gameState.userMoveCount = 0;
  gameState.userMoves = [];
  gameState.userMovesQ = [];
  gameState.gameMoves = [];
  gameState.typeMoves = [];
  gameState.hazdMoves = [];
  gameState.typeMovesTrack = [];
  gameState.typeMoveQ = [];
}