'use strict';

var Tester = require('./tester');
var findup = require('findup-sync');
var path = require('path');

Tester.prototype._getPackage = function(pkgName) {
  var fp = findup('package.json');
  /* istanbul ignore else */
  if (fp) {
    var thisPrj = require(fp);
    if (thisPrj.name === pkgName) {
      return {
        name: pkgName,
        module: require(path.resolve(path.dirname(fp), thisPrj.main)),
        version: thisPrj.version,
      };
    }
  }

  var pkg = require(pkgName + '/package.json');
  return {
    name: pkgName,
    module: require(pkgName),
    version: pkg.version,
  };
};
