const path = require('path');
const { getBaseConfig } = require('./config/webpack-helpers');

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
      ],
    },
  }
];

module.exports = function(env = {}) {
  return {
    ...getBaseConfig(env),
    module: {
      rules
    },
  };
};
