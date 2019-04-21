// Letting JSHint know that everything is ok and letting it know that variables are declared elsewhere
/*jslint node: true */
/*jshint browser: true */
'use strict';
// Library
/*global createjs*/
/*global Synth*/

// Define path to audio and list of key/value paired sounds for SoundJS
var audioPath = 'assets/sounds/';
var sounds = [
  { id: 'Zap', src: 'Zap_G2.wav' },
  { id: 'Hiss', src: 'Hiss_G4.wav' },
  { id: 'SpikeL', src: 'Spike_B6.wav' },
  { id: 'SpikeR', src: 'Spike_D7.wav' },
  { id: 'Click', src: 'Click.wav' }
];

// initialize the generated sounds object and set the volume
var notes = Synth.createInstrument('organ');
Synth.setVolume(0.75);

// Initialize createjs sounds and set their volume to 1/3 the game volume
function initializeS() {
  // if initializeDefaultPlugins returns false, this browser cannot play sound
  if (!createjs.Sound.initializeDefaultPlugins()) {
    return;
  }

  createjs.Sound.registerSounds(sounds, audioPath);
  createjs.Sound.volume = 0.25;
}
