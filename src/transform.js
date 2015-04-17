'use strict'

var through = require('through2')
var transformify = require('transformify')
var detective = require('detective')
var hasRequire = require('has-require')

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through()
  return transformify(replaceProxyquire)()
}

var replacement = 'require(\'proxyquireify\')(require)'
function replaceProxyquire (code) {
  if (!hasRequire(code, 'proxyquire')) {
    return code
  }
  var requires = detective.find(code, {
    nodes: true,
    parse: {
      range: true
    }
  })
  if (!~requires.strings.indexOf('proxyquire')) {
    return code
  }
  var offset = 0
  return requires.nodes
    .map(function (node) {
      return {
        from: node.range[0],
        to: node.range[1]
      }
    })
    .reduce(function (code, require) {
      var from = require.from + offset
      var to = require.to + offset
      offset += (replacement.length - (to - from))
      return code.slice(0, from) + replacement + code.slice(to)
    }, code)
}
