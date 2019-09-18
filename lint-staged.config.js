module.exports = {
  // ignore .eslintrc.js and lint-staged.config.js
  '!(.eslintrc|lint-staged.config)*.js': [
    'eslint --max-warnings=0 --fix',
    'git add',
  ],
};
