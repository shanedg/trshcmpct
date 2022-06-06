import { selectGuildById } from './select-guild-by-id';

const testGuilds = [
  {
    id: 'someid',
    name: 'server name',
    icon: 'icon',
    owner: true,
    permissions: 'permissions',
    features: [],
    permissions_new: 'new permissions'
  },
  {
    id: 'anotherid',
    name: 'server name',
    icon: 'icon',
    owner: true,
    permissions: 'permissions',
    features: [],
    permissions_new: 'new permissions'
  },
];

describe('selectGuildById', () => {
  it('returns guild if present', () => {
    const result = selectGuildById(testGuilds, 'someid');
    expect(result).toBeTruthy();
    expect(result.id).toBe('someid');
  });

  it('returns undefined if not present', () => {
    expect(selectGuildById(testGuilds, 'missingid')).toBeUndefined();
  });
});
