/**
 * Exercises
 */

define(function(require){
  var exercises = [
    require('./major-scale-single-octave')
  , require('./major-scale-double-octave')
  , require('./minor-scale-single-octave')
  , require('./minor-scale-double-octave')
  , require('./alternate-minor')
  ];

  return exercises.sort( function( a, b ){
    return a.name > b.name;
  });
});