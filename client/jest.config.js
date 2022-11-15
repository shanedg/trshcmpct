import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
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
      // Since the babel config isn't in the package root,
      // we need to locate it explicitly for babel-jest here.
      { configFile: resolve(__dirname, 'babel.config.cjs') }
    ],
  },
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
};
