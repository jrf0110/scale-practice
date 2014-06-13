require('sugar');

var $         = require('jquery');

var exerciser = require('./exercies');
var state     = require('./app-state');

// Load jQuery plugin views
require('./views/app-settings');

var exports = window.app = module.exports;

module.exports.views = {};

$(function(){
  module.exports.views.appSettings = $('.app-settings').appSettings();

  module.exports.views.instrument = $('.instrument').instrument({
    onNotePress: function( note, e ){
      mySynth.play({
        id:       note.id
      , octave:   note.octave
      , duration: config.noteDuration
      });
    }
  });

  exercise.setView( module.exports.views.instrument );
});