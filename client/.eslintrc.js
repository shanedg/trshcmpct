/* eslint-env node */
module.exports = {
  extends: [
    '../.eslintrc.js',
  ],
  env: {
    browser: true,
    commonjs: false,
    node: false,
  },
  globals: {
    __DEV__: true,
  },
  root: true,
};
