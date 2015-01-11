proxyquire-universal [![Build Status](https://travis-ci.org/bendrucker/proxyquire-universal.svg?branch=master)](https://travis-ci.org/bendrucker/proxyquire-universal)
====================

Use [proxyquire](https://github.com/thlorenz/proxyquire) in Node and [proxyquireify](https://github.com/thlorenz/proxyquireify) in the browser with no code changes. 

## Usage

Write your tests for Node:

```js
var proxyquire = require('proxyquire');
proxyquire('./a', stubs);
```

Then add the `'proxyquire-universal'` plugin when you build your test bundle for the browser:

```js
browserify()
  .plugin('proxyquire-universal')
  .bundle()
  .pipe(fs.createWriteStream('test-bundle.js'));
```

proxyquire-universal takes care of calling `bundle.plugin(proxyquireify.plugin)` automatically. You should not register proxyquireify manually.