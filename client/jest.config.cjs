module.exports = {
  rootDir: './',
  transform: {
    // Only files in src/ are built & transpiled by Babel, so only these should be transformed.
    // Note that the transform pattern is matched against the full path.
    // This creates some trouble in CI because Drone's default workspace already includes src/ (/drone/src).
    // To workaround this, include the package directory in the transform pattern (/client/src)
    // as a defense against transforming unintended files.
    // Unfortunately, we can't use <rootDir> in this pattern.
    '\\/client\\/src\\/.+\\.[t|j]sx?$': [
      'babel-jest',
    ],
    // jest-setup.ts needs to be .ts to include types for
    // extended Jest matchers from @testing-library/jest-dom
    '\\/client\\/jest-setup\\.ts$': [
      'babel-jest',
    ],
  },
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    // See https://jestjs.io/docs/webpack#handling-static-assets
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.cjs',
  },
};
