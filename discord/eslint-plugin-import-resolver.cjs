/**
 * Lifted with minor modifications from:
 * https://gist.github.com/danielweck/cd63af8e9a8b3492abacc312af9f28fd
 * See .eslintrc.cjs for more details
 */
const path = require('node:path');
const { resolve: resolveExports } = require('resolve.exports');

// Handle NodeJS built-ins if not handled by another ESLint module resolver in the chain
const { builtinModules } = require('node:module');
const builtins = new Set(builtinModules);

/**
 * @param {string} source source
 * @param {string} file file
 * @param {Object} _config config
 */
const resolve = (source, file, _config) => {
  // Handle node:* built-in prefix
  const nodeProtocolPattern = /^node:/;
  if (builtins.has(source.replace(nodeProtocolPattern, ''))) {
    return { found: true, path: null };
  }
  try {
    const moduleId = require.resolve(source, { paths: [path.dirname(file)] });
    return { found: true, path: moduleId };
  } catch (/** @type {any} */ err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.path && err.path.endsWith('/package.json')) {
      const { name, module, main, exports } = require(err.path);
      const resolved = resolveExports({ name, module, main, exports }, source);
      const moduleId = path.join(path.dirname(err.path), resolved);
      return { found: true, path: moduleId };
    }
    return { found: false };
  }
};

module.exports = {
  interfaceVersion: 2,
  resolve,
};
