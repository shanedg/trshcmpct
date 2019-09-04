const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Get dev server config
 */
function getDevServer() {
  return {
    open: true,
  };
}

/**
 * Get build entry point/s
 */
function getEntries() {
  return {
    index: './src/index.js',
  };
}

/**
 * Get build mode
 * @param env Environment
 */
function getMode(env) {
  return env.production
    ? 'production'
    : 'development';
}

/**
 * Get build output file/s
 */
function getOutput() {
  return {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
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

module.exports = {
  getDevServer,
  getEntries,
  getMode,
  getOutput,
  getPlugins,
  getSplitChunks,
};
