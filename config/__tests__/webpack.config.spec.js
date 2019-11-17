const serializer = require('jest-serializer-path');

const webpackConfig = require('../../webpack.config');

// Remove absolute paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack config', () => {
  const development = {};
  const production = { production: true };

  it('matches development snapshot', () => {
    const env = {};
    expect(webpackConfig(env)).toMatchSnapshot();
  });

  it('matches production snapshot', () => {
    const env = {
      production: true,
    };
    expect(webpackConfig(env)).toMatchSnapshot();
  });

  // ported from webpack-helpers.spec.js
  it('sets dev server options', () => {
    expect(webpackConfig(development).devServer).toStrictEqual({open: true});
  });

  it('sets entry points', () => {
    const entries = webpackConfig(development).entry;
    expect(entries).toEqual(
      expect.objectContaining({
        index: expect.any(String),
      })
    );
    const entryList = Object.keys(entries);
    expect(entryList)
      .toEqual(
        expect.arrayContaining(['index'])
      );
  });

  it('sets development mode by default', () => {
    expect(webpackConfig(development).mode)
      .toEqual('development');
  });

  it('sets production mode from environment flag', () => {
    expect(webpackConfig(production).mode)
      .toEqual('production');
  });

});
