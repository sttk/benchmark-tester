'use strict';

var Benchmark = require('benchmark');
var assert = require('assert');
var formatNumber = require('@fav/type.format-number');
var formatDate = require('@fav/type.format-date');

var formatHz = formatNumber('9,999');

function Tester() {
  if (!(this instanceof Tester)) {
    return new Tester();
  }

  this.tests = {};
  this.results = [];
  this.packages = {};
}

Tester.prototype.addTest = function(pkgName, testFn) {
  var test = getTest(pkgName, this);
  test.fn = testFn;
  loadPackage(pkgName, this);
  return this;
};

function getTest(pkgName, tester) {
  var test = tester.tests[pkgName];
  if (test) {
    return test;
  }
  return tester.tests[pkgName] = {};
}

Tester.prototype.configPackage = function(pkgName, configFn) {
  var pkg = loadPackage(pkgName, this);
  configFn.call(null, pkg.module, pkg.version);
  return this;
};

Tester.prototype.setConverter = function(pkgName, convertFn) {
  var test = getTest(pkgName, this);
  test.converter = convertFn;
  return this;
};

Tester.prototype.runTest = function(testTitle, testData) {
  var tester = this;

  var result = { title: testTitle, data: testData };
  tester.results.push(result);

  var suite = new Benchmark.Suite()
    .on('start', function() {
      tester._beforeTest(result);
    })
    .on('cycle', function(event) {
      result[event.target.name] = tester._formatCycle(event.target);
      tester._onCycle(event.target, result);
    })
    .on('complete', function() {
      tester._afterTest(result);
    });

  Object.keys(tester.tests).forEach(function(pkgName) {
    var pkg = loadPackage(pkgName, tester);
    var test = tester.tests[pkgName];
    var convert = test.converter || notConvertData;
    var data = convert(testData, pkg.module);
    suite.add(pkgName, function() {
      test.fn.call(null, pkg.module, data);
    });
  });

  suite.run();
  return this;
};

function notConvertData(data) {
  return data;
}

Tester.prototype.verifyTest = function(pkgName, testData, expected, assertFn) {
  var tester = this;
  var pkg = loadPackage(pkgName, tester);
  var test = tester.tests[pkgName];

  if (typeof testData === 'function') {
    var verifyFn = testData;
    verifyFn.call(null, test.fn, pkg.module);
    return this;
  }

  var convert = test.converter || notConvertData;
  var data = convert(testData, pkg.module);

  if (typeof assertFn !== 'function') {
    assertFn = assert.equal;
  }
  assertFn(test.fn.call(null, pkg.module, data), expected);
  return this;
};

function loadPackage(pkgName, tester) {
  var pkg = tester.packages[pkgName];
  if (pkg) {
    return pkg;
  }
  return tester.packages[pkgName] = tester._getPackage(pkgName);
}

Tester.prototype.addPackage = function(pkgName, module, version) {
  pkgName = String(pkgName);

  this.packages[pkgName] = {
    name: pkgName,
    module: module,
    version: version,
  };

  return this;
};

/* istanbul ignore next */
Tester.prototype._getPackage = function(pkgName) {
  return {
    name: pkgName,
    module: function() {},
    version: '',
  };
};

Tester.prototype._beforeTest = function(testInfo) {
  console.log(testInfo.title + ':');
};

Tester.prototype._onCycle = function(cycleInfo /* , testInfo */) {
  console.log(String(cycleInfo));
};

Tester.prototype._formatCycle = function(cycleInfo) {
  return formatHz(cycleInfo.hz) + ' ops/sec';
};

Tester.prototype._afterTest = function(/* testInfo */) {
  console.log();
};

Tester.prototype.print = function() {
  console.log(this.results.length + ' cases complete.');
  console.log();
  console.log('- Platform: ' + Benchmark.platform.description);
};

Tester.formatNumber = formatNumber;
Tester.formatDate = formatDate;

module.exports = Tester;
