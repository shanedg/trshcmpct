/**
 * ESLint config for TypeScript in JavaScript projects.
 */
module.exports = {
  extends: [
    // To see what rules are in the recommended set: https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    // There is a performance cost for rules applied by recommended-requiring-type-checking.
    // The folks behind `@typescript-eslint` suggest it's worth it: https://typescript-eslint.io/docs/linting/type-linting/#how-is-performance
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint/eslint-plugin'],
};
