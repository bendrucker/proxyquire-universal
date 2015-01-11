'use strict';

var through      = require('through2');
var transformify = require('transformify');
var jstransform  = require('jstransform');
var visitor      = require('./visitor');

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through();
  return transformify(replaceProxyquire)();
}

function replaceProxyquire (code) {
  if (/require\(\s*[\'"]proxyquire[\'"]\s*\)/.test(code)) {
    return jstransform.transform([visitor], code).code
  }
  return code;
} 
