module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },

  only: [
    '../client',
  ],

  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],

  presets: [
    [
      '@babel/preset-env', {
        modules: false,
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
