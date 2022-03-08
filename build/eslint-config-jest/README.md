# @trshcmpctr/eslint-config-jest

ESLint config for Jest tests in JavaScript projects.

## Installation

```sh
npm install eslint-plugin-jest @trshcmpctr/eslint-config-jest --save-dev
```

## Usage

This config assumes a base like `@trshcmpctr/eslint-config` is already applied.
Use overrides to apply config settings to test files only.

```js
// .eslintrc.js
module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  overrides: [
    {
      files: ['*.test.js'],
      extends: ['@trshcmpctr/eslint-config-jest']
    }
  ],
  root: true
};
```

## TODO

* <https://github.com/dangreenisrael/eslint-plugin-jest-formatting>
* <https://github.com/istanbuljs/eslint-plugin-istanbul>
* <https://www.npmjs.com/package/eslint-plugin-jest-dom>
