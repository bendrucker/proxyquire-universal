'use strict'

const { PassThrough } = require('stream')
const transformify = require('transformify')
const replaceRequires = require('replace-requires')

module.exports = function (file, options) {
  if (/\.json$/.test(file)) return new PassThrough()
  return transformify(replaceProxyquire)()
}

const replacement = 'require(\'proxyquireify\')(require)'
function replaceProxyquire (code) {
  return replaceRequires(code, { proxyquire: replacement })
}
