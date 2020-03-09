const createIgnoredFilter = require('./filter-ignored');

const isIgnored = createIgnoredFilter();
const eslintFlags = '--max-warnings 0 --fix --cache --cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': files =>
    `eslint ${eslintFlags} ${files.filter(file => !isIgnored(file)).join(' ')}`
};
