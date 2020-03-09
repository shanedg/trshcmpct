const handleChildExit = require('./handleChildExit');

describe('child exit code helper', () => {
  let processExitSpy;

  beforeAll(() => {
    // Prevent process from exiting tests early.
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
  });

  afterEach(() => {
    processExitSpy.mockClear();
  });

  it('exits with -1 if error is not null', () => {
    handleChildExit(new Error(), null, null);
    expect(processExitSpy).toHaveBeenNthCalledWith(1, -1);
  });

  it('exits with 0 if error is null', () => {
    handleChildExit(null, null, null);
    expect(processExitSpy).toHaveBeenNthCalledWith(1, 0);
  });
});
