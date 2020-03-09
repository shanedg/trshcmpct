const childProcess = require('child_process');
const handleChildExit = require('./handleChildExit');

/**
 * Lint project if `NO_PRECOMMIT=1`.
 * Check types and run tests.
 * Reject push on errors.
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
