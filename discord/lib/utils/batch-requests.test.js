import test from 'ava';
import sinon from 'sinon';

import { batchRequests } from './batch-requests';

/**
 * Fake implementation of fetch
 * Always throws
 * @param {string} url Url to fetch
 */
const fetchFails = url => { throw new Error(url); };

/**
 * Fake implementation of fetch
 * Always resolves
 * @param {string} url Url to fetch
 * @returns Fake response
 */
const fetchSucceeds =
  url => Promise.resolve({ json: () => 'response from ' + url });

/**
  * Fake implementation of fetch
  * Response#json always throws
  * @param {string} url Url to fetch
  * @returns Fake response
  */
const fetchWithBadResponseJson =
  url => Promise.resolve({ json: () => { throw new Error('response from ' + url); } });

const testEndpoints = ['https://some-url.fake/api/1', 'https://some-url.fake/api/2'];

const fetchFailsSpy = sinon.spy(fetchFails);
const fetchSucceedsSpy = sinon.spy(fetchSucceeds);
const fetchWithBadResponseSpy = sinon.spy(fetchWithBadResponseJson);

test('fetches the expected endpoints', async t => {
  t.plan(4);
  await t.truthy(batchRequests(fetchSucceedsSpy, testEndpoints));
  const fetchCalls = fetchSucceedsSpy.getCalls();
  t.is(fetchCalls.length, 2);
  // The actual implementation of fetch has no guarantees
  // about order of completion but this is fine for a lil test.
  t.is(fetchCalls[0].args[0], 'https://some-url.fake/api/1');
  t.is(fetchCalls[1].args[0], 'https://some-url.fake/api/2');
});

test('rejects if fetch fails', async t => {
  t.plan(2);
  await t.throwsAsync(batchRequests(fetchFailsSpy, testEndpoints));
  t.is(fetchFailsSpy.callCount, 1);
});

test('rejects if response#json fails', async t => {
  t.plan(2);
  await t.throwsAsync(batchRequests(fetchWithBadResponseSpy, testEndpoints));
  // Called once for every url in testEndpoints.
  t.is(fetchWithBadResponseSpy.callCount, 2);
});
