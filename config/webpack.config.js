const chalk = require('chalk');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const getMode = productionFlag => productionFlag ? 'production' : 'development';

// Config env and argv:
// https://webpack.js.org/configuration/configuration-types/#exporting-a-function
// https://webpack.js.org/api/cli/#environment-options
// https://webpack.js.org/guides/environment-variables/
module.exports = (env = {}, argv = {}) => {
  const isProduction = getMode(env.production) === 'production';
  const isWatching = argv.watch;

  return {
    mode: getMode(env.production),

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
            warnings: argv.debug ? 'verbose' : false,
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
      new ESLintPlugin({
        cache: true,
        cacheLocation: 'node_modules/.cache/eslint-cache/',
        emitError: isProduction,
        emitWarning: !isProduction,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        failOnError: isProduction,
        lintDirtyModulesOnly: !!isWatching,
        reportUnusedDisableDirectives: !isProduction,
      }),
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
