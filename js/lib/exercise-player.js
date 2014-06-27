/**
 * Exercise Player
 */

var async         = require('async');
var config        = require('../config');
var utils         = require('./utils');
var guitarNoteMap = require('./guitar-note-map');
var state         = require('../app-state');
var metronome     = require('./metronome');

var proto = {
  _stop: false

, stop: function(){
    this._stop = true;
    return this;
  }

, play: function( exercise, options, callback ){
    if ( typeof options === 'function' ){
      callback = options;
      options = null;
    }

    callback = callback || function(){};

    options = utils.defaults( options || {}, {
      fourClicks: true
    });

    if ( exercise.definition.length === 0 ) return callback();

    var this_ = this;
    var rootString = config.guitarStrings[ exercise.definition[0].string ].id;
    var rootFret = utils.stepsFrom( rootString, state.key );

    var durationSec = 1 / (state.tempo / 60);
    var durationMicro = durationSec * 1000;
    var keyStart = config.keys.findIndex( function( k ){
      return k.id === state.key;
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

        this_.emit( 'notes', notes, notesFrets );

        setTimeout( next, durationMicro );
      };
    });

    if ( state.reverse ){
      fns = fns.concat( fns.slice( 0, fns.length - 1 ).reverse() );
    }

    if ( options.fourClicks ){
      fns = [ metronome.playFourClicks.bind( metronome ) ].concat( fns );
    }

    async.series( fns, function(){
      if ( state.repeat && this_._stop !== true ){
        return this_.play(
          exercise
        , utils.extend( {}, options, { fourClicks: false } )
        , callback
        );
      }

      this_._stop = false;
      this_.emit('stop');
      callback();
    });

    return this;
  }
};

module.exports = {
  create: function(){
    return Object.create(
      utils.extend( {}, proto, utils.EventEmitter.prototype )
    );
  }
};