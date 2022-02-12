const { filter } = require('./eslint-ignored');

const eslintFlags = '\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': async files => {
    return `eslint ${eslintFlags} ${(await filter(files)).join(' ')}`;
  }
};
