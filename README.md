# trshcmpctr

[![Build Status](https://cloud.drone.io/api/badges/shanedg/trshcmpctr/status.svg)](https://cloud.drone.io/shanedg/trshcmpctr)

"_all build config, no substance_"

## Install

Prefer to install from the lockfile.

```bash
npm ci
```

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

We use `babel-eslint` instead of `@typescript-eslint` because this project compiles TypeScript with Babel, not the TypeScript compiler.
See [What about Babel and babel-eslint](https://github.com/typescript-eslint/typescript-eslint#what-about-babel-and-babel-eslint):

> The key trade-off can be summarized as: `babel-eslint` supports additional syntax which TypeScript itself does not, but `typescript-eslint` supports creating rules based on type information, which is not available to Babel because there is no type-checker.

The `@typescript-eslint/parser` does not understand all valid Babel syntax.
We miss out on potentially-valuable rules powered by type information but we get full support for Babel syntax.

## Test

Run `Jest` tests.

```bash
npm run test
```

## Type Check

> This project compiles TypeScript with Babel, not the TypeScript compiler.

Run `tsc` against the project's TS files to catch type errors.

```bash
npm run type-check
```

For context, see notes on [linting](##lint) above.

Babel discards all type information during transpilation but supports a wider range of syntax than the TypeScript compiler.
Hence, this separate command.

## TODO

* Add styles, CSS and some preprocessor
  * Add linting for styles
* Add auto versioning via conventional commits
  * Also publishing for fun? via Github actions maybe?
* React strict mode
* Acceptance tests
* E2E tests
