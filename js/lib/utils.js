var _ = require('lodash');

var utils = module.exports = {};

_.extend( utils, _ );

utils.async         = require('async');
utils.EventEmitter  = require('events').EventEmitter;