/**
 * This is a separate entry point from the application.
 * It exists to make application path values available to package consumers.
 * They are exposed via ES module at the "./paths" export sub path.
 * i.e. `import { paths } from '@trshmpctr/client/paths';`
 */
import { namedRoutes } from './App/get-routes';

import type { NamedRoutes } from './App/get-routes';

function getIsNotAChildRoot(path: string) {
  return path !== '/';
}

function withLeadingSlash(path: string) {
  if (path.startsWith('/')) {
    return path;
  }
  return '/' + path;
}

function withPrefix(prefix: string, path: string) {
  // Ignore the root as a prefix to avoid double slashes
  if (prefix === '/') {
    return path;
  }
  return prefix + path;
}

/**
 * Traverse the route hierarchy to return a list of valid paths
 * @param routes Named routes
 * @returns A list of all paths
 */
export function getPaths(routes?: NamedRoutes) {
  // Base case, no children
  if (!routes) {
    return [] as string[];
  }
  const childPaths: string[] = [];
  for (const path in routes) {
    childPaths.push(path);
    const prefixedChildrenPaths = getPaths(routes[path].children)
      // Avoid duplicating parent path when child path is "/"
      // i.e. avoid "/some-path" and "/some-path/", preserve the former
      .filter(getIsNotAChildRoot)
      // Normalize child paths that start with parameters
      // for the purpose of assembling path segments
      .map(withLeadingSlash)
      // Prefix child paths with parent path
      .map(withPrefix.bind(null, path));
    childPaths.push(...prefixedChildrenPaths);
  }
  return childPaths;
}

/**
 * All valid application paths
 */
export const paths = getPaths(namedRoutes);
