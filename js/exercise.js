var exercise = (function(){
  return Object.create({
    _stop: false

  , synth: syn.createSynthesizer()

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
            return guitarNoteMap[ f.string ][ f.fret ];
          });

          this_.synth.play( notes ).stop( durationSec );
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
  });
})();