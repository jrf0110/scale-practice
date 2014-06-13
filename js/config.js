var config = (function(){
  var config =  {
    settings: {
      instruments: [
        { name: 'Guitar', id: 'acoustic' }
      // , { name: 'Piano', id: 'piano' }
      ]

    , keys: [
        { name: 'C', id: 'C' }
      , { name: 'C#', id: 'C#' }
      , { name: 'D', id: 'D' }
      , { name: 'E&#x266d;', id: 'D#' }
      , { name: 'E', id: 'E' }
      , { name: 'F', id: 'F' }
      , { name: 'F#', id: 'F#' }
      , { name: 'G', id: 'G' }
      , { name: 'G#', id: 'G#' }
      , { name: 'A', id: 'A' }
      , { name: 'B&#x266d;', id: 'A#' }
      , { name: 'B', id: 'B' }
      ]

    , tempo: 200
    , octave: 3
    }

  , sampleRate: 20000
  , volume: 0.6
  , noteDuration: 2
  , noteMin: 1

  , guitarStrings: [
      { id: 'E', octave: 1 }
    , { id: 'A', octave: 1 }
    , { id: 'D', octave: 2 }
    , { id: 'G', octave: 2 }
    , { id: 'B', octave: 2 }
    , { id: 'E', octave: 3 }
    ]

  , guitarNumFrets: 16
  };

  return config;
})();