/**
 * ESLint config for React in JavaScript projects.
 */
module.exports = {
  extends: [
    // To see what rules are in the recommended set: https://www.npmjs.com/package/eslint-plugin-react
    'plugin:react/recommended',
    // To see what rules are in the recommended set: https://www.npmjs.com/package/eslint-plugin-react-hooks
    'plugin:react-hooks/recommended',
    // To see what rules are in the recommended set: https://www.npmjs.com/package/eslint-plugin-jsx-a11y
    'plugin:jsx-a11y/recommended',
  ],

  plugins: [
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-jsx-a11y',
  ],
};
