# @trshcmpctr/eslint-config

Base ESLint config for JavaScript projects.

Extend this config in your .eslintrc.* file to set defaults suitable for
linting untranspiled, untransformed JavaScript files (like those in your project root)
and for extending via file extension overrides.

## Installation

```sh
npm install eslint @trshcmpctr/eslint-config --save-dev
```

## Usage

Basic example:

```js
// .eslintrc.js
module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,
};
```

Example with overrides for React syntax and recommended rules (provided by `eslint-plugin-react`):

```js
// .eslintrc.js
module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,

  overrides: [
    {
      files: ['*.jsx'],
      extends: ['plugin:react/recommended'],
      plugins: ['eslint-plugin-react'],
      settings: {
        react: {
          pragma: 'React',
          version: 'detect',
        }
      }
    }
  ]
};
```