/**
 * By default, Jest writes all output to stderr:
 * https://github.com/microsoft/just/issues/28#issue-412703134
 *
 * Lifted from:
 * https://github.com/microsoft/fluentui/blob/28ceaaa83cd92a0389c466f0b15b283e3d9b08e4/scripts/jest/jest-reporter.js
 */
const { DefaultReporter } = require('@jest/reporters');

/**
 * The purpose of this custom reporter is to prevent Jest from logging to stderr
 * when there are no errors.
 */
class JestReporter extends DefaultReporter {
  constructor(...args) {
    super(...args);

    this._isLoggingError = false;
    this.log = message => {
      if (this._isLoggingError) {
        process.stderr.write(message + '\n');
      } else {
        process.stdout.write(message + '\n');
      }
    };
  }

  printTestFileFailureMessage(...args) {
    this._isLoggingError = true;
    super.printTestFileFailureMessage(...args);
    this._isLoggingError = false;
  }
}

module.exports = JestReporter;
