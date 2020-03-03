module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint --config config/commitlint.config.js -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'node config/git-hooks/pre-commit.js'
    ],
    'pre-push': [
      'node config/git-hooks/pre-push.js'
    ],
  }
};
