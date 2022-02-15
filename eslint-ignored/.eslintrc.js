module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,

  overrides: [
    // Tests
    {
      files: ['*.test.js'],
      extends: ['@trshcmpctr/eslint-config-jest'],
    },
  ],
};
