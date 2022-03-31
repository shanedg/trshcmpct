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
      extends: ['@trshcmpctr/eslint-config-jest'],
    },
  ],
};
