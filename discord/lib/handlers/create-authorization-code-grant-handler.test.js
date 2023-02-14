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
    error: 'bad auth on purpose!'
  })});

const fakeSession = { state: 'some-nonce' };
const nextSpy = sinon.spy();

test.before(async () => {
  const handleCodeGrant = createAuthorizationCodeGrantHandler(fetchSucceeds, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    redirectUri: 'http://localhost:53134/auth'
  });
  const newTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: fakeSession,
    query: { code: 'abc456', state: encodeURIComponent('some-nonce') },
  };
  // The handler response param (2nd) is unused
  await handleCodeGrant(newTokenRequest, {}, nextSpy);
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
  t.plan(1);
  const localNextSpy = sinon.spy();

  const handleCodeGrant = createAuthorizationCodeGrantHandler(sinon.spy(), {});
  const noCodeNewTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {},
    query: {},
  };

  await handleCodeGrant(noCodeNewTokenRequest, {}, localNextSpy);
  const nextSpyCalls = localNextSpy.getCalls();
  t.is(nextSpyCalls.length, 1);
});

test('creates a handler that expects a state query param and calls next if none present', async t => {
  t.plan(1);
  const localNextSpy = sinon.spy();
  const handleCodeGrant = createAuthorizationCodeGrantHandler(sinon.spy(), {});
  const noCodeNewTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {},
    query: { code: 'abc456' },
  };
  await handleCodeGrant(noCodeNewTokenRequest, {}, localNextSpy);
  const nextSpyCalls = localNextSpy.getCalls();
  t.is(nextSpyCalls.length, 1);
});

test('creates a handler that calls next if possible clickjacking attempt detected', async t => {
  t.plan(2);
  const localNextSpy = sinon.spy();
  const handleCodeGrant = createAuthorizationCodeGrantHandler(fetchSucceedsWithOauthError, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    redirectUri: 'http://localhost:53134/auth'
  });
  const newTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {
      state: 'some-nonce'
    },
    query: { code: 'abc456', state: encodeURIComponent('a-different-nonce') },
  };

  await handleCodeGrant(newTokenRequest, {}, localNextSpy);
  const nextCalls = localNextSpy.getCalls();
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args[0], `detected possible clickjacking attempt
  session state: some-nonce
  oauth state: a-different-nonce`);
});

test('creates a handler that fails authorization requests gracefully', async t => {
  t.plan(2);
  const request = {
    log: {
      debug: sinon.spy(),
      error: sinon.spy(),
    },
    session: {
      state: 'some-nonce',
    },
    query: { code: 'abc456', state: encodeURIComponent('some-nonce') },
  };
  const authFailsNextSpy = sinon.spy();
  const fetchRejects = () => Promise.reject('async-auth-request-error');
  const handleCodeGrantFetchRejects = createAuthorizationCodeGrantHandler(fetchRejects, {});

  await handleCodeGrantFetchRejects(request, {}, authFailsNextSpy);
  const nextCalls = authFailsNextSpy.getCalls();
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args[0], 'async-auth-request-error');
});
