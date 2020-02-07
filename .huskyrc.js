module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint --config config/commitlint.config.js -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'node scripts/git-hooks/pre-commit.js'
    ],
    'pre-push': [
      'node scripts/git-hooks/pre-push.js'
    ],
  }
};
