'use strict';

var utils  = require('jstransform/src/utils');
var Syntax = require('jstransform').Syntax;

module.exports = function (traverse, node, path, state) {
  utils.append('require(\'proxyquireify\')(require)', state);
  utils.move(node.range[1], state);
};

module.exports.test = function (node, path, state) {
  return node.type === Syntax.CallExpression
    && node.callee.type === Syntax.Identifier
    && node.callee.name === 'require'
    && node.arguments.length
    && node.arguments[0].value === 'proxyquire';
}
