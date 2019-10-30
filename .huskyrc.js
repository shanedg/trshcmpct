module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'node utils/hooks/pre-commit.js'
    ],
    'pre-push': [
      'node utils/hooks/pre-push.js'
    ],
  }
};
