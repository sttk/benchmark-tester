@ECHO OFF

SET CWD=%~d0%~p0

node %CWD%unit\tester.unit.js
node %CWD%unit\tester-config-package.unit.js
node %CWD%unit\tester-set-converter.unit.js
node %CWD%unit\markdown-table.unit.js
node %CWD%unit\load-package.unit.js

node %CWD%index.test.js
node %CWD%cli\no-verify.test.js
node %CWD%cli\verify-only.test.js
