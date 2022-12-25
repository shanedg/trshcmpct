/**
 * Handle unexpected endpoint errors
 * @param {Object} request
 * @param {Object} response
 */
export const handleApiError = (request, response) => {
  request.log.error('api error');
  response.sendStatus(500);
};
