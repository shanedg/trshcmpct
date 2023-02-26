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

test('renders login template with login link', t => {
  const renderCalls = renderSpy.getCalls();
  t.plan(11);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'login');
  t.is(renderCalls[0].args.length, 2);

  const { login_link }  = renderCalls[0].args[1];
  t.assert(login_link);

  const url = new URL(login_link);
  t.is(url.origin, 'https://discord.com');
  t.is(url.pathname, '/api/oauth2/authorize');

  const params = url.searchParams;
  t.is(params.get('client_id'), 'my-client-id');
  t.is(params.get('redirect_uri'), 'http://localhost:8080');
  // We don't know the state in advance
  t.assert(params.get('state'));
  t.is(params.get('response_type'), 'code');
  t.is(params.get('scope'), 'guilds.members.read');
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
