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
  t.context.request = requestWithSpies;
  renderLogin(requestWithSpies, responseWithSpies, nextSpy);
});

test('creates a handler that renders login template', t => {
  t.plan(5);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'login');
  t.is(renderCalls[0].args.length, 2);
  t.like(renderCalls[0].args[1], {
    clientId: 'my-client-id',
    redirectUri: 'http%3A%2F%2Flocalhost%3A8080',
  });
  t.truthy(renderCalls[0].args[1].state);
});

test('creates a handler that adds state to the request session', t => {
  t.plan(1);
  t.truthy(t.context.request.session.state);
});

test('creates a handler that calls next if already logged in', t => {
  const localRenderSpy = sinon.spy();
  const localNextSpy = sinon.spy();
  const localResponseWithSpies = { render: localRenderSpy };
  const ninetySecondsFromNow = (Date.now() / 1000) + 90;
  const loggedInRequest = {
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
