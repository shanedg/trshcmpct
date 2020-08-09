const { ignoredFilter } = require('./filter-ignored');

const eslintFlags = '\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': async files => {
    const lintFiles = await ignoredFilter(files);
    return `eslint ${eslintFlags} ${lintFiles.join(' ')}`;
  }
};
