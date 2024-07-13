import test from 'ava';
import sinon from 'sinon';

import { authFromCode } from './auth-from-code.js';

test.before(async t => {
  // Mock fetch resolves
  t.context.fetch = sinon.spy(url => Promise.resolve({ json: () => 'response from ' + url }));
  await authFromCode(t.context.fetch, {
    code: 'mycode',
    clientId: 'myclientid',
    clientSecret: 'myclientsecret',
    redirectUri: 'http://localhost:12345'
  });
});

test('calls fetch with oauth url', t => {
  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[0], 'https://discord.com/api/oauth2/token');
});

test('calls fetch with oauth body', t => {
  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  const bodyParams = fetchCalls[0].args[1].body;
  t.is(bodyParams.toString(), [
    'client_id=myclientid',
    'client_secret=myclientsecret',
    'code=mycode',
    'grant_type=authorization_code',
    'redirect_uri=http%3A%2F%2Flocalhost%3A12345',
    'scope=guilds.members.read'
  ].join('&'));
});
