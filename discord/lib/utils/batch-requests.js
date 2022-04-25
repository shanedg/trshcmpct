/**
 * Batch custom fetch requests to several urls at once
 * @param {Function} fetch Fetch implementation
 * @param {string[]} urls Endpoints to fetch against
 * @returns List of request results
 */
export const batchRequests = async (fetch, urls) => {
  const requests = await Promise.all(urls.map(url => fetch(url)));
  return await Promise.all(requests.map(r => r.json()));
};
