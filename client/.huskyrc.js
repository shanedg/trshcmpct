module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint --config config/commitlint.config.js -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'npm run lint-staged'
    ],
    'pre-push': [
      'npm run type-check && npm run test'
    ],
  }
};
