// Letting JSHint know that everything is ok and letting it know that variables are declared elsewhere
/*jslint node: true */
/*jshint browser: true */
'use strict';
// Library
/*global createjs*/
// simon-graphics.js
/*global grphState*/

// Below are all the functions used to draw objects for the game. Note that all the functions return a shape or object which then must be added to a container or directly to the stage. In the function they are drawn at 0,0 then shifted to the specified x,y coordinates. This was done so that it is easier to track of their locations using their shape.x value

// Returns a simon shape
function drawSimon(x, y) {
  // Create a new graphics object centered at 0,0
  var ss = grphState.simonSize;
  var graphics = new createjs.Graphics();
  graphics.beginFill('#0095DD'); // <- The color of simon
  graphics.rect(-(ss / 2), -ss, ss, ss);

  // The object is centered on the given point, given a name and returned
  var simn = new createjs.Shape(graphics);
  simn.x = x;
  simn.y = y;
  simn.name = 'Simon';

  return simn;
}

// Returns a pillar shape
function drawPillar(x, y, name) {
  // Create a new graphics object at 0,0
  var graphics = new createjs.Graphics();
  graphics.beginFill('#999999'); // <- The color of the pillar
  graphics.rect(0, 0, grphState.pillarW, grphState.pillarH);

  // The object is moved to the given point, given a name and returned
  var pllr = new createjs.Shape(graphics);
  pllr.x = x;
  pllr.y = y;
  pllr.name = name;

  return pllr;
}

// Returns a wall shape
function drawWall(x, y, w, h, name) {
  // Create a new graphics object at 0,0
  var graphics = new createjs.Graphics();
  graphics.beginFill('#999999'); // <- The color of the wall
  graphics.rect(0, 0, w, h);

  // The object is moved to the given point, given a name and returned
  var wall = new createjs.Shape(graphics);
  wall.x = x;
  wall.y = y;
  wall.name = name;

  return wall;
}

// Returns a button shape
function drawButton(x, y) {
  // Button width and height from the graphics object
  var bw = grphState.buttonW;
  var bh = grphState.buttonH;

  // Create a new graphics object centered at 0,0
  var graphics = new createjs.Graphics();
  graphics.beginFill('#FF0000'); // <- The color of the button
  graphics.rect(-(bw / 2), -bh, bw, bh);

  // The object is centered on the given point and given a name
  var bttn = new createjs.Shape(graphics);
  bttn.x = x;
  bttn.y = y;
  bttn.name = 'Button';

  return bttn;
}

// Returns a new randomly generated squiggly bolt of lightning, very, very frightening me
function drawBolt(x, y, w) {
  // Create a graphics object
  var graphics = new createjs.Graphics();
  graphics.setStrokeStyle(3);
  graphics.beginStroke('#FDD023');

  // Set two arrays to store the random x,y values for the line with a start at 0,0
  var zapx = [0];
  var zapy = [0];

  // While the total length of the line is less that the given width w, a random length and a random y value are added to the line arrays
  // https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
  while (zapx.reduce(function(acc, val){return acc + val;}, 0) < w) {
    // The value of 20 was chosen by trial and error, may need to be changed but for the moment it scales with the multiplier
    zapx.push(Math.random() * (w / (20 * grphState.mult)));
    zapy.push(-(Math.random() * (20 * grphState.mult)));
  }

  // While the line is longer than the given width, remove a line segment. This should remove any overflow caused by the condition of the above while loop. I presume it should only be one extra segment but this is just to be sure to be sure
  while (zapx.reduce(function(acc, val){return acc + val;}, 0) > w) {
    zapx.pop();
  }

  // Set the last values of the arrays to the same start point
  zapx.push(0);
  zapy.push(0);

  // For all the line segments build up a continuous electric line
  // A line is drawn from temp to temp + the next random length, then the random length is added to temp so the next section of line will start from the next point
  var temp = zapx[0];
  for (let i = 0; i < zapx.length; i++) {
    graphics.moveTo(temp, zapy[i]).lineTo(temp + zapx[i], zapy[i + 1]);
    temp += zapx[i];
  }

  // The object is moved to the given point, given a name and returned
  var bolt = new createjs.Shape(graphics);
  bolt.x = x;
  bolt.y = y;
  bolt.name = 'Bolt';

  return bolt;
}

// Returns a large spike shape
function drawSpike(x, y, w, h) {
  // Create a new graphics object centered at 0,0
  var graphics = new createjs.Graphics();
  graphics.beginFill('#BBBBBB');
  graphics
    .moveTo(0, 0)
    .lineTo(w / 2, h)
    .lineTo(-w / 2, h)
    .closePath();

  // The object is moved to the given point, given a name and returned
  var spike = new createjs.Shape(graphics);
  spike.x = x;
  spike.y = y;
  spike.name = 'Spike';

  return spike;
}

// Returns a Mashy Spike Plate, straight from the boys down at Aperture Science
function drawMSP(x, y) {
  // Create a new graphics object
  var pw = grphState.simonSize / 4; // Plate Height and Arm Width
  var graphics = new createjs.Graphics();
  graphics.beginFill('#BBBBBB');

  // MSP Arm
  // Note the arm is as long as the room so that when it extends it can reach far enough
  graphics.rect(grphState.pillarW / 2 - pw / 2, 0, pw, grphState.roomH);

  // MSP Plate
  graphics.rect(0, grphState.roomH - pw, grphState.pillarW * 0.95, pw);

  // MSP Spikes, 9 for every plate
  var step = grphState.pillarW / 10;
  var start = step / 2 + grphState.pillarW / 40; // Start in at a fraction of the plate width

  // Looping 9 times adding a spike at each step
  for (let i = 0; i < 9; i++) {
    graphics
      .moveTo(start + step / 2, grphState.roomH)
      .lineTo(start, grphState.roomH + pw * 0.75)
      .lineTo(start - step / 2, grphState.roomH)
      .closePath();
    start += step;
  }

  // The object is moved to the given point, given a name and returned
  var msp = new createjs.Shape(graphics);
  msp.x = x;
  msp.y = y;
  msp.name = 'Mashy Spike Plate';

  return msp;
}

// Returns a textbox the width and height of the entered text
function drawTextbox(line, fs, x, y) {
  // The fontsize is dynamic using the graphics multiplier
  var fontSize = fs * grphState.mult;

  // The max width of the textbox is set to the max screen width with a little chopped off each side. If the text exceeds this width it should wrap
  var maxline = grphState.winW - grphState.winW / 8;

  // A new text object is made with the dynamic font size and line width
  var text = new createjs.Text(line, fontSize + 'px Courier', '#FFFFFF');
  text.lineWidth = maxline;
  text.lineHeight = fontSize;
  text.textAlign = 'center';

  // The bounds of the text object are calculated to use when creating the box
  text.getBounds();
  text.x = text._rectangle.width / 2; // Since the text is centered at 0,0 it moves so the left is at 0,0
  var bw = text._rectangle.width + text._rectangle.height / 5;
  var bh = text._rectangle.height + text._rectangle.height / 10;

  // A graphics object is made the size and shape of the text with some padding
  var graphics = new createjs.Graphics();
  graphics.beginFill('#000000');
  graphics.rect(-(text._rectangle.height / 10), -(text._rectangle.height / 10), bw, bh);
  var box = new createjs.Shape(graphics);

  // The text and the box are added to the same container, centered on the given point and returned
  var textbox = new createjs.Container();
  textbox.addChild(box);
  textbox.addChild(text);
  textbox.x = x - bw / 2;
  textbox.y = y - bh / 2;

  return textbox;
}
