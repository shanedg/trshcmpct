const childProcess = require('child_process');
const handleChildExit = require('./handleChildExit');

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
      { stdio: 'inherit' },
      handleChildExit
    );
  }
}

module.exports = onPreCommit;
