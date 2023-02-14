/**
 * Create a handler for rendering an authenticated html view
 * Injects the directory and filename for the html view
 * @param {Object} options Required options
 * @param {string} options.htmlDirectory Absolute path to html directory
 * @param {string} options.htmlFilename Html filename
 * @returns Handler function for rendering the authenticated view
 */
export const createAuthenticatedRenderHandler = ({
  htmlDirectory,
  htmlFilename,
}) => {
  return async (request, response, next) => {
    const { oauth, state } = request.session;
    if (oauth && oauth.access_token && state) {
      request.log.debug('render authenticated client');
      response.render(`${htmlDirectory}/${htmlFilename}`, (err, html) => {
        if (err) {
          next(`problem rendering authenticated view: ${err}`);
          return;
        }
        response.send(html);
      });
      return;
    }
    request.log.error(`missing session data: ${JSON.stringify(request.session)}`);
    next();
  };
};
