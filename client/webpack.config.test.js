import serializer from 'jest-serializer-path';

import webpackConfig from './webpack.config';

// Remove absolute file paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpackConfig', () => {
  describe('development mode', () => {
    const developmentEnvironment = {};
    const developmentConfig = webpackConfig(developmentEnvironment);
    Object.freeze(developmentConfig);

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

  describe('production mode', () => {
    const productionEnvironment = { production: true };
    const productionConfig = webpackConfig(productionEnvironment);
    Object.freeze(productionConfig);

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
