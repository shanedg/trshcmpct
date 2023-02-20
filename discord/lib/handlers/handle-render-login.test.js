import test from 'ava';
import sinon from 'sinon';

import { handleRenderLogin } from './handle-render-login';

const renderSpy = sinon.spy();
const sendSpy = sinon.spy();
const errorSpy = sinon.spy();
const debugSpy = sinon.spy();
const nextSpy = sinon.spy();
const responseWithSpies = { render: renderSpy, send: sendSpy };

test.before(t => {
  const requestWithSpies = {
    log: { error: errorSpy, debug: debugSpy },
    session: {},
    query: {},
  };
  t.context.renderLogin = handleRenderLogin;
  t.context.request = requestWithSpies;
  handleRenderLogin('my-client-id', 'http://localhost:8080', requestWithSpies, responseWithSpies, nextSpy);
});

test('renders login template', t => {
  const renderCalls = renderSpy.getCalls();
  t.plan(5);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'login');
  t.is(renderCalls[0].args.length, 2);
  t.like(renderCalls[0].args[1], {
    clientId: 'my-client-id',
    redirectUri: 'http%3A%2F%2Flocalhost%3A8080',
  });
  t.truthy(renderCalls[0].args[1].state);
});

test('adds state to the request session', t => {
  t.plan(1);
  t.truthy(t.context.request.session.state);
});

test('calls next middleware if already logged in', t => {
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

  t.context.renderLogin('my-client-id', 'http://localhost:8080', loggedInRequest, localResponseWithSpies, localNextSpy);

  const renderCalls = localRenderSpy.getCalls();
  const nextCalls = localNextSpy.getCalls();
  t.plan(2);
  t.is(renderCalls.length, 0);
  t.is(nextCalls.length, 1);
});
