jest.mock('node-fetch');

const fetch = require('node-fetch');

const {
  authFromCode,
  getFetchWithOauth,
  getGuildById,
} = require('./utils');

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
