import { jest } from '@jest/globals';

import { getRenderLoginWithData } from '.';

describe('getRenderLoginWithData creates a handler that', () => {
  const renderLogin = getRenderLoginWithData({ clientId: 'my-client-id' });

  const logDebugSpy = jest.fn();
  const logErrorSpy = jest.fn();
  const nextSpy = jest.fn();
  const renderSpy = jest.fn();
  const sendSpy = jest.fn();

  const goodResponse = { render: renderSpy, send: sendSpy };

  beforeEach(() => {
    jest.clearAllMocks();
    const loginRequest = {
      log: { error: logErrorSpy, debug: logDebugSpy },
      session: { views: 0 },
      query: {},
    };
    renderLogin(loginRequest, goodResponse, nextSpy);
  });

  it('renders the login template', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0][0]).toBe('index');
  });

  it('injects the client id to the login locals', () => {
    expect(renderSpy.mock.calls.length).toBe(1);
    expect(renderSpy.mock.calls[0].length).toBe(2);
    expect(renderSpy.mock.calls[0][1]).toStrictEqual(expect.objectContaining({
      clientId: 'my-client-id'
    }));
  });

  it('logs to debug', () => {
    expect(logDebugSpy.mock.calls.length).toBe(1);
    expect(logDebugSpy.mock.calls[0][0]).toBe('render login page');
  });

  it('calls the next middleware function if logging in', () => {
    jest.clearAllMocks();
    const loggedInRequest = {
      log: { error: logErrorSpy, debug: logDebugSpy },
      session: { views: 0 },
      query: { code: 123 },
    };
    renderLogin(loggedInRequest, goodResponse, nextSpy);
    expect(renderSpy.mock.calls.length).toBe(0);
    expect(nextSpy.mock.calls.length).toBe(1);
  });

  it('calls the next middleware function if logged in', () => {
    jest.clearAllMocks();
    const ninetySecondsFromNow = (Date.now()/1000)+90;
    const loggedInRequest = {
      log: { error: logErrorSpy, debug: logDebugSpy },
      session: {
        views: 0,
        oauth: { access_token: 'access-token' },
        oauthExpires: ninetySecondsFromNow,
      },
      query: {},
    };
    renderLogin(loggedInRequest, goodResponse, nextSpy);
    expect(renderSpy.mock.calls.length).toBe(0);
    expect(nextSpy.mock.calls.length).toBe(1);
  });
});
