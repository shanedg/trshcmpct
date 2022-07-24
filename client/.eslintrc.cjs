module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,

  overrides: [
    // Node config files
    {
      files: ['config/**/*.js', '.eslintrc.cjs'],
      extends: ['plugin:node/recommended'],
      plugins: ['eslint-plugin-node'],
    },

    {
      files: ['config/**/*.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
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
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
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
      env: {
        browser: true,
        node: false,
      },
      globals: {
        __DEV__: true,
      },
    },

    // React
    {
      files: ['*.tsx'],
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
      plugins: ['eslint-plugin-cypress'],
    },
  ],
};
