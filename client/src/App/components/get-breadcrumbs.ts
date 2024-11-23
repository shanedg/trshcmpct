/**
 * Generate a list of all ancestor paths to use in navigation breadcrumbs
 * @param pathname The current pathname
 * @returns A list of all ancestor paths
 */
export function getBreadcrumbs(pathname: string) {
  // pathname shouldn't be empty but it has no ancestors if it is
  if (pathname === '') {
    console.error('expected a non-empty path');
    return [];
  }

  // The root has no ancestors
  if (pathname === '/') {
    return [];
  }

  const segments = pathname.split('/');
  const breadcrumbs = ['/'];
  let segmentCollector = '';
  // Skip the first segment because it always contains an empty string
  // Skip the last segment because it contains the current path
  for (let i = 1; i < segments.length - 1; i += 1) {
    const currentSegment = segments[i];
    segmentCollector += '/' + currentSegment;
    breadcrumbs.push(segmentCollector);
  }
  return breadcrumbs;
}
