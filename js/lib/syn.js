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

  var createDistortionWaveShaper = function( context, dist, n_samples ){
    dist = dist || 0.8;
    n_samples = n_samples || 1000;

    var shaper = context.createWaveShaper();
    var k = 2 * dist / (1 - dist);

    var curve = new Float32Array( n_samples );

    for (var i = 0; i < n_samples; i+=1) {
        // LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
        // a = 0, b = 2048, z = 1, y = -1, c = i
        var x = (i - 0) * (1 - (-1)) / (n_samples - 0) + (-1);
        curve[i] = (1 + k) * x / (1+ k * Math.abs(x));
    }
    
    shaper.curve = curve;

    return shaper;
  };

  var createGuitarWaveShaper = function( context, frequency ){
    return createDistortionWaveShaper( context, 0.5, 1000 );

    // var nodes = [];

    // nodes.push( createDistortionWaveShaper( context, 5, 1000 ) );

    // for ( var i = 0, l = 6; i < l; i++ ){
    //   nodes[ i - 1 ].connect( nodes[ i ] );
    // }

    // return nodes[ nodes.length - 1 ];
  };

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
        var shaper = createGuitarWaveShaper( context, f );
        var delay = options.context.createDelayNode();

        delay.delayTime.value = 0.03;

        osc.type.value = 0;
        osc.frequency.value = f;

        // Unify the competing browser interfaces
        osc.start = ( osc.noteOn || osc.start ).defaults(0).bind( osc );
        osc.stop = ( osc.noteOff || osc.stop ).defaults(0).bind( osc );


        shaper.connect( options.destination );
        shaper.connect( delay );
        osc.connect( shaper );
        options.destination.connect( delay );

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
      options = options || {};

      this.context = context;
      this.gainNode = context.createGainNode();
      this.gainNode.connect( context.destination );

      this.adsr = Object.merge({
        attack: 0.002
      , 
      }, options.adsr || {} );

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
      var now = this.context.currentTime;

      if ( !Array.isArray( notes ) ){
        notes = [ notes ];
      }

      var duration;
      var frequencies = notes.map( function( note ){
        // Pretty shady, but pick one duration
        duration = note.duration;

        return Object.merge( this_.noteFrequencyTable[ note.id + note.octave ], {
          duration: note.duration
        });
      });

      this.gainNode.gain.cancelScheduledValues( now );
      this.gainNode.gain.setValueAtTime( this.gainNode.gain.value, now );

      this.gainNode.gain.linearRampToValueAtTime( 1.0, now + this.adsr.attack );
      this.gainNode.gain.exponentialRampToValueAtTime( 0.01, now + duration );

      var p = Object.create( player ).init({
        frequencies:  frequencies
      , context:      this.context
      , destination:  this.gainNode
      }).play( delay );

      if ( duration ){
        p.stop( duration + ( delay || 0 ) );
      }

      return p;
    }
  };

  return {
    createSynthesizer: function( options ){
      return Object.create( synthesizer ).init( options );
    }
  };
})();