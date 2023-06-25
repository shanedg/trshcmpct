/**
 * Custom error handler for unexpected endpoint exceptions
 * @param {Error} error
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleApiError = (error, request, response, next) => {
  request.log.error(`api error: ${error}`);

  // must delegate to the default express error handler
  // when headers have already been sent to the client
  if (response.headersSent) {
    return next(error);
  }

  response.sendStatus(500);
};
