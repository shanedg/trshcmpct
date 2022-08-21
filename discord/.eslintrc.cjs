const path = require('node:path');

module.exports = {
  extends: [
    '@trshcmpctr/eslint-config',
    'plugin:node/recommended',
  ],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['lib/**'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',

        // We need these options to enable @babel/eslint-parser
        // and support import assertion syntax for JSON modules.
        requireConfigFile: false,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-import-assertions']
        },
      },
      settings: {
        'import/resolver': {
          // Default resolver for eslint-plugin-import doesn't support package.json#exports
          // https://github.com/import-js/eslint-plugin-import/issues/1810
          // but we need that support for at least ava (https://www.npmjs.com/package/ava).
          // We can use a custom resolver built on the resolve.exports package:
          // https://github.com/lukeed/resolve.exports
          // This solution is lifted with modifications from this gist:
          // https://gist.github.com/danielweck/cd63af8e9a8b3492abacc312af9f28fd
          // We can remove this if eslint-plugin-import resolves the above issue.
          [path.resolve('./eslint-plugin-import-resolver.cjs')]: {},
        },
      },
      rules: {
        // This rule checks the same thing as import/no-unresolved so we don't need both
        // but prefer import/no-unresolved because it supports custom module resolvers
        // and node/no-missing-import does not.
        'node/no-missing-import': 'off'
      },
    },

    {
      files: ['*.test.js'],
      extends: ['plugin:ava/recommended'],
      plugins: ['eslint-plugin-ava'],
    },

    {
      files: ['cypress/**'],
      extends: ['plugin:eslint-plugin-cypress/recommended'],
      plugins: ['eslint-plugin-cypress'],
    },
  ],
};
