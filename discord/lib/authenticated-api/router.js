import express from 'express';

import config from '../config.json' assert { type: 'json' };
import { createGetGuildMembership } from './create-get-guild-membership';
import { handleApiError } from './handle-api-error';
import { handleEndpointNotFound } from './handle-endpoint-not-found';
import { requireAuthentication } from './require-authentication';

const { guildId } = config;

const getGuildMembership = createGetGuildMembership(fetch, guildId);

/**
 * Dedicated router for our authenticated endpoints
 */
const authenticatedApiRouter = express.Router();

// All requests to these resources must be authenticated
authenticatedApiRouter.use(requireAuthentication);

// After authentication, check authorization aka membership in target guild
authenticatedApiRouter.get('/authorized', [
  getGuildMembership,
  handleApiError,
]);

// Any unhandled requests at this point must be 404s
authenticatedApiRouter.use(handleEndpointNotFound);

export { authenticatedApiRouter };
