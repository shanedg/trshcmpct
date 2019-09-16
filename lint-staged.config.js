module.exports = {
  '*.js': [
    'eslint --ignore-pattern \'!.eslintrc.js\' --max-warnings=0 --fix',
    'git add',
  ],
};
