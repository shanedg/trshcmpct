module.exports = {
  extends: [
    '@trshcmpctr/eslint-config',
    'plugin:node/recommended',
  ],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['lib/**'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    {
      files: ['*.test.js'],
      extends: ['@trshcmpctr/eslint-config-jest'],
    },
  ],
};
