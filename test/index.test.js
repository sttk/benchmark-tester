'use strict';

var BenchmarkTester = require('../src');

new BenchmarkTester()
  .addPackage('String API', String.prototype)

  .addTest('String API', function(proto, data) {
    return proto.toUpperCase.call(data);
  })
  .addTest('lodash', function(lodash, data) {
    return lodash.upperCase(data);
  })
  .verifyTest('String API', 'abc', 'ABC')
  .verifyTest('lodash',  'abc', 'ABC')
  .runTest('to upper case', 'abc')

  .addTest('String API', function(proto, data) {
    return proto.toLowerCase.call(data);
  })
  .addTest('lodash', function(lodash, data) {
    return lodash.lowerCase(data);
  })
  .verifyTest('String API', 'ABC', 'abc')
  .verifyTest('lodash', 'ABC', 'abc')
  .runTest('to lower case', 'ABC')

  .addTest('String API', function(proto, data) {
    return proto.trim.call(data);
  })
  .addTest('lodash', function(lodash, data) {
    return lodash.trim(data);
  })
  .verifyTest('String API', ' abc ', 'abc')
  .verifyTest('lodash',  ' abc ', 'abc')
  .runTest('trim', ' abc ')

  .print();
