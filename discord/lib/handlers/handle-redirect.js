/**
 * Handler function for redirecting to a new url.
 *
 * Express expects handler function signatures with only three parameters
 * where the first parameter is the request object (request, response, next).
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first argument and support the expected signature.
 * e.g.
 * ```
 * // the returned function no longer expects the first argument because it is prefilled
 * const boundHandler = handleRedirect.prototype.bind(null, '/some/url')
 * ```
 * @param {string} url See https://expressjs.com/en/api.html#res.redirect
 * @param {express.Request} _request
 * @param {express.Response} response
 * @param {express.NextFunction} _next
 */
export const handleRedirect = (url, _request, response, _next) => {
  response.redirect(url);
};
