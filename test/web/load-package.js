;(function() {

var packages = {
  lodash: { name: 'lodash', module: _, version: '4.17.11' },
};

BenchmarkTester.prototype._getPackage = function(name) {
  return packages[name];
};

}());
