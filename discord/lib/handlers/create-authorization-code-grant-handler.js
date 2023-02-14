import { authFromCode } from '../utils';

/**
 * Create handler for getting a fresh token
 * with the authorization code grant flow:
 * https://discordjs.guide/oauth2/#authorization-code-grant-flow
 * Injects a method for network requests as well as auth config
 * @param {Function} fetch Fetch implementation
 * @param {Object} config Required auth data
 * @param {string} config.clientId
 * @param {string} config.clientSecret
 * @param {string} config.redirectUri
 * @returns Handler function for authenticating a new session
 */
export const createAuthorizationCodeGrantHandler = (fetch, {
  clientId,
  clientSecret,
  redirectUri
}) => {
  return async (request, _response, next) => {
    request.log.debug('get new token');
    const { code, state } = request.query;

    if (!code) {
      request.log.debug('no code found');
      next();
      return;
    }

    if (!state) {
      request.log.debug('no state found');
      next();
      return;
    }

    const decodedState = decodeURIComponent(state);
    if (decodedState !== request.session.state) {
      next(`detected possible clickjacking attempt
  session state: ${request.session.state}
  oauth state: ${decodedState}`);
      return;
    }

    let oauthFinal;
    try {
      const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, redirectUri });
      oauthFinal = await oauthResult.json();
    } catch (e) {
      request.log.error(`problem authorizing code: ${e}`);
      next(e);
      return;
    }

    if (oauthFinal.error) {
      next(`bad authorization: ${oauthFinal.error}`);
      return;
    }

    const nowInSeconds = Date.now() / 1000;
    request.session.oauth = oauthFinal;
    request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;
    next();
  };
};
