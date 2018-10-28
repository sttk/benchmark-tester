'use strict';

var Tester = require('../../src/tester');
var assert = require('assert');

new Tester()
  .addPackage('add', function(a, b) { return a + b; }, '0.1.0')
  .addPackage('sub', function(a, b) { return a - b; })
  .addPackage('mul', function(a, b) { return a * b; }, '')
  .addPackage('div', function(a, b) { return a / b; }, '1.2.0')

  .addTest('add', function(add, data) {
    return add(data[0], data[1]);
  })
  .addTest('sub', function(sub, data) {
    return sub(data[0], data[1]);
  })
  .addTest('mul', function(mul, data) {
    return mul(data[0], data[1]);
  })
  .addTest('div', function(div, data) {
    return div(data[0], data[1]);
  })
  .verifyTest('add', [123, 456], 579)
  .verifyTest('sub', [123, 456], -334, assert.notEqual)
  .verifyTest('mul', function(testFn, mul) {
    assert.strictEqual(testFn(mul, [123, 456]), 56088);
  })
  .verifyTest('div', function(testFn, div) {
    var value = testFn(div, [123, 456]);
    assert.ok(0.26 < value && value < 0.27);
  })
  .runTest('Zeros', [0, 0])
  .runTest('Integers', [123, 456])
  .runTest('Decimals', [0.123, 4.56])

  .addTest('add', function(add, data) {
    return add(add(data[0], data[1]), data[2]);
  })
  .addTest('sub', function(sub, data) {
    return sub(sub(data[0], data[1]), data[2]);
  })
  .addTest('mul', function(mul, data) {
    return mul(mul(data[0], data[1]), data[2]);
  })
  .addTest('div', function(div, data) {
    return div(div(data[0], data[1]), data[2]);
  })
  .runTest('Zeros (3 num)', [0, 0, 0])
  .runTest('Integers (3 num)', [123, 456, 789])
  .runTest('Decimals (3 num)', [0.123, 4.56, -0.0789])

  .print();
