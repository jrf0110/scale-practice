var EventEmitter = require('events')
var utils = require('./utils');
var syn = require('./syn');

var guitarNoteMap = [], frets = 24;
config.guitarStrings.forEach( function( base ){
  var str = [], keys = config.settings.keys;
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

var proto = {
  _stop: false

, setSynth: function( synth ){
    this.synth = synth;
    return this;
  }

, setView: function( view ){
    this.view = view;
    return this;
  }

, stop: function(){
    this.stop = true;
    return this;
  }

, play: function( exercise, key, tempo, callback ){
    callback = callback || function(){};

    if ( exercise.definition.length === 0 ) return callback();

    var this_ = this;
    var rootString = config.guitarStrings[ exercise.definition[0].string ].id;
    var rootFret = utils.stepsFrom( rootString, key );

    var durationSec = 1 / (tempo / 60);
    var durationMicro = durationSec * 1000;
    var keyStart = config.settings.keys.findIndex( function( k ){
      return k.id === key;
    });

    fns = exercise.definition.map( function( step ){
      return function( next ){
        if ( this_._stop ) return next(true);

        var notesFrets = [{
          fret: rootFret + step.pos
        , string: step.string
        }];

        var notes = notesFrets.map( function( f ){
          return Object.merge( guitarNoteMap[ f.string ][ f.fret ], {
            duration: durationSec
          });
        });

        this_.synth.play( notes );
        this_.trigger('')
        RequestAnimationFrame( this_.onExc)
        RequestAnimationFrame( this_.view.highlightNotes.fill( notesFrets ) );

        setTimeout( next, durationMicro );
      };
    });

    if ( app_state.reverse ){
      fns = fns.concat( fns.slice( 0, fns.length - 1 ).reverse() );
    }

    fns = [ metronome.playFourClicks.bind( metronome ) ].concat( fns );

    async.series( fns, function(){
      if ( app_state.repeat && this_._stop !== true ){
        return this_.play( key, exercise, callback );
      }

      this_._stop = false;
      this_.view.clearHighlight();
      callback();
    });

    return this;
  }
}

module.exports = {
  create: function(){
    return Object.create(
      Object
      Object.merge( {}, proto, EventEmitter.prototype )
    ).setSynth( syn.createSynth() );
  }
};