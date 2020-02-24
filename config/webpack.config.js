const chalk = require('chalk');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

// Config env and argv:
// https://webpack.js.org/configuration/configuration-types/#exporting-a-function
// https://webpack.js.org/api/cli/#environment-options
// https://webpack.js.org/guides/environment-variables/
module.exports = (env = {}, argv = {}) => {
  const debug = argv.debug;
  const mode = env.production ? 'production' : 'development';
  const isProduction = mode === 'production';

  return {
    mode,

    entry: {
      index: path.resolve(__dirname, '../src/index.ts'),
    },

    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, '../dist'),
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            cache: true,
            // Development only
            emitWarning: !isProduction,
            // Production only
            emitError: isProduction,
            failOnError: isProduction,
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, './babel.config.js'),
          },
        }
      ]
    },

    resolve: {
      extensions: [
        // Defaults
        '.wasm',
        '.mjs',
        '.js',
        '.json',
        // React
        '.jsx',
        // Typescript
        '.ts',
        '.tsx',
      ],
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        // Terser is minimizer by default? but we can customize?
        new TerserPlugin({
          // https://webpack.js.org/plugins/terser-webpack-plugin/#terseroptions
          terserOptions: {
            warnings: debug ? 'verbose' : false,
          },
        })
      ],

      splitChunks: {
        cacheGroups: {
          vendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/
          }
        },
        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
        name: true,
      },
    },

    plugins: [
      new CleanWebpackPlugin(),
      new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(env.production ? false : true),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src/index.html'),
        title: 'trshcmpctr',
      }),
    ],

    devServer: {
      open: true,
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
