const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const serializer = require('jest-serializer-path');
const webpack = require('webpack');

const webpackConfig = require('../webpack.config');

// Remove absolute paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack', () => {
  const developmentEnvironment = {};
  const productionEnvironment = { production: true };
  let developmentConfig;
  let productionConfig;

  describe('common config', () => {

    beforeAll(() => {
      developmentConfig = webpackConfig(developmentEnvironment);
      productionConfig = webpackConfig(productionEnvironment);
      Object.freeze(developmentConfig);
      Object.freeze(productionConfig);
    });

    it('sets entry points', () => {
      expect(developmentConfig.entry).toHaveProperty('index', path.resolve(__dirname, '../../src/index.ts'));
      expect(productionConfig.entry).toStrictEqual(developmentConfig.entry);
    });

    it('sets output', () => {
      expect(developmentConfig.output).toHaveProperty('filename', '[name].[chunkhash].js');
      expect(developmentConfig.output).toHaveProperty('path', path.resolve(__dirname, '../../dist'));
      expect(productionConfig.output).toStrictEqual(developmentConfig.output);
    });

    describe('module', () => {

      it('sets rules', () => {
        expect(developmentConfig.module).toHaveProperty('rules', expect.any(Array));
        expect(productionConfig.module).toHaveProperty('rules', expect.any(Array));
      });

      it('enforces loading source with eslint-loader first', () => {
        expect(developmentConfig.module.rules.find(rule => rule.loader === 'eslint-loader')).toHaveProperty('enforce', 'pre');
        expect(productionConfig.module.rules.find(rule => rule.loader === 'eslint-loader')).toHaveProperty('enforce', 'pre');
      });

      it('transpiles source with babel-loader', () => {
        expect(developmentConfig.module.rules.find(rule => rule.loader === 'babel-loader')).toBeTruthy();
        expect(productionConfig.module.rules.find(rule => rule.loader === 'babel-loader')).toBeTruthy();
      });

      it('excludes node_modules from all loaders', () => {
        const loadersExcludeNodeModules = (previousRuleOrResult, currentRule) => {
          return (
            (previousRuleOrResult === true || previousRuleOrResult.exclude.toString() === '/node_modules/') &&
            currentRule.exclude.toString() === '/node_modules/'
          );
        };

        expect(developmentConfig.module.rules.reduce(loadersExcludeNodeModules)).toBeTruthy();
        expect(productionConfig.module.rules.reduce(loadersExcludeNodeModules)).toBeTruthy();
      });

    });

    it('sets optimizations', () => {
      expect(developmentConfig.optimization).toHaveProperty('splitChunks', expect.any(Object));
      expect(productionConfig.optimization).toHaveProperty('splitChunks', expect.any(Object));
    });

    it('sets plugins', () => {
      expect(developmentConfig.plugins).toMatchObject([
        expect.any(CleanWebpackPlugin),
        expect.any(Function), // ProgressBarPlugin, anonymous function signature
        expect.any(webpack.DefinePlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
      // Can't use deep-equality checks around plugins since they're unique class instances so repeat same assertion against productionConfig.
      // Otherwise, toEqual/toStrictEqual comparisons fail with "Received: serializes to the same string".
      expect(productionConfig.plugins).toMatchObject([
        expect.any(CleanWebpackPlugin),
        expect.any(Function), // ProgressBarPlugin
        expect.any(webpack.DefinePlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
    });

    it('sets dev server options', () => {
      expect(developmentConfig.devServer).toHaveProperty('open', true);
      expect(productionConfig.devServer).toStrictEqual(developmentConfig.devServer);
    });

  });

  describe('development config', () => {

    beforeAll(() => {
      developmentConfig = webpackConfig(developmentEnvironment);
      Object.freeze(developmentConfig);
    });

    it('matches snapshot', () => {
      expect(developmentConfig).toMatchSnapshot();
    });

    it('sets development mode', () => {
      expect(developmentConfig.mode).toEqual('development');
    });

    it('turns off minimize optimization', () => {
      expect(developmentConfig.optimization).toHaveProperty('minimize', false);
    });

    it('DefinePlugin sets __DEV__ to "true"', () => {
      expect(developmentConfig.plugins.find(p => p instanceof webpack.DefinePlugin))
        .toHaveProperty('definitions.__DEV__', 'true');
    });

  });

  describe('production config', () => {

    beforeAll(() => {
      productionConfig = webpackConfig(productionEnvironment);
      Object.freeze(productionConfig);
    });

    it('matches snapshot', () => {
      expect(productionConfig).toMatchSnapshot();
    });

    it('sets production mode', () => {
      expect(productionConfig.mode).toEqual('production');
    });

    it('turns on minimize optimization', () => {
      expect(productionConfig.optimization).toHaveProperty('minimize', true);
    });

    it('DefinePlugin set __DEV__ to "false"', () => {
      expect(productionConfig.plugins.find(p => p instanceof webpack.DefinePlugin))
        .toHaveProperty('definitions.__DEV__', 'false');
    });

  });

});
