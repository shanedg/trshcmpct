const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: [
    '../.eslintrc.js',
  ],
  env: {
    browser: true,
    commonjs: false,
    node: false,
  },
  root: true,
};
