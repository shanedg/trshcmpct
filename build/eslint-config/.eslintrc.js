module.exports = {
  extends: [
    // It lints itself :)
    './lib/eslint-config.js',
    'plugin:node/recommended',
  ],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['*.test.js'],
      extends: ['@trshcmpctr/eslint-config-jest'],
    },
  ],
};
