'use strict'

const proxyquire = require('proxyquireify')

module.exports = function (b, options) {
  b.transform(require('./transform')).plugin(proxyquire.plugin)
}
