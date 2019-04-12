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
  validMoves:['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']};

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
    // move = 'ArrowLeft';
    move = 'ArrowUp';
  } else if (num == 1) {
    // move = 'ArrowLeft';
    move = 'ArrowDown';
  } else if (num == 2) {
    // move = 'ArrowLeft';
    move = 'ArrowLeft';
  } else {
    // move = 'ArrowLeft';
    move = 'ArrowRight';
  }
  return move;

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
    gameState.userMoves.pop();
  }
  // gameOverflow();
  // console.log('Test'); // Even adding this humble console log breaks the code, I have no idea why
  // var test = 1; // This too

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset 
  else if (um[move] != gm[move]){
    gameOver(dialogue.go);
  }
  
  // If the check is passed and the length of the two arrays are equal then userMoves is reset and one extra move it added to gameMoves
  else if (um.length == gm.length && buttonFlag == true) {
    var move = nextmoveRandom();
    gameState.userMoves = [];
    gameState.gameMoves.push(move);
    gameState.hazdMoves.push(move);
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
    gameState.userMoves.pop();
  }

}

// This function ends and resets the game. 
function gameOver(){
  gameOverGraphics();
  // alert('Game Over - Press Space to start again');
  startFlag = false;
  
  gameReset()

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