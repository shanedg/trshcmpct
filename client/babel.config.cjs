// This file has to remain CommonJs until babel-jest supports .mjs
// https://stackoverflow.com/a/63216984
// https://github.com/facebook/jest/issues/9430
module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },

  only: [
    './src',
  ],

  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],

  presets: [
    [
      '@babel/preset-env', {
        corejs: 3,
        useBuiltIns: 'usage',
      }
    ],
    '@babel/preset-react',
    [
      '@babel/preset-typescript', {
        allExtensions: true,
        isTSX: true,
      }
    ],
  ],
};
