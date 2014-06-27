var _ = require('lodash');
var config = require('../config');

var utils = window.utils = module.exports = {};

_.extend( utils, _ );

require('sugar');

utils.async         = require('async');
utils.EventEmitter  = require('events').EventEmitter;

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
  var steps = 0, keys = config.keys, l = keys.length;
  var start = keys.findIndex( function( k ){
    return k.id === n1;
  });

  while ( keys[ start++ % l ].id !== n2 ) steps++;

  return steps;
};

utils.noteAt = function( n1, steps ){
  if ( steps === 0 ) return n1;

  var keys = config.keys;
  var start = keys.findIndex( function( k ){
    return k.id === n1;
  });

  return keys[ (start + steps) % keys.length ].id;
};

utils.createEventEmitter = function( obj ){
  var emittable = {};

  for ( var key in utils.EventEmitter.prototype ){
    Object.defineProperty( emittable, key, {
      enumerable: false
    , configurable: true
    , value:      utils.EventEmitter.prototype[ key ]
    });
  }

  // In Node, _events does not get defined right away
  // But in browserify, it does
  if ( !Object.hasOwnProperty('_events') ){
    Object.defineProperty( emittable, '_events', {
      enumerable:   false
    , writable:     true
    , value:        {}
    });
  }

  Object.keys( obj ).forEach( function( key ){
    Object.defineProperty( emittable, key, {
      enumerable: true
    , get: function(){ return obj[ key ]; }
    , set: function( v ){
        var old = obj[ key ];
        if ( old === v ) return;
        obj[ key ] = v;
        this.emit( 'change', this, v, old );
        this.emit( 'change:' + key, this, v, old );
      }
    });
  });

  return emittable;
};

require('./normalize-apis');
