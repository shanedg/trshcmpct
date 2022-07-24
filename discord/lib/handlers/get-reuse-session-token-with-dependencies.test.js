import test from 'ava';
import sinon from 'sinon';

import { getReuseSessionTokenWithDependencies } from './get-reuse-session-token-with-dependencies';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
 url => Promise.resolve({ json: () => 'response from ' + url });

const debugSpy = sinon.spy();
const errorSpy = sinon.spy();
const nextSpy = sinon.spy();
const renderSpy = sinon.spy();
const sendSpy = sinon.spy();
const responseWithSpies = { render: renderSpy, send: sendSpy };

test.before(async () => {
  const reuseSessionToken = getReuseSessionTokenWithDependencies(fetchSucceeds, { guildId: '456' });
  const sessionTokenRequest = {
    log: { error: errorSpy, debug: debugSpy },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
      views: 10,
    },
  };
  await reuseSessionToken(sessionTokenRequest, responseWithSpies, nextSpy);
});

test('creates a handler that > logs to debug', t => {
  t.plan(2);
  const debugCalls = debugSpy.getCalls();
  t.is(debugCalls.length, 1);
  t.is(debugCalls[0].args[0], 'reuse session token');
});

test('creates a handler that > renders the logged in template', t => {
  t.plan(2);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'authenticated');
});

test('creates a handler that > injects new session flag', t => {
  t.plan(3);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args.length, 2);
  t.like(renderCalls[0].args[1], {
    newSession: false,
  });
});
