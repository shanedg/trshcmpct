import express from 'express';

import { handleApiError } from './handle-api-error';
import { handleEndpointNotFound } from './handle-endpoint-not-found';
import { handleGetGuildMembership } from './handle-get-guild-membership';
import { requireAuthentication } from './require-authentication';
import { requireGuildMembership } from './require-guild-membership';

/**
 * Dedicated router for authenticated (and authorized) endpoints
 */
export class AuthenticatedAPIRouter {
  /**
   * Create a new AuthenticatedAPIRouter
   * @param {Object} configuration
   * @param {Function} configuration.fetch
   * @param {string} configuration.guildId Discord server id
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
   * Initialize the authenticated API middleware
   */
  initializeMiddleware() {
    if (this.hasInitialized) throw new Error('authenticated API middleware already initialized');
    this.hasInitialized = true;

    const authenticatedApiRouter = express.Router();

    // All requests to these resources must be:
    // 1. authenticated
    // 2. authorized (members of target guild)
    authenticatedApiRouter.use(
      requireAuthentication,
      requireGuildMembership.bind(null, this.configuration.fetch, this.configuration.guildId)
    );

    // Deliver guild membership data to the frontend
    authenticatedApiRouter.get('/authorized', handleGetGuildMembership);

    authenticatedApiRouter.use(handleApiError);

    // Any unhandled requests at this point must be 404s
    authenticatedApiRouter.use(handleEndpointNotFound);

    this.router = authenticatedApiRouter;
  }

  /**
   * The authenticated API middleware
   */
  get middleware() {
    return this.router;
  }
}
