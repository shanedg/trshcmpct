import { authFromCode } from '../utils';

/**
 * Create handler for getting a fresh token
 * Injects a method for network requests as well as auth config
 * @param {Function} fetch Fetch implementation
 * @param {Object} config Required auth data
 * @param {string} config.clientId
 * @param {string} config.clientSecret
 * @param {string} config.redirectUri
 * @returns Handler that authenticates a new session
 */
export const createAuthorizationCodeGrantHandler = (fetch, {
  clientId,
  clientSecret,
  redirectUri
}) => {
  // Handler to get a new token for authentication
  return async (request, _response, next) => {
    request.log.debug('get new token');
    const { code } = request.query;
    if (!code) {
      request.log.debug('no code found');
      next();
      return;
    }

    const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, redirectUri });
    const oauthFinal = await oauthResult.json();
    if (oauthFinal.error) {
      request.log.error('bad authorization');
      throw new Error(`bad authorization: ${JSON.stringify(oauthFinal, null, 2)}`);
    }

    const nowInSeconds = Date.now() / 1000;
    request.session.oauth = oauthFinal;
    request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;
    next();
  };
};
