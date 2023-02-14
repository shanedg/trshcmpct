import { randomBytes } from 'node:crypto';

/**
 * Create handler for rendering the login view
 * @param {Object} data Required options
 * @param {string} data.clientId Discord application id
 * @param {string} data.redirectUri Application path to redirect to with authorization code
 * @returns Handler function for rendering the login view
 */
export const createLoginRenderHandler = ({ clientId, redirectUri }) => {
  return (request, response, next) => {
    const nowInSeconds = Date.now() / 1000;

    const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
    const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
    const hasSession = sessionHasToken && tokenIsNotExpired;

    if (!hasSession) {
      const nonce = randomBytes(16).toString('base64');
      request.session.state = nonce;

      request.log.debug('render login page');
      response.render('login', {
        clientId,
        state: encodeURIComponent(nonce),
        redirectUri: encodeURIComponent(redirectUri),
      });
      return;
    }
    next();
  };
};
