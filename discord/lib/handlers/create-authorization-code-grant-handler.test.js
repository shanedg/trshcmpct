import test from 'ava';
import sinon from 'sinon';

import { createAuthorizationCodeGrantHandler } from './create-authorization-code-grant-handler';

/**
 * Fake implementation of fetch
 * Always resolves
 * @returns Empty fake response
 */
const fetchSucceeds =
  () => Promise.resolve({ json: () => ({
    access_token: 'asdf12345',
    expires_in: 5000
  })});

/**
 * Fake fetch that succeeds but with an oauth error
 * @returns Fake oauth error response
 */
const fetchSucceedsWithOauthError =
  () => Promise.resolve({ json: () => ({
    error: 'bad auth!'
  })});

const logErrorSpy = sinon.spy();
const logDebugSpy = sinon.spy();
const fakeSession = {};
const nextSpy = sinon.spy();

test.before(async () => {
  const handleCodeGrant = createAuthorizationCodeGrantHandler(fetchSucceeds, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    redirectUri: 'http://localhost:53134/auth'
  });
  const newTokenRequest = {
    log: { error: logErrorSpy, debug: logDebugSpy },
    session: fakeSession,
    query: { code: 'abc456' },
  };
  // The handler response param (2nd) is unused
  await handleCodeGrant(newTokenRequest, {}, nextSpy);
});

test('creates a handler that logs to debug', t => {
  t.plan(2);
  const logSpyCalls = logDebugSpy.getCalls();
  t.is(logSpyCalls.length, 1);
  t.is(logSpyCalls[0].args[0], 'get new token');
});

test('creates a handler that adds oauth result and expiry time to session if auth succeeds', t => {
  t.plan(2);
  t.deepEqual(fakeSession.oauth, {
    access_token: 'asdf12345',
    expires_in: 5000,
  });
  // OAuth should expire in the future
  t.assert(fakeSession.oauthExpires > Date.now() / 1000);
});

test('creates a handler that expects a code query param and calls next if none present', async t => {
  t.plan(3);
  const localLogErrorSpy = sinon.spy();
  const localLogDebugSpy = sinon.spy();
  const localNextSpy = sinon.spy();
  // Fetch and auth options never get a chance to be referenced so we can avoid mocking them out at all
  const handleCodeGrant = createAuthorizationCodeGrantHandler(sinon.spy(), {});
  const noCodeNewTokenRequest = {
    log: { error: localLogErrorSpy, debug: localLogDebugSpy },
    session: {},
    query: {},
  };
  // The handler response param (2nd) is unused
  await handleCodeGrant(noCodeNewTokenRequest, {}, localNextSpy);
  const logSpyCalls = localLogDebugSpy.getCalls();
  const nextSpyCalls = localNextSpy.getCalls();
  t.is(logSpyCalls.length, 2);
  t.is(logSpyCalls[1].args[0], 'no code found');
  t.is(nextSpyCalls.length, 1);
});

test('creates a handler that throws an error if auth fails', async t => {
  t.plan(4);
  const localLogErrorSpy = sinon.spy();
  const localLogDebugSpy = sinon.spy();
  const localNextSpy = sinon.spy();
  const handleCodeGrant = createAuthorizationCodeGrantHandler(fetchSucceedsWithOauthError, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    redirectUri: 'http://localhost:53134/auth'
  });
  const newTokenRequest = {
    log: { error: localLogErrorSpy, debug: localLogDebugSpy },
    session: {},
    query: { code: 'abc456' },
  };
  // The handler response param (2nd param) is unused
  const error = await t.throwsAsync(handleCodeGrant(newTokenRequest, {}, localNextSpy));
  const logSpyErrorCalls = localLogErrorSpy.getCalls();
  t.is(logSpyErrorCalls.length, 1);
  t.is(logSpyErrorCalls[0].args[0], 'bad authorization');
  t.deepEqual(error, new Error('bad authorization: {\n  "error": "bad auth!"\n}'));
});

test('creates a handler that fails authorization requests gracefully', async t => {
  t.plan(2);
  const request = {
    log: {
      debug: sinon.spy(),
      error: sinon.spy(),
    },
    session: {},
    query: { code: 'abc456' },
  };
  const authFailsNextSpy = sinon.spy();
  const fetchRejects = () => Promise.reject('async-auth-request-error');
  const handleCodeGrantFetchRejects = createAuthorizationCodeGrantHandler(fetchRejects, {});
  // Auth options (2nd param) are only referenced in arguments to fetch function
  await handleCodeGrantFetchRejects(request, {}, authFailsNextSpy);
  const nextCalls = authFailsNextSpy.getCalls();
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args[0], 'async-auth-request-error');
});
