'use strict';

var Tester = require('../../src/tester');
var assert = require('assert');

var add = function(a, b) {
  return a + b;
};

var test = function(module, data) {
  assert.strictEqual(module, add);
  assert.deepEqual(data, [-12, -34]);
  return module(data[0], data[1]);
};

var run = false;

new Tester()
  .addPackage('add', add, '0.1.0')
  .setConverter('add', function(data, module) {
    assert.strictEqual(module, add);
    run = true;
    return data.map(function(el) { return -el; });
  })
  .addTest('add', test)
  .verifyTest('add', [12, 34], -46)
  .verifyTest('add', function(testFn, module) {
    assert.strictEqual(test, testFn);
    assert.strictEqual(module, add);
  })
  .runTest('Test of converter', [12, 34]);

assert.ok(run);
