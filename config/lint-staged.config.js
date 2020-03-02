// Adapted from:
// https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
const { createIgnoredFilter } = require('../scripts/filter-ignored');

const isIgnored = createIgnoredFilter([
  // Accepts micromatch patterns: https://github.com/micromatch/micromatch.
  'lint-staged.config.js',
]);

const eslintFlags = '--max-warnings 0 --fix --cache --cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': files =>
    `eslint ${eslintFlags} ${files.filter(file => !isIgnored(file)).join(' ')}`
};
