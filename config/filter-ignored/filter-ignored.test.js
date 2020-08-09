const { createIgnoredFilter, ignoredFilter } = require('.');
const eslint = require('eslint');

describe('ignoredFilter', () => {
  const testESLintOptions = { useEslintrc: false };
  let eslintSpy;

  beforeEach(() => {
    eslintSpy = jest.spyOn(eslint, 'ESLint').mockImplementationOnce(jest.fn());
  });

  afterEach(() => {
    eslintSpy.mockClear();
  });

  it('passes options through to ESLint', async () => {
    await ignoredFilter([], testESLintOptions);
    expect(eslintSpy).toHaveBeenCalledWith({
      useEslintrc: false,
    });
    expect(eslintSpy).toBeCalledTimes(1);
  });

  it('passes an empty object by default', async () => {
    await ignoredFilter([]);
    expect(eslintSpy).toHaveBeenCalledWith({});
    expect(eslintSpy).toBeCalledTimes(1);
  });
});

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
