/**
 * Create a handler for rendering an authenticated html view
 * Injects the directory and filename for the html view
 * @param {Object} options Required options
 * @param {string} options.htmlDirectory Absolute path to html directory
 * @param {string} options.htmlFilename Html filename
 * @returns Handler that renders the authenticated view
 */
export const createAuthenticatedRenderHandler = ({
  htmlDirectory,
  htmlFilename,
}) => {
  /**
   * Handler for rendering an authenticated html view
   */
  return async (request, response, next) => {
    if (request.session.oauth && request.session.oauth.access_token) {
      request.log.debug('render authenticated client');
      response.sendFile(htmlFilename, {
        // No reason to send the Last-Modified header with the actual last modified date
        lastModified: false,
        root: htmlDirectory,
      }, err => {
        if (err) {
          next(err);
        }
      });
      return;
    }
    next();
  };
};
