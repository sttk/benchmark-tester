'use strict';

var Tester = require('../../src/tester');
require('../../src/print/markdown-table');
require('../../src/load-package');

var verifyData = [' 　Ab c \t ', 'Ab c'];
var testData = verifyData[0];

new Tester()
  .addPackage('String#trim', function(s) { return s.trim(); })

  .addTest('String#trim', function(trim, data) {
    return trim(data);
  })
  .addTest('lodash', function(lodash, data) {
    return lodash.trim(data);
  })
  .addTest('benchmark-tester', function() {
    return 'For testing the package in this current project.';
  })

  .verifyTest('String#trim', verifyData[0], verifyData[1])
  .verifyTest('lodash',  verifyData[0], verifyData[1])

  .runTest('Trim a string', testData)

  .print();
