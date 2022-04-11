const { getLoggedInData } = require('./get-logged-in-data');

describe('getLoggedInData', () => {
  const fakeAuthenticatedFetch = jest.fn(url => ({
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

  it('collects user and guilds data', async () => {
    const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '123' });
    expect(result).toMatchObject({
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

  it('returns guild if user is member', async () => {
    const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '123' });
    expect(result).toMatchObject({
      guild: {
        id: '123',
        name: 'some-server-name'
      },
    });
  });

  it('does not return guild if user is not a member', async () => {
    const result = await getLoggedInData(fakeAuthenticatedFetch, { guildId: '456' });
    expect(result).toMatchObject({
      guild: undefined,
    });
  });
});
