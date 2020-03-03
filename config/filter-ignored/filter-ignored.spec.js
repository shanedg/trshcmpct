const { createIgnoredFilter } = require('.');
const eslint = require('eslint');
const micromatch = require('micromatch');
const path = require('path');

describe('createIgnoredFilter', () => {
  describe('returns a function that', () => {
    let isIgnored;

    beforeAll(() => {
      // micromatch patterns: https://github.com/micromatch/micromatch
      const ignoredList = [
        'file.js',
        '**/file.js',
        '**/some-dir/**',
      ];
      const cliOptions = {
        ignorePath: path.join(__dirname, '.dummy-eslintignore'),
      };

      isIgnored = createIgnoredFilter(ignoredList, cliOptions);
    });

    it('ignores files included in ignored list', () => {
      expect(isIgnored('file.js')).toEqual(true);
      expect(isIgnored('any/dir/file.js')).toEqual(true);
    });

    it('ignores directories included in ignored list', () => {
      expect(isIgnored('some-dir/b.js')).toEqual(true);
      expect(isIgnored('asdf/some-dir/c.js')).toEqual(true);
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

  describe('accepts list of custom ignored patterns for micromatch', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns function that calls isMatch with list', () => {
      jest.spyOn(micromatch, 'isMatch');

      const ignoredList = [];
      const isIgnored = createIgnoredFilter(ignoredList);
      isIgnored('asdf');

      expect(micromatch.isMatch).toHaveBeenCalledWith(
        'asdf',
        ignoredList
      );
    });
  });

  describe('accepts options for CLIEngine', () => {
    beforeAll(() => {
      jest.spyOn(eslint, 'CLIEngine').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('passes options through if present', () => {
      const cliOptions = { mock: true };
      createIgnoredFilter([], cliOptions);

      expect(eslint.CLIEngine).toHaveBeenCalledWith(cliOptions);
    });

    it('defaults to an empty object', () => {
      createIgnoredFilter([]);

      expect(eslint.CLIEngine).toHaveBeenCalledWith({});
    });
  });
});
