'use strict';

var browserify      = require('browserify');
var streamToPromise = require('stream-to-promise');
var expect          = require('chai').expect;

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

});
