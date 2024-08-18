import test from 'ava';
import sinon from 'sinon';

import { handleAuthorizationCodeGrant } from './handle-authorization-code-grant.js';

/**
 * Helper that mocks a successful code grant request
 */
const successfulFetch = () => Promise.resolve({ json: () => ({
  // Mock fetch resolves with a fake token
  access_token: 'asdf12345',
  expires_in: 5000
})});

/**
 * Application configuration required for authorization
 */
const authorizationConfig = {
  clientId: 'my-client-id',
  clientSecret: 'my-client-secret',
  redirectUri: 'http://localhost:53134/auth',
};

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
  query: {
    code: 'abc456',
    state: encodeURIComponent('some-nonce'),
    ...query
  },
  session: {
    regenerate: sinon.spy(callback => callback()),
    save: sinon.spy(callback => callback()),
    ...session
  },
});

test('adds oauth result and expiry time to session if auth succeeds', async t => {
  const request = getRequest(
    { code: 'abc456', state: encodeURIComponent('some-nonce')},
    { state: 'some-nonce' }
  );
  await handleAuthorizationCodeGrant(
    successfulFetch,
    authorizationConfig,
    request,
    {},
    sinon.spy()
  );
  t.plan(2);
  t.deepEqual(request.session.oauth, {
    access_token: 'asdf12345',
    expires_in: 5000,
  });
  // OAuth should expire in the future
  t.assert(request.session.oauthExpires > Math.floor(Date.now() / 1000));
});

test('expects a code query param and calls error middleware if none present', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    sinon.spy(),
    {},
    getRequest({ code: undefined, state: undefined }),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('no code found in query for grant authorization'));
});

test('expects a state query param and calls error middleware if none present', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(sinon.spy(), {}, getRequest({ state: undefined }), {}, next);
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('no state found in query for grant authorization'));
});

test('calls error middleware if possible clickjacking attempt detected', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    sinon.spy(),
    authorizationConfig,
    getRequest(
      { state: encodeURIComponent('a-different-nonce') },
      { state: 'some-nonce' }
    ),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error(`detected possible clickjacking attempt:
session state: some-nonce does not match oauth query: a-different-nonce`));
});

test('calls error middleware with caught fetch errors', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    () => { throw new Error('some-error-in-fetch'); },
    {},
    getRequest(
      {},
      { state: 'some-nonce' }
    ),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('some-error-in-fetch'));
});

test('calls error middleware with caught fetch rejections', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    () => Promise.reject('async-auth-request-error'),
    {},
    getRequest(
      {},
      { state: 'some-nonce' }
    ),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem authorizing code'));
  t.is(nextCalls[0].args[0].cause, 'async-auth-request-error');
});

test('calls error middleware if unable to create new session', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    successfulFetch,
    authorizationConfig,
    getRequest(
      {},
      {
        regenerate: sinon.spy(callback => callback(new Error('unable-to-regenerate'))),
        state: 'some-nonce',
      }
    ),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unable-to-regenerate'));
});

test('calls error middleware if unable to save session', async t => {
  const next = sinon.spy();
  await handleAuthorizationCodeGrant(
    successfulFetch,
    authorizationConfig,
    getRequest(
      {},
      {
        save: sinon.spy(callback => callback(new Error('unable-to-save'))),
        state: 'some-nonce',
      }
    ),
    {},
    next
  );
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unable-to-save'));
});
