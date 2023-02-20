import test from 'ava';
import sinon from 'sinon';

import { handleRenderAuthenticated } from './handle-render-authenticated';

test('renders the authenticated view', async t => {
  const renderSpy = sinon.spy(() => Promise.resolve());
  const response = { render: renderSpy };
  const authenticatedRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
      state: 'some-encoded-state',
    },
  };

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    authenticatedRequest,
    response,
    sinon.spy()
  );

  const renderCalls = renderSpy.getCalls();
  t.plan(2);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], '/absolute/path/to/html/directory/index.html');
});

test('calls next middleware if missing authentication', async t => {
  const nextSpy = sinon.spy();
  const unauthenticatedRequest = {
    log: { debug: sinon.spy(), error: sinon.spy() },
    session: {}
  };

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    unauthenticatedRequest,
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});

test('calls next middleware if missing state', async t => {
  const nextSpy = sinon.spy();
  const unauthenticatedRequest = {
    log: { debug: sinon.spy(), error: sinon.spy() },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
    }
  };

  await handleRenderAuthenticated(
    '/absolute/path/to/html/directory',
    'index.html',
    unauthenticatedRequest,
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});
