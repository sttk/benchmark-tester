'use strict';

var Tester = require('./tester');
var parseArgv = require('@fav/cli.parse-argv');

var opts = parseArgv({
  verifyOnly: {
    alias: 'V',
    type: 'boolean',
    default: false,
  },
  verify: {
    type: 'boolean',
    default: true,
  },
}).options;

var verifyTest = Tester.prototype.verifyTest;
Tester.prototype.verifyTest = function() {
  if (!opts.verify) {
    return this;
  }
  return verifyTest.apply(this, arguments);
};

var runTest = Tester.prototype.runTest;
Tester.prototype.runTest = function() {
  if (opts.verifyOnly) {
    return this;
  }
  return runTest.apply(this, arguments);
};

var print = Tester.prototype.print;
Tester.prototype.print = function() {
  if (opts.verifyOnly) {
    return this;
  }
  return print.apply(this, arguments);
};

module.exports = Tester;
