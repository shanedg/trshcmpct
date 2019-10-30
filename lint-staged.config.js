module.exports = {
  // ignore .eslintrc.js and lint-staged.config.js and .huskyrc.js
  '!(.eslintrc|lint-staged.config|.huskyrc)*.{js,jsx,ts,tsx}': [
    'eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0 --fix --cache',
    'git add',
  ],
};
