/**
 * Adapted from:
 * https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
 */
const eslint = require('eslint');

/**
 * Filter out files ignored by ESLint.
 * @param {string[]} files List of filepaths to filter.
 * @param {eslint.ESLint.Options} options ESLint options.
 */
const ignoredFilter = async (files, options = {}) => {
  const cli = new eslint.ESLint(options);

  const shouldBeFiltered = async file => !(await cli.isPathIgnored(file));
  const fileFilterMap = await Promise.all(files.map(shouldBeFiltered));

  return files.filter((_file, index) => fileFilterMap[index]);
};

module.exports.ignoredFilter = ignoredFilter;
