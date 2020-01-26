module.exports = {
  rootDir: '..',
  roots: [
    '<rootDir>/config',
    '<rootDir>/scripts',
    '<rootDir>/src',
  ],
  transform: {
    // Only transform files in src/!
    // Only this directory is built/transpiled by Babel.
    '\\/src\\/.+\\.[t|j]sx?$': '<rootDir>/config/babelJest.js',
  },
};
