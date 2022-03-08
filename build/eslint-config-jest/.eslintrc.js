module.exports = {
  extends: [
    '@trshcmpctr/eslint-config',
    'plugin:node/recommended',
  ],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['*.test.js'],
      // It lints itself :)
      extends: ['./lib/eslint-config-jest.js'],
    },
  ],
};