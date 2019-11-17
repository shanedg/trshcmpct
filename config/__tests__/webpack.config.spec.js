const serializer = require('jest-serializer-path');

const webpackConfig = require('../../webpack.config');

// Remove absolute paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack config', () => {

  it('matches development snapshot', () => {
    const env = {};
    expect(JSON.stringify(webpackConfig(env), null, 4)).toMatchSnapshot();
  });

  it('matches production snapshot', () => {
    const env = {
      production: true,
    };
    expect(JSON.stringify(webpackConfig(env), null, 4)).toMatchSnapshot();
  });

});
