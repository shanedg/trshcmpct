const createIgnoredFilter = require('.');
const eslint = require('eslint');

describe('createIgnoredFilter', () => {
  const testCLIOptions = { useEslintrc: false };

  describe('accepts options for CLIEngine', () => {
    let cliEngineSpy;

    beforeAll(() => {
      cliEngineSpy = jest.spyOn(eslint, 'CLIEngine').mockImplementation(jest.fn());
    });

    afterEach(() => {
      cliEngineSpy.mockClear();
    });

    it('passes options through if present', () => {
      createIgnoredFilter(testCLIOptions);
      expect(cliEngineSpy).toHaveBeenCalledWith(testCLIOptions);
    });

    it('defaults to an empty object', () => {
      createIgnoredFilter();
      expect(cliEngineSpy).toHaveBeenCalledWith({});
    });
  });
});
