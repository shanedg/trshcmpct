module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },

  only: [
    '../src',
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
