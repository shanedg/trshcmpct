module.exports = {
  // ignore .eslintrc.js and lint-staged.config.js
  '!(.eslintrc|lint-staged.config)*.{js,jsx,ts,tsx}': [
    'eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0 --fix --cache',
    'git add',
  ],
};
