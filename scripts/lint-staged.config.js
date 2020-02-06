// Adapted from:
// https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
const { createIgnoredFilter } = require('./filter-ignored');

const isIgnored = createIgnoredFilter([
  // Accepts micromatch patterns: https://github.com/micromatch/micromatch.
  'lint-staged.config.js',
]);

module.exports = {
  '*.{js,jsx,ts,tsx}': files =>
    'eslint --max-warnings=0 --fix --cache ' + files.filter(file => !isIgnored(file)).join(' ')
};
