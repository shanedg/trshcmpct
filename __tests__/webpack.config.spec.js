const webpackConfig = require('../webpack.config');

/**
 * Webpack config snapshot testing.
 */

describe('webpack config', () => {

  test('matches development snapshot', () => {
    const env = {};
    expect(JSON.stringify(webpackConfig(env), null, 4)).toMatchSnapshot();
  });

  test('matches production snapshot', () => {
    const env = {
      production: true,
    };
    expect(JSON.stringify(webpackConfig(env), null, 4)).toMatchSnapshot();
  });

});
