// Custom transformer, purely to customize the location
// of the Babel configuration file.
// https://babeljs.io/docs/en/config-files#jest
// https://jestjs.io/docs/en/tutorial-react#custom-transformers
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  configFile: require.resolve('./babel.config.js'),
});
