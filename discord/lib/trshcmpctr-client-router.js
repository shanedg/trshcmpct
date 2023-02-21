import { dirname } from 'node:path';

import express from 'express';

import manifest from '@trshcmpctr/client' assert { type: 'json' };

import { handleError } from './handlers/handle-error';
import { handleRedirect } from './handlers/handle-redirect';
import { handleRenderAuthenticated } from './handlers/handle-render-authenticated';

/**
 * Dedicated router for rendering the authenticated @trshcmpctr/client application
 */
const trshcmpctrClientRouter = express.Router();

const clientUrl = new URL(await import.meta.resolve('@trshcmpctr/client'));
const clientPublic = dirname(clientUrl.pathname);

trshcmpctrClientRouter.get('/', [
  handleRenderAuthenticated.bind(null, clientPublic, manifest['index.html']),
  // Redirect to login if not authenticated
  handleRedirect.bind(null, '/login')
]);

// Serve application static assets
trshcmpctrClientRouter.use(express.static(clientPublic));
trshcmpctrClientRouter.use(handleError);

export { trshcmpctrClientRouter };
