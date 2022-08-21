import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import serializer from 'jest-serializer-path';

import webpackConfig from './webpack.config';

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
        expect.any(HtmlWebpackPlugin),
      ]);
      expect(productionConfig.plugins).toMatchObject([
        expect.any(ESLintWebpackPlugin),
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
  });
});
