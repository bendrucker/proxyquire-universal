'use strict';

var browserify      = require('browserify');
var streamToPromise = require('stream-to-promise');
var expect          = require('chai').use(require('sinon-chai')).expect;
var sinon           = require('sinon');
var jstransform     = require('jstransform');

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
        .to.contain('var foo = \'require(\\\'proxyquire\\\')\'');
    });
  });

  it('skips AST walk if no require is matched', function () {
    sinon.spy(jstransform, 'transform');
    return bundle('noop').then(function () {
      expect(jstransform.transform).to.not.have.been.called;
    })
    .finally(function () {
      jstransform.transform.restore();
    });
  });

});
