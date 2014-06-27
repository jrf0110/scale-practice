// {
//   onKeyChange: function( key ){
//     if ( key === 'E' ){
//       return alert('Sorry, the key of `E` is broken right now lol');
//     }
//     appState.key = key;
//   }

// , onTempoChange: function( tempo ){
//     appState.tempo = tempo;
//     metronome.setTempo( tempo );
//   }

// , onExerciseChange: function( exercise ){
//     appState.exercise = exercise;
//   }

// , onRepeatChange: function( repeat ){
//     appState.repeat = repeat;
//   }

// , onReverseChange: function( reverse ){
//     appState.reverse = reverse;
//   }

// , onPlay: function( e ){
//     exercise.play(
//       config.settings.exercises.find( function( e ){
//         return e.id === appState.exercise;
//       })
//     , appState.key
//     , appState.tempo
//     , function(){
//         e.target.innerHTML = 'Play';
//       }
//     );
//   }

// , onStop: function(){
//     exercise.stop();
//   }
// }

var $         = require('jquery');
var appState  = require('../app-state');
var exercises = require('../exercises');
var config    = require('../config');

module.exports = function( $this, options ){
  if ( !($this instanceof $) ){
    $this = $( $this );
  }

  var defaults = {
    optionTmpl: function( option ){
      return [
        '<option value="'
      , option.id
      , '"'
      , option.selected ? ' selected="true"' : ''
      , '>'
      , option.name
      , '</option>'
      ].join('');
    }
  , selects: [
      { name: 'key',        values: config.keys }
    , { name: 'exercise',   values: exercises }
    ]
  , onInstrumentChange: function( instrument, e ){}
  , onKeyChange:        function( key, e ){}
  , onExerciseChange:   function( exercise, e ){}
  , onTempoChange:      function( tempo, e ){}
  , onRepeatChange:     function( repeat, e ){}
  , onReverseChange:    function( reverse, e ){}
  , onPlay:             function( e ){}
  , onStop:             function( e ){}
  };

  options = $.extend( {}, defaults, options );

  var plugin = {
    render: function(){
      options.selects.forEach( function( setting ){
        $this.find('[name="' + setting.name + '"]').html(
          setting.values.map( function( i ){
            if ( i.id === appState[ setting.name ] ) i.selected = true;
            return i;
          }).map( options.optionTmpl )
        ).on( 'change', function( e ){
          appState[ setting.name ] = e.target.value;

          options[
            [ 'on'
            , setting.name[0].toUpperCase() + setting.name.slice(1)
            , 'Change'
            ].join('')
          ]( e.target.value, e );
        });

        appState.on( 'change:' + setting.name, function( state, val, old ){
          $this.find('[name="' + setting.name + '"] options').attr( 'selected', null );
          $this.find('[name="' + setting.name + '"] [value="' + val + '"]').attr( 'selected', true );
        });
      });

      $this.find('[name="tempo"]').val(
        appState.tempo
      ).blur( function( e ){
        appState.tempo = +e.target.value;
        options.onTempoChange( appState.tempo, e );
      });

      $this.find('[name="play"]').click( function( e ){
        if ( e.target.innerHTML === 'Stop' ){
          e.target.innerHTML = 'Play';
          options.onStop( e );
        } else {
          e.target.innerHTML = 'Stop';
          options.onPlay( e );
        }
      });

      // Checkboxes
      [
        'reverse'
      , 'repeat'
      ].forEach( function( prop ){
        $this.find('[name="' + prop + '"]').attr(
          'checked', appState[ prop ]
        ).on( 'change', function( e ){
          appState[ prop ] = !!e.target.checked;

          options[ [
            'on'
          , prop[0].toUpperCase() + prop.slice(1)
          , 'Change'
          ].join('') ]( !!e.target.checked, e );
        });
      });
    }
  };

  plugin.render();

  return plugin;
};