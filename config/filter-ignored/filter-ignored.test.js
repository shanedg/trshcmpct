const { ignoredFilter } = require('.');
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
