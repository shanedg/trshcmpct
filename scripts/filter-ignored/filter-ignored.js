// Adapted from:
// https://github.com/okonet/lint-staged/#how-can-i-ignore-files-from-eslintignore-
const eslint = require('eslint');
const micromatch = require('micromatch');

/**
 * Higher-order function to filter files ignored by:
 * 1. the ESLint CLI, including patterns in .eslintignore, and
 * 2. an additional list of micromatch patterns.
 * See micromatch patterns: https://github.com/micromatch/micromatch.
 * @param {string[]} ignoredList Custom list of micromatch patterns to ignore.
 * @param {eslint.CLIEngine.Options} [options={}] Passed directly to the ESLint CLI.
 */
const createIgnoredFilter = (ignoredList, options = {}) => {
  const { CLIEngine } = eslint;
  const cli = new CLIEngine(options);

  return file => {
    if (cli.isPathIgnored(file)) {
      return true;
    }

    if (micromatch.isMatch(file, ignoredList)) {
      return true;
    }

    return false;
  };
};

module.exports = {
  createIgnoredFilter,
};
