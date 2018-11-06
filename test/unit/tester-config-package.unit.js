'use strict';

var Tester = require('../../src/tester');
var assert = require('assert');

var add = function(a, b) {
  return a + b;
};

var run = false;

new Tester()
  .addPackage('add', add, '0.1.0')
  .configPackage('add', function(module, version) {
    assert.strictEqual(module, add);
    assert.strictEqual(version, '0.1.0');
    assert.strictEqual(module(12, 34), 46);
    run = true;
  });

assert.ok(run);
