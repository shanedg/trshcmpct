import {
  getFetchWithOauth,
  getLoggedInData,
} from '../utils';

/**
 * Create a handler for reusing an existing session token
 * Injects the provided fetch function as a dependency
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Handler that uses the provided dependencies to render the authenticated view
 */
export const getReuseSessionTokenWithDependencies = (fetch, { guildId }) => {
  // Handler to reuse session token to render authenticated
  return async (request, response, next) => {
    if (request.session.oauth && request.session.oauth.access_token) {
      request.log.debug('reuse session token');
      const fetchWithOauth = getFetchWithOauth(fetch, request.session.oauth);
      const data = await getLoggedInData(fetchWithOauth, { guildId });
      response.render('authenticated', { ...data, newSession: false });
      return;
    }
    next();
  };
};
