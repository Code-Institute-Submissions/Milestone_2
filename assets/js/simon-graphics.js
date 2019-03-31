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
  draw();
}

// Display custom canvas.
// resizes along with the browser window.
function draw() {
  // Start by clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redefining canvas dependant variables
  pillarSizeH = window.innerHeight/3;
  pillarNum = Math.ceil(window.innerWidth/(pillarSizeW + (pillarSizeW/4)));

  // Draw game elements
  // Top Pillars
  // for (let i = 0; i < pillarNum; i++) {
  //   drawPillar(((pillarSizeW + (pillarSizeW/4))*i)+20, 0);
  // }

  // // Bottom Pillars
  // for (let i = 0; i < pillarNum; i++) {
  //     drawPillar(((pillarSizeW + (pillarSizeW/4))*i)+20, (pillarSizeH*2));
  //   }

  drawRoom();

  // drawButton(canvas.width/2, (canvas.height/2)+simonSize+10);
  drawSimon(canvas.width/2, canvas.height/2);

  // drawSimon(0, 0);

  // Leaving this blue border here so that I can see the edge of the canvas
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = '1';
  ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawRoom(){
  var haz;
  var pillarStart;
  var rWallX;
  var cent = (window.innerWidth)/2;

  // Only for the moment will 3 be fallback if game has not started
  // This should be a splashscreen in future
  if (gameState.gameMoves.length <= 0){
    haz = 5;
  }
  else{
    haz = gameState.gameMoves.length + 2; //+2 for start and end platforms
  }

  // The location to start drawing pillars is calcualted using:
  // center - (((pillar number-1)/2)*(pillar width+pillar gap))+pillar width/2 for odd numbers
  // center - ((pillar number/2)*(pillar width+pillar gap))-pillar width/8 for even numbers

  // Turns out these equations reduce to the same so no need to split between even and odd
  // Also I use a general formula rather than hardcode that a game is 1/4 pillar width

  // This is used to center pillars on the screen if there are too few to fill the screen
  if (haz < pillarNum-1){
    pillarStart = cent - ((pillarSizeW/2)*((pillarGap*(haz-1))+haz));
    // Top Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar((pillarStart+((pillarSizeW+pillarGapW)*i)), 0);
    }
    // Bottom Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar((pillarStart+((pillarSizeW+pillarGapW)*i)), (pillarSizeH*2));
    }
    // Left Wall
    drawWall(0,0,pillarStart+5, window.innerHeight);
    // Right Wall
    rWallX = pillarStart+((pillarSizeW+pillarGapW)*haz)-pillarGapW-5;
    drawWall(rWallX,0,1000, window.innerHeight);
  }
  // Otherwise they are drawn from the left hand side
    else{
    // Top Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar(100+((pillarSizeW+pillarGapW)*i), 0);
    }
    // Bottom Pillars
    for (let i = 0; i < haz; i++) {
      drawPillar(100+((pillarSizeW+pillarGapW)*i), (pillarSizeH*2));
    }
    // Left Wall
    drawWall(0,0,100, window.innerHeight);
    // Right Wall
    rWallX = ((pillarSizeW+pillarGapW)*haz);
    drawWall(rWallX,0,1000, window.innerHeight);
  }
}

function drawSimon(x, y) {
  // Centering Simon
  x = x - simonSize/2;
  y = y - simonSize/2;

  ctx.beginPath();
  ctx.rect(x, y, simonSize, simonSize);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  // Dot to help see where simon starts
  ctx.beginPath();
  ctx.rect(x, y, 2, 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

function drawPillar(x, y){
  // Centering Pillar
  // x = x - pillarSizeW/2;
  // y = y - pillarSizeH/2;
  // Drawing Pillar
  ctx.beginPath();
  ctx.rect(x, y, pillarSizeW, pillarSizeH);
  ctx.fillStyle = "#999999";
  ctx.fill();
  ctx.closePath();
}

function drawWall(x, y, w, h){
  // Drawing Wall
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = "#999999";
  ctx.fill();
  ctx.closePath();
}

function drawButton(x, y){

  // Centering button
  x = x - (simonSize*1.2)/2;
  y = y - simonSize/2;

  ctx.beginPath();
  ctx.rect(x, y, simonSize*1.2, simonSize/4);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}
