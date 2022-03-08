/**
 * Adapted from:
 * https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
 */
const eslint = require('eslint');

// TypeError: Class constructor ESLint cannot be invoked without 'new'
// (new eslint.ESLint() doesn't work)
const ESLint = eslint.ESLint;

/**
 * Remove files ignored by ESLint.
 * @param {string[]} files List of filepaths to filter.
 * @param {ESLint.Options} options ESLint options.
 */
const filter = async (files, options = {}) => {
  const cli = new ESLint(options);

  const shouldBeFiltered = async file => !(await cli.isPathIgnored(file));
  const fileFilterMap = await Promise.all(files.map(shouldBeFiltered));

  return files.filter((_file, index) => fileFilterMap[index]);
};

module.exports = {
  filter,
};
