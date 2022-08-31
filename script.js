//Global Variables
var pattern =  Array.from({length: Math.floor(Math.random()*4)+5}, () => Math.floor(Math.random() * 6)+1);
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

//Global Constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

function startGame() {
  //initialize game variables
  pattern = Array.from({length: Math.floor(Math.random()*4)+5}, () => Math.floor(Math.random() * 6)+1);
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("soundBtn").classList.add("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("soundBtn").classList.remove("hidden");
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Congratulations! You won!");
}

function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit");
}

function guess(btn) {
  console.log("user guessed " + btn);
  if(!gamePlaying) {
    return;
  }
  
  if(btn != pattern[guessCounter]) {
    loseGame();
  } else if (guessCounter == progress) {
      if(progress == pattern.length-1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
  } else {
    guessCounter++;
  }
}

function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i = 0;i<=progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: Math.random()*400+100,
  2: Math.random()*400+100,
  3: Math.random()*400+100,
  4: Math.random()*400+100,
  5: Math.random()*400+100,
  6: Math.random()*400+100
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

function changeSound() {
  for(let i = 0; i < 6; i++) {
    freqMap[i] = Math.random()*400+100
  }
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
