/**
 * Global app state
 */

var config  = require('./config');
var utils   = require('./lib/utils');

module.exports = utils.createEventEmitter({
  instrument:   'guitar'
, key:          'C'
, exercise:     'major-one-octave'
, defaultTempo: 120
, tempo:        config.tempo
, octave:       config.octave
, repeat:       false
, reverse:      false
});

console.log('instrument:', module.exports.instrument);