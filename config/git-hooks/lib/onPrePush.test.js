const childProcess = require('child_process');
const onPrePush = require('./onPrePush');

describe('on pre-push', () => {
  let childProcessExecSpy;
  let initialEnv;

  beforeAll(() => {
    initialEnv = process.env;
    Object.freeze(initialEnv);
  });

  beforeEach(() => {
    // Save environment, ignoring `NO_PRECOMMIT` if set.
    process.env = { ...initialEnv };
    delete process.env.NO_PRECOMMIT;

    // Prevent child processes from spawning.
    childProcessExecSpy = jest.spyOn(childProcess, 'execSync')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    childProcessExecSpy.mockRestore();
    process.env = initialEnv;
  });

  it('does not lint if NO_PRECOMMIT is falsy but still checks types and runs tests', () => {
    onPrePush();

    expect(childProcessExecSpy).toHaveBeenCalledWith(
      'npm run type-check && npm run test',
      expect.anything(),
      expect.anything(),
    );
  });

  it('lints, checks types, and tests when NO_PRECOMMIT is truthy', () => {
    process.env.NO_PRECOMMIT = true;
    onPrePush();

    expect(childProcessExecSpy).toHaveBeenCalledWith(
      'npm run lint && npm run type-check && npm run test',
      expect.anything(),
      expect.anything(),
    );
  });

  it('sends child process output to parent', () => {
    onPrePush();

    expect(childProcessExecSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stdio: 'inherit',
      }),
      expect.anything(),
    );
  });
});
