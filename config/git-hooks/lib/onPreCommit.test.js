const childProcess = require('child_process');
const onPreCommit = require('./onPreCommit');

describe('on pre-commit', () => {
  const initialEnv = process.env;
  Object.freeze(initialEnv);

  // Mock childProcess.execSync to keep from spawning actual processes.
  // Mock process.exit to keep from terminating our tests early.
  let mockExecSyncSpy;
  let processExitSpy;

  beforeEach(() => {
    // Save process env before each test.
    // Ignore NO_PRECOMMIT if set in the test environment.
    process.env = { ...initialEnv };
    delete process.env.NO_PRECOMMIT;

    mockExecSyncSpy = jest.spyOn(childProcess, 'execSync')
      .mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore spies and environment variables after each test.
    mockExecSyncSpy.mockRestore();
    processExitSpy.mockRestore();
    process.env = initialEnv;
  });

  it('lints staged files when NO_PRECOMMIT is falsy', () => {
    onPreCommit();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run lint-staged',
      expect.anything(),
      expect.anything(),
    );
  });

  it('does not lint staged files when NO_PRECOMMIT is truthy', () => {
    process.env.NO_PRECOMMIT = true;
    onPreCommit();

    expect(mockExecSyncSpy).not.toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  it('sends child process output to parent', () => {
    onPreCommit();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stdio: 'inherit',
      }),
      expect.anything(),
    );
  });

});
