require('sugar');

var $         = require('jquery');
var syn       = require('./lib/syn');
var ePlayer   = require('./lib/exercise-player').create();
var exercises = require('./exercises');
var config    = require('./config');
var state     = require('./app-state');

// Load jQuery plugin views
var Views = {
  appSettings:  require('./views/settings')
, instrument:   require('./views/instrument')
};

var exports = window.app = module.exports;
var views = module.exports.views = {};

var synth = exports.synth = syn.createSynthesizer();

exports.state = state;

$(function(){
  views.appSettings = Views.appSettings( '.app-settings', {
    onPlay: function( e ){
      ePlayer.play(
        exercises.find( function( ex ){
          return ex.id === state.exercise;
        })
      , function(){
          e.target.innerHTML = 'Play';
          views.instrument.clearHighlight();
        }
      );
    }

  , onStop: function(){
      ePlayer.stop();
    }
  });

  views.instrument = Views.instrument( '.instrument', {
    onNotePress: function( note, e ){
      synth.play({
        id:       note.id
      , octave:   note.octave
      , duration: config.noteDuration
      });
    }
  });

  ePlayer.on( 'notes', function( notes, notesFrets ){
    synth.play( notes );

    RequestAnimationFrame(
      views.instrument.highlightNotes.bind(
        views.instrument.highlightNotes
      , notesFrets
      )
    );
  });
});