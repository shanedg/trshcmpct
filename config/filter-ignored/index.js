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

  return file => {
    if (cli.isPathIgnored(file)) {
      return true;
    }

    return false;
  };
};

module.exports = createIgnoredFilter;
