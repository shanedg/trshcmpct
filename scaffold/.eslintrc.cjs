module.exports = {
  extends: ['@trshcmpctr/eslint-config'],
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
