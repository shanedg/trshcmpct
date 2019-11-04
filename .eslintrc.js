const OFF = 0;
const WARN = 1;
const ERROR = 2;

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
      ERROR,
      2
    ],
    'linebreak-style': [
      ERROR,
      'unix'
    ],
    quotes: [
      ERROR,
      'single'
    ],
    semi: [
      ERROR,
      'always'
    ],
    'jest/consistent-test-it': [
      ERROR,
    ],
    // Warn on unused variables except underscore-prefixed arguments.
    'no-unused-vars': [
      WARN,
      {
        argsIgnorePattern: '^_'
      }
    ],
  },
};
