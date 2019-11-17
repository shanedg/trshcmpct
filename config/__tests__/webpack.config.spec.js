const serializer = require('jest-serializer-path');

const webpackConfig = require('../../webpack.config');

// Remove absolute paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack config', () => {

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

});
