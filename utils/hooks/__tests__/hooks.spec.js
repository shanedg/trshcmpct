const childProcess = require('child_process');

const {
  onPreCommit,
  onPrePush,
} = require('../lib/index');

describe('on pre-commit', () => {

  const initialEnv = process.env;
  Object.freeze(initialEnv);

  // Mock childProcess.execSync to keep from spawning actual processes.
  // Mock process.exit to keep from terminating our tests early.
  let mockExecSyncSpy;
  let mockProcessExitSpy;

  beforeEach(() => {
    // Save process env before each test.
    // Ignore NO_PRECOMMIT if set in the test environment.
    process.env = { ...initialEnv };
    delete process.env.NO_PRECOMMIT;

    mockExecSyncSpy = jest.spyOn(childProcess, 'execSync')
      .mockImplementation(() => {});
    mockProcessExitSpy = jest.spyOn(process, 'exit')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore spies and environment variables after each test.
    mockExecSyncSpy.mockRestore();
    mockProcessExitSpy.mockRestore();
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
    expect(mockProcessExitSpy).toHaveBeenCalledWith(0);
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

describe('on pre-push', () => {

  const initialEnv = process.env;
  Object.freeze(initialEnv);

  // Mock childProcess.execSync to keep from spawning actual processes.
  let mockExecSyncSpy;

  beforeEach(() => {
    // Save environment variables to restore later.
    // Ignore NO_PRECOMMIT if set in the test environment.
    process.env = { ...initialEnv };
    delete process.env.NO_PRECOMMIT;

    mockExecSyncSpy = jest.spyOn(childProcess, 'execSync')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore spy and environment variables after each test.
    mockExecSyncSpy.mockRestore();
    process.env = initialEnv;
  });

  it('does not lint if NO_PRECOMMIT is falsy but still checks types and runs tests', () => {
    onPrePush();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run type-check && npm run test',
      expect.anything(),
      expect.anything(),
    );
  });

  it('lints, checks types, and tests when NO_PRECOMMIT is truthy', () => {
    process.env.NO_PRECOMMIT = true;

    onPrePush();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run lint:js && npm run type-check && npm run test',
      expect.anything(),
      expect.anything(),
    );
  });

  it('sends child process output to parent', () => {
    onPrePush();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stdio: 'inherit',
      }),
      expect.anything(),
    );
  });

});
