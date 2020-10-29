'use strict'

const through = require('through2')
const transformify = require('transformify')
const replaceRequires = require('replace-requires')

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return through()
  return transformify(replaceProxyquire)()
}

const replacement = 'require(\'proxyquireify\')(require)'
function replaceProxyquire (code) {
  return replaceRequires(code, { proxyquire: replacement })
}
