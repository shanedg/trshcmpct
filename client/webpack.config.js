import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('missing webpack-dev-server');
        }

        // Mock successful request for authorized user data
        middlewares.push({
          name: 'mock-api-authorized',
          path: '/api/v1/authorized',
          middleware: (_request, response) => {
            response.send({
              user: {
                username: '<mocked_user_name>',
              },
            });
          }
        });
  
        return middlewares;
      },
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    entry: resolve(__dirname, './src/index.ts'),

    mode: getMode(env.production),

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          // TODO: consider replacing babel with swc
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
        extensions: ['.ts', '.tsx'],
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
      }),
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
