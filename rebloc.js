var EventEmitter = require('events').EventEmitter,
    Rebloc;

Rebloc = function Rebloc(trellis) {
  var rebloc = new EventEmitter(), // Public Interface
      _rebloc = { // Private data
        rounds: 0, // use to track progess and decide length of sequence
        delay: 1000, // Time between flashes and window for acquisition. 
        sequence: [], 
        seqIdx: 0,
        state: "Setup",
        trellis: trellis,
        seed: new Date().getMilliseconds()
      };

  /**
   * Start the game by resetting all of the data.
   * Then begin the first round
   */
  rebloc.start = function start() {
    _rebloc.sequence = [];
    _rebloc.delay = 1000;
    _rebloc.seqIdx = 0;
    _rebloc.trellis.clearDisplay();
    _rebloc.trellis.blink(0);
    _rebloc.trellis.brightness(15);
    _rebloc.rounds = 0;
    _rebloc.delay = 1000;
    _rebloc.onNextRound();
  };
   
  /**
   * Called when 'nextround' event is emitted
   *
   * Extend the sequence and begin display phase
   *
   */
  _rebloc.onNextRound = function onNextRound() {
    // Create a new sequence
    var i,
        prev,
        cur;
  
    // Replace the indices in the sequence from last round
    for (i = 0; i < _rebloc.rounds; i++) {
      _rebloc.sequence[i] = _rebloc.randomIndex();
    }
  
    prev = _rebloc.sequence[i-1];
    cur = _rebloc.randomIndex();

    // Add one more index for this round
    _rebloc.sequence.push(cur);
  
    // Increase Round Number
    _rebloc.rounds++;
  
    // Begin Display
    _rebloc.display(_rebloc.currentIndex());
  };

  /**
   * Called by onNextRound (and itself pseudo-recursively)
   *
   * Display the sequence on the leds
   */
  _rebloc.display = function(idx) {
    // Turn on the requested LED
    _rebloc.trellis.led(idx.i, idx.j).output(1);
  
    // Set a timeout for when to change the display
    setTimeout(function() {
      // Turn off previous LED
      _rebloc.trellis.led(idx.i, idx.j).output(0);
  
      setTimeout(function() {
        // Get the next element in the sequence
        if (_rebloc.nextIndex()) {
          _rebloc.display(_rebloc.currentIndex());
        // If there are no more elements in the sequence, start acquiring
        } else {
          _rebloc.acquire(_rebloc.currentIndex());
        }
      }, 100);
    }, _rebloc.delay);
  };
  
  /**
   * Called by display and onButton press
   *
   * Listen for each button press required
   */
  _rebloc.acquire = function(index) {
    // Setup an event listener for the specific button we need.
    _rebloc.trellis.button(index.i, index.j).once('press', _rebloc.onButtonPress);
  
    _rebloc.lastTimeout = setTimeout(function() {
        // Remove the event listener
        _rebloc.trellis.button(index.i, index.j).removeListener('press', _rebloc.pressCallback);
        // End the game
        rebloc.emit('gameover', _rebloc.rounds);
    },_rebloc.delay);
  };

  /**
   * Called when the required button is pressed
   *
   * Begin next button acquisition or begin next round
   */
  _rebloc.onButtonPress = function() {
    // Prevent the failure timeout
    clearTimeout(_rebloc.lastTimeout);
  
    // Initiate the next acquire
    setTimeout(function() {
      if (_rebloc.nextIndex()) {
        _rebloc.acquire(_rebloc.currentIndex());
      } else {
        rebloc.emit('nextround');
      }
    }, 100);
  };

  _rebloc.onGameOver = function onGameOver(rounds) {
    var i = 0;
    _rebloc.trellis.brightness(1);
    _rebloc.trellis.blink(1);
    for (i; i < rounds && i < 15; i++) {
      _rebloc.trellis.led(Math.floor(i / 4),  i % 4).output(1);
    }

    // Setup of an event handler so that the game can be restarted by pressing any key
    _rebloc.trellis.once('keydata', rebloc.start);
  };


  rebloc.on('nextround', _rebloc.onNextRound);
  rebloc.on('gameover', _rebloc.onGameOver);

  // =========================
  // Helper/ Utility Functions
  // =========================

  /**
   * Generate a random index for the sequence
   */
  _rebloc.randomIndex = function randomIndex() {
    return {
      i : (Math.floor(_rebloc.seed * Math.random() * 4) % 4),
      j : (Math.floor(_rebloc.seed * Math.random() * 4) % 4)
    };
  };

  /**
   * Get the next index in the sequence. wraps around to first index when end is reached
   */
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

  /**
   * Retrieve the current index
   */
  _rebloc.currentIndex = function currentIndex() {
    return _rebloc.sequence[_rebloc.seqIdx];
  };


  // Return the fresh game object
  return rebloc;
};

module.exports = Rebloc; // The only export is the builder function
