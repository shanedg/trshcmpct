const { handleChildExit } = require('../lib/helpers');

describe('child exit code helper', () => {
  // Mock process.exit() to keep from terminating our tests early.
  let mockProcessExitSpy;

  beforeEach(() => {
    // Setup mocked process.exit spy.
    mockProcessExitSpy = jest.spyOn(process, 'exit')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    // Isolate process.exit spy for each test.
    mockProcessExitSpy.mockRestore();
  });

  it('exits with -1 if error is not null', () => {
    handleChildExit(new Error(), null, null);

    expect(mockProcessExitSpy).toHaveBeenCalledWith(-1);
  });

  it('exits with 0 if error is null', () => {
    handleChildExit(null, null, null);

    expect(mockProcessExitSpy).toHaveBeenCalledWith(0);
  });
});
