import { jest } from '@jest/globals';

import { batchRequests } from './batch-requests';

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
 * Always throws
 * @param {string} url Url to fetch
 */
const fetchFails = url => { throw new Error(url); };

/**
  * Fake implementation of fetch
  * Response#json always throws
  * @param {string} url Url to fetch
  * @returns Fake response
  */
const fetchWithBadResponseJson =
   url => Promise.resolve({ json: () => { throw new Error('response from ' + url); } });

describe('batchRequests', () => {
  const testEndpoints = ['https://some-url.fake/api/1', 'https://some-url.fake/api/2'];
  let fetch;

  beforeEach(async () => {
    fetch && fetch.mockClear();
    fetch = jest.fn(fetchSucceeds);
  });

  it('calls fetch with the expected endpoints', async () => {
    await batchRequests(fetch, testEndpoints);
    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0].length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe('https://some-url.fake/api/1');
    // The actual implementation of fetch has no guarantees
    // about order of completion but this is fine for a lil test.
    expect(fetch.mock.calls[1].length).toBe(1);
    expect(fetch.mock.calls[1][0]).toBe('https://some-url.fake/api/2');
  });

  it('throws if any calls to fetch fail', async () => {
    fetch
      .mockImplementationOnce(fetchFails);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('https://some-url.fake/api/1'));
    expect(fetch.mock.calls.length).toBe(1);
    fetch.mockClear();

    fetch
      .mockImplementationOnce(fetchSucceeds)
      .mockImplementationOnce(fetchFails);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('https://some-url.fake/api/2'));
    expect(fetch.mock.calls.length).toBe(2);
  });

  it('throws if any calls to response#json fail', async () => {
    fetch
      .mockImplementationOnce(fetchWithBadResponseJson)
      .mockImplementationOnce(fetchSucceeds);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('response from https://some-url.fake/api/1'));
    fetch.mockClear();

    fetch
      .mockImplementationOnce(fetchSucceeds)
      .mockImplementationOnce(fetchWithBadResponseJson);
    await expect(batchRequests(fetch, testEndpoints))
      .rejects.toThrow(new Error('response from https://some-url.fake/api/2'));
  });
});
