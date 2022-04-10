const path = require('path');

const cookieSession = require('cookie-session');
const express = require('express');
// We have to use node-fetch@^2 because node-fetch@>=3 is esm-only.
const fetch = require('node-fetch');
const pinoHttp = require('pino-http');

const { clientId, clientSecret, guildId, port, sessionSecret } = require('./config.json');
const { authFromCode, batchRequests, getFetchWithOauth, getGuildById } = require('./utils');

/**
 * Get data for logged-in view
 * @param {Function} fetch Fetch implementation
 * @param {boolean} newSession If session is new
 * @returns Logged-in template local variables
 */
const getLoggedInData = async (fetch, newSession) => {
  const commonEndpointUrls = [
    'https://discord.com/api/users/@me',
    'https://discord.com/api/users/@me/guilds',
    // TODO: alternatively: https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    // requires: guilds.members.read
    // `https://discord.com/api/users/@me/guilds/${guildId}/member`
  ];
  const [user, guilds] = await batchRequests(fetch, commonEndpointUrls);
  const { avatar, discriminator, id, username } = user;

  // Guilds won't be an array if the request fails (rate limited).
  const guild = Array.isArray(guilds) && getGuildById(guilds, guildId);

  const data = {
    avatar,
    discriminator,
    guild,
    id,
    newSession,
    username,
  };
  return data;
};

/**
 * Render login screen for un-auth'd sessions
 * @param {Object} request Request object
 * @param {Object} response Response object
 * @param {Function} next Middleware callback
 */
const renderLogin = (request, response, next) => {
  request.session.views = (request.session.views || 0) + 1;

  const nowInSeconds = Date.now()/1000;

  const { code } = request.query;
  const sessionHasToken = request.session.oauth && request.session.oauth.access_token;
  const tokenIsNotExpired = request.session.oauthExpires > nowInSeconds;
  const hasSession = sessionHasToken && tokenIsNotExpired;

  if (!code && !hasSession) {
    request.log.debug('render login page');
    response.render('index', { clientId });
    return;
  }
  next();
};

/**
 * Render logged-in content using the existing session token
 * @param {Object} request Request object
 * @param {Object} response Response object
 * @param {Function} next Middleware callback
 * @returns 
 */
const reuseSessionToken = async (request, response, next) => {
  if (request.session.oauth && request.session.oauth.access_token) {
    request.log.debug('reuse session token');
    const fetchWithOauth = getFetchWithOauth(fetch, request.session.oauth);
    const data = await getLoggedInData(fetchWithOauth, false);
    response.render('logged-in', data);
    return;
  }
  next();
};

/**
 * Render logged-in content after getting a fresh auth token
 * @param {Object} request Request object
 * @param {Object} response Response object
 * @param {Function} _next Middleware callback
 */
const getNewToken = async (request, response, _next) => {
  request.log.debug('get new token');
  const { code } = request.query;
  const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, port });
  const oauthFinal = await oauthResult.json();

  const nowInSeconds = Date.now()/1000;

  request.session.oauth = oauthFinal;
  request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;

  const fetchWithOauth = getFetchWithOauth(fetch, oauthFinal);
  const data = await getLoggedInData(fetchWithOauth, true);
  response.render('logged-in', data);
};

const app = express();
const pinoLogger = pinoHttp({
  autoLogging: false,
  level: process.env.DISCORD_LOG_LEVEL || 'info',
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(pinoLogger);
app.use(cookieSession({
  // keys: [sessionSecret1, sessionSecret2],
  // maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week (how long tokens are valid)
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
  // maxAge: 10 * 60 * 1000 // 10 minutes
  maxAge: 60 * 1000, // 1 minute
  secret: sessionSecret,
}));

app.get('/', [renderLogin, reuseSessionToken, getNewToken]);

app.use((error, request, response, next) => {
  request.log.error(error);

  response.render('error', null, (err, html) => {
    if (err) {
      request.log.error(err);
      next();
    }
    response.send(html);
  });
});

app.listen(port, () => pinoLogger.logger.info(`App listening at http://localhost:${port}`));
