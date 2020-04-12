const lintStagedConfig = require('../lint-staged.config');

const lintStagedFilter = lintStagedConfig['*.{js,jsx,ts,tsx}'];

describe('lintStagedConfig', () => {
  it('ignores default files from ESLint CLI engine', () => {
    expect(lintStagedFilter(['.eslintrc.js'])).not.toMatch('.eslintrc.js');
    expect(lintStagedFilter(['.huskyrc.js'])).not.toMatch('.huskyrc.js');
  });

  it('ignores directories included in .eslintignore', () => {
    expect(lintStagedFilter(['dist/a.js'])).not.toMatch('dist/a.js');
    expect(lintStagedFilter(['anywhere/in/project/dist/b.js'])).not.toMatch('anywhere/in/project/dist/b.js');
  });

  it('does not ignore other files', () => {
    expect(lintStagedFilter(['not-ignored.js'])).toMatch('not-ignored.js');
    expect(lintStagedFilter(['another-file.js'])).toMatch('another-file.js');
    expect(lintStagedFilter(['anywhere/in/project.js'])).toMatch('anywhere/in/project.js');
  });

  it('creates ESLint task', () => {
    expect(lintStagedFilter(['some-file.js'])).toMatch('\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/');
  });
});
