const { createIgnoredFilter } = require('./filter-ignored');
const temporaryFilter = createIgnoredFilter();

const eslintFlags = '\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': files =>
    `eslint ${eslintFlags} ${temporaryFilter(files).join(' ')}`
};
