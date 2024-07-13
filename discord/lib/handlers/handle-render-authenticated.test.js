import test from 'ava';
import sinon from 'sinon';

import { handleRenderAuthenticated } from './handle-render-authenticated.js';

/**
 * Helper to create requests for testing
 * @param {Object | undefined} session Extra data to add to the request session
 * @returns A minimal mock request object
 */
const getRequest = (session = {}) => ({
  log: {
    debug: sinon.spy(),
    error: sinon.spy(),
  },
  session: {
    ...session,
  },
});

test('renders the authenticated view', async t => {
  const renderSpy = sinon.spy(() => Promise.resolve());
  const authenticatedRequest = getRequest({
    oauth: {
      access_token: 'some-access-token',
      expires_in: 90,
    },
    state: 'some-encoded-state',
  });

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    authenticatedRequest,
    { render: renderSpy },
    sinon.spy()
  );

  const renderCalls = renderSpy.getCalls();
  t.plan(2);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], '/absolute/path/to/html/directory/index.html');
});

test('calls next middleware if missing authentication', async t => {
  const nextSpy = sinon.spy();
  const requestMissingAuthentication = getRequest({
    state: 'some-encoded-state'
  });

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    requestMissingAuthentication,
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});

test('calls next middleware if missing state', async t => {
  const nextSpy = sinon.spy();
  const requestMissingState = getRequest({
    oauth: {
      access_token: 'some-access-token',
      expires_in: 90,
    },
  });

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    requestMissingState,
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});
