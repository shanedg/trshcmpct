/**
 * Middleware handler that ensures a request is authenticated
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const requireAuthentication = async (request, response, next) => {
  if (!request.session.oauth || !request.session.oauth.access_token) {
    // 401 Unauthorized - can't be authorized without authentication | "you are who you say you are"
    request.log.debug('missing authentication - 401');
    return response.sendStatus(401);
  }
  next();
};
