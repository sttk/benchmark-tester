'use strict';

var Tester = require('../tester');

var platform = require('platform');
var os = require('os');

var _ = require('lodash');
var padStart = _.padStart;
var padEnd = _.padEnd;

Tester.prototype.print = function() {
  var tester = this;

  var pkgNames = Object.keys(tester.packages);
  var pkgs = pkgNames.map(getPackage, tester);
  var hdrs = pkgs.map(getHeaderFromPackage);
  var pads = calcPaddingSize(pkgs, hdrs, tester.results);

  console.log(createMarkdownTable(pkgs, hdrs, tester.results, pads));
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
  out += '- Machine: ' + getCpu() + ', ' + getMem() + '\n';

  return out;
}

function getCpu() {
  return os.cpus()[0].model;
}

function getMem() {
  var mem = os.totalmem();
  var units = ['B', 'kB', 'MB', 'GB', 'TB'];

  for (var i = 0, n = units.length; i < n; i++) {
    if (mem < 1024) {
      return mem + units[i];
    }
    mem /= 1024;
  }

  /* istanbul ignore next */
  return mem + units[units.length - 1];
}

