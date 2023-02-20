import test from 'ava';
import sinon from 'sinon';

import { handleAuthorizationCodeGrant } from './handle-authorization-code-grant';

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
  const newTokenRequest = {
    log: { debug: sinon.spy(), error: sinon.spy() },
    session: fakeSession,
    query: { code: 'abc456', state: encodeURIComponent('some-nonce') },
  };
  await handleAuthorizationCodeGrant(
    fetchSucceeds,
    {
      clientId: 'my-client-id',
      clientSecret: 'my-client-secret',
      redirectUri: 'http://localhost:53134/auth',
    },
    newTokenRequest,
    {},
    nextSpy
  );
});

test('adds oauth result and expiry time to session if auth succeeds', t => {
  t.plan(2);
  t.deepEqual(fakeSession.oauth, {
    access_token: 'asdf12345',
    expires_in: 5000,
  });
  // Oauth should expire in the future
  t.assert(fakeSession.oauthExpires > Date.now() / 1000);
});

test('expects a code query param and calls next middleware if none present', async t => {
  const localNextSpy = sinon.spy();
  const noCodeNewTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {},
    query: {},
  };

  await handleAuthorizationCodeGrant(sinon.spy(), {}, noCodeNewTokenRequest, {}, localNextSpy);

  const nextSpyCalls = localNextSpy.getCalls();
  t.plan(2);
  t.is(nextSpyCalls.length, 1);
  t.deepEqual(nextSpyCalls[0].args[0], new Error('no code found in query for grant authorization'));
});

test('expects a state query param and calls next middleware if none present', async t => {
  const localNextSpy = sinon.spy();
  const noCodeNewTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {},
    query: { code: 'abc456' },
  };

  await handleAuthorizationCodeGrant(sinon.spy(), {}, noCodeNewTokenRequest, {}, localNextSpy);

  const nextSpyCalls = localNextSpy.getCalls();
  t.plan(2);
  t.is(nextSpyCalls.length, 1);
  t.deepEqual(nextSpyCalls[0].args[0], new Error('no state found in query for grant authorization'));
});

test('calls error middleware if possible clickjacking attempt detected', async t => {
  const localNextSpy = sinon.spy();
  const newTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {
      state: 'some-nonce'
    },
    query: {
      code: 'abc456',
      state: encodeURIComponent('a-different-nonce')
    },
  };

  await handleAuthorizationCodeGrant(
    fetchSucceedsWithOauthError,
    {
      clientId: 'my-client-id',
      clientSecret: 'my-client-secret',
      redirectUri: 'http://localhost:53134/auth'
    },
    newTokenRequest,
    {},
    localNextSpy
  );

  const nextCalls = localNextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error(`detected possible clickjacking attempt:
session state: some-nonce does not match oauth query: a-different-nonce`));
});

test('calls error middleware with caught fetch errors', async t => {
  const authorizationRequest = {
    log: { debug: sinon.spy(), error: sinon.spy() },
    session: { state: 'some-nonce' },
    query: { code: 'abc456', state: encodeURIComponent('some-nonce') },
  };
  const authFailsNextSpy = sinon.spy();
  const fetchThrows = () => {
    throw new Error('some-error-in-fetch');
  };

  await handleAuthorizationCodeGrant(fetchThrows, {}, authorizationRequest, {}, authFailsNextSpy);

  const nextCalls = authFailsNextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('some-error-in-fetch'));
});

test('calls error middleware with caught fetch rejections', async t => {
  const authorizationRequest = {
    log: { debug: sinon.spy(), error: sinon.spy() },
    session: { state: 'some-nonce' },
    query: { code: 'abc456', state: encodeURIComponent('some-nonce') },
  };
  const authFailsNextSpy = sinon.spy();
  const fetchRejects = () => Promise.reject('async-auth-request-error');

  await handleAuthorizationCodeGrant(fetchRejects, {}, authorizationRequest, {}, authFailsNextSpy);

  const nextCalls = authFailsNextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.is(nextCalls[0].args[0].cause, 'async-auth-request-error');
});
