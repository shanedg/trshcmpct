# @trshcmpctr/eslint-config-typescript

ESLint config for TypeScript in JavaScript projects.

## Installation

```sh
npm install typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin @trshcmpctr/eslint-config-typescript --save-dev
```

## Usage

This config assumes a base like `@trshcmpctr/eslint-config` is already applied.

There is a performance cost for some of the rules this config applies.
The folks behind `@typescript-eslint` suggest it's worth it: <https://typescript-eslint.io/docs/linting/type-linting/#how-is-performance>

> For small projects this takes a negligible amount of time (a few seconds);
for large projects, it can take longer (30s or more).

Use overrides to apply config settings to TypeScript files only.
Provide the location of the `tsconfig.json` file via `parserOptions`.

```js
// .eslintrc.js
module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  overrides: [
    {
      files: ['*.ts'],
      extends: ['@trshcmpctr/eslint-config-typescript'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
      }
    }
  ],
  root: true
};
```

## TODO

* <https://typescript-eslint.io/docs/linting/troubleshooting/#the-indent--typescript-eslintindent-rules>
* <https://typescript-eslint.io/docs/linting/troubleshooting/#eslint-plugin-import>
