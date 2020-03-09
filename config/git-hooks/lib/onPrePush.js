const childProcess = require('child_process');
const handleChildExit = require('./handleChildExit');

// Always send child's output to parent.
// i.e. make sure that we see lint-staged and jest in the terminal.
const execSyncOptions = { stdio: 'inherit' };

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

module.exports = onPrePush;
