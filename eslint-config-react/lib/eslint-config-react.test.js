const eslint = require('eslint');

const ESLint = eslint.ESLint;

describe('eslint-config', () => {
  let eslintApi;

  beforeAll(() => {
    eslintApi = new ESLint({
      overrideConfigFile: 'lib/eslint-config-react.js',
      useEslintrc: false,
    });
  });

  describe('calculated config snapshots', () => {
    let config;

    beforeAll(async () => {
      // This file doesn't actually have to exist and the path doesn't matter
      // since we override the config file and useEslintrc is false.
      config = await eslintApi.calculateConfigForFile('SomeComponent.jsx');
    });

    it('parserOptions', () => {
      expect(config.parserOptions).toMatchSnapshot();
    });

    it('rules', () => {
      expect(config.rules).toMatchSnapshot();
    });
  });

});
