/**
 * Create handler for rendering the login view
 * @param {Object} data Required options
 * @param {string} data.clientId Discord application id
 * @param {string} data.redirectUri Application path to redirect to with authorization code
 * @returns Handler that renders the login view with the provided data
 */
export const createLoginRenderHandler = ({ clientId, redirectUri }) => {
  // TODO: do we need to pass in clientId and redirectUri?
  // we could just get them from config.json and then this can just be a simple handler
  // instead of a handler factory lol

  // Render login screen for un-auth'd sessions
  return (request, response, next) => {
    const nowInSeconds = Date.now()/1000;

    const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
    const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
    const hasSession = sessionHasToken && tokenIsNotExpired;

    if (!hasSession) {
      request.log.debug('render login page');
      response.render('login', { clientId, redirectUri: encodeURIComponent(redirectUri) });
      return;
    }
    next();
  };
};
