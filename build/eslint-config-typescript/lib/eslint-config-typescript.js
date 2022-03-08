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
    // For TypeScript compatibility with eslint-plugin-import
    // Extending this plugin also sets parserOptions.sourceType = 'module'.
    'plugin:import/typescript',
  ],

  parser: '@typescript-eslint/parser',

  settings: {
    // eslint-import-resolver-typescript
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      }
    }
  },

  plugins: ['@typescript-eslint/eslint-plugin'],

  rules: {
    // Turn off rules that TypeScript already enforces as part of type checking.
    // See https://typescript-eslint.io/docs/linting/troubleshooting/#eslint-plugin-import.
    'import/default': ['off'],
    'import/named': ['off'],
    'import/namespace': ['off'],
    'import/no-named-as-default-member': ['off'],
  }
};
