@ECHO OFF

SET CWD=%~d0%~p0

node %CWD%unit\tester.unit.js
node %CWD%unit\markdown-table.unit.js
node %CWD%unit\load-package.unit.js

node %CWD%index.test.js
