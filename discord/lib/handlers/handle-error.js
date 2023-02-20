/**
 * Custom error handler for unexpected application exceptions
 * @param {Error} error
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} _next
 */
export const handleError = (error, request, response, _next) => {
  request.log.error(error);
  response.render('error', null, (err, html) => {
    if (err) {
      request.log.error(err);
    }
    response.status(500).send(html);
  });
};
