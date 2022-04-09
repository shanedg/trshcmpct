jest.mock('node-fetch');

const fetch = require('node-fetch');

const {
  authFromCode,
  batchRequests,
  getFetchWithOauth,
  getGuildById,
} = require('./utils');

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

describe('utils', () => {
  describe('authFromCode', () => {
    beforeEach(async () => {
      fetch.mockClear();
      await authFromCode({
        code: 'mycode',
        clientId: 'myclientid',
        clientSecret: 'myclientsecret',
        port: '12345'
      });
    });

    it('calls fetch with oauth url', () => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0].length).toBe(2);
      expect(fetch.mock.calls[0][0]).toBe('https://discord.com/api/oauth2/token');
    });

    it('calls fetch with oauth body', () => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0].length).toBe(2);

      const bodyParams = fetch.mock.calls[0][1].body;
      expect(bodyParams).toBeInstanceOf(URLSearchParams);
      expect(bodyParams.toString()).toBe([
        'client_id=myclientid',
        'client_secret=myclientsecret',
        'code=mycode',
        'grant_type=authorization_code',
        'redirect_uri=http%3A%2F%2Flocalhost%3A12345',
        'scope=identify'
      ].join('&'));
    });
  });

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

  describe('getFetchWithOauth', () => {
    let fetchWithOauth;

    beforeEach(() => {
      fetch.mockClear();
      fetchWithOauth = getFetchWithOauth({
        token_type: 'Bearer',
        access_token: 'accesstoken'
      });
    });

    it('calls fetch with url', async () => {
      await fetchWithOauth('https://www.example.com');

      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0].length).toBe(2);
      expect(fetch.mock.calls[0][0]).toBe('https://www.example.com');
    });

    it('calls fetch with authorization header', async () => {
      await fetchWithOauth('https://www.example.com');

      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0].length).toBe(2);
      expect(fetch.mock.calls[0][1].headers.authorization).toBe('Bearer accesstoken');
    });
  });

  describe('getGuildById', () => {
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
      const result = getGuildById(testGuilds, 'someid');
      expect(result).toBeTruthy();
      expect(result.id).toBe('someid');
    });

    it('returns undefined if guild not present', () => {
      expect(getGuildById(testGuilds, 'missingid')).toBeUndefined();
    });
  });
});
