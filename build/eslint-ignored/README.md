# @trshcmpctr/eslint-ignored

Filter paths ignored by ESLint,
including files ignored by default and those matched by patterns in `.eslintignore` files.
Useful for avoiding `File ignored by default` warnings when passing files to ESLint.

## Installation

```sh
npm install eslint @trshcmpctr/eslint-ignored eslint --save-dev
```

## Usage with [lint-staged](https://github.com/okonet/lint-staged)

```js
const { filter } = require('@trshcmpctr/eslint-ignored');

module.exports = {
  '*.{js,jsx,ts,tsx}': async files => `eslint ${(await filter(files)).join(' ')}`
};
```
