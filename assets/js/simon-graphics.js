// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initialize() {

  window.addEventListener('resize', resizeCanvas, false);
  // Used to initialize the canvas on first loading the page
  resizeCanvas();

}

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Redefining canvas dependant variables
  pillarSizeH = (window.innerHeight-roomSize)/2;
  pillarNum = Math.ceil(window.innerWidth/(pillarSizeW + pillarGapW));
  cent = (window.innerWidth)/2;

  draw(0);
}

// Display custom canvas.
// resizes along with the browser window.
function draw(haz) {

  var off = 0;

  // Start by clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (pillarArray[haz] > cent){
    off = pillarArray[haz] - cent
    console.log(off);
  }

  drawRoom(off);

  // drawButton(canvas.width/2, (canvas.height/2)+simonSize+10);
  drawSimon(pillarArray[haz]+pillarSizeW/2, pillarSizeH + roomSize);

  // Leaving this blue border here so that I can see the edge of the canvas
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = '1';
  ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawRoom(off){
  var haz;
  var pillarStart;
  var rWallX;
  pillarArray = [];

  // Only for the moment will 3 be fallback if game has not started
  // This should be a splashscreen in future
  if (gameState.gameMoves.length <= 0){
    haz = 5;
  }
  else{
    haz = ((gameState.gameMoves.length-1)/2) + 2; //+2 for start and end platforms
  }

  // The location to start drawing pillars is calcualted using:
  // center - (((pillar number-1)/2)*(pillar width+pillar gap))+pillar width/2 for odd numbers
  // center - ((pillar number/2)*(pillar width+pillar gap))-pillar width/8 for even numbers

  // Turns out these equations reduce to the same so no need to split between even and odd
  // Also I use a general formula rather than hardcode that a game is 1/4 pillar width

  // This is used to center pillars on the screen if there are too few to fill the screen
  if (haz < pillarNum){
    pillarStart = cent - ((pillarSizeW/2)*((pillarGap*(haz-1))+haz));
    // Calcualting pillar coordinates
    for (let i = 0; i < haz; i++) {
      pillarArray.push(pillarStart+((pillarSizeW+pillarGapW)*i)-off);
    }
    // Top Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar(pillarArray[i], 0);
    }
    // Bottom Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar(pillarArray[i], pillarSizeH + roomSize);
    }
    // Left Wall
    drawWall(0-off,0,pillarStart+5, window.innerHeight);
    // Right Wall
    rWallX = pillarStart+((pillarSizeW+pillarGapW)*haz)-pillarGapW-5-off;
    drawWall(rWallX,0,1000, window.innerHeight);
  }
  
  // Otherwise they are drawn from the far left side
    else{
      // Calcualting pillar coordinates
      for (let i = 0; i < haz; i++) {
        pillarArray.push(((pillarSizeW+pillarGapW)*i)+100-off);
      }
      // Top Pillars
      for (let i = 0; i < haz; i++) {
        drawPillar(pillarArray[i], 0);
      }
      // Bottom Pillars
      for (let i = 0; i < haz; i++) {
        drawPillar(pillarArray[i], pillarSizeH + roomSize);
      }
      // Left Wall
      drawWall(0-off,0,100, window.innerHeight);
      // Right Wall
      rWallX = ((pillarSizeW+pillarGapW)*haz)-off;
      drawWall(rWallX,0,1000, window.innerHeight);
    }
}

function drawSimon(x, y) {
  // Centering Simon
  xn = x - simonSize/2;
  yn = y - simonSize;

  ctx.beginPath();
  ctx.rect(xn, yn, simonSize, simonSize);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  drawDot(x,y);
}

function drawPillar(x, y){

  ctx.beginPath();
  ctx.rect(x, y, pillarSizeW, pillarSizeH);
  ctx.fillStyle = "#999999";
  ctx.fill();
  ctx.closePath();

  drawDot(x, y);

}

function drawWall(x, y, w, h){

  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = "#999999";
  ctx.fill();
  ctx.closePath();
}

function drawButton(x, y){

  // Centering button
  x = xn - (simonSize*1.2)/2;
  y = yn - simonSize/2;

  ctx.beginPath();
  ctx.rect(xn, yn, simonSize*1.2, simonSize/4);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();

  drawDot(x, y);
}

// Function used for seeing difference between where object is drawn and coordinates entered
function drawDot(x,y){
  ctx.beginPath();
  ctx.rect(x, y, 2, 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}
