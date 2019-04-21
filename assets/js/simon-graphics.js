// Letting JSHint know that everything is ok and letting it know that variables are declared elsewhere
/*jslint node: true */
/*jshint browser: true */
'use strict';
// Library
/*global window*/
/*global createjs*/
// simon-game.js
/*global canvas*/
/*global stage*/
/*global simon:true*/
/*global room*/
/*global hazards*/
/*global startFlag*/
/*global notes*/
// simon-logic.js
/*global gameState*/
/*global gameCheck*/
/*global gameOverflow*/
/*global gameOver*/
// simon-draw.js
/*global drawSimon*/
/*global drawPillar*/
/*global drawWall*/
/*global drawButton*/
/*global drawBolt*/
/*global drawSpike*/
/*global drawMSP*/
/*global drawTextbox*/

// This object is used to track the graphical state of the game
// All graphical sizes should be relative to simon and the game can be scaled dynamically using the multiplier factor mult
var grphState = {
  // The browser window width and height are used for relative values
  // They need to be set using an EventListener outside the object
  winW: 1,
  winH: 1,
  // Calculate the center of the screen
  get cent() {
    return this.winW / 2;
  },

  mult: 1,
  get simonSize() {
    return 100 * this.mult;
  },

  // How tall the room is relative to simon
  get roomH() {
    return this.simonSize * 4; // <- 4 times simons height
  },

  // The height of the button
  get buttonH() {
    return this.simonSize / 4; // <- 1/4 simons height
  },

  get buttonW() {
    return this.simonSize * 1.2; // <- 1/5 bigger than simons width
  },

  // How wide the pillar is relative to simon
  get pillarW() {
    return this.simonSize * 2; // <- 2 times as wide as simon
  },

  // This value is set depending on the browser height
  get pillarH() {
    return (this.winH - this.roomH) / 2;
  },

  // pillarGap is the relative size of the gap between pillars
  pillarGapR: 0.5, // <- 1/2 the pillar width
  get pillarGapW() {
    return this.pillarGapR * this.pillarW;
  },

  // This value is the pillar gap and width combined so it is used as a pillar 'unit' for some calculations
  get pillarWGapW() {
    return this.pillarW + this.pillarGapW;
  },

  // This value is the maximum number of pillars that could fit on the screen
  // The value is used to calculate when the game room needs to be centered on the screen
  get pillarNum() {
    return Math.ceil(this.winW / this.pillarWGapW);
  },

  // This keeps track of what pillar simon is on
  pillarNumCount: 0,

  // An array to store the generated pillar locations
  pillarArray: [],

  // Where the pillars start on the canvas
  pillarStart: 0,

  // Location of where the right hand wall starts, the left wall starts at 0 so does not need a value stored
  rWallX: 0
};

// This object stores the lines of dialogue used in the game in key/value pairs. The lines are stored in arrays as the code to handle displaying text will cycle through the array, displaying the entry line by line.
var dialogue = {
  // Keys 1-15 will match the room number that they should display in
  1: [
    'Hello Simon',
    'I need your help to push that big red button',
    'Jump from pillar to pillar using the right arrow/swipe',
    'If you follow my instructions, you will make it there safely'
  ],
  2: [
    'Hello again Simon',
    'I need you to push that big red button',
    'If you do as I say, you will make it there safely'
  ],
  3: ['I need you to push that button Simon. Just do as I say and you will be safe'],
  5: ['Keep going Simon', 'I will keep you safe'],
  7: ['Just do what I say Simon'],
  8: ['It will all be over soon'],
  10: ['You have come far Simon', "Don't let me distract you"],
  13: ['Maybe soon I might let you out of here', 'Or not'],
  15: ['Just keep doing what I say Simon', 'Just do', 'What', 'I', 'Say'],
  // These are game over dialogue
  go: ["I'm sorry Simon, you need to do exactly what I say if you want to make out of here alive"],
  go2: ['I told you Simon, I need you to push that button, you must keep going right'],
  gr: ['Now Simon, did I tell you to change the size of the browser?'],
  ld: ['Please follow my instructions and flip your device to play the game']
};

// Global flags to monitor game state
var animationFlag = false;
var tickStopFlag = false;
var buttonFlag = false;
var zapFlag = false;
var tutorialFlag = false;

// Function used to start listening for screen resizes and draws the first canvas at the current screensize
function initializeG() {
  // Listener for canvas resize, it waits for the user to stop resizing before executing resizeCanvas()
  // It makes it a little less dynamic but at the very least the game over screen will display correctly when the user finishes, without it the function fires multiple times meaning the game over screen gets overwritten
  // https://alvarotrigo.com/blog/firing-resize-event-only-once-when-resizing-is-finished/
  var resizeId;
  window.addEventListener('resize', function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(resizeCanvas, 500);
  });

  // Start animation ticker
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener('tick', loopDraw);
  createjs.MotionGuidePlugin.install();

  // Initialize the canvas on first loading the page
  resizeCanvas();

}

// Functions used to dynamically resize the canvas to the device size, Runs each time the DOM window resize event finishes firing .
// http://htmlcheats.com/html/resize-the-html5-canvas-dyamically/
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  grphState.winW = window.innerWidth;
  grphState.winH = window.innerHeight;

  // If after a resize or on initial load the 'room' does not quite fit into the browser window or the 'room' is too small this scales up or down everything using the multiplier
  while (grphState.winH <= grphState.roomH * 2) {
    grphState.mult -= 0.05;
  }

  while (grphState.roomH * 2 <= grphState.winH) {
    grphState.mult += 0.05;
  }

  // It's brutal but for the moment if the game has started it forces a game over as it is difficult to recalculate the locations of everything on the fly and maintain the gamestate. If the game hasn't started then the room is drawn normally
  if (startFlag) {
    gameOver(dialogue.gr);
  }
  else {
    // Initial Draw
    // Splash screen should always try to show the button at the end so it is set to max pillarNum -1
    if (grphState.pillarNum > 3) {
      initDraw(grphState.pillarNum - 1);
    }
    // If it can't, then draw the minimum of 3
    else {
      initDraw(3);
    }
  }
}

// Draw function used to 'set the stage'
function initDraw(num) {
  // Declaring some variables
  var titlebox, textbox;

  // If the screen is taller than it is wide (ie portrait) the screen is cleared, the event ticker is stopped and the user is told the site works better in landscape
  if (grphState.winW < grphState.winH) {
    // The ticker is stopped
    createjs.Ticker.removeEventListener('tick', loopDraw);
    tickStopFlag = true;

    // A setTimeout is used to remedy a bug where I think the ticker ticks one last time after the title and instructions are drawn, wiping them and redrawing a room. This should put this at the end of the callback queue.
    setTimeout(function() {
      graphicsRestart();

      // Once everything is cleared a textbox is drawn to tell the player to rotate to landscape
      titlebox = drawTextbox('Simon', 120, grphState.winW / 2, grphState.winH / 4);
      textbox = drawTextbox(dialogue.ld, 40, grphState.winW / 2, grphState.winH * 0.75);
      stage.addChild(titlebox);
      stage.addChild(textbox);
      stage.update();
    }, 100);
  }
  // If the screen is already in landscape then carry on
  else {
    // If the tick eventlistener has stopped, restart it
    if (tickStopFlag) {
      createjs.Ticker.addEventListener('tick', loopDraw);
    }

    // Start to draw by clearing everything
    graphicsRestart();

    // Generate a room layout
    generateRoom(num);

    // Calculate the position of simon for the center of the first pillar of the room
    // Note: most of the time since simon's x position is relative to his center and the pillar is generated from the top left, half a pillar width has to be added or accounted for
    var simonX = grphState.pillarArray[0] + grphState.pillarW / 2;
    var simonY = grphState.pillarH + grphState.roomH;

    // Display a title and instructions to start
    titlebox = drawTextbox('Simon', 120, grphState.winW / 2, grphState.winH / 4);
    textbox = drawTextbox('Press space or double tap to start', 40, grphState.winW / 2, grphState.winH / 2);

    // Draw the generated room, simon and add them both to the stage
    drawRoom();
    simon = drawSimon(simonX, simonY);
    stage.addChild(simon);
    stage.addChild(room);
    stage.addChild(titlebox);
    stage.addChild(textbox);
  }
}

// This is the main loop of the game and is ticked using the EventListener started in the initialize function above. As of now it contains everything that happens in the game. Once the room is generated and stage set, it watches for when a move is made by the player, that move and it's type is added to the game queue and then processed as either a pillar jump move or a hazard move. Those moves are then checked to be correct and animated.
function loopDraw() {
  // Just before the loop runs, if the user inputs more moves than there are game moves this ensures that they are removed before they cause trouble
  gameOverflow();

  // If a new pillar has been added or the button has been pushed the room is redrawn
  // In the if condition: -5 is minus 2 walls, the button, the hazard container and the room number
  if (grphState.pillarArray.length !== (room.children.length - 5) / 2 || buttonFlag) {
    // Clear all the graphics containers
    graphicsRestart();

    // Resets the button and animation flags and resets the move counter
    buttonFlag = false;
    animationFlag = false;
    gameState.userMoveCount = 0;

    // Calculate the position of simon for the first pillar and reset the pillar counter
    var simonX = grphState.pillarArray[0] + grphState.pillarW / 2;
    var simonY = grphState.pillarH + grphState.roomH;
    grphState.pillarNumCount = 0;

    // Draw the room, simon and add them to the stage
    drawRoom();
    simon = drawSimon(simonX, simonY);
    stage.addChild(simon);
    stage.addChild(room);

    // If the room number matches one of the keys in the dialogue dict then the text is displayed
    var rn = gameState.hazdMoves.length; // 'Room' number
    if (rn in dialogue) {
      // Multiple lines of text are stored in arrays, the array is looped over and each bit of dialogue is shown one after another
      var textArray = dialogue[rn];
      for (let i = 0; i < textArray.length; i++) {
        // A textbox is generated, its visibility set to zero then faded in at the right time
        var text = drawTextbox(textArray[i], 40, grphState.cent, grphState.pillarH / 2);
        text.alpha = 0;
        stage.addChild(text);

        // Fade text animation
        createjs.Tween.get(text)
          .wait(3000 * i)
          .to({ alpha: 1 }, 200)
          .wait(3000)
          .to({ alpha: 0 }, 200);
      }
    }

    stage.update();
  }

  var uml = gameState.userMoves.length; // Number of user move
  var tml = gameState.typeMovesTrack.length; // Number of the types of game moves (hazard or jump)
  var gml = gameState.gameMoves.length; // Number of raw game moves (L,R,U,D)

  // If a new move is added to the users move list then that move type is removed from the move tracker and pushed to the queue to be animated. This move tracking system is used so that animations finish playing before the next one starts
  if (tml > gml - uml) {
    gameState.typeMoveQ.push(gameState.typeMoves[tml - 1]);
    gameState.typeMovesTrack.pop();
  }

  // The position of simon is relative to the main stage whereas the position of the button is relative to the room which itself is a child of the stage. Since this is the case the stage position of the button is calculated and used to compare against the location of simon
  var button = room.children[0]; // The button is always the first child
  var buttonG = button.localToGlobal(0, 0);
  var buttonX = buttonG.x - grphState.buttonW / 2;
  var buttonY = buttonG.y - grphState.buttonH;

  // If the number of user moves is the same as game moves and simon is over the button the button should be pushed
  if (gml === uml && simon.x > buttonX) {
    // Once simons y starts to overlap with the top of the button the button is moved down
    if (simon.y >= buttonY) {
      button.y = simon.y + grphState.buttonH;
      // Once simon 'lands' on the button a sound is played, the game pauses and then resets for the next room
      if (animationFlag === false) {
        console.log('ButtonPressed');
        createjs.Sound.play('Click');
        animationFlag = true; // Animation Flag is set

        // After a pause the game resets
        setTimeout(function() {
          if (startFlag) {
            buttonFlag = true;
            gameCheck(gml);
            console.log('Next Room');
          }
        }, 600);
      }
    }
  }

  // If a jump move is made then simon will jump from pillar to pillar. If the incorrect key is pressed then game over
  if (gameState.typeMoveQ[0] === 'Jump' && animationFlag === false) {
    animationFlag = true; // Animation Flag is set
    var at = 500, // Animation time in ms
      pn = grphState.pillarNumCount, // Pillar number
      pi = grphState.pillarNumCount * 2, // Pillar index of the current pillar
      ps = grphState.pillarArray[pn] + grphState.pillarW / 2, // Pillar Start x
      pe = grphState.pillarArray[pn + 1] + grphState.pillarW / 2, // Pillar End x
      ph = grphState.pillarH + grphState.roomH, // Pillar Height
      th = grphState.pillarH + grphState.roomH / 4, // Text Height
      rh = grphState.roomH, // Room Height
      pd = ps + (pe - ps) / 2; // Half the pillar distance, used in the animation below

    // If the correct move is made, animate simon jumping from the current pillar to the next
    if (gameState.userMoves[pi].includes('Right')) {
      // If the distance to the next pillar is over the half way mark then the room is scrolled instead of simon so the x movement for simon is set to 0
      if (grphState.pillarArray[pn + 1] > grphState.cent) {
        var pe2 = pe - simon.x;
        ps = simon.x;
        pe = simon.x;
        pd = simon.x;

        // Since simon jumps along a quadratic curve, d/dx is linear meaning this linear animation is fine, I was worried for a minute it wasn't
        createjs.Tween.get(room).to({ regX: pe2 }, at);
      }

      // If the jump is to the last hazard pillar the last instruction is displayed
      if (gameState.typeMovesTrack.length === 2) {
        // Pull the move from the input key name
        var move = gameState.gameMoves[gameState.gameMoves.length - 2];
        move = move.replace('Arrow', '');

        // Create a textbox, add it to the stage and then display it for half a second
        var text = drawTextbox(move, 40, pe, th);
        stage.addChild(text);
        createjs.Tween.get(text)
          .wait(500)
          .to({ alpha: 0 }, 200);
      }

      // Otherwise if simon is not beyond the center he is animated normally
      createjs.Tween.get(simon)
        .to({ guide: { path: [ps, ph, pd, ph - rh / 2, pe, ph] } }, at)
        .wait(50)
        .call(function() {
          animationFlag = false;
          gameCheck(gameState.userMoveCount);
          gameState.userMoveCount++;
        });

      // The completed move is removed from the move queue
      gameState.typeMoveQ.shift();

      // The pillar number counter is incremented
      grphState.pillarNumCount++;
    }

    // Otherwise if the incorrect move is made animate game over
    else {
      createjs.Tween.get(simon)
        .to({ alpha: 0 }, 200)
        .call(function() {
          animationFlag = false;
          gameCheck(gameState.userMoveCount, dialogue.go2);
          gameState.userMoveCount++;
        });

      // The completed move is removed from the move queue
      gameState.typeMoveQ.shift();
    }
  }

  // If a hazard move is made then simon will avoid a hazard
  else if (gameState.typeMoveQ[0] === 'Hazard' && animationFlag === false) {
    animationFlag = true; // Animation Flag is set
    var pn = grphState.pillarNumCount, // Pillar number
      pi = grphState.pillarNumCount * 2 - 1, // Pillar index of the current pillar for arrays
      ph = grphState.pillarH + grphState.roomH, //Pillar Height
      pw = grphState.pillarW, // Pillar Width
      rh = grphState.roomH; // Room Height

    // If the move is an Up, simon jumps up
    if (gameState.gameMoves[pi].includes('Up')) {
      zapFlag = true; // Starts the electric bolts
      createjs.Sound.play('Zap');

      // If the user move matches the game move then simon avoids the hazard
      if (gameState.userMoves[pi].includes('Up')) {
        notes.play('G#', 3, 2); // Correct note plays
        createjs.Tween.get(simon)
          .to({ y: ph - rh / 4 }, 100)
          .to({ y: ph }, 200)
          .call(function() {
            animationFlag = false;
            zapFlag = false;
            lightningStriker();
            gameCheck(gameState.userMoveCount);
            gameState.userMoveCount++;
          });
      }

      // Otherwise the hazard animates and gameover is initiated
      else {
        notes.play('E', 3, 3); // Game over note plays
        setTimeout(function() {
          animationFlag = false;
          zapFlag = false;
          lightningStriker();
          gameCheck(gameState.userMoveCount);
        }, 200);
      }
    }

    // If the move is a Down, simon ducks
    else if (gameState.gameMoves[pi].includes('Down')) {
      var ah = grphState.pillarH - grphState.roomH; // Arm height
      hazards.addChild(drawMSP(grphState.pillarArray[pn], ah)); // Add an MSP to the hazard container
      var hi = hazards.children.length - 1; // Hazard Index
      createjs.Sound.play('Hiss');

      // If the user move matches the game move then simon avoids the hazard
      if (gameState.userMoves[pi].includes('Down')) {
        notes.play('G#', 4, 2); // Correct note plays

        // Animate the Mashy Spike Plate
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: -rh + grphState.simonSize / 2 }, 120)
          .wait(200)
          .to({ regY: 0 }, 180);

        // Animate simon
        createjs.Tween.get(simon)
          .to({ scaleY: 0.25 }, 100) // <- Ducks 1/4 height
          .wait(200)
          .to({ scaleY: 1 }, 200)
          .wait(100)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
            gameState.userMoveCount++;
          });
      }

      // Otherwise the hazard animates and gameover is initiated
      else {
        notes.play('E', 3, 3); // Game over note plays

        // Animate the Mashy Spike Plate
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: -rh + grphState.simonSize }, 120)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
          });
      }
    }

    // If the move is a left, simon dodges left
    else if (gameState.gameMoves[pi].includes('Left')) {
      var sx = grphState.pillarArray[pn] + grphState.pillarW * 0.66; // Spike x
      hazards.addChild(drawSpike(sx, ph, pw / 4, grphState.simonSize)); // Add a spike to the hazard container
      var hi = hazards.children.length - 1; // Hazard Index
      createjs.Sound.play('SpikeL');

      // If the user move matches the game move then simon avoids the hazard
      if (gameState.userMoves[pi].includes('Left')) {
        notes.play('B', 3, 2); // Correct note plays

        // Animate the Spike
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: grphState.simonSize }, 120)
          .wait(200)
          .to({ regY: 0 }, 120);

        // Animate simon
        createjs.Tween.get(simon)
          .to({ regX: pw / 2 }, 100)
          .wait(200)
          .to({ regX: 0 }, 200)
          .wait(100)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
            gameState.userMoveCount++;
          });
      }

      // Otherwise the hazard animates and gameover is initiated
      else {
        notes.play('E', 3, 3); // Game over note plays

        // Animate the Spike
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: grphState.simonSize }, 120)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
          });
      }
    }

    // If the move is a right, simon dodges right
    else if (gameState.gameMoves[pi].includes('Right')) {
      var sx = grphState.pillarArray[pn] + grphState.pillarW * 0.33; // Spike x
      hazards.addChild(drawSpike(sx, ph, pw / 4, grphState.simonSize));
      var hi = hazards.children.length - 1; // Hazard Index
      createjs.Sound.play('SpikeR');

      // If the user move matches the game move then simon avoids the hazard
      if (gameState.userMoves[pi].includes('Right')) {
        notes.play('D#', 4, 2);

        // Animate the Spike
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: grphState.simonSize }, 120)
          .wait(200)
          .to({ regY: 0 }, 120);

        // Animate simon
        createjs.Tween.get(simon)
          .to({ regX: -(pw / 2) }, 100)
          .wait(200)
          .to({ regX: 0 }, 200)
          .wait(100)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
            gameState.userMoveCount++;
          });
      }

      // Otherwise the hazard animates and gameover is initiated
      else {
        notes.play('E', 3, 3);

        // Animate the Spike
        createjs.Tween.get(hazards.children[hi])
          .to({ regY: grphState.simonSize }, 120)
          .call(function() {
            animationFlag = false;
            gameCheck(gameState.userMoveCount);
          });
      }
    }

    // The completed move is removed from the move queue
    gameState.typeMoveQ.shift();
  }

  // Once the electricity has been started by the Up move a bolt is added, then every tick the bolt is removed and a newly generated bolt is added to simulate electricity
  // https://stackoverflow.com/questions/36724818/remove-shapes-with-specific-name-form-stage-in-easeljs/36728703
  if (zapFlag) {
    // Removes the previous bolt
    lightningStriker();

    var bs = grphState.pillarArray[grphState.pillarNumCount]; // Bolt start
    var by = grphState.pillarH + grphState.roomH + 5; // Bolt y position
    var bl = grphState.pillarW; // Bolt length
    hazards.addChild(drawBolt(bs, by, bl));
  }

  // Update the stage every tick
  stage.update();
}

// This function is used to calculate the positions of the pillars and walls for the room
function generateRoom(pill) {
  // Clear the pillar array
  grphState.pillarArray = [];

  // If the number of requested pillars is less than the maximum calcPillarStart is used to calculate where the first pillar should be relative to the center of the screen
  if (pill < grphState.pillarNum) {
    grphState.pillarStart = calcPillarStart(pill);
  }

  // Otherwise they are drawn from the far left side
  else {
    grphState.pillarStart = 105;
  }

  // Calculating pillar coordinates for number of pillars
  for (let i = 0; i < pill; i++) {
    grphState.pillarArray.push(grphState.pillarStart + grphState.pillarWGapW * i);
  }

  // The location of the right hand wall is then calculated
  grphState.rWallX = calcrWallX(pill);
}

// This function is used to calculate where the pillars should start based on the center of the room.
  // The location to start drawing pillars was calculated using the two formulas:
  // center - (((pillar number-1)/2)*(pillar width+pillar gap))+pillar width/2 for odd numbers of pillars
  // center - ((pillar number/2)*(pillar width+pillar gap))-pillar width/8 for even numbers of pillars
  // Turns out these equations reduce to the same formula which is used below
  // Note that the formulas above used a hard coded value for the gap between pillars, now the formula below uses a more general form using pillarGap
function calcPillarStart(pill) {
  var c = grphState.cent;
  var pw = grphState.pillarW;
  var pg = grphState.pillarGapR;

  return c - (pw / 2) * (pg * (pill - 1) + pill) + 5;
}

// This function calculates where the right-hand wall starts, counting however many pillar 'units' there are but not forgetting the last pillar has no gap following
function calcrWallX(pill) {
  var ps = grphState.pillarStart;
  var pwgw = grphState.pillarWGapW;
  var pgw = grphState.pillarGapW;

  return ps + pwgw * pill - pgw - 5;
}

// This small function removes lightning from the hazards container, it needs to be a function so that when the Up animation ends it can remove the last bolt
function lightningStriker() {
  // Looping through the hazards container, if a child is found with the name 'Bolt' it is removed
  for (let i = hazards.children.length - 1; i >= 0; i--) {
    var hchild = hazards.getChildAt(i);
    if (hchild.name === 'Bolt') {
      hazards.removeChild(hchild);
    }
  }
}

// This small function clears all the graphics containers for when the canvas needs to be cleared
function graphicsRestart() {
  // Clear everything before restarting
  stage.removeAllChildren();
  room.removeAllChildren();
  hazards.removeAllChildren();
  room.regX = 0; // This re-centers the room if it was scrolled previously
}

// This function clears the room and redraws a previously generated room
function drawRoom() {
  // Clear everything from the room
  room.removeAllChildren();

  var pn = grphState.pillarArray.length; // Number of pillars
  var name; // Name variable which is used to give each object a unique name

  // Button and hazards first so they animate behind the pillars
  room.addChild(drawButton(grphState.pillarArray[pn - 1] + grphState.pillarW / 2, grphState.pillarH + grphState.roomH));
  room.addChild(hazards);

  // Top Pillars
  for (let i = 0; i < pn; i++) {
    name = 'TopPillar' + (i + 1);
    room.addChild(drawPillar(grphState.pillarArray[i], 0, name));
  }
  // Bottom Pillars
  for (let i = 0; i < pn; i++) {
    name = 'BottomPillar' + (i + 1);
    room.addChild(drawPillar(grphState.pillarArray[i], grphState.pillarH + grphState.roomH, name));
  }
  // Left Wall
  room.addChild(drawWall(0, 0, grphState.pillarStart + 5, grphState.winH, 'LeftWall'));
  // Right Wall
  room.addChild(drawWall(grphState.rWallX, 0, 2000, grphState.winH, 'RightWall'));

  // Calculate where the room number should go
  var roomNumX = grphState.pillarArray[0] + grphState.pillarW / 2;
  var roomNumY = grphState.pillarH / 3;
  var fontSize = 90 * grphState.mult;
  var text;
  // If the game has started then the room number is added
  if (startFlag) {
    text = new createjs.Text(pn - 2, fontSize + 'px Courier', '#EEEEEE');
  }
  // If it hasn't then a blank text object is added, it needs to be added since the number of objects in the room needs to remain consistent for calculations elsewhere
  else {
    text = new createjs.Text('', fontSize + 'px Courier', '#EEEEEE');
  }
  // The number is then placed at the correct location and then added to the room
  text.x = roomNumX;
  text.y = roomNumY;
  text.textAlign = 'center';
  room.addChild(text);
}

// This function animates the gameover, it fades the screen to black and displays the gameover text
function gameOverGraphics(text) {
  // Create a new graphics object at 0,0
  var graphics = new createjs.Graphics();
  graphics.beginFill('#000000');
  graphics.rect(0, 0, grphState.winW, grphState.winH);
  var curtains = new createjs.Shape(graphics);

  // Set the blackout 'curtain' to be transparent then fade in
  curtains.alpha = 0;
  stage.addChild(curtains);
  createjs.Tween.get(curtains).to({ alpha: 1 }, 100);

  // A textbox is generated, its visibility set to zero then faded in
  var textbox = drawTextbox(text, 40, grphState.winW / 2, grphState.winH / 2);
  textbox.alpha = 0;
  stage.addChild(textbox);
  // Fade text animation
  createjs.Tween.get(textbox)
    .wait(1000)
    .to({ alpha: 1 }, 1000)
    .wait(3000)
    .to({ alpha: 0 }, 200)
    .wait(1000)
    .call(function() {
      if (startFlag === false) {
        initDraw(grphState.pillarNum - 1);
      }
    });
}
