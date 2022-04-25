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
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    {
      files: ['*.test.js'],
      extends: ['@trshcmpctr/eslint-config-jest'],
    },

    {
      files: ['*.ava-test.js'],
      extends: ['plugin:ava/recommended'],
      plugins: ['eslint-plugin-ava'],
      settings: {
        'import/resolver': {
          // This custom resolver supports export maps, used in ava package:
          // error  Unable to resolve path to module 'ava'  import/no-unresolved
          // Remove this if/when eslint-plugin-import adds support for export maps:
          // https://github.com/import-js/eslint-plugin-import/issues/1810
          '@tophat/eslint-import-resolver-require': {},
          // TODO: wait this one looks more legit: https://www.npmjs.com/package/@jsenv/importmap-eslint-resolver
          // TODO: this seems nice: https://github.com/lukeed/resolve.exports
        },
      },
      rules: {
        // This rule checks the same thing as import/no-unresolved so we don't need both
        // but prefer import/no-unresolved because it supports custom module resolvers
        // and node/no-missing-import does not.
        'node/no-missing-import': 'off'
      },
    },
  ],
};
