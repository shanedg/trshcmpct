import express from 'express';

import { handleAuthorizationCodeGrant } from './handlers/handle-authorization-code-grant.js';
import { handleError } from './handlers/handle-error.js';
import { handleLogout } from './handlers/handle-logout.js';
import { handleRedirect } from './handlers/handle-redirect.js';
import { handleRenderLogin } from './handlers/handle-render-login.js';

/**
 * Dedicated router for login and authentication
 */
export class LoginRouter {
  /**
   * Create a new LoginRouter
   * @param {Object} configuration
   * @param {string} configuration.clientId Discord application id
   * @param {string} configuration.clientSecret Discord application secret
   * @param {Function} configuration.fetch
   * @param {string} configuration.loginRedirect Where in the app to redirect after successful login
   * @param {string} configuration.redirectUri Application authorization url
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

    this.configuration = Object.freeze(configuration);

    this.initializeMiddleware();
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

    loginRouter.get('/logout', [
      handleLogout,
      handleRedirect.bind(null, '/login'),
    ]);

    loginRouter.use(handleError);

    this.loginRouter = loginRouter;
  }

  /**
   * The login middleware
   */
  get middleware() {
    return this.loginRouter;
  }
}
