const ignoredFilter = require('.');
const path = require('path');

describe('filter-ignored', () => {
  const testCLIOptions = {
    ignorePath: path.join(__dirname, '__fixtures__', '.dummy-eslintignore'),
    useEslintrc: false
  };

  describe('ignoredFilter', () => {
    it('ignores default files from ESLint', async () => {
      // ESLint ignores dot files by default...
      expect(await ignoredFilter(['.huskyrc.js'], testCLIOptions)).toEqual([]);
      // ...except for .eslintrc.js as of v7.x.x.
      expect(await ignoredFilter(['.eslintrc.js'], testCLIOptions)).toEqual(['.eslintrc.js']);
    });

    it('ignores files included in the project .eslintignore', async () => {
      expect(await ignoredFilter(['ignored-example.js'], testCLIOptions)).toEqual([]);
    });

    it('ignores directories included in .eslintignore', async () => {
      expect(await ignoredFilter(['dist/a.js'], testCLIOptions)).toEqual([]);
      expect(await ignoredFilter(['anywhere/in/project/dist/b.js'], testCLIOptions)).toEqual([]);
    });

    it('does not ignore other files', async () => {
      expect(await ignoredFilter(['not-ignored.js'], testCLIOptions)).toEqual(['not-ignored.js']);
      expect(await ignoredFilter(['another-file.js'], testCLIOptions)).toEqual(['another-file.js']);
      expect(await ignoredFilter(['anywhere/in/project.js'], testCLIOptions)).toEqual(['anywhere/in/project.js']);
    });
  });
});
