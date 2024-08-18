/**
 * Middleware handler for rendering an authenticated view
 *
 * Express expects handler function signatures have (at most) three parameters: request, response, next.
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first two arguments and support the expected signature.
 * e.g.
 * ```
 * app.use(handleRenderAuthenticated.prototype.bind(null, '/app', 'index.html'))
 * ```
 * @param {string} htmlDirectory Absolute path to html directory
 * @param {string} htmlFilename Html filename
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleRenderAuthenticated = (htmlDirectory, htmlFilename, request, response, next) => {
  const { oauth } = request.session;

  if (!oauth || !oauth.access_token) {
    request.log.debug('not authenticated');
    return next();
  }

  request.log.debug('render authenticated view');
  return response.render(`${htmlDirectory}/${htmlFilename}`, (renderError, html) => {
    if (renderError) {
      request.log.error(renderError);
      return next(new Error('problem rendering authenticated view', { cause: renderError }));
    }
    return response.send(html);
  });
};
