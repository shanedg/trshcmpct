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
      extends: ['@trshcmpctr/eslint-config-typescript'],
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
