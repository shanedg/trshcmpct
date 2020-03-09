const childProcess = require('child_process');
const handleChildExit = require('./handleChildExit');

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

module.exports = onPreCommit;
