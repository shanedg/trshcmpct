const webpackConfig = require('../webpack.config');

/**
 * Webpack config snapshot testing.
 */

describe('webpack config', () => {

  test('matches snapshot', () => {
    expect(JSON.stringify(webpackConfig)).toMatchSnapshot();
  });

});
