const childProcess = require('child_process');
const handleChildExit = require('./handleChildExit');

/**
 * Lint entire project only if opted out of linting staged files on pre-commit
 * (via environment variable, NO_PRECOMMIT=1).
 * Perform project type checking and run all project test suites. Reject push
 * on any errors or warnings.
 */
function onPrePush() {
  if (process.env.NO_PRECOMMIT) {
    childProcess.execSync(
      'npm run lint:js && npm run type-check && npm run test',
      { stdio: 'inherit' },
      handleChildExit
    );
  } else {
    childProcess.execSync(
      'npm run type-check && npm run test',
      { stdio: 'inherit' },
      handleChildExit
    );
  }
}

module.exports = onPrePush;
