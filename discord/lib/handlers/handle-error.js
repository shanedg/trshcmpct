/**
 * Custom error handler for unexpected application exceptions
 * @param {Error} error
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleError = (error, request, response, next) => {
  request.log.error(error);

  // must delegate to the default express error handler
  // when headers have already been sent to the client
  if (response.headersSent) {
    request.log.error('headers already sent');
    return next(error);
  }

  response.render('error', null, (renderError, html) => {
    if (renderError) {
      request.log.error(renderError);
      return next(new Error('problem rendering error template', { cause: renderError }));
    }
    response.status(500).send(html);
  });
};
