import { jest } from '@jest/globals';

// Exported in utils/index as part of the utils "public api"
import { getLoggedInData } from '.';

// "private", imported directly from the module
import { batchRequests, selectGuildById } from './get-logged-in-data';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
 url => Promise.resolve({ json: () => 'response from ' + url });

/**
 * Fake implementation of fetch
 * Always throws
 * @param {string} url Url to fetch
 */
const fetchFails = url => { throw new Error(url); };

/**
  * Fake implementation of fetch
  * Response#json always throws
  * @param {string} url Url to fetch
  * @returns Fake response
  */
const fetchWithBadResponseJson =
   url => Promise.resolve({ json: () => { throw new Error('response from ' + url); } });

describe('batchRequests', () => {
  const testEndpoints = ['https://some-url.fake/api/1', 'https://some-url.fake/api/2'];
  let fetch;

  beforeEach(async () => {
    fetch && fetch.mockClear();
    fetch = jest.fn(fetchSucceeds);
  });

  it('calls fetch with the expected endpoints', async () => {
    await batchRequests(fetch, testEndpoints);
    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0].length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe('https://some-url.fake/api/1');
    // The actual implementation of fetch has no guarantees
    // about order of completion but this is fine for a lil test.
    expect(fetch.mock.calls[1].length).toBe(1);
    expect(fetch.mock.calls[1][0]).toBe('https://some-url.fake/api/2');
  });

  it('throws if any calls to fetch fail', async () => {
    fetch
      .mockImplementationOnce(fetchFails);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('https://some-url.fake/api/1'));
    expect(fetch.mock.calls.length).toBe(1);
    fetch.mockClear();

    fetch
      .mockImplementationOnce(fetchSucceeds)
      .mockImplementationOnce(fetchFails);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('https://some-url.fake/api/2'));
    expect(fetch.mock.calls.length).toBe(2);
  });

  it('throws if any calls to response#json fail', async () => {
    fetch
      .mockImplementationOnce(fetchWithBadResponseJson)
      .mockImplementationOnce(fetchSucceeds);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('response from https://some-url.fake/api/1'));
    fetch.mockClear();

    fetch
      .mockImplementationOnce(fetchSucceeds)
      .mockImplementationOnce(fetchWithBadResponseJson);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('response from https://some-url.fake/api/2'));
  });
});

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

describe('selectGuildById', () => {
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

  it('returns guild if present', () => {
    const result = selectGuildById(testGuilds, 'someid');
    expect(result).toBeTruthy();
    expect(result.id).toBe('someid');
  });

  it('returns undefined if guild not present', () => {
    expect(selectGuildById(testGuilds, 'missingid')).toBeUndefined();
  });
});

