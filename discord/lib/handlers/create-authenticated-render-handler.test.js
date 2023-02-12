import test from 'ava';
import sinon from 'sinon';

import { createAuthenticatedRenderHandler } from './create-authenticated-render-handler';

test('creates a handler that renders the authenticated view', async t => {
  const renderSpy = sinon.spy(() => Promise.resolve());
  const response = { render: renderSpy };
  const authenticatedRenderHandler = createAuthenticatedRenderHandler({
    htmlDirectory: '/absolute/path/to/html/directory',
    htmlFilename: 'index.html',
  });
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
  await authenticatedRenderHandler(authenticatedRequest, response, sinon.spy());
  const renderCalls = renderSpy.getCalls();
  t.plan(2);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], '/absolute/path/to/html/directory/index.html');
});

test('creates a handler that calls next if missing authentication', async t => {
  const nextSpy = sinon.spy();
  const unauthenticatedRequest = {
    log: { error: sinon.spy() },
    session: {}
  };
  const authenticatedRenderHandler = createAuthenticatedRenderHandler({
    htmlDirectory: '/absolute/path/to/html/directory',
    htmlFilename: 'index.html',
  });
  await authenticatedRenderHandler(unauthenticatedRequest, {}, nextSpy);
  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});

test('creates a handler that calls next if missing state', async t => {
  const nextSpy = sinon.spy();
  const unauthenticatedRequest = {
    log: { error: sinon.spy() },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
    }
  };
  const authenticatedRenderHandler = createAuthenticatedRenderHandler({
    htmlDirectory: '/absolute/path/to/html/directory',
    htmlFilename: 'index.html',
  });
  await authenticatedRenderHandler(unauthenticatedRequest, {}, nextSpy);
  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});
