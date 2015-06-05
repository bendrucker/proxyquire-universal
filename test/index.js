'use strict'

var test = require('tape')
var includes = require('array-includes')
var browserify = require('browserify')
var printf = require('pff')
var escapeStringRegexp = require('escape-string-regexp')
var detective = require('detective')
var proxyquireUniversal = require('../')

test(function (t) {
  var pqify = 'require(\'proxyquireify\')(require)'
  var pqifyRegexp = escape(pqify)

  bundle('default', function (t, requires, code) {
    console.log(requires)
    t.ok(includes(requires, 'proxyquireify'))
    t.notOk(includes(requires, 'proxyquire'))
    t.ok(pqifyRegexp.test(code))
  })

  bundle('double-quotes', function (t, requires, code) {
    t.ok(includes(requires, 'proxyquireify'))
    t.notOk(includes(requires, 'proxyquire'))
    t.ok(pqifyRegexp.test(code))
  })

  bundle('comment', function (t, requires) {
    t.notOk(requires.length)
  })

  bundle('string', function (t, requires) {
    t.notOk(requires.length)
  })

  bundle('multiple', function (t, requires, code) {
    t.equal(requires.length, 2)
    t.deepEqual(requires, ['proxyquireify', 'proxyquireify'])
    t.equal(code.match(escape(pqify, 'g')).length, 2)
  })

  bundle('other', function (t, requires, code) {
    t.deepEqual(requires, ['proxyquireify', 'xtend'])
  })

  function escape (string, flags) {
    return new RegExp(escapeStringRegexp(string), flags)
  }

  function bundle (scenario, callback) {
    t.test(scenario, function (t) {
      browserify()
        .plugin(proxyquireUniversal)
        .add(printf('%s/fixtures/%s.js', __dirname, scenario))
        .bundle(function (err, bundle) {
          if (err) return t.end(err)
          callback(t, detective.find(bundle).strings, bundle.toString())
          t.end()
        })
    })
  }
})
