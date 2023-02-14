/**
 * Handle an application error
 * @param {Error} error Error object
 * @param {Object} request Request object
 * @param {Object} response Response object
 * @param {Function} next Middleware callback
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
