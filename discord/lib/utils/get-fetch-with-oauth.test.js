import test from 'ava';
import sinon from 'sinon';

import { fetchWithOauth } from './get-fetch-with-oauth.js';

test.before(async t => {
  // Mock fetch resolves
  t.context.fetch = sinon.spy(url => Promise.resolve({ json: () => 'response from ' + url }));
  await fetchWithOauth(
    t.context.fetch,
    {
      token_type: 'Bearer',
      access_token: 'accesstoken'
    },
    'https://www.example.com'
  );
});

test('calls fetch with url', t => {
  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[0], 'https://www.example.com');
});

test('calls fetch with authorization header', t => {
  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[1].headers.authorization, 'Bearer accesstoken');
});
