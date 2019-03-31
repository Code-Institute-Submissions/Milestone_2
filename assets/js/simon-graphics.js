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
  pillarSizeY = window.innerHeight/3;
  pillarNum = Math.ceil(window.innerWidth/(pillarSizeX + (pillarSizeX/4)));

  // Draw game elements
  // Top Pillars
  for (var i = 0; i < pillarNum; i++) {
    drawPillar(((pillarSizeX + (pillarSizeX/4))*i)+20, 0);
  }

  // Bottom Pillars
  for (var i = 0; i < pillarNum; i++) {
      drawPillar(((pillarSizeX + (pillarSizeX/4))*i)+20, (pillarSizeY*2));
    }

  drawSimon(canvas.width/2, canvas.height/2);
  // drawSimon(0, 0);

  // Leaving this blue border here so that I can see the edge of the canvas 
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = '1';
  ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
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
}

function drawPillar(x, y){
  // Centering Pillar
  // x = x - pillarSizeX/2;
  // y = y - pillarSizeY/2;
  // Drawing Pillar
  ctx.beginPath();
  ctx.rect(x, y, pillarSizeX, pillarSizeY);
  ctx.fillStyle = "#999999";
  ctx.fill();
  ctx.closePath();
}
