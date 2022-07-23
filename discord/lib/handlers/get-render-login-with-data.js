/**
 * Create handler for rendering the login view
 * @param {Object} data Required data
 * @returns Handler that renders the login view with the provided data
 */
export const getRenderLoginWithData = ({ clientId, redirectUri }) => {
  // Render login screen for un-auth'd sessions
  return (request, response, next) => {
    request.session.views = (request.session.views || 0) + 1;

    const nowInSeconds = Date.now()/1000;

    const { code } = request.query;
    const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
    const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
    const hasSession = sessionHasToken && tokenIsNotExpired;

    if (!code && !hasSession) {
      request.log.debug('render login page');
      response.render('index', { clientId, redirectUri: encodeURIComponent(redirectUri) });
      return;
    }
    next();
  };
};
