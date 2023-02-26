import express from 'express';

import { handleApiError } from './handle-api-error';
import { handleEndpointNotFound } from './handle-endpoint-not-found';
import { handleGetGuildMembership } from './handle-get-guild-membership';
import { requireAuthentication } from './require-authentication';

/**
 * Dedicated router for authenticated endpoints
 */
export class AuthenticatedAPIRouter {
  /**
   * Create a new AuthenticatedAPIRouter
   * @param {Object} configuration Configuration options
   * @param {Function} fetch
   * @param {string} guildId
   */
  constructor(configuration) {
    const {
      fetch,
      guildId,
    } = configuration;

    if (!fetch) throw new Error('missing fetch');
    if (!guildId) throw new Error('missing guild id');

    this.configuration = configuration;
    Object.freeze(this.configuration);

    this.initializeMiddleware();
  }

  /**
   * Initialize the authenticated api middleware
   */
  initializeMiddleware() {
    if (this.hasInitialized) throw new Error('auhenticated api middleware already initialized');
    this.hasInitialized = true;

    const authenticatedApiRouter = express.Router();

    // All requests to these resources must be authenticated
    authenticatedApiRouter.use(requireAuthentication);

    // After authentication, check authorization aka membership in target guild
    authenticatedApiRouter.get('/authorized', [
      handleGetGuildMembership.bind(null, this.fetch, this.guildId),
      handleApiError,
    ]);

    // Any unhandled requests at this point must be 404s
    authenticatedApiRouter.use(handleEndpointNotFound);

    this.router = authenticatedApiRouter;
  }

  /**
   * The authenticated api middleware
   */
  get middleware() {
    return this.router;
  }
}
