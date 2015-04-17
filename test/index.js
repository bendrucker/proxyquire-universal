'use strict';

var browserify      = require('browserify');
var streamToPromise = require('stream-to-promise');
var expect          = require('chai').use(require('sinon-chai')).expect;
var sinon           = require('sinon');
var detective       = require('detective');

describe('proxyquire-universal', function () {

  function bundle (scenario) {
    return streamToPromise(browserify()
      .plugin(require('../'))
      .add(__dirname + '/fixtures/' + scenario + '.js')
      .bundle())
      .call('toString');
  };

  it('rewrites proxyquire calls', function () {
    return bundle('default').then(function (bundle) {
      expect(bundle)
        .to.contain('require(\'proxyquireify\')(require)')
        .and.to.not.contain('require(\'proxyquire\')');
    });
  });

  it('rewrites proxyquire calls with double quotes', function () {
    return bundle('double-quotes').then(function (bundle) {
      expect(bundle)
        .to.contain('require(\'proxyquireify\')(require)')
        .and.to.not.contain('require("proxyquire")');
    });
  });

  it('ignores comments', function () {
    return bundle('comment').then(function (bundle) {
      expect(bundle)
        .to.contain('require(\'proxyquire\')');
    });
  });

  it('ignores strings', function () {
    return bundle('string').then(function (bundle) {
      expect(bundle)
        .to.contain('var foo = "require(\'proxyquire\')"');
    });
  });

  it('can handle multiple proxyquires', function () {
    return bundle('multiple').then(function (bundle) {
      expect(bundle)
        .to.contain(
          'var p1 = require(\'proxyquireify\')(require)\n' +
          'var p2 = require(\'proxyquireify\')(require)'
        )
    });
  });

});
