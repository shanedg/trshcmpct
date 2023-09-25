/**
 * Middleware handler for redirecting to a new url.
 *
 * Express expects handler function signatures have (at most) three parameters: request, response, next.
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first argument and support the expected signature.
 * e.g.
 * ```
 * app.use(handleRedirect.prototype.bind(null, '/some/url'))
 * ```
 * @param {string} url See https://expressjs.com/en/api.html#res.redirect
 * @param {express.Request} _request
 * @param {express.Response} response
 */
export const handleRedirect = (url, _request, response) => {
  response.redirect(url);
};
