import { jest } from '@jest/globals';

import { authFromCode } from './auth-from-code';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
 url => Promise.resolve({ json: () => 'response from ' + url });

describe('authFromCode', () => {
  let fetch;

  beforeAll(async () => {
    fetch = jest.fn(fetchSucceeds);
    await authFromCode(fetch, {
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
