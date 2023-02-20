/**
 * Handler function for responding to unauthenticated requests
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const requireAuthentication = async (request, response, next) => {
  if (!request.session.oauth || !request.session.oauth.access_token) {
    // Unauthorized aka unauthenticated
    response.sendStatus(401);
    return;
  }
  next();
};
