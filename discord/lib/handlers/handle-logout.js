/**
 * Middleware handler for logging the user out
 * Based on this example:
 * https://www.npmjs.com/package/express-session#user-login
 * @param {express.Request} request
 * @param {express.Response} _response
 * @param {express.NextFunction} next
 */
export const handleLogout = (request, _response, next) => {
  // Can't log out if there's no session
  if (!request.session) {
    return next();
  }

  // Can't log out if not logged in
  if (!request.session.oauth) {
    return next();
  }

  request.session.authorized = null;
  request.session.oauth = null;
  request.session.oauthExpires = null;
  request.session.guildMembershipData = null;

  // Save the cleared values back to the old session
  request.session.save(sessionSaveError => {
    if (sessionSaveError) {
      return next(sessionSaveError);
    }

    // Once the old session has been updated, create a new one
    request.session.regenerate(sessionRegenerateError => {
      if (sessionRegenerateError) {
        return next(sessionRegenerateError);
      }

      next();
    });
  });
};
