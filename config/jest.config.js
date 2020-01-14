module.exports = {
  rootDir: '..',
  roots: [
    '<rootDir>/config',
    '<rootDir>/scripts',
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': '<rootDir>/config/babelJest.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    // Only transform files in <rootDir>/src:
    // https://jestjs.io/docs/en/tutorial-react-native#transformignorepatterns-customization
    '<rootDir>/(?!src/)',
  ],
};
