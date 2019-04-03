// This object is used to track the graphical state of the game
// All graphical sizes should be relative to Simon so that if needs be in the future the game can be scaled using the multiplier factor
var grphState = {
  // The browser window width and height are used for relative values 
  // They need to be set using an EventListener outside the object
  winW:1,
  winH:1,
  // Calculate the center of the screen
  get cent(){
    return this.winW/2},

  mult:1, 
  get simonSize(){
    return 100 * this.mult},
  
  // How tall the room relative to Simon
  get roomH(){
    return this.simonSize * 4},
  
  // How wide the pillar is relative to simon
  get pillarW(){
    return this.simonSize * 2},
  
  // This value is set depending on the browser size
  get pillarH(){
    return (this.winH-this.roomH)/2},

  // pillarGap is the relative size of the gap between pillars 
  pillarGapR:0.5,
  get pillarGapW(){
    return this.pillarGapR*this.pillarW},

  // This value is the pillar gap and width combined
  get pillarWGapW(){
    return this.pillarW + this.pillarGapW},

  // This value is the maximum number of pillars that could fit on the screen
  // The value is used to calculate if the game room needs to be centered on the sceen 
  get pillarNum(){
    return Math.ceil(this.winW/(this.pillarWGapW))},

  // An array to store the pillar locations
  pillarArray:[],

  // Where the pillars start
  pillarStart:0,

  // Location of where the right hand wall starts
  rWallX:0
};

// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initialize() {

  window.addEventListener('resize', resizeCanvas, false);
  // Used to initialize the canvas on first loading the page
  resizeCanvas();

  // Generate a default room, this should be chaneged for a splash screen in future
  generateRoom(5);
  draw();
}

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  grphState.winW = window.innerWidth;
  grphState.winH = window.innerHeight;

  draw();
}

// Display custom canvas.
// resizes along with the browser window.
function draw(pill) {

  var off = 0;
  // Start by clearing the canvas
  stage.removeAllChildren();
  
  var simonX = grphState.pillarArray[pill]+grphState.pillarW/2;
  var simonY = grphState.pillarH + grphState.roomH

  if (simonX > grphState.cent){
    off = simonX - grphState.cent
    simonX = grphState.cent
  }
  
  drawRoom(off);
  stage.addChild(drawSimon(simonX,simonY));
  stage.update();

}

// This function is used to calcualte the positions of the pillars and walls for the room
function generateRoom(pill){
  // Clear the pillar array 
  grphState.pillarArray = [];

  // This is used to center pillars on the screen if there are too few to fill the screen
  if (pill < grphState.pillarNum){
    console.log(pill, grphState.pillarNum);
    grphState.pillarStart = calcPillarStart(pill);
  }
  // Otherwise they are drawn from the far left side
  else{
    grphState.pillarStart = 105;
  }
  // Calcualting pillar coordinates
  for (let i = 0; i < pill; i++) {
    grphState.pillarArray.push(grphState.pillarStart+((grphState.pillarWGapW)*i));
  }
  grphState.rWallX = calcrWallX(pill);

}

// This function is used to calcualte where the pillars should start based on the center of the room. 
  // The location to start drawing pillars was calcualted using the two formulas:
  // center - (((pillar number-1)/2)*(pillar width+pillar gap))+pillar width/2 for odd numbers
  // center - ((pillar number/2)*(pillar width+pillar gap))-pillar width/8 for even numbers
  // Turns out these equations reduce to the same formula which is used below
  // Note that the formulas above used a hardcoded value for the gap between pillars, now the formula below uses a more general form using pillarGap
function calcPillarStart(pill){
  var c = grphState.cent;
  var pw = grphState.pillarW;
  var pg = grphState.pillarGapR;

  return c - ((pw/2)*((pg*(pill-1))+pill)) + 5;
}

function calcrWallX(pill){
  var ps = grphState.pillarStart;
  var pwgw = grphState.pillarWGapW;
  var pgw = grphState.pillarGapW;

  return ps+((pwgw)*pill)-pgw-5
}

function drawRoom(off){
  var pn = grphState.pillarArray.length;

  // Top Pillars
  for (let i = 0; i < pn; i++) {
    stage.addChild(drawPillar(grphState.pillarArray[i]-off, 0));
  }
  // Bottom Pillars
  for (let i = 0; i < pn; i++) {
    stage.addChild(drawPillar(grphState.pillarArray[i]-off, grphState.pillarH + grphState.roomH));
  }
  // Left Wall
  stage.addChild(drawWall(0-off,0,grphState.pillarStart+5, grphState.winH));
  // Right Wall
  stage.addChild(drawWall(grphState.rWallX-off,0,10000, grphState.winH));
  // Button
  stage.addChild(drawButton((grphState.pillarArray[pn-1]+(grphState.pillarW/2))-off, grphState.pillarH + grphState.roomH));

}

function drawSimon(x, y) {
  // Centering Simon
  var ss = grphState.simonSize;
  var xn = x - ss/2;
  var yn = y - ss;

  var graphics = new createjs.Graphics()
  graphics.beginFill('#0095DD');
  graphics.rect(xn,yn,ss,ss);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));
}

function drawPillar(x, y){

  var graphics = new createjs.Graphics()
  graphics.beginFill('#999999');
  graphics.rect(x,y,grphState.pillarW,grphState.pillarH);
  
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
  var ss = grphState.simonSize;
  var xn = x - (ss*1.2)/2;
  var yn = y - ss/4;

  var graphics = new createjs.Graphics()
  graphics.beginFill('#FF0000');
  graphics.rect(xn, yn, ss*1.2, ss/4);
  
  // Draw dot for debugging
  graphics.beginFill('#000000')
  graphics.rect(x,y,2,2);

  return (new createjs.Shape(graphics));

}
