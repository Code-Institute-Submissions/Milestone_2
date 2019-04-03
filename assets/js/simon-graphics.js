// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initialize() {

  // Declaring the variables before they are set in resizeCanvas as some depend on the size of the canvas
  var mult, simonSize, roomSize, pillarSizeW, pillarSizeH, pillarGap, pillarGapW, pillarNum, pillarArray, cent

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

  mult = 1;
  simonSize = 100 * mult;
  roomSize = simonSize * 4; // This is a function of Simon size where 1 = simonSize
  pillarSizeW = 200 * mult;
  pillarSizeH = 0; // Value depends on the canvas size which is calculated in draw function in simon-graphics
  pillarGap = 0.5; // This is a function of pillar width where 1 = pillarSizeW
  pillarGapW = pillarGap*pillarSizeW;
  pillarArray = [];

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
  stage.removeAllChildren();

  if (pillarArray[haz] > cent){
    off = pillarArray[haz] - cent;
    console.log(pillarArray[haz], cent, off);
  }

  drawRoom(off);

  var simonX = pillarArray[haz]+pillarSizeW/2;
  var simonY = pillarSizeH + roomSize
  stage.addChild(drawSimon(simonX,simonY));
  stage.update();

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
      stage.addChild(drawPillar(pillarArray[i], 0));
    }
    // Bottom Pillars
    for (let i = 0; i < haz; i++) {
      stage.addChild(drawPillar(pillarArray[i], pillarSizeH + roomSize));
    }
    // Left Wall
    stage.addChild(drawWall(0-off,0,pillarStart+5, window.innerHeight));
    // Right Wall
    rWallX = pillarStart+((pillarSizeW+pillarGapW)*haz)-pillarGapW-5-off;
    stage.addChild(drawWall(rWallX,0,1000, window.innerHeight));
    stage.addChild(drawButton((pillarArray[pillarArray.length-1]+(pillarSizeW/2)), pillarSizeH + roomSize));
  }
  
  // Otherwise they are drawn from the far left side
    else{
      // Calcualting pillar coordinates
      for (let i = 0; i < haz; i++) {
        pillarArray.push(((pillarSizeW+pillarGapW)*i)+100-off);
      }
      // Top Pillars
      for (let i = 0; i < haz; i++) {
        stage.addChild(drawPillar(pillarArray[i], 0));
      }
      // Bottom Pillars
      for (let i = 0; i < haz; i++) {
        stage.addChild(drawPillar(pillarArray[i], pillarSizeH + roomSize));
      }
      // Left Wall
      stage.addChild(drawWall(0-off,0,105, window.innerHeight));
      // Right Wall
      rWallX = ((pillarSizeW+pillarGapW)*haz)-5-off;
      stage.addChild(drawWall(rWallX,0,1000, window.innerHeight));
      stage.addChild(drawButton((pillarArray[pillarArray.length-1]+(pillarSizeW/2)), pillarSizeH + roomSize));
    }
}

function drawSimon(x, y) {
  // Centering Simon
  xn = x - simonSize/2;
  yn = y - simonSize;

  var graphics = new createjs.Graphics()
  graphics.beginFill('#0095DD');
  graphics.rect(xn,yn,simonSize,simonSize);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));
}

function drawPillar(x, y){

  var graphics = new createjs.Graphics()
  graphics.beginFill('#999999');
  graphics.rect(x,y,pillarSizeW,pillarSizeH);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));

}

function drawWall(x, y, w, h){

  var graphics = new createjs.Graphics()
  graphics.beginFill('#999999');
  graphics.rect(x,y,w,h);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));

}

function drawButton(x, y){

  // Centering button
  xn = x - (simonSize*1.2)/2;
  yn = y - simonSize/4;

  var graphics = new createjs.Graphics()
  graphics.beginFill('#FF0000');
  graphics.rect(xn, yn, simonSize*1.2, simonSize/4);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));

}

// Function used for seeing difference between where object is drawn and coordinates entered
function drawDot(x,y){
  ctx.beginPath();
  ctx.rect(x, y, 2, 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}
