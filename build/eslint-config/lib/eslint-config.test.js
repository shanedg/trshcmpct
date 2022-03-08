const eslint = require('eslint');

const ESLint = eslint.ESLint;

describe('eslint-config', () => {
  let eslintApi;

  beforeAll(() => {
    eslintApi = new ESLint({
      overrideConfigFile: 'lib/eslint-config.js',
      useEslintrc: false,
    });
  });

  /**
   * Snapshots can be a pain but default configuration options might change in
   * newer versions of eslint or other libraries we extend.
   * 
   * I just want to know if it happens.
   */
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

    it('parserOptions', () => {
      expect(config.parserOptions).toMatchSnapshot();
    });

    it('rules', () => {
      expect(config.rules).toMatchSnapshot();
    });
  });

  /**
   * Tests in the following blocks should exercise overridden rules.
   * 
   * The point is not to test every rule,
   * just the ones with interesting exceptions.
   * 
   * The libraries we extend should have tests for their own rules.
   * This is more about validating expectations for customized rule options.
   */
  describe('no-unused-vars', () => {
    let results,
      rulesResult;

    beforeAll(async () => {
      results = await eslintApi.lintFiles('lib/__fixtures__/no-unused-vars.js');
      rulesResult = results[0];
    });

    // Tests in this block expect that only 1 file is included in lint results.
    it('tests only lint 1 fixture file', () => {
      expect(results.length).toBe(1);
    });

    // Increment either errors or warnings as new rules are added.
    it('finds 0 errors', () => {
      expect(rulesResult.errorCount).toMatchInlineSnapshot(`0`);
    });

    it('finds 2 warnings', () => {
      expect(rulesResult.warningCount).toMatchInlineSnapshot(`2`);
    });

    it('reports expected messages', () => {
      const noUnusedVarsMessages = rulesResult.messages.filter(message => message.ruleId === 'no-unused-vars');
      expect(noUnusedVarsMessages).toContainEqual(expect.objectContaining({
        message: "'unusedVariable' is assigned a value but never used."
      }));
      expect(noUnusedVarsMessages).toContainEqual(expect.objectContaining({
        message: "'unusedArgument' is defined but never used. Allowed unused args must match /^_/u."
      }));
    });
  });

});
