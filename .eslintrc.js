const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: [
      './tsconfig.json',
      './src/tsconfig.json',
    ],
    sourceType: 'module',
  },
  plugins: [
    'eslint-plugin-jest',
    'eslint-plugin-react',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
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
    // Warn on unused variables unless name is prefixed with underscore.
    '@typescript-eslint/no-unused-vars': [
      WARN,
      {
        argsIgnorePattern: '^_'
      }
    ],
  },
  overrides: [
    {
      // Override some @typescript-eslint rules creating noise in js files.
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-var-requires': OFF,
      }
    },
  ],
};
