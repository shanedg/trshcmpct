const eslint = require('eslint');

const ESLint = eslint.ESLint;

describe('eslint-config', () => {
  let eslintApi;

  beforeAll(() => {
    eslintApi = new ESLint({
      overrideConfigFile: 'lib/eslint-config-jest.js',
      useEslintrc: false,
    });
  });

  describe('calculated config snapshots', () => {
    let config;

    beforeAll(async () => {
      // This file doesn't actually have to exist and the path doesn't matter
      // since we override the config file and useEslintrc is false.
      config = await eslintApi.calculateConfigForFile('anyFile.js');
    });

    it('env', () => {
      expect(config.env).toMatchSnapshot();
    });

    it('rules', () => {
      expect(config.rules).toMatchSnapshot();
    });
  });

});
