'use strict';

var through     = require('through2');
var jstransform = require('jstransform');
var visitor     = require('./visitor');

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through();

  var code = '';
  function read (chunk, enc, next) {
    code += chunk;
    next();
  }
  function flush (next) {
    this.push(jstransform.transform([visitor], code).code);
    next();
  }
  return through(read, flush);
}
