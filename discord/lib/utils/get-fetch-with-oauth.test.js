import test from 'ava';
import sinon from 'sinon';

import { fetchWithOauth } from './get-fetch-with-oauth';

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds = url => Promise.resolve({ json: () => 'response from ' + url });

test.beforeEach(t => {
  t.context.fetch = sinon.spy(fetchSucceeds);
});

test('calls fetch with url', async t => {
  await fetchWithOauth(
    t.context.fetch,
    {
      token_type: 'Bearer',
      access_token: 'accesstoken'
    },
    'https://www.example.com'
  );

  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);
  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[0], 'https://www.example.com');
});

test('calls fetch with authorization header', async t => {
  await fetchWithOauth(
    t.context.fetch,
    {
      token_type: 'Bearer',
      access_token: 'accesstoken'
    },
    'https://www.example.com'
  );
  const fetchCalls = t.context.fetch.getCalls();
  t.plan(3);
  t.is(fetchCalls.length, 1);  t.is(fetchCalls[0].args.length, 2);
  t.is(fetchCalls[0].args[1].headers.authorization, 'Bearer accesstoken');
});
