# @trshcmpctr/client

all build config, no substance

## Build

Build the project in development mode.

```bash
npm run build
```

Build the project with production optimizations applied.

```bash
npm run build:production
```

## Start

Start `webpack-dev-server` to serve the project, in-memory.
Launch project in browser.
Watch files, rebuilding and reloading incremental changes.

```bash
npm start
```

## Watch

Build the project in development mode and watch files, rebuilding incremental changes.

```bash
npm run watch
```

## Lint

Lint JavaScript files with ESLint.

```bash
npm run lint
```

## Test

Run `Jest` tests.

```bash
npm run test:jest
```

## Type Check

> This project compiles TypeScript with Babel, not the TypeScript compiler.

Run `tsc` against the project's TS files to catch type errors.

```bash
npm run type-check
```

## Troubleshooting

### Adding Cypress to this project

Adding Cypress (dependencies?) seems to be causing type resolution problems for Jest globals.
Maybe it would help to migrate this Webpack project to ESM?

```sh
❯ npm run test

> @trshcmpctr/client@1.0.0 test
> npm run test:jest && npm run type-check


> @trshcmpctr/client@1.0.0 test:jest
> jest --config=config/jest/jest.config.js --no-cache --reporters=@trshcmpctr/jest-stdout-reporter --silent

 PASS  config/webpack.config.test.js
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |       75 |     100 |     100 |
 config             |     100 |       80 |     100 |     100 |
  webpack.config.js |     100 |       80 |     100 |     100 | 14-57
 src/App            |     100 |       50 |     100 |     100 |
  App.tsx           |     100 |       50 |     100 |     100 | 4
--------------------|---------|----------|---------|---------|-------------------
 PASS  src/App/App.test.tsx

> @trshcmpctr/client@1.0.0 type-check
> tsc

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:34:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'beforeEach' must be of type 'HookFunction', but here has type 'Lifecycle'.

34 declare var beforeEach: jest.Lifecycle;
               ~~~~~~~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2514:13
    2514 declare var beforeEach: Mocha.HookFunction;
                     ~~~~~~~~~~
    'beforeEach' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:36:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'afterEach' must be of type 'HookFunction', but here has type 'Lifecycle'.

36 declare var afterEach: jest.Lifecycle;
               ~~~~~~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2532:13
    2532 declare var afterEach: Mocha.HookFunction;
                     ~~~~~~~~~
    'afterEach' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:37:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'describe' must be of type 'SuiteFunction', but here has type 'Describe'.

37 declare var describe: jest.Describe;
               ~~~~~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2548:13
    2548 declare var describe: Mocha.SuiteFunction;
                     ~~~~~~~~
    'describe' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:39:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'xdescribe' must be of type 'PendingSuiteFunction', but here has type 'Describe'.

39 declare var xdescribe: jest.Describe;
               ~~~~~~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2569:13
    2569 declare var xdescribe: Mocha.PendingSuiteFunction;
                     ~~~~~~~~~
    'xdescribe' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:40:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'it' must be of type 'TestFunction', but here has type 'It'.

40 declare var it: jest.It;
               ~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2583:13
    2583 declare var it: Mocha.TestFunction;
                     ~~
    'it' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:42:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'xit' must be of type 'PendingTestFunction', but here has type 'It'.

42 declare var xit: jest.It;
               ~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2604:13
    2604 declare var xit: Mocha.PendingTestFunction;
                     ~~~
    'xit' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:43:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'test' must be of type 'TestFunction', but here has type 'It'.

43 declare var test: jest.It;
               ~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/mocha/index.d.ts:2597:13
    2597 declare var test: Mocha.TestFunction;
                     ~~~~
    'test' was also declared here.

../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:46:15 - error TS2451: Cannot redeclare block-scoped variable 'expect'.

46 declare const expect: jest.Expect;
                 ~~~~~~

  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/cypress-expect.d.ts:2:15
    2 declare const expect: Chai.ExpectStatic
                    ~~~~~~
    'expect' was also declared here.

../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/cypress-expect.d.ts:2:15 - error TS2451: Cannot redeclare block-scoped variable 'expect'.

2 declare const expect: Chai.ExpectStatic
                ~~~~~~

  ../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:46:15
    46 declare const expect: jest.Expect;
                     ~~~~~~
    'expect' was also declared here.


Found 9 errors in 2 files.

Errors  Files
     8  ../common/temp/node_modules/.pnpm/@types+jest@28.1.6/node_modules/@types/jest/index.d.ts:34
     1  ../common/temp/node_modules/.pnpm/cypress@10.3.0/node_modules/cypress/types/cypress-expect.d.ts:2
```
