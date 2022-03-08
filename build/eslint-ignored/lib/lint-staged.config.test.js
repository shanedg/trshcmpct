const lintStagedConfig = require('./lint-staged.config');

const getLintStagedCommand = lintStagedConfig['*.{js,jsx,ts,tsx}'];

describe('lint-staged.config.js', () => {
  it('respects default ignores from ESLint', async () => {
    const command = await getLintStagedCommand([
      '.huskyrc.js',
      '.eslintrc.js',
    ]);
    expect(command).not.toMatch('.huskyrc.js');
    expect(command).toMatch('.eslintrc.js');
  });

  it('creates ESLint task', async () => {
    expect(await getLintStagedCommand(['some-file.js'])).toMatch('\
--max-warnings 0 \
--fix \
--cache \
--cache-location node_modules/.cache/eslint-cache/');
  });
});
