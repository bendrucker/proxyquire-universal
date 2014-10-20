'use strict';

var through2 = require('through2');
module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through();
  var data = '';
  function read (chunk, enc, next) {
    data += chunk;
    next();
  }
  function flush (next) {
    this.push(data.replace('require(\'proxyquire\')', 'require(\'proxyquireify\')(require)'));
    next();
  }
  return through2(read, flush);
}
