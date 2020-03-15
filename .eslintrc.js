module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'eslint-plugin-jest',
    'eslint-plugin-react',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  root: true,
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'jest/consistent-test-it': [
      'error',
    ],
    // Warn on unused variables except underscore-prefixed arguments.
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_'
      }
    ],
  },
};
