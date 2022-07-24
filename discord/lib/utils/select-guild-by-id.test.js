import test from 'ava';

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

test('returns guild if present', t => {
  t.plan(2);
  const result = selectGuildById(testGuilds, 'someid');
  t.truthy(result);
  t.is(result.id, 'someid');
});

test('returns undefined if not present', t => {
  t.plan(1);
  t.is(selectGuildById(testGuilds, 'missingid'), undefined);
});
