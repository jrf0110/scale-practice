var async = require('async');
var syn   = require('./syn');
var state = require('../app-state');

module.exports = Object.create({
  synth: syn.createSynthesizer()

, onTick: function(){
    this.synth.play({
      id: 'C'
    , octave: 4
    }).stop(0.05);
  }

, playFourClicks: function( callback ){
    callback = callback || function(){};

    var this_ = this;
    var duration = ( 1 / (state.tempo / 60) ) * 1000;

    async.series(
      Number.range( 0, 3 ).every().map( function(){
        return function( done ){
          this_.onTick();
          setTimeout( done, duration );
        };
      })
    , callback
    );
  }

, start: function(){
    var duration = ( 1 / (state.tempo / 60) ) * 1000;
    this.tickInterval = setInterval( this.onTick.bind( this ), duration );
    return this;
  }

, stop: function(){
    clearInterval( this.tickInterval );
  }
});