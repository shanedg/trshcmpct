const path = require('path');
const {
  getDevServer,
  getEntries,
  getMode,
  getOutput,
  getPlugins,
  getSplitChunks,
} = require('./config/webpack-helpers');

const rules = [
  {
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      emitWarning: true,
    },
  },
  {
    test: /.(js|jsx)$/,
    include: [
      path.resolve(__dirname, './src'),
    ],
    loader: 'babel-loader',
    options: {
      plugins: [
        'syntax-dynamic-import',
      ],
      presets: [
        ['@babel/preset-env', {
          'modules': false,
        }],
        '@babel/preset-react',
      ],
    },
  }
];

module.exports = function(env = {}) {
  return {
    mode: getMode(env),

    entry: getEntries(),

    output: getOutput(),

    module: {
      rules
    },

    optimization: {
      splitChunks: getSplitChunks(),
    },

    plugins: getPlugins(),

    devServer: getDevServer(),

  };
};
