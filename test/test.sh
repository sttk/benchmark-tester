#!/usr/bin/env bash

CWD=$(dirname $(which $0))

node ${CWD}/unit/tester.unit.js
node ${CWD}/unit/tester-config-package.unit.js
node ${CWD}/unit/tester-set-converter.unit.js
node ${CWD}/unit/markdown-table.unit.js
node ${CWD}/unit/load-package.unit.js

node ${CWD}/index.test.js
