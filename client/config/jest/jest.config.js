module.exports = {
  rootDir: '../..',
  roots: [
    '<rootDir>/config',
    '<rootDir>/src',
  ],
  transform: {
    // Only files in src/ are built & transpiled by Babel, so only these should be transformed.
    // Note that the transform pattern is matched against the full path.
    // This creates some trouble in CI because Drone's default workspace already includes src/ (/drone/src).
    // To workaround this, we configure Drone to remove src/ from the workspace base path.
    // But we also include the root directory in the transform pattern here (/client/src)
    // as an extra defense against transforming unintended files.
    '\\/client\\/src\\/.+\\.[t|j]sx?$': '<rootDir>/config/jest/babel-jest.js',
  },
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest-setup.js'],
  globals: {
    __DEV__: true
  },
};
