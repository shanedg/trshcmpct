module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint --config config/commitlint.config.js -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'node scripts/hooks/pre-commit.js'
    ],
    'pre-push': [
      'node scripts/hooks/pre-push.js'
    ],
  }
};
