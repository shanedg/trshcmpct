/**
 * Ensure that the incoming request is for an authenticated session
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 */
export const requireAuthentication = async (request, response, next) => {
  // TODO: Update this with future changes to session handling
  if (!request.session.oauth || !request.session.oauth.access_token) {
    // Unauthorized aka unauthenticated
    response.sendStatus(401);
    return;
  }
  next();
};
