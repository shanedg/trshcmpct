/**
 * Adapted from:
 * https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
 */
const eslint = require('eslint');

/**
 * Create a filter function for files ignored by the ESLint CLI.
 * This includes files ignored by default and patterns in .eslintignore.
 *
 * @param {eslint.CLIEngine.Options} [options={}] Passed directly to the ESLint CLI.
 * @returns {(file: string) => boolean} Filter function.
 */
const createIgnoredFilter = (options = {}) => {
  const { CLIEngine } = eslint;
  const cli = new CLIEngine(options);

  return files => files.filter(file => {
    if (cli.isPathIgnored(file)) {
      return false;
    }

    return true;
  });
};

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

module.exports.createIgnoredFilter = createIgnoredFilter;
module.exports.ignoredFilter = ignoredFilter;
