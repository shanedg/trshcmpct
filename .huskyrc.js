module.exports = {
  hooks: {
    'pre-commit': [
      'node utils/hooks/pre-commit.js'
    ],
    'pre-push': [
      'node utils/hooks/pre-push.js'
    ],
  }
};
