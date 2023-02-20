import { randomBytes } from 'node:crypto';

/**
 * Handler function for rendering the login view
 *
 * Express expects handler function signatures with only three parameters
 * where the first parameter is the request object (request, response, next).
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first argument and support the expected signature.
 * e.g.
 * ```
 * // the returned function no longer expects the first two arguments because they are prefilled
 * const boundHandler = handleRenderLogin.prototype.bind(null, 'app-id', 'http://localhost:53134/auth')
 * ```
 * @param {string} clientId Discord application id
 * @param {string} redirectUri Application path to redirect to with authorization code
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleRenderLogin = (clientId, redirectUri, request, response, next) => {
  const nowInSeconds = Date.now() / 1000;
  const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
  const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
  const hasValidToken = sessionHasToken && tokenIsNotExpired;

  if (hasValidToken) {
    return next();
  }

  const nonce = randomBytes(16).toString('base64');
  request.session.state = nonce;

  request.log.debug('render login page');
  return response.render('login', {
    clientId,
    state: encodeURIComponent(nonce),
    redirectUri: encodeURIComponent(redirectUri),
  });
};
