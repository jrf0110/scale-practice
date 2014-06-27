var $         = require('jquery');
var appState  = require('../app-state');
var config    = require('../config');

module.exports = function( $this, options ){
  if ( !($this instanceof $) ){
    $this = $( $this );
  }

  var defaults = {
    keyboardNumOctaves: 3
  , guitarNumFrets: 16
  , guitarNumStrings: 6
  , onNoteClick: function( note, e ){}
  , keyboardTemplate: function( keys ){
      return [
        '<div class="keyboard">'
      , '  <div class="black-keys">'
      ,    keys.black
      , '  </div>'
      , '  <div class="white-keys">'
      ,    keys.white
      , '  </div>'
      , '</div>'
      ].join('');
    }
  , keyboardKeyTemplate: function( key ){
      return [
        '<div class="note keyboard-key'
      , ( key.note.length > 1 ? ' keyboard-key-black' : '' )
      , ( key.note.active ? ' active' : '' )
      , '"'
      , ' data-note="', key.note, '"'
      , ' data-octave="', key.octave, '"'
      , '></div>'
      ].join('');
    }

  , guitarTemplate: function( options ){
      return [
        '<div class="guitar">'
      , '  <div class="notes">'
      ,    options.notes
      , '  </div>'
      , '  <div class="strings">'
      ,    options.strings
      , '  </div>'
      , '  <div class="fretboard">'
      ,    options.frets
      , '  </div>'
      , '</div>'
      ].join('');
    }

  , guitarStringTemplate: function(){
      return [
        '<div class="string"></div>'
      ].join('');
    }

  , guitarFretTemplate: function(){
      return [
        '<div class="fret"></div>'
      ].join('');
    }

  , guitarNoteStringTemplate: function( frets ){
      return [
        '<div class="string">'
      , frets
      , '</div>'
      ].join('');
    }

  , guitarNoteFretTemplate: function( key ){
      return [
        '<div class="note fret"'
      , ' data-note="', key.note, '"'
      , ' data-octave="', key.octave, '"'
      , '></div>'
      ].join('');
    }
  };

  options = $.extend( {}, defaults, options );

  var plugin = {
    render: function(){
      if ( appState.instrument === 'piano' ){
        plugin.renderPiano();
      } else if ( appState.instrument === 'guitar' ){
        plugin.renderGuitar();
      }

      $this.find('.note').on( 'mousedown', function( e ){
        var $el = $( e.target );
        options.onNotePress(
          {
            id: $el.data('note')
          , octave: $el.data('octave') + (
                      appState.instrument === 'piano' ?
                        appState.octave : 0
                    )
          }
        , e
        );
      });
    }

  , renderPiano: function(){
      var keyGtOne = function( key ){
        return key.id.length > 1;
      };

      var keyEqOne = function( key ){
        return key.id.length === 1;
      };

      var getKeyHtml = function( key ){
        return options.keyboardKeyTemplate({ note: key.id, octave: i });
      };

      var keys = { white: '', black: '' };
      for ( var i = 0; i < options.keyboardNumOctaves; i++ ){
        keys.black += config.keys.filter(
          keyGtOne
        ).map( getKeyHtml ).join('\n');

        keys.white += config.keys.filter(
          keyEqOne
        ).map( getKeyHtml ).join('\n');
      }

      $this.html( options.keyboardTemplate( keys ) );
    }

  , renderGuitar: function(){
      var guitar = { strings: '', frets: '', notes: '' };
      var i, ii, frets, noteIndex, string;

      var findIndex = function( string ){
        return config.keys.findIndex( function( key ){
          return key.id === string.id;
        });
      };

      for ( i = 0; i < options.guitarNumStrings; i++ ){
        frets = "";
        string = config.guitarStrings[ i ];
        noteIndex = findIndex( string );

        for ( ii = 0; ii < options.guitarNumFrets; ii++ ){
          frets += options.guitarNoteFretTemplate({
            octave: string.octave + Math.floor( ( noteIndex + 1 + ii ) / (config.keys.length ) )
          , note: config.keys[
              ( noteIndex + 1 + ii ) % config.keys.length
            ].id
          });
        }

        guitar.notes += options.guitarNoteStringTemplate( frets );
      }

      for ( i = 0; i < options.guitarNumStrings; i++ ){
        guitar.strings += options.guitarStringTemplate();
      }

      for ( i = 0; i < options.guitarNumFrets; i++ ){
        guitar.frets += options.guitarFretTemplate();
      }

      $this.html( options.guitarTemplate( guitar ) );
    }

  , highlightNotes: function( notes ){
      plugin.clearHighlight();
      $this.find(
        notes.map( function( note ){
          return [
            '.notes > .string:nth-child(' + (note.string + 1) + ') '
          , ' .note:nth-child(' + note.fret + ')'
          ].join('');
        }).join(', ')
      ).addClass('active');
    }

  , clearHighlight: function(){
      $this.find('.note.active').removeClass('active');
    }

  , play: function( notes ){
      $this.find(
        notes.map( function( note ){
          return [
            '.notes > .string:nth-child(' + (note.string + 1) + ') '
          , ' .note:nth-child(' + note.fret + ')'
          ].join('');
        }).join(', ')
      ).trigger('mousedown');
    }
  };

  plugin.render();

  return plugin;
};