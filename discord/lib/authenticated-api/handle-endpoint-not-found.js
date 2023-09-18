/**
 * Middleware handler for responding to requests for nonexistent resources
 * @param {express.Request} request
 * @param {express.Response} response
 */
export const handleEndpointNotFound = (request, response) => {
  request.log.debug('missing endpoint - 404');
  response.sendStatus(404);
};
