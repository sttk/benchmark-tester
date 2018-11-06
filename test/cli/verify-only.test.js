'use strict';

process.argv.push('--verify-only');

var BenchmarkTester = require('../..');
var assert = require('assert');

var logs = [];

new BenchmarkTester()
  .addTest('lodash', function() {
    console.log('verifyTest');
    logs.push('addTest');
  })
  .configPackage('lodash', function() {
    logs.push('configPackage');
  })
  .setConverter('lodash', function() {
    logs.push('serConverter');
  })
  .verifyTest('lodash', function() {
    console.log('verifyTest');
    logs.push('verifyTest');
  })
  .runTest('Test case', null)
  .print();

assert.deepEqual(logs, [
  'configPackage',
  'verifyTest'
]);

