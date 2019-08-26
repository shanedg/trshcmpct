const child_process = require('child_process');

const {
  onPreCommit,
  onPrePush,
} = require('../lib/index');

describe('on pre-commit', () => {

  const initialEnv = process.env;
  Object.freeze(initialEnv);

  // Mock execSync to keep from spawning actual processes.
  let mockExecSyncSpy;
  // Mock process.exit() to keep from terminating our tests early.
  let mockProcessExitSpy;

  // Save process env before each test.
  beforeEach(() => {
    process.env = {
      ...initialEnv
    };

    // Ignore the value if set in the actual process env.
    delete process.env.NO_PRECOMMIT;

    // Setup mocked spies.
    mockExecSyncSpy = jest.spyOn(child_process, 'execSync')
      .mockImplementation(() => {});
    mockProcessExitSpy = jest.spyOn(process, 'exit')
      .mockImplementation(() => {});
  });

  // Restore spies and process.env after each test.
  afterEach(() => {
    mockExecSyncSpy.mockRestore();
    mockProcessExitSpy.mockRestore();
    process.env = initialEnv;
  });

  it('lints staged files when NO_PRECOMMIT is not set', () => {
    onPreCommit();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run lint-staged',
      expect.anything(),
      expect.anything(),
    );
  });

  it('does not lint staged files when NO_PRECOMMIT is set', () => {
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

  let mockExecSyncSpy;

  // Save process env before each test.
  beforeEach(() => {
    process.env = {
      ...initialEnv
    };

    // Ignore the value if set in the actual process env.
    delete process.env.NO_PRECOMMIT;

    // Setup mocked execSync spy.
    mockExecSyncSpy = jest.spyOn(child_process, 'execSync')
      .mockImplementation(() => {});
  });

  // Restore execSync spy and process.env after each test.
  afterEach(() => {
    mockExecSyncSpy.mockRestore();
    process.env = initialEnv;
  });

  it('tests but does not lint when NO_PRECOMMIT is not set', () => {
    onPrePush();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run test',
      expect.anything(),
      expect.anything(),
    );
  });

  it('lints and tests when NO_PRECOMMIT is set', () => {
    process.env.NO_PRECOMMIT = true;

    onPrePush();

    expect(mockExecSyncSpy).toHaveBeenCalledWith(
      'npm run lint:js && npm run test',
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