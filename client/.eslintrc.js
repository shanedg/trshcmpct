/* eslint-env node */
module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:testing-library/react',
  ],
  env: {
    browser: true,
    commonjs: false,
    node: false,
  },
  globals: {
    __DEV__: true,
  },
  plugins: [
    'eslint-plugin-react',
    'eslint-plugin-testing-library',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  root: true,
};
