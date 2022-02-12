module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  root: true,
  rules: {
    indent: [
      'warn',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'warn',
      'single'
    ],
    semi: [
      'warn',
      'always'
    ],
    // Warn on unused variables except underscore-prefixed arguments.
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_'
      }
    ],
  },
  
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
