# @trshcmpctr/eslint-config-react

ESLint config for React in JavaScript projects.

## Installation

```sh
npm install eslint-plugin-react eslint-plugin-react-hooks @trshcmpctr/eslint-config-react --save-dev
```

## Usage

This config assumes a base like `@trshcmpctr/eslint-config` is already applied.
Use overrides to apply config settings to React files only.
Configure React `pragma` and `version` via `settings.react`
(see [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)).
The example in the override below is probably fine.

```js
// .eslintrc.js
module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  overrides: [
    {
      files: ['*.jsx'],
      extends: ['@trshcmpctr/eslint-config-react'],
      settings: {
        react: {
          pragma: 'React',
          version: 'detect'
        },
      },
    }
  ],
  root: true
};
```
