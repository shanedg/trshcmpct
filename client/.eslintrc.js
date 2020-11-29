/* eslint-env node */
module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
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
    'eslint-plugin-jest-dom',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  root: true,
};
