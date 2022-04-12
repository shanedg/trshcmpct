jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils');
  return {
    ...originalModule,
    // Mock authFromCode so we can spy on it.
    authFromCode: jest.fn((_fetch, _data) => {
      return Promise.resolve({ json: jest.fn().mockReturnValue({
        access_token: 'some-access-token',
        expires_in: 90,
      })});
    }),
  };
});

const { authFromCode } = require('../utils');

const {
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
} = require('.');

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
 url => Promise.resolve({ json: () => 'response from ' + url });

const logDebugSpy = jest.fn();
const logErrorSpy = jest.fn();
const nextSpy = jest.fn();
const renderSpy = jest.fn();
const sendSpy = jest.fn();

const goodRequest = {
  log: { error: logErrorSpy, debug: logDebugSpy },
  session: { views: 0 },
  query: { code: 'abc456' },
};
const goodResponse = { render: renderSpy, send: sendSpy };

describe('getNewTokenWithDependencies creates a handler that', () => {
  const getNewToken = getNewTokenWithDependencies(fetchSucceeds, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    guildId: '456',
    port: 1234
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await getNewToken(goodRequest, goodResponse, nextSpy);
  });

  it('logs to debug', () => {
    expect(logDebugSpy.mock.calls.length).toBe(1);
    expect(logDebugSpy.mock.calls[0][0]).toBe('get new token');
  });
  
  it('authenticates with the code in the query param', async () => {
    expect(authFromCode.mock.calls.length).toBe(1);
    expect(authFromCode.mock.calls[0].length).toBe(2);
    expect(authFromCode.mock.calls[0][1]).toStrictEqual(expect.objectContaining({
      code: 'abc456'
    }));
  });

  it('renders the logged in template', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0][0]).toBe('authenticated');
  });

  it('injects new session flag', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0].length).toBe(2);
    expect(renderSpy.mock.calls[0][1]).toStrictEqual(expect.objectContaining({
      newSession: true
    }));
  });
});

describe('getReuseSessionTokenWithDependencies creates a handler that', () => {
  const reuseSessionToken = getReuseSessionTokenWithDependencies(fetchSucceeds, { guildId: '456' });
  beforeEach(async () => {
    jest.clearAllMocks();
    await reuseSessionToken(goodRequest, goodResponse, nextSpy);
  });

  it('logs to debug', () => {
    expect(logDebugSpy.mock.calls.length).toBe(1);
    expect(logDebugSpy.mock.calls[0][0]).toBe('reuse session token');
  });

  it('renders the logged in template', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0][0]).toBe('authenticated');
  });

  it('injects new session flag', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0].length).toBe(2);
    expect(renderSpy.mock.calls[0][1]).toStrictEqual(expect.objectContaining({
      newSession: false
    }));
  });
});
