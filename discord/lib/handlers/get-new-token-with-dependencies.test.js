import { jest } from '@jest/globals';

import { getNewTokenWithDependencies } from './get-new-token-with-dependencies';

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
const spiedResponse = { render: renderSpy, send: sendSpy };

describe('getNewTokenWithDependencies creates a handler that', () => {
  beforeAll(async () => {
    const getNewToken = getNewTokenWithDependencies(fetchSucceeds, {
      clientId: 'my-client-id',
      clientSecret: 'my-client-secret',
      guildId: '456',
      port: 1234
    });
    const newTokenRequest = {
      log: { error: logErrorSpy, debug: logDebugSpy },
      session: { views: 0 },
      query: { code: 'abc456' },
    };
    await getNewToken(newTokenRequest, spiedResponse, nextSpy);
  });

  it('logs to debug', () => {
    expect(logDebugSpy.mock.calls.length).toBe(1);
    expect(logDebugSpy.mock.calls[0][0]).toBe('get new token');
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
