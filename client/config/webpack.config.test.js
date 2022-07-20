const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const serializer = require('jest-serializer-path');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');

// Remove absolute file paths from snapshots.
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

    it('sets plugins', () => {
      expect(developmentConfig.plugins).toMatchObject([
        expect.any(ESLintWebpackPlugin),
        expect.any(webpack.DefinePlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
      expect(productionConfig.plugins).toMatchObject([
        expect.any(ESLintWebpackPlugin),
        expect.any(webpack.DefinePlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
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
