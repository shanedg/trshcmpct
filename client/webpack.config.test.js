import serializer from 'jest-serializer-path';

import webpackConfig, { sortDevelopmentEntryFirst} from './webpack.config';

// Remove absolute file paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack', () => {
  describe('development config', () => {
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

    it('adds development entry point', () => {
      expect(developmentConfig.entry.development).toBeTruthy();
      expect(developmentConfig.entry.index.dependOn).toBe('development');
    });
  });

  describe('production config', () => {
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

    it('does not add development entry point', () => {
      expect(productionConfig.entry.development).toBeUndefined();
      expect(productionConfig.entry.index.dependOn).toBeUndefined();
    });
  });

  describe('sortDevelopmentEntryFirst', () => {
    it('always orders development entry point first', () => {
      expect(['index', 'development'].sort(sortDevelopmentEntryFirst)).toEqual(['development', 'index']);
      expect(['development', 'index'].sort(sortDevelopmentEntryFirst)).toEqual(['development', 'index']);
    });

    it('does not do any other sorting', () => {
      expect(['index'].sort(sortDevelopmentEntryFirst)).toEqual(['index']);
      expect(['a', 'c', 'b'].sort(sortDevelopmentEntryFirst)).toEqual(['a', 'c', 'b']);
    });
  });
});
