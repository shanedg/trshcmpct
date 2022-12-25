import test from 'ava';
import sinon from 'sinon';

import { createLoginRenderHandler } from './create-login-render-handler';

const renderSpy = sinon.spy();
const sendSpy = sinon.spy();
const errorSpy = sinon.spy();
const debugSpy = sinon.spy();
const nextSpy = sinon.spy();
const responseWithSpies = { render: renderSpy, send: sendSpy };

test.before(t => {
  const renderLogin = createLoginRenderHandler({
    clientId: 'my-client-id',
    redirectUri: 'http://localhost:8080',
  });
  t.context.renderLogin = renderLogin;
  const requestWithSpies = {
    log: { error: errorSpy, debug: debugSpy },
    session: {},
    query: {},
  };
  renderLogin(requestWithSpies, responseWithSpies, nextSpy);
});

test('renders login template', t => {
  t.plan(2);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'login');
});

test('injects client id in the login template', t => {
  t.plan(3);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args.length, 2);
  t.like(renderCalls[0].args[1], {
    clientId: 'my-client-id',
    redirectUri: 'http%3A%2F%2Flocalhost%3A8080',
  });
});

test('logs to debug', t => {
  t.plan(2);
  const debugCalls = debugSpy.getCalls();
  t.is(debugCalls.length, 1);
  t.is(debugCalls[0].args[0], 'render login page');
});

test('calls next if already logged in', t => {
  const localRenderSpy = sinon.spy();
  const localSendSpy = sinon.spy();
  const localNextSpy = sinon.spy();
  const localResponseWithSpies = { render: localRenderSpy, send: localSendSpy };
  const ninetySecondsFromNow = (Date.now()/1000)+90;
  const localErrorSpy = sinon.spy();
  const localDebugSpy = sinon.spy();
  const loggedInRequest = {
    log: { error: localErrorSpy, debug: localDebugSpy },
    session: {
      oauth: { access_token: 'access-token' },
      oauthExpires: ninetySecondsFromNow,
    },
    query: {},
  };
  t.context.renderLogin(loggedInRequest, localResponseWithSpies, localNextSpy);
  const renderCalls = localRenderSpy.getCalls();
  const nextCalls = localNextSpy.getCalls();
  t.is(renderCalls.length, 0);
  t.is(nextCalls.length, 1);
});
