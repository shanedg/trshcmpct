/**
 * Handle application errors
 * @param {Error} error Error object
 * @param {Object} request Request object
 * @param {Object} response Response object
 * @param {Function} next Middleware callback
 */
const handleErrors = (error, request, response, _next) => {
  request.log.error(error);
  response.render('error', null, (err, html) => {
    if (err) {
      request.log.error(err);
    }
    response.send(html);
  });
};

export { handleErrors };
