import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Helper for configuring build entries
 * @param {boolean} isProduction 
 * @returns Build entries
 */
const getEntries = (isProduction) => {
  const entries = {
    index: {
      import: resolve(__dirname, './src/index.ts'),
    },
  };

  // in development, we load an additional entry point to bypass clickjack defenses
  if (!isProduction) {
    entries.development = resolve(__dirname, './src/development.ts');
    entries.index.dependOn = 'development';
  }

  return entries;
};

/**
 * Custom sort function that always orders the development entry first (if present)
 * @param {string} chunkA
 * @param {string} chunkB 
 * @returns {-1 | 1 | 0} Relative sorting value
 */
export const sortDevelopmentEntryFirst = (chunkA, chunkB) => {
  if (chunkA === 'development') {
    return -1;
  }
  if (chunkB === 'development') {
    return 1;
  }
  return 0;
};

/**
 * Helper for setting the build mode
 * @param {boolean} productionFlag 
 * @returns {'production' | 'development'} Build mode
 */
const getMode = productionFlag => productionFlag ? 'production' : 'development';

// Config env and argv:
// https://webpack.js.org/configuration/configuration-types/#exporting-a-function
// https://webpack.js.org/api/cli/#environment-options
// https://webpack.js.org/guides/environment-variables/
export default (env = {}, argv = {}) => {
  const isProduction = getMode(env.production) === 'production';

  return {
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    entry: getEntries(isProduction),

    mode: getMode(env.production),

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            configFile: resolve(__dirname, 'babel.config.cjs'),
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ]
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
          defaultVendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/
          }
        },
        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
      },
    },

    output: {
      clean: true,
      filename: '[name].[chunkhash].js',
      path: resolve(__dirname, './dist'),
    },

    plugins: [
      new ESLintPlugin({
        cache: true,
        cacheLocation: 'node_modules/.cache/eslint-cache/',
        emitError: isProduction,
        emitWarning: !isProduction,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        failOnError: isProduction,
        lintDirtyModulesOnly: !!argv.watch,
        reportUnusedDisableDirectives: !isProduction ? 'warn' : null,
      }),
      new WebpackManifestPlugin({
        // Issue with `publicPath: 'auto'` prepending manifest URLs with 'auto/':
        // https://github.com/jantimon/html-webpack-plugin/issues/1514
        // Supposedly fixed but still needs this workaround
        publicPath: ''
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, './src/index.html'),
        title: 'trshcmpctr',
        // ensure that development entry is always injected first
        chunksSortMode: sortDevelopmentEntryFirst,
      }),
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
