# trshcmpctr

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

Builds the project in development mode.

```bash
npm run build
```

### `start`

Start webpack-dev-server in development mode, includes watch & rebuild.

```bash
npm run start
```

OR

```bash
npm start
```

### `*:production`

`start` and `build` each have corresponding `*:production` command variants for applying production optimizations.

```bash
npm run start:production
```

```bash
npm run build:production
```

### `lint`

Lint project files.

```bash
npm run lint
```

Invoke `run-p` to execute all commands matching `lint:**` in parallel.
At the moment there is only `lint:js`.
This is perhaps a premature optimization.

#### `lint:js`

Run ESLint against the project's JavaScript and TypeScript files.

```bash
npm run lint:js
```

We use `babel-eslint` instead of `@typescript-eslint` because this project compiles TypeScript with Babel, not with the TypeScript compiler.
See [What about Babel and `babel-eslint`](https://github.com/typescript-eslint/typescript-eslint#what-about-babel-and-babel-eslint):

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

For context, see notes on the `lint:js` command above.

Babel discards all type information during transpilation but supports a wider range of syntax than the TypeScript compiler.
Hence, this separate command.

## TODO

* Jest tests written in TypeScript
* Watching for development/production builds -- simple as `npm run build -- --watch` or similar?
* Add styles, CSS and some preprocessor
  * Add linting for styles
* Add auto versioning via conventional commits
  * Also publishing for fun? via Github actions maybe?
* React strict mode
* Acceptance tests
* E2E tests
* overhaul unit \_\_tests\_\_ organization? prefer test files are directly next to the files they test instead of silo'd in sibling folder
* consider implementing custom cache busting for `eslint-loader` because it doesn't invalidate when `eslintrc.js` is updated. see [this solution](https://github.com/webpack-contrib/eslint-loader/issues/214#issuecomment-388721691) using `cacheIdentifier`
  * also consider `eslint-webpack-plugin` because that's recommended in that or a similar thread (I'm skeptical about this plugin but should take a good look at it, or at least keep an eye on their progress)
