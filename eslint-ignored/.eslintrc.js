module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,

  overrides: [
    // Tests
    {
      files: ['*.test.js'],
      extends: ['plugin:jest/recommended'],
      plugins: ['eslint-plugin-jest'],
      rules: {
        'jest/consistent-test-it': ['error'],
      },
    },
  ],
};
