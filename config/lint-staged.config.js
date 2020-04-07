const filterIgnored = require('./filter-ignored')();

const eslintFlags = '--max-warnings 0 \
                     --fix \
                     --cache \
                     --cache-location node_modules/.cache/eslint-cache/';

module.exports = {
  '*.{js,jsx,ts,tsx}': files =>
    `eslint ${eslintFlags} ${filterIgnored(files).join(' ')}`
};
