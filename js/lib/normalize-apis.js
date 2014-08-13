window.AudioContext = [
  ''
, 'webkit'
, 'moz'
].firstMap( function( prefix ){
  return window[ prefix + 'AudioContext' ];
});

window.RequestAnimationFrame = [
  ''
, 'webkit'
, 'moz'
].firstMap( function( prefix ){
  return window[ prefix + 'RequestAnimationFrame' ];
}) || setTimeout.defaults( null, 1 );