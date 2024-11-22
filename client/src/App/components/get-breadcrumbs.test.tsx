import { getBreadcrumbs } from './get-breadcrumbs';

describe('getBreadcrumbs', () => {
  it('returns no breadcrumbs if passed an empty string', () => {
    // Silence the error logged for this unexpected case
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    expect(getBreadcrumbs('')).toStrictEqual([]);
    expect(errorSpy).toHaveBeenNthCalledWith(1, 'expected a non-empty path');
    errorSpy.mockRestore();
  });

  it('returns no breadcrumbs for the root', () => {
    expect(getBreadcrumbs('/')).toStrictEqual([]);
  });

  it('returns the root as the only breadcrumb for L1 paths', () => {
    expect(getBreadcrumbs('/l1')).toStrictEqual(['/']);
  });

  it('returns the root and the parent L1 for L2 paths', () => {
    expect(getBreadcrumbs('/l1/l2')).toStrictEqual(['/', '/l1']);
  });

  it('returns the root, the L1, and the parent L2 for L3 paths', () => {
    expect(getBreadcrumbs('/l1/l2/l3')).toStrictEqual(['/', '/l1', '/l1/l2']);
  });

  it('returns the root, the L1, the L2, and the parent L3 for L4 paths', () => {
    expect(getBreadcrumbs('/l1/l2/l3/l4')).toStrictEqual(['/', '/l1', '/l1/l2', '/l1/l2/l3']);
  });
});
