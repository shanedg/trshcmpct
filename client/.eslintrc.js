module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  root: true,
  
  overrides: [
    // Typescript source files
    {
      files: [
        '*.tsx',
        '*.ts',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      env: {
        browser: true,
        node: false,
      },
      globals: {
        __DEV__: true,
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
    },

    // React
    {
      files: ['*.tsx'],
      extends: ['plugin:react/recommended'],
      plugins: ['eslint-plugin-react'],
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
      extends: ['plugin:jest/recommended'],
      plugins: ['eslint-plugin-jest'],
      rules: {
        'jest/consistent-test-it': ['error'],
      },
    },

    // React tests
    {
      files: [
        '*.test.jsx',
        '*.test.tsx',
      ],
      extends: [
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
      ],
      plugins: [
        'eslint-plugin-testing-library',
        'eslint-plugin-jest-dom',
      ],
    },
  ],
};
