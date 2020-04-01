# trshcmpctr

[![Build Status](https://cloud.drone.io/api/badges/shanedg/trshcmpctr/status.svg)](https://cloud.drone.io/shanedg/trshcmpctr)

"_all build config, no substance_"

## Install

```bash
npm install
```

OR

```bash
npm ci
```

## Commands

### `build`

Build the project in development mode.

```bash
npm run build
```

### `start`

Start webpack-dev-server and build the project.
Watch files and rebuild on change.

```bash
npm run start
```

OR

```bash
npm start
```

## `watch`

Build the project and watch files, rebuilding on change.

```bash
npm run watch
```

### `*:production`

`build`, `start`, and `watch` each have corresponding `*:production` scripts for applying production optimizations.

```bash
npm run start:production

npm run build:production

npm run watch:production
```

### `lint`

Lint JavaScript files with ESLint.

```bash
npm run lint
```

We use `babel-eslint` instead of `@typescript-eslint` because this project compiles TypeScript with Babel, not the TypeScript compiler.
See [What about Babel and babel-eslint](https://github.com/typescript-eslint/typescript-eslint#what-about-babel-and-babel-eslint):

> The key trade-off can be summarized as: `babel-eslint` supports additional syntax which TypeScript itself does not, but `typescript-eslint` supports creating rules based on type information, which is not available to Babel because there is no type-checker.

The `@typescript-eslint/parser` does not understand all valid Babel syntax.
We miss out on potentially-valuable rules powered by type information but we get full support for Babel syntax.

### `test`

Run `Jest` unit tests.

```bash
npm run test
```

OR

```bash
npm t
```

#### Snapshots

Use the following to update Jest snapshots which need to reflect new changes.

```bash
npm run test -- -u
```

#### Watching

Watch tests, rerunning on changes.

```bash
npm run test -- --watch
```

### `type-check`

Run `tsc` against the project's TypeScript files to catch type errors.

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
