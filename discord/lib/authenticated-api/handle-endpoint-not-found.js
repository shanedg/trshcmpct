/**
 * Handler function for responding to requests for nonexistent resources
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} _next
 */
export const handleEndpointNotFound = (request, response, _next) => {
  request.log.debug('api 404');
  response.sendStatus(404);
};
