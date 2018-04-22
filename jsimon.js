var strict = false;
var compSequence = [];
var userSequence = [];
var lightInt = 500; //light playback delay
var counter = 0; //how many correct presses you've made
var winAt = 20; //sequence length needed to win
var sound_yellow = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
var sound_green = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var sound_red = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var sound_blue = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var sound_gameover = new Audio("https://bit.ly/2i6znut");
var sound_mistake = new Audio("https://bit.ly/2hDtBwZ");
var sound_toggle = new Audio("https://bit.ly/2hVnoQ0");
var sound_reset = new Audio("https://bit.ly/2ieTILd");
var sound_win = new Audio("https://bit.ly/2isBt4v");

//start with colored buttons turned off
$(document).ready(function() {
  disable();
});

$('.click').click(function() {
  var input = "";
  var len = compSequence.length;
  if($(this).hasClass('red')) input = "red";
  if($(this).hasClass('green')) input = "green";
  if($(this).hasClass('yellow')) input = "yellow";
  if($(this).hasClass('blue')) input = "blue";
  userSequence.push(input);
  if(input !== compSequence[counter]) { //if you miss one, replay...
    if(strict) ending(); //...start over if you're in strict mode
    else mistake1(); //...or make ouch sound in not in strict
  } else {
    clickMe(input);
    playSound(input);
    ++counter; //otherwise, try matching next in sequence
    if(userSequence.length >= compSequence.length) {
      if(compSequence.length == winAt) win(); //if sequence is winning length, win
      else addPush(); //else, add another
      readOut();
    }
  }
});

//This does the inward-click animation.
//The css handles a tap-click.
function clickMe(color) {
  $('#' + color).addClass('push');
    setTimeout(function() {
      $('#' + color).removeClass('push');
    }, lightInt / 2);
}

//toggle strict mode
$("#myonoffswitch").click(function() {
  if(strict === false) strict = true;
  else strict = false;
  sound_toggle.play();
});

//Adds a step to the computer's sequence
function addPush() {
  disable();
  var rnd = Math.floor(Math.random() * 4); //since there are 4 buttons
  var toPush = "";
  switch(rnd) {
    case 0:
      toPush = "red";
      break;
    case 1:
      toPush = "green";
      break;
    case 2:
      toPush = "yellow";
      break;
    case 3:
      toPush = "blue";
      break;
    default:
      toPush = "ERROR";
  }
  compSequence.push(toPush);
  document.getElementById("moves").innerHTML = Number(document.getElementById("moves").innerHTML) + 1; //increment move counter
}

//Wrapper for rdOut(). It returns true so that enable() can wait for it
//to finish.
function readOut() {
  disable();
  userSequence = [];
  counter = 0;
  if(compSequence === []) return;
  setTimeout(function() {
    rdOut(compSequence, 0); //starts at index 0
  }, lightInt);
}

//A recursive function using setTimeout.
//Can't use setInterval since the interval
//isn't even.
function rdOut(seq, index) {
  var len = seq.length;
  if(len === 0 || index >= len) {
    enable();
    return;
  }
  setTimeout(function() {
    $('#' + seq[index]).addClass('showMe');
    playSound(seq[index]);
    setTimeout(function() {
      $('#' + seq[index]).removeClass('showMe');
      rdOut(seq, index + 1);
    }, lightInt / 2);
  }, lightInt);
}

//reset everything
function reset() {
  sound_reset.play();
  userSequence = [];
  compSequence = [];
  document.getElementById("moves").innerHTML = "0";
  $("#go").prop('disabled', false);
  enable();
}

//for the first move
function start() {
  enable();
  document.getElementById("moves").innerHTML = "0";
  $("#go").prop('disabled', true);
  addPush();
  if(readOut()) enable();
}

//when you lose in strict mode
function ending() {
  mistake2();
  disable();
  compSequence = [];
  userSequence = [];
  counter = 0;
  $("#go").prop('disabled', false);
}

//for a mistake in non-strict mode
function mistake1() {
  sound_mistake.play();
  var temp = document.getElementById("moves").innerHTML;
  document.getElementById("moves").innerHTML = ":(";
  $("#red").addClass("mistake");
  $("#green").addClass("mistake");
  $("#yellow").addClass("mistake");
  $("#blue").addClass("mistake");
  setTimeout(function() {
    $("#red").removeClass("mistake");
    $("#green").removeClass("mistake");
    $("#yellow").removeClass("mistake");
    $("#blue").removeClass("mistake");
    setTimeout(function() {
      document.getElementById("moves").innerHTML = temp;
      if(readOut()) enable();
    }, lightInt);
  }, lightInt);
}

//if you make a mistake in strict mode, the
//buttons turn grey and you have to push reset or go
function mistake2() {
  sound_gameover.play();
  document.getElementById("moves").innerHTML = ":(";
  $("#red").addClass("mistake");
  $("#green").addClass("mistake");
  $("#yellow").addClass("mistake");
  $("#blue").addClass("mistake");
  disable();
}

//disable all the buttons except reset
function disable() {
     document.getElementById("red").style.pointerEvents = 'none';
   document.getElementById("green").style.pointerEvents = 'none';
  document.getElementById("yellow").style.pointerEvents = 'none';
    document.getElementById("blue").style.pointerEvents = 'none';
  $("#slider").prop('disabled', true);
}

//re-enable buttons
function enable() {
  console.log("enabled");
     document.getElementById("red").style.pointerEvents = 'auto';
   document.getElementById("green").style.pointerEvents = 'auto';
  document.getElementById("yellow").style.pointerEvents = 'auto';
    document.getElementById("blue").style.pointerEvents = 'auto';
        if($("#red").hasClass("mistake")) $("#red").removeClass("mistake");
    if($("#green").hasClass("mistake")) $("#green").removeClass("mistake");
  if($("#yellow").hasClass("mistake")) $("#yellow").removeClass("mistake");
      if($("#blue").hasClass("mistake")) $("#blue").removeClass("mistake");
  $("#slider").prop('disabled', false);
}

//Plays the sound matching the color. Maybe all the sounds could be consolidated here.
function playSound(color) {
  switch(color) {
    case 'yellow':
      if(!sound_yellow.ended) {
        var nother = sound_yellow.cloneNode();
        nother.play();
      } else sound_yellow.play();
      break;
    case 'green':
      if(!sound_green.ended) {
        var nother = sound_green.cloneNode();
        nother.play();
      } else sound_green.play();
      break;
    case 'red':
      if(!sound_red.ended) {
        var nother = sound_red.cloneNode();
        nother.play();
      } else sound_red.play();
      break;
    case 'blue':
      if(!sound_blue.ended) {
        var nother = sound_blue.cloneNode();
        nother.play();
      } else sound_blue.play();
      break;
    default:
      console.log("sounds are broken");
  }
}

//HAPPY
function win() {
  sound_win.play();
  document.getElementById("moves").innerHTML = ":)";
  disable();
  compSequence = [];
  userSequence = [];
  counter = 0;
  $("#go").prop('disabled', false);
}
