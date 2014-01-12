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

    , exercises: [
        {
          name: 'The Major Scale (Single Octave)'
        , id: 'major-one-octave'
        , definition: [
            { string: 0, pos: 0  }, { string: 0, pos: 2 }
          , { string: 1, pos: -1 }, { string: 1, pos: 0 }, { string: 1, pos: 2 }
          , { string: 2, pos: -1 }, { string: 2, pos: 1 }, { string: 2, pos: 2 }
          ]
        }
      , {
          name: 'The Major Scale (Double Octave)'
        , id: 'major-two-octave'
        , definition: [
            { string: 0, pos: 0  }, { string: 0, pos: 2 }
          , { string: 1, pos: -1 }, { string: 1, pos: 0 }, { string: 1, pos: 2 }
          , { string: 2, pos: -1 }, { string: 2, pos: 1 }, { string: 2, pos: 2 }
          , { string: 3, pos: -1 }, { string: 3, pos: 1 }, { string: 3, pos: 2 }
          , { string: 4, pos: 0  }, { string: 4, pos: 2 }
          , { string: 5, pos: -1 }, { string: 5, pos: 0 }
          ]
        }
      , {
          name: 'The Minor Scale (Single Octave)'
        , id: 'minor-one-octave'
        , definition: [
            { string: 0, pos: 0  }, { string: 0, pos: 2 }, { string: 0, pos: 3 }
          , { string: 1, pos: 0  }, { string: 1, pos: 2 }, { string: 1, pos: 3 }
          , { string: 2, pos: 0  }, { string: 2, pos: 2 }
          ]
        }
      , {
          name: 'The Minor Scale (Double Octave)'
        , id: 'minor-two-octave'
        , definition: [
            { string: 0, pos: 0  }, { string: 0, pos: 2 }, { string: 0, pos: 3 }
          , { string: 1, pos: 0  }, { string: 1, pos: 2 }, { string: 1, pos: 3 }
          , { string: 2, pos: 0  }, { string: 2, pos: 2 }
          , { string: 3, pos: -1 }, { string: 3, pos: 0 }, { string: 3, pos: 2 }
          , { string: 4, pos: 0  }, { string: 4, pos: 1 }, { string: 4, pos: 3 }
          , { string: 5, pos: 0  }
          ]
        }
      , {
          name: 'Alternate 1 Minor'
        , id: 'alternate-1-minor'
        , definition: [
            { string: 0, pos: 0  }, { string: 0, pos: 2 }, { string: 0, pos: 3 }
          , { string: 2, pos: 0  }, { string: 2, pos: 2 }
          , { string: 1, pos: 0  }, { string: 1, pos: 2 }, { string: 1, pos: 3 }
          , { string: 3, pos: -1 }, { string: 3, pos: 0 }, { string: 3, pos: 2 }
          , { string: 2, pos: 0  }, { string: 2, pos: 2 }
          , { string: 4, pos: 0  }, { string: 4, pos: 1 }, { string: 4, pos: 3 }
          , { string: 3, pos: -1 }, { string: 3, pos: 0 }, { string: 3, pos: 2 }
          , { string: 5, pos: 0  }, { string: 5, pos: 2 }, { string: 5, pos: 3 }
          ]
        }
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

  // var ex = config.settings.exercises.find( function( ex ){
  //   return ex.id === 'alternate-1-minor';
  // });

  // config.settings.exercises.push({
  //   "name": "Minor Postion Thing 1"
  // , "id": "minor-position-thing-1"
  // , "definition": [5,26,17,2,8,10,12,22,14,17,12,14,15,19,10,24,3,0,20,15,7,27]
  // , "guitarIntervalStringMap": ex.guitarIntervalStringMap
  // });

  // var majorTwo = config.settings.exercises.push({
  //   name: 'The Major Scale (Two Octaves)'
  // , id: 'major-two-octave'
  // , definition: config.settings.exercises[0].definition
  // , guitarIntervalStringMap: config.settings.exercises[0].guitarIntervalStringMap
  // });

  // majorTwo = config.settings.exercises[ majorTwo - 1 ];

  // majorTwo.definition = majorTwo.definition.slice( 0, Math.floor(majorTwo.definition.length / 2) + 1 );

  // majorTwo.definition = majorTwo.definition.concat(
  //   majorTwo.definition.slice(1).map( function( n, i, a ){
  //     return a[ a.length - 1 ] + n;
  //   })
  // );

  // majorTwo.definition = majorTwo.definition.concat(
  //   majorTwo.definition.slice(0, majorTwo.definition.length - 1 ).reverse()
  // );

  // config.settings.exercises.push({
  //   name: 'Random Minor 1'
  // , id: 'random-minor-1'
  // , definition: ex.definition.slice(0).randomize()
  // , guitarIntervalStringMap: ex.guitarIntervalStringMap
  // });

  // // Reversable exercises
  // [
  //   'alternate-1-minor'
  // ].forEach( function( reversable ){
  //   var exercise = config.settings.exercises.find( function( ex ){
  //     return ex.id === reversable;
  //   });

  //   config.settings.exercises.push({
  //     name:                     exercise.name + ' Reversed'
  //   , id:                       exercise.id + '-reversed'
  //   , definition:               exercise.definition.slice(0).reverse()
  //   , guitarIntervalStringMap:  exercise.guitarIntervalStringMap
  //   });
  // });

  // Mirrorable exercises
  [
    // 'major-one-octave'
  ].forEach( function( mirrorable ){
    var exercise = config.settings.exercises.find( function( ex ){
      return ex.id === mirrorable;
    });

    exercise.definition = exercise.definition.concat( exercise.definition.slice(
      0, exercise.definition.length - 1
    ).reverse() );
  });

  config.settings.exercises = config.settings.exercises.sort( function( a, b ){
    return a.name > b.name;
  });

  return config;
})();