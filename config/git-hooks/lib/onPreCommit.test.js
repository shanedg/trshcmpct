const childProcess = require('child_process');
const onPreCommit = require('./onPreCommit');

describe('on pre-commit', () => {
  const initialEnv = process.env;
  Object.freeze(initialEnv);

  let childProcessExecSpy;
  let processExitSpy;

  beforeEach(() => {
    // Save environment, ignoring `NO_PRECOMMIT` if set.
    process.env = { ...initialEnv };
    delete process.env.NO_PRECOMMIT;

    // Prevent child processes from spawning.
    // Prevent process from exiting tests early.
    childProcessExecSpy = jest.spyOn(childProcess, 'execSync')
      .mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = initialEnv;
  });

  it('lints staged files when NO_PRECOMMIT is falsy', () => {
    onPreCommit();

    expect(childProcessExecSpy).toHaveBeenCalledWith(
      'npm run lint-staged',
      expect.anything(),
      expect.anything(),
    );
  });

  it('does not lint staged files when NO_PRECOMMIT is truthy', () => {
    process.env.NO_PRECOMMIT = true;
    onPreCommit();

    expect(childProcessExecSpy).not.toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  it('sends child process output to parent', () => {
    onPreCommit();

    expect(childProcessExecSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stdio: 'inherit',
      }),
      expect.anything(),
    );
  });

});
