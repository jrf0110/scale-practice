var utils = (function(){
  var utils = {};

  // Returns the first truthy value
  Array.prototype.firstMap = function( fn ){
    for ( var i = 0, l = this.length, val; i < l; ++i ){
      val = fn( this[ i ], i, this );
      if ( val ) return val;
    }
    return null;
  };

  Array.prototype.transpose = function(){
    this.unshift( this.pop() );
    return this;
  };

  Function.prototype.defaults = function(){
    var this_ = this, defaults = Array.prototype.slice.call( arguments );
    return function(){
      var args = Array.prototype.slice.call( arguments ).concat(
        defaults.slice( arguments.length )
      );
      return this_.apply( this, args );
    };
  };

  utils.stepsFrom = function( n1, n2 ){
    var steps = 0, keys = config.settings.keys, l = keys.length;
    var start = keys.findIndex( function( k ){
      return k.id === n1;
    });

    while ( keys[ start++ % l ].id !== n2 ) steps++;

    return steps;
  };

  utils.noteAt = function( n1, steps ){
    if ( steps === 0 ) return n1;

    var keys = config.settings.keys;
    var start = keys.findIndex( function( k ){
      return k.id === n1;
    });

    return keys[ (start + steps) % keys.length ].id;
  };

  return utils;
})();