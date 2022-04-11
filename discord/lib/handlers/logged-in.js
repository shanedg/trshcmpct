const {
  authFromCode,
  getFetchWithOauth,
  getLoggedInData,
} = require('../utils');

/**
 * Create handler for getting a fresh token
 * Injects the provided fetch function as a dependency
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Handler that uses the provided dependencies to render the logged-in view
 */
const getNewTokenWithDependencies = (fetch, {
  clientId,
  clientSecret,
  guildId,
  port
}) => {
  // Handler to get a new token to render logged-in
  return async (request, response, _next) => {
    request.log.debug('get new token');
    const { code } = request.query;
    const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, port });
    const oauthFinal = await oauthResult.json();
    const nowInSeconds = Date.now()/1000;

    request.session.oauth = oauthFinal;
    request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;

    const fetchWithOauth = getFetchWithOauth(fetch, oauthFinal);
    const data = await getLoggedInData(fetchWithOauth, { guildId });
    response.render('logged-in', { ...data, newSession: true });
  };
};

/**
 * Create a handler for reusing an existing session token
 * Injects the provided fetch function as a dependency
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Handler that uses the provided dependencies to render the logged-in view
 */
const getReuseSessionTokenWithDependencies = (fetch, { guildId }) => {
  // Handler to reuse session token to render logged-in
  return async (request, response, next) => {
    if (request.session.oauth && request.session.oauth.access_token) {
      request.log.debug('reuse session token');
      const fetchWithOauth = getFetchWithOauth(fetch, request.session.oauth);
      const data = await getLoggedInData(fetchWithOauth, { guildId });
      response.render('logged-in', { ...data, newSession: false });
      return;
    }
    next();
  };
};

module.exports = {
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
};
