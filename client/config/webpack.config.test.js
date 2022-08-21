import serializer from 'jest-serializer-path';

// Note, we export an array of configuration objects
import webpackConfig from './webpack.config';

// Remove absolute file paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack', () => {
  const developmentEnvironment = {};

  webpackConfig(developmentEnvironment).forEach((config, index) => {
    Object.freeze(config);

    describe(`${index} - ${config.name} development config`, () => {
      it('matches snapshot', () => {
        expect(config).toMatchSnapshot();
      });
  
      it('sets development mode', () => {
        expect(config.mode).toEqual('development');
      });
  
      it('turns off minimize optimization', () => {
        expect(config.optimization).toHaveProperty('minimize', false);
      });
    });
  });

  const productionEnvironment = { production: true };
  webpackConfig(productionEnvironment).forEach((config, index) => {
    Object.freeze(config);

    describe(`${index} - ${config.name} production config`, () => {
      it('matches snapshot', () => {
        expect(config).toMatchSnapshot();
      });
  
      it('sets production mode', () => {
        expect(config.mode).toEqual('production');
      });
  
      it('turns on minimize optimization', () => {
        expect(config.optimization).toHaveProperty('minimize', true);
      });
    });
  });
});
