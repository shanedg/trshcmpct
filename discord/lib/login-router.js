import express from 'express';

import config from './config.json' assert { type: 'json' };
import { handleAuthorizationCodeGrant } from './handlers/handle-authorization-code-grant';
import { handleError } from './handlers/handle-error';
import { handleRedirect } from './handlers/handle-redirect';
import { handleRenderLogin } from './handlers/handle-render-login';

const {
  clientId,
  clientSecret,
  redirectUri,
} = config;

/**
 * Dedicated router for login and authentication
 */
const loginRouter = express.Router();

loginRouter.get('/login', [
  handleRenderLogin.bind(null, clientId, redirectUri),
  // Redirect to app if already authenticated
  handleRedirect.bind(null, '/')
]);

loginRouter.get('/auth', [
  handleAuthorizationCodeGrant.bind(null, fetch, { clientId, clientSecret, redirectUri }),
  // Redirect to app once authenticated
  handleRedirect.bind(null, '/'),
]);

loginRouter.use(handleError);

export { loginRouter };
