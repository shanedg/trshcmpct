import { authFromCode } from '../utils/auth-from-code';

/**
 * Handler function for authenticating a new session
 * with the authorization code grant flow:
 * https://discordjs.guide/oauth2/#authorization-code-grant-flow
 *
 * Express expects handler function signatures with only three parameters
 * where the first parameter is the request object (request, response, next).
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first two arguments and support the expected signature.
 * e.g.
 * ```
 * // the returned function no longer expects the first two arguments because they are prefilled
 * const boundHandler = handleAuthorizationCodeGrant.prototype.bind(null, fetch, configData)
 * ```
 * @param {Function} fetch Fetch implementation
 * @param {Object} config Required auth data
 * @param {string} config.clientId Discord application id
 * @param {string} config.clientSecret Discord client secret
 * @param {string} config.redirectUri Application authorization url
 * @param {express.Request} request
 * @param {express.Response} _response
 * @param {express.NextFunction} next
 */
export const handleAuthorizationCodeGrant = async (
  fetch,
  {
    clientId,
    clientSecret,
    redirectUri
  },
  request,
  _response,
  next
) => {
  request.log.debug('get new token');
  const { code, state } = request.query;

  if (!code) {
    return next(new Error('no code found in query for grant authorization'));
  }

  if (!state) {
    return next(new Error('no state found in query for grant authorization'));
  }

  const decodedState = decodeURIComponent(state);
  if (decodedState !== request.session.state) {
    const message = `session state: ${request.session.state} does not match oauth query: ${decodedState}`;
    return next(new Error(`detected possible clickjacking attempt:\n${message}`));
  }

  let oauthFinal;
  try {
    const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, redirectUri });
    oauthFinal = await oauthResult.json();
  } catch (oauthRequestError) {
    request.log.error(oauthRequestError);
    return next(new Error('problem authorizing code', { cause: oauthRequestError }));
  }

  if (oauthFinal.error) {
    request.log.error(oauthFinal.error);
    return next(new Error('bad authorization', { cause: oauthFinal.error }));
  }

  const nowInSeconds = Date.now() / 1000;
  request.session.oauth = oauthFinal;
  request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;
  next();
};
