module.exports = {
  rootDir: '../..',
  roots: [
    '<rootDir>/config',
    '<rootDir>/src',
  ],
  transform: {
    // Only files in src/ are built & transpiled by Babel.
    '\\/src\\/.+\\.[t|j]sx?$': '<rootDir>/config/jest/babel-jest.js',
  },
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest-setup.js'],
  globals: {
    '__DEV__': true
  }
};
