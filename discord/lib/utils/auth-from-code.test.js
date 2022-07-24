import test from 'ava';
import sinon from 'sinon';

import { authFromCode } from './auth-from-code';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds = url => Promise.resolve({ json: () => 'response from ' + url });

test.before(async t => {
  const fetch = sinon.spy(fetchSucceeds);
  t.context.fetch = fetch;
  await authFromCode(fetch, {
    code: 'mycode',
    clientId: 'myclientid',
    clientSecret: 'myclientsecret',
    port: '12345'
  });
});

test('calls fetch with oauth url', t => {
  t.plan(3);
  const fetchCalls = t.context.fetch.getCalls();
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[0], 'https://discord.com/api/oauth2/token');
});

test('calls fetch with oauth body', t => {
  t.plan(3);
  const fetchCalls = t.context.fetch.getCalls();
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  const bodyParams = fetchCalls[0].args[1].body;
  t.is(bodyParams.toString(), [
    'client_id=myclientid',
    'client_secret=myclientsecret',
    'code=mycode',
    'grant_type=authorization_code',
    'redirect_uri=http%3A%2F%2Flocalhost%3A12345',
    'scope=identify'
  ].join('&'));
});
