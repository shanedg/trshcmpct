import express from 'express';

import { handleAuthorizationCodeGrant } from './handlers/handle-authorization-code-grant';
import { handleError } from './handlers/handle-error';
import { handleRedirect } from './handlers/handle-redirect';
import { handleRenderLogin } from './handlers/handle-render-login';

/**
 * Dedicated router for login and authentication
 */
export class LoginRouter {
  /**
   * Create a new LoginRouter
   * @param {Object} configuration Configuration options
   * @param {string} configuration.clientId
   * @param {string} configuration.clientSecret
   * @param {Function} configuration.fetch
   * @param {string} configuration.loginRedirect Where to redirect after successful authentication
   * @param {string} configuration.redirectUri
   */
  constructor(configuration) {
    const {
      clientId,
      clientSecret,
      fetch, 
      loginRedirect,
      redirectUri,
    } = configuration;

    if (!clientId) throw new Error('missing client id');
    if (!clientSecret) throw new Error('missing client secret');
    if (!fetch) throw new Error('missing fetch');
    if (!loginRedirect) throw new Error('missing login redirect');
    if (!redirectUri) throw new Error('missing redirect uri');

    this.configuration = configuration;

    // Never modify configuration values after construction
    Object.freeze(this.configuration);
  }

  /**
   * Initialize the login middleware
   */
  initializeMiddleware() {
    if (this.hasInitialized) throw new Error('login middleware already initialized');
    this.hasInitialized = true;

    const {
      clientId,
      clientSecret,
      fetch,
      loginRedirect,
      redirectUri,
    } = this.configuration;

    const loginRouter = express.Router();

    const redirectAfterAuthentication = handleRedirect.bind(null, loginRedirect);

    loginRouter.get('/login', [
      handleRenderLogin.bind(null, clientId, redirectUri),
      // Redirect if already authenticated
      redirectAfterAuthentication
    ]);

    loginRouter.get('/auth', [
      handleAuthorizationCodeGrant.bind(null, fetch, { clientId, clientSecret, redirectUri }),
      // Redirect once authenticated
      redirectAfterAuthentication
    ]);

    loginRouter.use(handleError);

    this.loginRouter = loginRouter;

    // Return self for chaining
    // e.g. new LoginRouter(config).initializeMiddleware().middleware
    return this;
  }

  /**
   * The login middleware
   */
  get middleware() {
    if (!this.hasInitialized) throw new Error('login middleware not initialized');
    return this.loginRouter;
  }
}
