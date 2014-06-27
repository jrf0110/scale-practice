/**
 * Exercises
 */

module.exports = [
  require('./major-scale-single-octave')
, require('./major-scale-double-octave')
, require('./minor-scale-single-octave')
, require('./minor-scale-double-octave')
, require('./alternate-minor')
].sort( function( a, b ){
  return a.name > b.name;
});