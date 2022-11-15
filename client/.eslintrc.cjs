const cjsConfigFiles = [
  '.eslintrc.cjs',
  'babel.config.cjs',
];

const esmConfigFiles = [
  'jest-setup.js',
  'jest.config.js',
  'webpack.config.js',
];

module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,

  overrides: [
    // All config files
    {
      files: [...cjsConfigFiles, ...esmConfigFiles],
      extends: ['plugin:node/recommended'],
      plugins: ['eslint-plugin-node'],
    },

    // ESM config files
    {
      files: [...esmConfigFiles],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      },
    },

    // Browser files
    {
      files: ['src/**'],
      env: {
        browser: true,
        node: false,
      },
    },

    // Typescript files
    {
      files: [
        '*.tsx',
        '*.ts',
      ],
      extends: ['@trshcmpctr/eslint-config-typescript'],
      parserOptions: {
        project: './tsconfig.json'
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
          typescript: {
            project: './tsconfig.json',
          },
        },
      },
    },

    // React
    {
      files: [
        '*.jsx',
        '*.tsx',
      ],
      extends: ['@trshcmpctr/eslint-config-react'],
      settings: {
        react: {
          pragma: 'React',
          version: 'detect',
        },
      },
    },

    // Tests
    {
      files: [
        '*.test.js',
        '*.test.jsx',
        '*.test.ts',
        '*.test.tsx',
      ],
      extends: ['@trshcmpctr/eslint-config-jest'],
    },

    // React tests using @testing-library/react.
    {
      files: [
        '*.test.jsx',
        '*.test.tsx',
      ],
      // To see what rules are in the recommended set: https://www.npmjs.com/package/eslint-plugin-testing-library
      extends: ['plugin:testing-library/react'],
      plugins: ['eslint-plugin-testing-library'],
    },

    // Cypress tests
    {
      files: ['cypress/**'],
      extends: ['plugin:eslint-plugin-cypress/recommended'],
      parserOptions: {
        project: './cypress/tsconfig.json'
      },
      plugins: ['eslint-plugin-cypress'],
      settings: {
        'import/resolver': {
          typescript: {
            project: './cypress/tsconfig.json',
          },
        },
      },
    },
  ],
};
