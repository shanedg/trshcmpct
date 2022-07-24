import test from 'ava';
import sinon from 'sinon';

import { getNewTokenWithDependencies } from './get-new-token-with-dependencies';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
  url => Promise.resolve({ json: () => 'response from ' + url });

const renderSpy = sinon.spy();
const sendSpy = sinon.spy();
const logErrorSpy = sinon.spy();
const logDebugSpy = sinon.spy();
const nextSpy = sinon.spy();
const spiedResponse = { render: renderSpy, send: sendSpy };

test.before(async () => {
  const getNewToken = getNewTokenWithDependencies(fetchSucceeds, {
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    guildId: '456',
    port: 1234
  });
  const newTokenRequest = {
    log: { error: logErrorSpy, debug: logDebugSpy },
    session: { views: 0 },
    query: { code: 'abc456' },
  };
  await getNewToken(newTokenRequest, spiedResponse, nextSpy);
});

test('creates a handler that logs to debug', t => {
  t.plan(2);
  const logSpyCalls = logDebugSpy.getCalls();
  t.is(logSpyCalls.length, 1);
  t.is(logSpyCalls[0].args[0], 'get new token');
});

test('creates a handler that renders the logged in template', t => {
  t.plan(2);
  const renderSpyCalls = renderSpy.getCalls();
  t.is(renderSpyCalls.length, 1);
  t.is(renderSpyCalls[0].args[0], 'authenticated');
});

test('creates a handler that injects new session flag', t => {
  t.plan(3);
  const renderSpyCalls = renderSpy.getCalls();
  t.is(renderSpyCalls.length, 1);
  t.is(renderSpyCalls[0].args.length, 2);
  t.like(renderSpyCalls[0].args[1], { newSession: true });
});
