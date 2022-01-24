module.exports = {
  rootDir: '../..',
  roots: [
    '<rootDir>/config',
    '<rootDir>/client',
  ],
  transform: {
    // Only files in client/ are built & transpiled by Babel.
    '\\/client\\/.+\\.[t|j]sx?$': '<rootDir>/config/jest/babelJest.js',
  },
  collectCoverage: true,
  testEnvironment: 'jsdom',
};
