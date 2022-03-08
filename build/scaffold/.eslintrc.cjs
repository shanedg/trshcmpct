module.exports = {
  extends: [
    '@trshcmpctr/eslint-config',
    'plugin:node/recommended',
  ],
  plugins: ['eslint-plugin-node'],
  root: true,

  overrides: [
    {
      files: ['lib/**/*.js'],
      parserOptions: {
        sourceType: 'module'
      }
    },
  ]
};
