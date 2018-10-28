(function() {

'use strict';

var padStart = _.padStart;
var padEnd = _.padEnd;
var escape = _.escape;

BenchmarkTester.prototype._beforeTest = function(testInfo) {
  testInfo.code = String(Date.now());
  createResultElement(testInfo.code);

  var s = testInfo.title + ':';
  console.log(s);
  printResult(s, testInfo.code);
};

BenchmarkTester.prototype._onCycle = function(cycleInfo, testInfo) {
  var s = String(cycleInfo);
  console.log(s);
  printResult(s, testInfo.code);
};

BenchmarkTester.prototype.print = function() {
  var code = String(Date.now());
  createResultElement(code);

  var tester = this;

  var pkgNames = Object.keys(tester.packages);
  var pkgs = pkgNames.map(getPackage, tester);
  var hdrs = pkgs.map(getHeaderFromPackage);
  var pads = calcPaddingSize(pkgs, hdrs, tester.results);

  var s = createMarkdownTable(pkgs, hdrs, tester.results, pads)
  printResult(s, code);
};

function getPackage(pkgName) {
  return this.packages[pkgName];
}

function getHeaderFromPackage(pkg) {
  if (pkg.version) {
    return pkg.name + '(' + pkg.version + ')';
  }
  return pkg.name;
}

function calcPaddingSize(pkgs, hdrs, results) {
  var pads = [1].concat(hdrs.map(getLength));

  results.forEach(function(rs) {
    pads[0] = Math.max(pads[0], rs.title.length);
    pkgs.forEach(function(pkg, i) {
      pads[i + 1] = Math.max(pads[i + 1], getLength(rs[pkg.name]));
    });
  });

  return pads;
}

function getLength(s) {
  return (s || /* istanbul ignore next */'').length;
}

function createMarkdownTable(pkgs, hdrs, results, pads) {
  var out = '| ' + padEnd('', pads[0]) + ' |';
  hdrs.forEach(function(hdr, i) {
    out += ' ' + padEnd(hdr, pads[i + 1]) + ' |';
  });
  out += '\n';

  out += '|:' + padEnd('', pads[0], '-') + '-|';
  hdrs.forEach(function(hdr, i) {
    out += '-' + padEnd('', pads[i + 1], '-') + ':|';
  });
  out += '\n';

  results.forEach(function(rs) {
    out += '| ' + padEnd(rs.title, pads[0]) + ' |';
    pkgs.forEach(function(pkg, i) {
      out += ' ' + padStart(rs[pkg.name], pads[i + 1]) + ' |';
    });
    out += '\n';
  });

  out += '\n';
  out += '- Platform: ' + platform.description + '\n';

  return out;
}

function createResultElement(code) {
  document.body.innerHTML += '<pre id="r' + code + '"></pre>';
}

function printResult(s, code) {
  document.getElementById('r' + code).innerHTML += escape(s) + '<br/>';
}

}());
