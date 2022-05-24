import { jest } from '@jest/globals';

import { getReuseSessionTokenWithDependencies } from './get-reuse-session-token-with-dependencies';

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

describe('getReuseSessionTokenWithDependencies creates a handler that', () => {
  beforeAll(async () => {
    const reuseSessionToken = getReuseSessionTokenWithDependencies(fetchSucceeds, { guildId: '456' });
    const sessionTokenRequest = {
      log: { error: logErrorSpy, debug: logDebugSpy },
      session: {
        oauth: {
          access_token: 'some-access-token',
          expires_in: 90,
        },
        views: 10,
      },
    };
    await reuseSessionToken(sessionTokenRequest, spiedResponse, nextSpy);
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
