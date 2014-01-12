$.fn.appSettings = function( options ){
  var $this = this;

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
      { name: 'instrument', settings_key: 'instruments' }
    , { name: 'key',        settings_key: 'keys' }
    , { name: 'exercise',   settings_key: 'exercises' }
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
          config.settings[ setting.settings_key ].map( function( i ){
            if ( i.id === app_state[ setting.name ] ) i.selected = true;
            return i;
          }).map( options.optionTmpl )
        ).on( 'change', function( e ){
          options[
            [
              'on'
            , setting.name[0].toUpperCase() + setting.name.slice(1)
            , 'Change'
            ].join('')
          ]( e.target.value, e );
        });
      });

      $this.find('[name="tempo"]').val(
        app_state.tempo
      ).blur( function( e ){
        options.onTempoChange( +e.target.value, e );
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
          'checked', app_state.repeat
        ).on( 'change', function( e ){
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