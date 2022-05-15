const path = require('node:path');

const { filter } = require('./eslint-ignored');

const eslintTestOptions = {
  ignorePath: path.join(__dirname, '__fixtures__', '.dummy-eslintignore'),
  useEslintrc: false
};

const filterWithOptions = files => filter(files, eslintTestOptions);

describe('eslint-ignored#filter', () => {
  it('respects default ignores from ESLint', async () => {
    const ignoredDotFiles = ['.huskyrc.js'];
    const dotFileExceptions = ['.eslintrc.js'];
    expect(await filterWithOptions(ignoredDotFiles)).toEqual([]);
    expect(await filterWithOptions(dotFileExceptions)).toEqual(dotFileExceptions);
  });

  it('ignores files included in the project .eslintignore', async () => {
    expect(await filterWithOptions(['ignored-example.js'])).toEqual([]);
    expect(await filterWithOptions([
      'dist/a.js',
      'anywhere/in/project/dist/b.js'
    ])).toEqual([]);
  });

  it('does not ignore other files', async () => {
    const notIgnored = [
      'not-ignored.js',
      'another-file.js',
      'anywhere/in/project.js',
    ];
    expect(await filterWithOptions(notIgnored)).toEqual(notIgnored);
  });
});
