module.exports = {
  hooks: {
    'commit-msg': [
      'commitlint -E HUSKY_GIT_PARAMS'
    ],
    'pre-commit': [
      'node scripts/hooks/pre-commit.js'
    ],
    'pre-push': [
      'node scripts/hooks/pre-push.js'
    ],
  }
};
