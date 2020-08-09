const lintStagedConfig = require('../lint-staged.config');

const lintStagedFilter = lintStagedConfig['*.{js,jsx,ts,tsx}'];

describe('lintStagedConfig', () => {
  it('ignores default files from ESLint', async () => {
    // ESLint ignores dot files by default...
    expect(await lintStagedFilter(['.huskyrc.js'])).not.toMatch('.huskyrc.js');
    // ...except for .eslintrc.js as of v7.x.x.
    expect(await lintStagedFilter(['.eslintrc.js'])).toMatch('.eslintrc.js');
  });

  it('ignores directories included in .eslintignore', async () => {
    expect(await lintStagedFilter(['dist/a.js'])).not.toMatch('dist/a.js');
    expect(await lintStagedFilter(['anywhere/in/project/dist/b.js'])).not.toMatch('anywhere/in/project/dist/b.js');
  });

  it('does not ignore other files', async () => {
    expect(await lintStagedFilter(['not-ignored.js'])).toMatch('not-ignored.js');
    expect(await lintStagedFilter(['another-file.js'])).toMatch('another-file.js');
    expect(await lintStagedFilter(['anywhere/in/project.js'])).toMatch('anywhere/in/project.js');
  });

  it('creates ESLint task', async () => {
    expect(await lintStagedFilter(['some-file.js'])).toMatch('\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/');
  });
});
