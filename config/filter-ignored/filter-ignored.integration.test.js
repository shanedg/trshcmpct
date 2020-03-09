const createIgnoredFilter = require('.');
const path = require('path');

describe('createIgnoredFilter', () => {
  const testCLIOptions = {
    ignorePath: path.join(__dirname, '__fixtures__', '.dummy-eslintignore'),
    useEslintrc: false
  };

  describe('returns a function that', () => {
    let isIgnored;

    beforeAll(() => {
      isIgnored = createIgnoredFilter(testCLIOptions);
    });

    it('ignores default files from ESLint CLI engine', () => {
      expect(isIgnored('.eslintrc.js')).toEqual(true);
      expect(isIgnored('.huskyrc.js')).toEqual(true);
    });

    it('ignores files included in the project .eslintignore', () => {
      expect(isIgnored('ignored-example.js')).toEqual(true);
    });

    it('ignores directories included in the project .eslintignore', () => {
      expect(isIgnored('dist/a.js')).toEqual(true);
      expect(isIgnored('anywhere/in/project/dist/b.js')).toEqual(true);
    });

    it('does not ignore other files', () => {
      expect(isIgnored('not-ignored.js')).toEqual(false);
      expect(isIgnored('another-file.js')).toEqual(false);
      expect(isIgnored('anywhere/in/project.js')).toEqual(false);
    });
  });
});
