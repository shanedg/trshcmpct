const { getFetchWithOauth } = require('.');

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
 url => Promise.resolve({ json: () => 'response from ' + url });

describe('getFetchWithOauth', () => {
  let fetch;
  let fetchWithOauth;

  beforeEach(() => {
    fetch && fetch.mockClear();
    fetch = jest.fn(fetchSucceeds);
    fetchWithOauth = getFetchWithOauth(fetch, {
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
