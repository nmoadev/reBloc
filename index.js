var tessel = require('tessel'),
    Trellis = require('trellis'),
    reBloc = require('./rebloc'),
    trellis;

trellis = Trellis(tessel.port['B'], true);
trellis.ready(function(trellis) {
  reBloc.start(trellis);
});
