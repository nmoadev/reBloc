var rebloc = {},
    _rebloc;

_rebloc = {
  rounds: 0,
  delay: 1,
  state: "Setup"
};

rebloc.start = function start(trellis) {



};


// rebloc.acquire = function acquire(button) {
//   _rebloc.currentAcquire++;
//   _rebloc.lastTimeout = setTimeout(function() {
//     if (_rebloc.buttonPressed === false) {
//       rebloc.emit('gameover');
//     }
//   }, _rebloc.delay);
// };
//
//
// trellis.on('buttonPress', function(buttonNumber) {
//   // If this button press gives us the button we were looking for
//   if (buttonNumber === rebloc.currentButton()) {
//     // cancel the last acquisition
//     clearTimeout(_trellis.lastTimeout);
//     // start the next acquisition, if we have another button to acquire
//     if (rebloc.nextButton() {
//       rebloc.acquire(rebloc.currentButton());
//     // otherwise, emit the signal to start the next round
//     } else {
//       rebloc.emit('nextround');
//     }
//   }
// });

_rebloc.nextroundCallback = function() {
  // Creare a new sequence
  _rebloc.newSequence();
  // Begin Display
  _rebloc.display(buttonIndex);

};

_rebloc.display = function(buttonIndex) {
  trellis.led(buttonIndex.i, buttonIndex.j).output(1);
  setTimeout(function() {
    if (_rebloc.nextIndex()) {
      _rebloc.display(_rebloc.currentIndex());
    } else {
      _rebloc.resetSequencePtr();
      _rebloc.acquire(_rebloc.currentIndex());
    }
  }, _rebloc.delay);
};

_rebloc.pressCallback = function() {
  // Prevent the failure timeout
  clearTimeout(_rebloc.lastTimeout);

  // Initiate the next acquire
  if (_rebloc.nextButtonIndex()) {
    _rebloc.acquire(_rebloc.currentIndex());
  } else {
    rebloc.emit('nextround');
  }
};

_rebloc.acquire = function(index) {
  // Setup an event listener for the specific button we need.
  trellis.button(i, j).once('press', pressCallback);

  _rebloc.lastTimeout = setTimeout(function() {
      // Remove the event listener
      trellis.button(index.i, index.j).removeListener('press', _rebloc.pressCallback);
      // End the game
      rebloc.emit('gameover');
  },_trellis.delay);
};
