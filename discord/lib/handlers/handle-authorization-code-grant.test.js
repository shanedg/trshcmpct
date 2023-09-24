import test from 'ava';
import sinon from 'sinon';

import { handleAuthorizationCodeGrant } from './handle-authorization-code-grant';

/**
 * Helper to create requests for testing
 * @param {Object} query Extra data to add to the request query
 * @param {Object} session Extra data to add to the request session
 * @returns A minimal mock request object
 */
const getRequest = (query = {}, session = {}) => ({
  log: {
    debug: sinon.spy(),
    error: sinon.spy(),
  },
  query: { ...query },
  session: { ...session },
});

test.before(async t => {
  t.context.request = getRequest(
    { code: 'abc456', state: encodeURIComponent('some-nonce')},
    { state: 'some-nonce' }
  );
  await handleAuthorizationCodeGrant(
    // Mock fetch resolves with a fake token
    () => Promise.resolve({ json: () => ({
      access_token: 'asdf12345',
      expires_in: 5000
    })}),
    {
      clientId: 'my-client-id',
      clientSecret: 'my-client-secret',
      redirectUri: 'http://localhost:53134/auth',
    },
    t.context.request,
    {},
    sinon.spy()
  );
});

test('adds oauth result and expiry time to session if auth succeeds', t => {
  t.plan(2);
  t.deepEqual(t.context.request.session.oauth, {
    access_token: 'asdf12345',
    expires_in: 5000,
  });
  // OAuth should expire in the future
  t.assert(t.context.request.session.oauthExpires > Date.now() / 1000);
});

test('expects a code query param and calls next middleware if none present', async t => {
  const nextSpy = sinon.spy();

  await handleAuthorizationCodeGrant(sinon.spy(), {}, getRequest(), {}, nextSpy);

  const nextSpyCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextSpyCalls.length, 1);
  t.deepEqual(nextSpyCalls[0].args[0], new Error('no code found in query for grant authorization'));
});

test('expects a state query param and calls next middleware if none present', async t => {
  const nextSpy = sinon.spy();

  await handleAuthorizationCodeGrant(sinon.spy(), {}, getRequest({ code: 'abc456' }), {}, nextSpy);

  const nextSpyCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextSpyCalls.length, 1);
  t.deepEqual(nextSpyCalls[0].args[0], new Error('no state found in query for grant authorization'));
});

test('calls error middleware if possible clickjacking attempt detected', async t => {
  const nextSpy = sinon.spy();

  await handleAuthorizationCodeGrant(
    sinon.spy(),
    {
      clientId: 'my-client-id',
      clientSecret: 'my-client-secret',
      redirectUri: 'http://localhost:53134/auth'
    },
    getRequest(
      { code: 'abc456', state: encodeURIComponent('a-different-nonce') },
      { state: 'some-nonce' }
    ),
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error(`detected possible clickjacking attempt:
session state: some-nonce does not match oauth query: a-different-nonce`));
});

test('calls error middleware with caught fetch errors', async t => {
  const nextSpy = sinon.spy();

  await handleAuthorizationCodeGrant(
    () => { throw new Error('some-error-in-fetch'); },
    {},
    getRequest(
      { code: 'abc456', state: encodeURIComponent('some-nonce') },
      { state: 'some-nonce' }
    ),
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('some-error-in-fetch'));
});

test('calls error middleware with caught fetch rejections', async t => {
  const nextSpy = sinon.spy();

  await handleAuthorizationCodeGrant(
    () => Promise.reject('async-auth-request-error'),
    {},
    getRequest(
      { code: 'abc456', state: encodeURIComponent('some-nonce') },
      { state: 'some-nonce' }
    ),
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.is(nextCalls[0].args[0].cause, 'async-auth-request-error');
});
