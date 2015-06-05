'use strict'

var through = require('through2')
var transformify = require('transformify')
var detective = require('detective')
var hasRequire = require('has-require')
var patch = require('patch-text')
var extend = require('xtend')

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through()
  return transformify(replaceProxyquire)()
}

var replacement = 'require(\'proxyquireify\')(require)'
function replaceProxyquire (code) {
  if (!hasRequire(code, 'proxyquire')) return code
  var requires = detective.find(code, {
    nodes: true
  })
  if (!~requires.strings.indexOf('proxyquire')) {
    return code
  }
  return patch(code, requires.nodes.map(function (node) {
    return extend(node, {replacement: replacement})
  }))
}
