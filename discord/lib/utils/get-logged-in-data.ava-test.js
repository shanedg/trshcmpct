import test from 'ava';
import sinon from 'sinon';

import { getLoggedInData } from './get-logged-in-data';

const fakeAuthenticatedFetch = sinon.spy(url => ({
  json: () => {
    switch(url) {
    case 'https://discord.com/api/users/@me':
      return {
        avatar: 'some-avatar-id',
        discriminator: '001',
        id: '12345',
        username: 'some-user-name',
      };
    case 'https://discord.com/api/users/@me/guilds':
      return [{
        id: '123',
        name: 'some-server-name'
      }];
    }
  }
}));

test('collects user and guilds data', async t => {
  t.plan(1);
  const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '123' });
  t.like(result, {
    avatar: 'some-avatar-id',
    discriminator: '001',
    guild: {
      id: '123',
      name: 'some-server-name'
    },
    id: '12345',
    username: 'some-user-name'
  });
});

test('returns guild if user is member', async t => {
  t.plan(1);
  const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '123' });
  t.like(result, {
    guild: {
      id: '123',
      name: 'some-server-name'
    },
  });
});

test('does not return guild if user not a member', async t => {
  t.plan(1);
  const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '456' });
  t.like(result, {
    guild: undefined,
  });
});
