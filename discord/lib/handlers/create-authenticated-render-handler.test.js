import test from 'ava';
import sinon from 'sinon';

import { createAuthenticatedRenderHandler } from './create-authenticated-render-handler';

const debugSpy = sinon.spy();
const errorSpy = sinon.spy();
const nextSpy = sinon.spy();
const renderSpy = sinon.spy();
const sendSpy = sinon.spy();
const sendFileSpy = sinon.spy(() => Promise.resolve());
const responseWithSpies = { render: renderSpy, send: sendSpy, sendFile: sendFileSpy };

test.before(async () => {
  const reuseSessionToken = createAuthenticatedRenderHandler({
    htmlDirectory: '/absolute/path/to/html/directory',
    htmlFilename: 'index.html',
  });
  const sessionTokenRequest = {
    log: { error: errorSpy, debug: debugSpy },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
    },
  };
  await reuseSessionToken(sessionTokenRequest, responseWithSpies, nextSpy);
});

test('creates a handler that > logs to debug', t => {
  t.plan(2);
  const debugCalls = debugSpy.getCalls();
  t.is(debugCalls.length, 1);
  t.is(debugCalls[0].args[0], 'render authenticated client');
});

test('creates a handler that > renders the authenticated view', t => {
  t.plan(3);
  const sendFileCalls = sendFileSpy.getCalls();
  t.is(sendFileCalls.length, 1);
  t.is(sendFileCalls[0].args[0], 'index.html');
  t.is(sendFileCalls[0].args[1].root, '/absolute/path/to/html/directory');
});
