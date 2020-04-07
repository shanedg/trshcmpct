const createIgnoredFilter = require('.');
const path = require('path');

describe('createIgnoredFilter', () => {
  const testCLIOptions = {
    ignorePath: path.join(__dirname, '__fixtures__', '.dummy-eslintignore'),
    useEslintrc: false
  };

  describe('returns a function that', () => {
    let notIgnored;

    beforeAll(() => {
      notIgnored = createIgnoredFilter(testCLIOptions);
    });

    it('ignores default files from ESLint CLI engine', () => {
      expect(notIgnored(['.eslintrc.js'])).toEqual([]);
      expect(notIgnored(['.huskyrc.js'])).toEqual([]);
    });

    it('ignores files included in the project .eslintignore', () => {
      expect(notIgnored(['ignored-example.js'])).toEqual([]);
    });

    it('ignores directories included in .eslintignore', () => {
      expect(notIgnored(['dist/a.js'])).toEqual([]);
      expect(notIgnored(['anywhere/in/project/dist/b.js'])).toEqual([]);
    });

    it('does not ignore other files', () => {
      expect(notIgnored(['not-ignored.js'])).toEqual(['not-ignored.js']);
      expect(notIgnored(['another-file.js'])).toEqual(['another-file.js']);
      expect(notIgnored(['anywhere/in/project.js'])).toEqual(['anywhere/in/project.js']);
    });
  });
});
