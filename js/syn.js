/**
 * Synthesizer module
 *
 * Usage:
 *
 *  var mySynth = syn.createSynthesizer();
 *
 *  // Play a 1,5 chord for 1 second
 *  mySynth.play([
 *    { id: 'C', octave: 1 }
 *  , { id: 'A', octave: 1 }
 *  ]).stop(1);
 */

var syn = (function(){
  // C3 technically, but I'll call it C0
  var baseFrequency = 130.81; 
  var twelthRootOfTwo = Math.pow( 2, 1 / 12 );
  var numOctaves = 8;
  var notes = [];
  var noteFrequencyTable = {};

  var noSharps = [ 'B', 'E' ];
  for ( var i = 'A'; i <= 'G'; i = String.fromCharCode( i.charCodeAt() + 1 )){
    notes.push( i );

    if ( noSharps.indexOf( i ) === -1 ){
      notes.push( i + '#' );
    }
  }

  // Shift `C` to the beginning
  while ( notes[ 0 ] !== 'C' ) notes.transpose();

  for ( var o = 0, n, steps, l = notes.length; o < numOctaves; ++o ){
    steps = l * o;
    for ( n = 0; n < l; ++n ){
      noteFrequencyTable[ notes[ n ] + o ] = ( baseFrequency * (
        Math.pow( twelthRootOfTwo, steps + n )
      )).round(2);
    }
  }

  var player = {
    // init: function( frequencies, context, destination ){
    init: function( options ){
      if ( typeof options !== 'object' ){
        throw new Error('syn.player.init - Invalid first argument. Must be object');
      }

      [ // Required fields
        'frequencies', 'context', 'destination'
      ].forEach( function( key ){
        if ( !( key in options ) ){
          throw new Error('syn.player.init - First argument property `' + key + '` is required');
        }
      });

      var this_ = this;

      this.frequencies  = options.frequencies;
      this.destination  = options.destination;
      this.context      = options.context;

      this.oscillators = this.frequencies.map( function( f ){
        var osc = options.context.createOscillator();
        osc.type.value = 0;
        osc.frequency.value = f;

        // Unify the competing browser interfaces
        osc.start = ( osc.noteOn || osc.start ).defaults(0).bind( osc );
        osc.stop = ( osc.noteOff || osc.stop ).defaults(0).bind( osc );

        osc.connect( options.destination );

        return osc;
      });

      return this;
    }

  , play: function( delay ){
      this.oscillators.forEach( function( osc ){
        osc.start();
      });

      return this;
    }

  , stop: function( delay ){
      var this_ = this;

      setTimeout( function(){
        this_.oscillators.forEach( function( osc ){
          osc.stop();
          osc.disconnect();
        });
      }, delay * 1000 );

      return this;
    }
  };

  var context = new AudioContext();

  var synthesizer = {
    noteFrequencyTable: noteFrequencyTable

  , init: function( options ){
      this.context = context;
      this.gainNode = context.createGainNode();
      this.gainNode.connect( context.destination );

      return this;
    }

  , playFrequencies: function( frequencies, delay ){
      if ( typeof frequencies === 'number' ){
        frequencies = [ frequencies ];
      }

      return Object.create( player ).init({
        frequencies:  frequencies
      , context:      this.context
      , destination:  this.gainNode
      }).play( delay );
    }

  , play: function( notes, delay ){
      var this_ = this;

      if ( !Array.isArray( notes ) ){
        notes = [ notes ];
      }

      var frequencies = notes.map( function( note ){
        return this_.noteFrequencyTable[ note.id + note.octave ];
      });

      return Object.create( player ).init({
        frequencies:  frequencies
      , context:      this.context
      , destination:  this.gainNode
      }).play( delay );
    }
  };

  return {
    createSynthesizer: function( options ){
      return Object.create( synthesizer ).init( options );
    }
  };
})();