/**
 * For each string, for each fret, index the note
 *
 * guitarNoteMap[0][5] // => {id: "A", octave: 1}
 */

var config = require('../config');

var guitarNoteMap = module.exports = [], frets = 24;
config.guitarStrings.forEach( function( base ){
  var str = [], keys = config.keys;
  var baseIdx = keys.findIndex( function( k ){
    return k.id === base.id;
  });

  for ( var i = 0, l = keys.length; i < frets; i++ ){
    str.push({
      id:     keys[ ( baseIdx + i ) % l ].id
    , octave: base.octave + Math.floor( ( baseIdx + i ) / l )
    });
  }

  guitarNoteMap.push( str );
});