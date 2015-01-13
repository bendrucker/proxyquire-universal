'use strict';

var through      = require('through2');
var transformify = require('transformify');
var jstransform  = require('jstransform');
var hasRequire   = require('has-require');
var visitor      = require('./visitor');

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through();
  return transformify(replaceProxyquire)();
}

function replaceProxyquire (code) {
  if (hasRequire(code, 'proxyquire')) {
    return jstransform.transform([visitor], code).code
  }
  return code;
} 
