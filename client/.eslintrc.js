/* eslint-env node */
module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:react/recommended',
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
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  root: true,
};
