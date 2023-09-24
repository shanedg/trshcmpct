import express from 'express';

import { handleError } from './handlers/handle-error';
import { handleRedirect } from './handlers/handle-redirect';
import { handleRenderAuthenticated } from './handlers/handle-render-authenticated';

/**
 * Dedicated router for rendering an authenticated html view
 */
export class AuthenticatedHTMLRouter {
  /**
   * Create a new AuthenticatedHTMLRouter
   * @param {Object} configuration
   * @param {string} configuration.htmlDirectory
   * @param {string} configuration.htmlFilename
   */
  constructor(configuration) {
    const {
      htmlDirectory,
      htmlFilename,
    } = configuration;

    if (!htmlDirectory) throw new Error('missing html directory');
    if (!htmlFilename) throw new Error('missing html filename');

    this.configuration = Object.freeze(configuration);

    this.initializeMiddleware();
  }

  /**
   * Initialize the authenticated view middleware
   */
  initializeMiddleware() {
    if (this.hasInitialized) throw new Error('authenticated view middleware already initialized');
    this.hasInitialized = true;

    const {
      htmlDirectory,
      htmlFilename,
    } = this.configuration;

    const trshcmpctrClientRouter = express.Router();

    trshcmpctrClientRouter.get('/', [
      handleRenderAuthenticated.bind(null, htmlDirectory, htmlFilename),
      // FIXME: redirect to /not-a-member or something if someone signs in but isn't a member?
      // FIXME: OR do we just render a mostly-empty view via the client app when the guild membership data is empty?
      // Redirect to login if not authenticated
      handleRedirect.bind(null, '/login')
    ]);

    // Serve application static assets
    trshcmpctrClientRouter.use(express.static(htmlDirectory));
    trshcmpctrClientRouter.use(handleError);

    this.router = trshcmpctrClientRouter;
  }

  /**
   * The authenticated view middleware
   */
  get middleware() {
    return this.router;
  }
}
