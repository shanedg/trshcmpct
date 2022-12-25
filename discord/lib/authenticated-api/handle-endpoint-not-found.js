/**
 * Handle requests for nonexistent resources
 * @param {Object} request
 * @param {Object} response
 */
export const handleEndpointNotFound = (request, response) => {
  request.log.debug('api 404');
  response.sendStatus(404);
};
