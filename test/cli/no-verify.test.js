'use strict';

process.argv.push('--no-verify');

var BenchmarkTester = require('../..');
var assert = require('assert');

var logs = [];

var testCounter = 0;

new BenchmarkTester()
  .addTest('lodash', function() {
    testCounter++;
  })
  .configPackage('lodash', function() {
    logs.push('configPackage');
  })
  .setConverter('lodash', function() {
    logs.push('setConverter');
  })
  .verifyTest('lodash', function() {
    logs.push('verifyTest');
  })
  .runTest('Test', [])
  .print();

assert.ok(testCounter > 0);
assert.deepEqual(logs, [
  'configPackage',
  'setConverter',
]);
