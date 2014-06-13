window.AudioContext = [
  'webkit'
, 'moz'
, ''
].firstMap( function( prefix ){
  return window[ prefix + 'AudioContext' ];
});

window.RequestAnimationFrame = [
  'webkit'
, 'moz'
, ''
].firstMap( function( prefix ){
  return window[ prefix + 'RequestAnimationFrame' ];
}) || setTimeout.defaults( null, 1 );

Object.extend = function( a ){
  var b, rest = Array.prototype.slice.call( arguments, 1 );

  for ( var i = 0, l = rest.length; i < l; ++i ){
    b = rest[ i ];
    for ( var key in b ){
      a[ key ] = b[ key ];
    }
  }

  return a;
};