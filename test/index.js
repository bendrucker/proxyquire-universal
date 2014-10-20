'use strict';

var browserify = require('browserify');
var expect     = require('chai').expect;

describe('proxyquire-universal', function () {

  var bundle;
  beforeEach(function (done) {
    browserify()
      .plugin(require('../'))
      .add(__dirname + '/fixtures/test.js')
      .bundle(function (err, _bundle_) {
        if (err) return done(err);
        bundle = _bundle_.toString();
        done();
      });
  });

  it('rewrites proxyquire calls', function () {
    expect(bundle)
      .to.contain('require(\'proxyquireify\')(require)')
      .and.to.not.contain('require(\'proxyquire\')');
  });

});
