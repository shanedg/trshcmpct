module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['lib/**'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',

        // we need @babel/eslint-parser to support import json assertions
        requireConfigFile: false,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-import-assertions']
        },
      },
    },
  ]
};
