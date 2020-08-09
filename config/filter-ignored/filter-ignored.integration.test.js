const { createIgnoredFilter, ignoredFilter } = require('.');
const path = require('path');

describe('filter-ignored', () => {
  const testCLIOptions = {
    ignorePath: path.join(__dirname, '__fixtures__', '.dummy-eslintignore'),
    useEslintrc: false
  };

  describe('ignoredFilter', () => {
    it('ignores default files from ESLint', async () => {
      // ESLint ignores dot files by default.
      // (Except for .eslintrc as of v7.x.x)
      expect(await ignoredFilter(['.huskyrc.js'], testCLIOptions)).toEqual([]);
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

  describe('createIgnoredFilter', () => {
    let notIgnored;

    beforeAll(() => {
      notIgnored = createIgnoredFilter(testCLIOptions);
    });

    it('ignores default files from ESLint CLI engine', () => {
      // ESLint ignores dot files by default.
      expect(notIgnored(['.huskyrc.js'])).toEqual([]);
      // ESLint no longer ignores .eslintrc files by default in v7.
      expect(notIgnored(['.eslintrc.js'])).toEqual(['.eslintrc.js']);
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
