const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Get build mode
 * @param {*} env Environment
 */
function getMode(env) {
  return env.production
    ? 'production'
    : 'development';
}

/**
 * Get build entry point/s
 */
function getEntries() {
  return {
    index: './src/index.js',
    'other-index': './src/other-index.js',
  };
}

/**
 * Get build output file/s
 */
function getOutput() {
  return {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  };
}

/**
 * Get build plugins
 */
function getPlugins() {
  return [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin(),
  ];
}

/**
 * Get splitChunksPlugin
 */
function getSplitChunks() {
  return {
    cacheGroups: {
      vendors: {
        priority: -10,
        test: /[\\/]node_modules[\\/]/
      }
    },

    chunks: 'async',
    minChunks: 1,
    minSize: 30000,
    name: true
  };
}

/**
 * Get module rules
 */
function getModuleRules() {
  return [
    {
      test: /.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader',

      options: {
        plugins: [
          'syntax-dynamic-import',
        ],

        presets: [
          ['@babel/preset-env', {
            'modules': false
          }],
        ],
      },
    }
  ];
}

/**
 * Get dev server config
 */
function getDevServer() {
  return {
    open: true,
  };
}

/**
 * Generate build config
 * @param {*} env Environment
 */
function getBaseConfig(env) {
  return {
    mode: getMode(env),

    entry: getEntries(),

    output: getOutput(),

    plugins: getPlugins(),

    module: {
      rules: getModuleRules(),
    },

    optimization: {
      splitChunks: getSplitChunks(),
    },

    devServer: getDevServer(),
  };
}

module.exports = function(env = {}) {
  return getBaseConfig(env);
};
