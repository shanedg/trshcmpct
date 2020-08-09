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

### A Note on Choice of ESLint Parser

This project compiles TypeScript with Babel, not the TypeScript compiler.
Babel discards all type information during transpilation but supports a wider range of syntax than the TypeScript compiler.
For this reason, we use the `babel-eslint` parser instead of the parser provided by `@typescript-eslint`.
For more context, see [What about Babel and babel-eslint](https://github.com/typescript-eslint/typescript-eslint#what-about-babel-and-babel-eslint):

> The key trade-off can be summarized as: `babel-eslint` supports additional syntax which TypeScript itself does not, but `typescript-eslint` supports creating rules based on type information, which is not available to Babel because there is no type-checker.

## Test

Run `Jest` tests.

```bash
npm run test
```

## Type Check

> This project compiles TypeScript with Babel, not the TypeScript compiler.
For additional context, see the [note on choice of ESLint parser](#a-note-on-choice-of-eslint-parser) above.

Run `tsc` against the project's TS files to catch type errors.

```bash
npm run type-check
```

## TODO

* Add styles, CSS and some preprocessor
  * Add linting for styles
* Add auto versioning via conventional commits
  * Also publishing for fun? via Github actions maybe?
* React strict mode
* Acceptance tests
* E2E tests
