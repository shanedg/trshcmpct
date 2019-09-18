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
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      emitWarning: true,
    },
  },
  {
    test: /.(js|jsx|ts|tsx)$/,
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
        ['@babel/preset-typescript', {
          'allExtensions': true,
          'isTSX': true,
        }],
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
