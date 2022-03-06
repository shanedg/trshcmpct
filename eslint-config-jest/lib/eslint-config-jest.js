/**
 * ESLint config for Jest tests in JavaScript projects.
 */
module.exports = {
  // To see what rules are in the recommended set: https://www.npmjs.com/package/eslint-plugin-jest
  extends: ['plugin:jest/recommended'],

  plugins: [
    'eslint-plugin-jest',
  ],

  // Only include rules that will make sense in both Node and browser environments.
  rules: {
    'jest/consistent-test-it': ['error'],
  },
};
