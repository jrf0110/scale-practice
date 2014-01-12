var Guitar = function( options ){
  var defaults = {
    frets: 16
  , strings: config.guitarStrings.slice(0)
  , synthName: 'acoustic'
  , defaultDuration: 3
  };

  this.options = $.extend( {}, defaults, options );
  
  this.synth = Synth.createInstrument( this.options.synthName );
  this.initNotes();

  return this;
};

Guitar.prototype.initNotes = function(){
  var this_ = this;

  this.notes = {};

  this.options.strings.forEach( function( str, n ){
    var keys  = config.settings.keys;
    var notes = this_.notes[ str.id ] = this_.notes[ n ] = [];
    var start = keys.findIndex( function( k ){
      return k.id === str.id;
    });

    for ( var i = 0, l = keys.length; i < this_.options.frets; i++ ){
      notes.push({
        id:       keys[ ( start + i ) % l ].id
      , octave:   str.octave + Math.floor( ( start + i ) / l )
      });
    }
  });
};

Guitar.prototype.play = function( notes ){
  for ( var i = 0, l = notes.length, note; i < l; ++i ){
    if ( 'string' in notes[ i ] ){
      note = this.notes[ notes[ i ].string ][ notes[ i ].fret ];
    }

    this.synth.play(
      notes[ i ].id       || note.id
    , notes[ i ].octave   || note.octave
    , notes[ i ].duration || this.options.duration
    );
  }

  return this;
};