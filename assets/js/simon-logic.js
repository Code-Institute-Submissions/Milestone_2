// gameState object keeps track of the user moves and game moves
var gameState = {
  userMoveCount:0,
  userMoves:[],
  userMovesQ:[], 
  gameMoves:[],
  typeMoves:[], 
  typeMovesTrack:[],
  typeMoveQ:[], 
  validMoves:["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]};

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
    // move = 'ArrowUp';
  } else if (num == 1) {
    move = 'ArrowUp';
    // move = 'ArrowDown';
  } else if (num == 2) {
    move = 'ArrowUp';
    // move = 'ArrowLeft';
  } else {
    move = 'ArrowUp';
    // move = 'ArrowRight';
  }
  return move;
}

// Function used to start game with given number of moves
function gameStart(num){
  console.log("New Game");

  // Clearing gameState arrays
  gameState.userMoves = [];
  gameState.userMovesQ = [];
  gameState.gameMoves = [];
  gameState.typeMoves = []; 
  gameState.typeMovesTrack = [];
  gameState.typeMoveQ = []; 

  // Adding number of moves to game arrays
  for (let i = 0; i < num; i++) {
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.gameMoves.push(nextmoveRandom());
    gameState.typeMoves.push('Hazard');
  }
  gameState.gameMoves.push('ArrowRight');
  gameState.typeMoves.push('Jump');

  gameState.typeMovesTrack = [...gameState.typeMoves];

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
    console.log('Pop?');
    gameState.userMoves.pop();
  }
  // gameOverflow();
  // console.log('Test'); // Even adding this humble console log breaks the code, I have no idea why
  // var test = 1; // This too?

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset 
  else if (um[move] != gm[move]){
    gameOver();
  }
  
  // If the check is passed and the length of the two arrays are equal then userMoves is reset and one extra move it added to gameMoves
  else if (um.length == gm.length && buttonFlag == true) {
    gameState.userMoves = [];
    gameState.gameMoves.push(nextmoveRandom());
    gameState.typeMoves.push('Hazard');
    gameState.gameMoves.push('ArrowRight');
    gameState.typeMoves.push('Jump');
    gameState.typeMovesTrack = [...gameState.typeMoves];
    generateRoom(((gameState.gameMoves.length-1)/2) + 2); //+2 for start and end platforms
    console.log(gameState.gameMoves);
  }

}

function gameOverflow(){
  var gm = gameState.gameMoves; // Game moves
  var um = gameState.userMoves; // User moves

  // If the user enter more moves than there are gameMoves they are immediately removed
  while (um.length > gm.length){
    console.log('Pop?');
    gameState.userMoves.pop();
  }
}

// This function ends and resets the game. At the moment it will end the game as soon as a wrong move is entered, the next stage is to wait until the wrong move is animated then end the game
function gameOver(){
  alert('Game Over - Press Space to start again');
  startFlag = false;
  // Clearing gameState arrays
  gameState.userMoves = [];
  gameState.userMovesQ = [];
  gameState.gameMoves = [];
  gameState.typeMoves = []; 
  gameState.typeMovesTrack = [];
  gameState.typeMoveQ = []; 
}