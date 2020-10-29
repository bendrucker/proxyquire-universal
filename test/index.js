'use strict'

const test = require('tape')
const includes = require('array-includes')
const browserify = require('browserify')
const printf = require('pff')
const escapeStringRegexp = require('escape-string-regexp')
const detective = require('detective')
const proxyquireUniversal = require('../')

test(function (t) {
  const pqify = 'require(\'proxyquireify\')(require)'
  const pqifyRegexp = escape(pqify)

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
    const proxyquires = requires.filter(function (id) {
      return id === 'proxyquireify'
    })
    t.equal(proxyquires.length, 2)
    t.equal(code.match(escape(pqify, 'g')).length, 2)
  })

  bundle('other', function (t, requires, code) {
    t.ok(includes(requires, 'proxyquireify'))
    t.ok(includes(requires, 'xtend'))
  })

  t.end()

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
