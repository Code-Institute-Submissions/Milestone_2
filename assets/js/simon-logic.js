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
    move = 'ArrowRight';
    // move = 'ArrowUp';
  } else if (num == 1) {
    move = 'ArrowRight';
    // move = 'ArrowDown';
  } else if (num == 2) {
    move = 'ArrowRight';
    // move = 'ArrowLeft';
  } else {
    move = 'ArrowRight';
  }
  return move;
}

// Function used to start game with certain number of moves
function gameStart(num){
  console.log("New Game");

  // Clearing gameState arrays
  gameState.userMoves = [];
  gameState.gameMoves = [];

  // Adding number of moves to game array
  for (let i = 0; i < num; i++) {
    gameState.gameMoves.push('ArrowRight');
    gameState.gameMoves.push(nextmoveRandom());
  }
  gameState.gameMoves.push('ArrowRight');

  // Print game moves to console
  console.log(gameState.gameMoves);

}

// Function to check if the player has entered a correct move
// If the move is wrong the game is reset
function checkGame(){
  // makes the code a little easier to read
  var gm = gameState.gameMoves;
  var um = gameState.userMoves;

  // Checks that the latest entered move is the same as latest generated move
  // If they are not the game ends and the startFlag is reset 
  if (um[um.length - 1] != gm[um.length - 1]){
    alert('Game Over - Press Space to start again');
    startFlag = false;
  }
  
  // If the check is passed and the length of the two arrays are equal then userMoves is reset and one extra move it added to gameMoves
  if (um.length == gm.length) {
    gameState.userMoves = [];
    gameState.gameMoves.push(nextmoveRandom());
    gameState.gameMoves.push('ArrowRight');
    console.log(gameState.gameMoves);
  }

}