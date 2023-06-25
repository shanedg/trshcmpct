import { randomBytes } from 'node:crypto';

/**
 * Handler function for rendering the login view
 *
 * Express expects handler function signatures with only three parameters
 * where the first parameter is the request object (request, response, next).
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first argument and support the expected signature.
 * e.g.
 * ```
 * // the returned function no longer expects the first two arguments because they are prefilled
 * const boundHandler = handleRenderLogin.prototype.bind(null, 'app-id', 'http://localhost:53134/auth')
 * ```
 * @param {string} clientId Discord application id
 * @param {string} redirectUri Where to redirect with authorization code
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleRenderLogin = (clientId, redirectUri, request, response, next) => {
  const nowInSeconds = Date.now() / 1000;
  const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
  const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
  const hasValidToken = sessionHasToken && tokenIsNotExpired;

  if (hasValidToken) {
    return next();
  }

  // Unique authorization request state
  const nonce = randomBytes(16).toString('base64');
  request.session.state = nonce;

  request.log.debug('render login page');
  return response.render('login', {
    login_link: buildDiscordLoginLink(clientId, nonce, redirectUri),
  });
};

/**
 * Construct Oauth url for Discord login
 * @param {*} clientId Discord application id
 * @param {*} nonce Unique authorization request state
 * @param {*} redirectUri Where to redirect with authorization code
 * @returns Login link
 */
const buildDiscordLoginLink = (clientId, nonce, redirectUri) => {
  if (!clientId) throw new Error('missing client id');
  if (!nonce) throw new Error('missing nonce');
  if (!redirectUri) throw new Error('missing redirect uri');

  const searchParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'guilds.members.read',
    state: nonce,
  });

  // This url has to be rendered by Handlebars "triple-stash" directive
  // to avoid escaping special characters
  // e.g. {{{ login_link }}}
  // See https://handlebarsjs.com/guide/expressions.html#html-escaping
  return `https://discord.com/api/oauth2/authorize?${searchParams}`;
};
