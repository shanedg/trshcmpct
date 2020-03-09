const childProcess = require('child_process');
const handleChildExit = require('./helpers');

// Always send child's output to parent.
// i.e. make sure that we see lint-staged and jest in the terminal.
const execSyncOptions = { stdio: 'inherit' };

/**
 * Lint staged files and reject commit on any errors or warnings.
 * Provide option to opt-out and defer linting to pre-push (via environment
 * variable, NO_PRECOMMIT=1).
 */
function onPreCommit() {
  if (process.env.NO_PRECOMMIT) {
    process.exit(0);
  } else {
    childProcess.execSync(
      'npm run lint-staged',
      execSyncOptions,
      handleChildExit
    );
  }
}

/**
 * Lint entire project only if opted out of linting staged files on pre-commit
 * (via environment variable, NO_PRECOMMIT=1).
 * Perform project type checking and run all project test suites. Reject push
 * on any errors or warnings.
 */
function onPrePush() {
  if (process.env.NO_PRECOMMIT) {
    childProcess.execSync(
      // lint-staged doesn't make sense in the pre-push context: changes
      // have already been committed
      'npm run lint:js && npm run type-check && npm run test',
      execSyncOptions,
      handleChildExit
    );
  } else {
    childProcess.execSync(
      'npm run type-check && npm run test',
      execSyncOptions,
      handleChildExit
    );
  }
}

module.exports = {
  onPreCommit,
  onPrePush,
};
