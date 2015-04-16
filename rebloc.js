var Math = require('math'),
    EventEmitter = require('events').EventEmitter,
    rebloc = {},
    _rebloc;

utils.inherits(rebloc, EventEmitter);

rebloc.start = function start(trellis) {
  _rebloc = {
    rounds: 0, // use to track progess and decide length of sequence
    delay: 700, // 700 ms is starting delay, this would lead to 700 rounds... we'll work it out
    sequence: [],
    seqIdx: 0
    state: "Setup"
  };

  _rebloc.onNextRound();
};

_rebloc.randomIndex = function randomIndex() {
  return {
    i : Math.floor(Math.random() * (3 - 0 + 1) + 0),
    j : Math.floor(Math.random() * (3 - 0 + 1) + 0)
  };
};

_rebloc.nextIndex = function nextIndex() {
  _rebloc.seqIdx++;
  // If we we're still in range
  if (_rebloc.seqIdx < _rebloc.sequence.length) {
    return _rebloc.seqIdx;
  }

  // Rollover to beginning
  _rebloc.seqIdx = 0;

  return false;
};

_rebloc.currentIndex = function currentIndex() {
  return sequence[_rebloc.seqIdx];
};

_rebloc.onNextRound = function onNextRound() {
  // Creare a new sequence
  var i;

  // Replace the indices in the sequence from last round
  for (i = 0; i < _rebloc.rounds; i++) {
    _rebloc.sequence[i] = _rebloc.randomIndex();
  }

  // Add one more index for this round
  _rebloc.sequence.append(_rebloc.randomIndex());

  _rebloc.rounds++;
  _rebloc.delay--;

  // Begin Display
  _rebloc.display(_rebloc.currentIndex());
};

_rebloc.display = function(idx) {
  // Turn on the requested LED
  _reblpc.trellis.led(idx.i, idx.j).output(1);

  // Set a timeout for when to change the display
  setTimeout(function() {
    // Turn off previous LED
    _rebloc.trellis.led(idx.i, idx.j).output(0);

    // Get the next element in the sequence
    if (_rebloc.nextIndex()) {
      _rebloc.display(_rebloc.currentIndex());
    // If there are no more elements in the sequence, start acquiring
    } else {
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
  _rebloc.trellis.button(i, j).once('press', pressCallback);

  _rebloc.lastTimeout = setTimeout(function() {
      // Remove the event listener
      _rebloc.trellis.button(index.i, index.j).removeListener('press', _rebloc.pressCallback);
      // End the game
      rebloc.emit('gameover');
  },_rebloc.delay);
};

module.exports = rebloc;
