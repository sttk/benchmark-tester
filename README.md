# [benchmark-tester][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

Benchmark test runner with package loading and result printing functions.

## Install

```sh
$ npm install -D benchmark-tester benchmark lodash platform
```

## Load this module 

### Node.js

```js
var BenchmarkTester = require('benchmark-tester');
```

### Web browser <a name="loadmodule-webbrowser"></a>

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title></title>
<script src="node_modules/lodash/lodash.min.js"></script>
<script src="node_modules/platform/platform.js"></script>
<script src="node_modules/benchmark/benchmark.js"></script>
<script src="node_modules/benchmark-tester/web/benchmark-tester.min.js"></script>
<script src="node_modules/benchmark-tester/web/markdown-table.js"></script>
<script src="./load-packages.js"></script><!-- Creates in "Usage" below -->
<body>
<script src="./browser-test.js"></script><!-- Creates in "Usage" below -->
</body>
</html>
```

## Usage

### Node.js

1. Add test functions for each package and run the test.

    ```js
    // test.js
    var BenchmarkTester = require('benchmark-tester');

    new BenchmarkTester()
      .addTest('lodash', function(lodash, data) { // Loads `lodash` automatically
        return lodash.trim(data);
      })
      .runTest('Trim', '  abc  ');
    ```
    
    The result of running the above test is:
    
    ```sh
    $ node test.js 
    Trim:
    lodash x 5,919,517 ops/sec ±2.04% (79 runs sampled)
    ```

2. Output the result as a Markdown table.

    ```js
    // test.js
    var BenchmarkTester = require('benchmark-tester');

    new BenchmarkTester()
      .addTest('lodash', function(lodash, data) {
        return lodash.trim(data);
      })
      .runTest('Trim', '  abc  ')
      
      .print();
    ```
    
    The result of running the above test is:
    
    ```sh
    $ node test/readme-example.test.js 
    Trim:
    lodash x 6,036,712 ops/sec ±1.59% (82 runs sampled)

    |      | lodash(4.17.11)   |
    |:-----|------------------:|
    | Trim | 6,036,712 ops/sec |

    - Platform: Node.js 10.8.0 on Darwin 64-bit
    - Machine: Intel(R) Core(TM) i7-2620M CPU @ 2.70GHz, 16GB
    ```

3. A test function can be verified as follows:

    ```js
    var BenchmarkTester = require('benchmark-tester');
    var assert = require('assert');
    
    var inputData = '  abc  ';
    var expectedData = 'abc';

    new BenchmarkTester()
      .addTest('lodash', function(lodash, inputData) {
        return lodash.trim(inputData);
      })
      
      .verifyTest('lodash', inputData, expectedData)
      .verifyTest('lodash', function(testFn, lodash) {
        assert.equal(testFn(lodash, inputData), expectedData);
      }) 
      
      .runTest('Trim', inputData)
      .print();
    ```
    
4. A package to be loaded can be added manually.

    ```js
    var BenchmarkTester = require('benchmark-tester');
    var assert = require('assert');
    
    var inputData = '  abc  ';
    var expectedData = 'abc';

    new BenchmarkTester()
      .addPackage('String API', String.prototype)
      
      .addTest('lodash', function(lodash, inputData) {
        return lodash.trim(inputData);
      })
      .addTest('String API', function(proto, inputData) {
        return proto.trim.call(inputData);
      })
      
      .runTest('Trim', inputData)
      .print();
    ```

    The result of running the above test is:
    
    ```sh
    $ node test/readme-example.test.js 
    Trim:
    lodash x 5,962,477 ops/sec ±2.06% (81 runs sampled)
    String API x 23,272,338 ops/sec ±1.55% (85 runs sampled)

    |      | String API         | lodash(4.17.11)   |
    |:-----|-------------------:|------------------:|
    | Trim | 23,272,338 ops/sec | 5,962,477 ops/sec |

    - Platform: Node.js 10.8.0 on Darwin 64-bit
    - Machine: Intel(R) Core(TM) i7-2620M CPU @ 2.70GHz, 16GB
    ```     

5. A package can be configure as follows:

    ```js
    // test.js
    var BenchmarkTester = require('benchmark-tester');

    new BenchmarkTester()
      .addTest('lodash', function(lodash, data) {
        return lodash.trim(data);
      })
      .configPackage('lodash', function(lodash, version) {
         ...
      })
      .runTest('Trim', '  abc  ')
      
      .print();
    ```
    
6. A package test data can be converted before each test as follows:

    ```js
    // test.js
    var BenchmarkTester = require('benchmark-tester');

    new BenchmarkTester()
      .addTest('lodash', function(lodash, data) {
        return lodash.trim(data);
      })
      .setConverter('lodash', function(data, module) {
        return '\t' + data + '\t';
      })
      .runTest('Trim', '  abc  ')
      
      .print();
    ```
       
### Web browser

1. Creates `load-packages.js` file in [the above](#loadmodule-webbrowser).
   <a name="loadpackage-webbrowser"></a>
    
    ```js
    var packages = {
      lodash: { name: 'lodash', module: _, version: '4.17.11' },
    };

    BenchmarkTester.prototype._getPackage = function(name) {
      return packages[name];
    };
    ```

2. Creates `browser-test.js` file in [the above](#loadmodule-webbrowser). 

    ```js
    
    var inputData = '  abc  ';
    var expectedData = 'abc';

    new BenchmarkTester()
      .addTest('lodash', function(lodash, inputData) {
        return lodash.trim(inputData);
      })
      
      .verifyTest('lodash', inputData, expectedData)
      .verifyTest('String API', inputData, expectedData)
      
      .runTest('Trim', inputData)
      .print();
    ```

    The result of running the above test is:
    
    (Page's HTML fragment)
    
    ```html
    <pre id="r1540722940278">
    Trim:
    String API x 21,569,892 ops/sec ±2.43% (56 runs sampled)
    lodash x 5,380,868 ops/sec ±2.19% (55 runs sampled)
    </pre>
    <pre id="r1540722952219">
    |               | String API         | lodash(4.17.11)   |
    |:--------------|-------------------:|------------------:|
    | Trim          | 21,569,892 ops/sec | 5,380,868 ops/sec |

    - Platform: Chrome 69.0.3497.100 on OS X 10.13.6 64-bit
    </pre>
    ```
    
    (Web Develper Tool)
    
    ```js
    Trim:
    String API x 21,569,892 ops/sec ±2.43% (56 runs sampled)
    lodash x 5,380,868 ops/sec ±2.19% (55 runs sampled)
    ```


## API

### <u>class BenchmarkTester</u>

#### <u>*constructor*() : BenchmarkTester</u>

Creates an instance of BenchmarkTester.

#### <u>.runTest(testTitle, inputData) : BenchmarkTester </u>

Runs a benchmark test about package modules added by `.addTest` method.

**Parameter:**

| Parameter   | Type    | Description                          |
|:------------|:-------:|:-------------------------------------|
| testTitle   | string  | The test title to be output.         |
| inputData   | *any*   | The input data to be used in a test. |

#### <u>.print() : Void</u>

Prints a result text.
In default, this program prints a result as a Markdown table.

#### <u>.addTest(packageName, testFunc) : BenchmarkTester</u>

Adds a package and a test function for it.

**Parameter:**

| Parameter   | Type    | Description                          |
|:------------|:-------:|:-------------------------------------|
| packageName | string  | The package name.                    |
| testFunc    | function| The test function for the package.   |

The API of *testFunc* is as follows:

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| module      | object / function  | The module of the package.      |
| inputData   | *any*   | The input data to be passed to the module. |

#### <u>.verifyTest(packageName, inputData, expectedData) : BenchmarkTester</u>

Verifys a test function.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| packageName | string  | The package name.                          |
| inputData   | *any*   | The input data to be passed to the module. |
| expectedData| *any*   | The expected data of the test function.    |

#### <u>.verifyTest(packageName, verifyFunc) : BenchmarkTester</u>

Verifys a test function.

**Parameter:**

| Parameter   | Type    | Description                               |
|:------------|:-------:|:------------------------------------------|
| packageName | string  | The package name.                         |
| verifyFunc  | function| The function to verify the test function. |

The API of *testFunc* is as follows:

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| testFunc    | function| The test function for the package.         |
| module      | object / function  | The module of the package.      |

#### <u>.addPackage(packageName, module, version) : BenchmarkTester</u>

Add a package module be loaded manually.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| packageName | string  | The package name.                          |
| modle       | object/function | The module be loaded.              |
| version     | string  | The version of the package.                |

#### <u>.configPackage(packageName, configFunc) : BenchmarkTester</u>

Execute *configFunc* to configure a package module.

**Parameter:**

| Parameter   | Type    | Description                                   |
|:------------|:-------:|:----------------------------------------------|
| packageName | string  | The package name.                             |
| configFunc  | function| The function to configure the package module. |

The API of * configFunc* is as follows:

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| modle       | object/function | The package module.                |
| version     | string  | The version of the package.                |

#### <u>.setConverter(packageName, convertFunc) : BenchmarkTester</u>

Set a test data converter.
*convertFunc* is executed a test data before a test.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| packageName | string  | The package name.                          |
| convertFunc | function| The function to convert a test data.       |

The API of *convertFunc* is as follows:

**Parameter:**

| Parameter   | Type    | Description                                      |
|:------------|:-------:|:-------------------------------------------------|
| testData    | *any*   | Test data passed by `.runTest` or `.verifyTest`. |
| modle       | object/function | The package module.                      |


<i>**For customizing**</i>

#### <u>._beforeTest(testInfo) : Void</u>

Is called before starting a benchmark test.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| testInfo    | object  | The benchmark test information.            |

The properties of *testInfo* is as follows:

**Properties:**

| Name        | Type    | Description                                   |
|:------------|:-------:|:----------------------------------------------|
| title       | object  | The test title.                               |
| data        | *any*   | The input data for the package test function. |

#### <u>._afterTest(testInfo) : Void</u>

Is called after ending a benchmark test.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| testInfo    | object  | The benchmark test information.            |

The properties of *testInfo* is same with `._beforeTest` method.

#### <u>._onCycle(cycleInfo, testInfo) : Void</u>

Is called after executing each package test function.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| cycleInfo   | object  | The `event.target` of [benchmark](https://www.npmjs.com/package/benchmark). |
| testInfo    | object  | The benchmark test information.            |

The properties of *testInfo* is same with `._beforeTest` method.

#### <u>._formatCycle(cycleInfo) : string</u>

Formats the result text for a package test function.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| cycleInfo   | object  | The `event.target` of [benchmark](https://www.npmjs.com/package/benchmark). |

#### <u>._getPackage(packageName) : object / function</u>

Loads a package module and returns it.
In Web browser, this method is needed to be overriden like `load-package.js` file in [the example above](#loadpackage-webbrowser).

The package name of the current project can be specified.
This program will find up `package.json` file and load the package module automatically.

**Parameter:**

| Parameter   | Type    | Description                                |
|:------------|:-------:|:-------------------------------------------|
| packageName | string  | The package name.                          |


## License

Copyright (C) 2018 Takayuki Sato.

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/benchmark-tester/
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.org/package/benchmark-tester/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/benchmark-tester.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/benchmark-tester
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/benchmark-tester?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/benchmark-tester
[coverage-img]: https://coveralls.io/repos/github/sttk/benchmark-tester/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/benchmark-tester?branch=master       
