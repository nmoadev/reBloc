var tessel = require('tessel'),
    Trellis = require('trellis-tessel'),
    Rebloc = require('./rebloc'),
    trellis;

trellis = Trellis(tessel.port['B'], true);
trellis.ready(function() {
  var rebloc = Rebloc(trellis);
  rebloc.start();
  rebloc.on('gameover', function() {
    console.log('gameover');
  });
});
