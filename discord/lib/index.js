const path = require('path');

const cookieSession = require('cookie-session');
const express = require('express');
// We have to use node-fetch@^2 because node-fetch@>=3 is esm-only.
const fetch = require('node-fetch');
const pinoHttp = require('pino-http');

const {
  clientId,
  clientSecret,
  guildId,
  port,
  sessionSecret,
} = require('./config.json');
const {
  getRenderLoginWithData,
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
  handleErrors,
} = require('./handlers');

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

// Dependency-inject our chosen fetch implementation
const renderLogin = getRenderLoginWithData({ clientId });
const reuseSessionToken = getReuseSessionTokenWithDependencies(fetch, { guildId });
const getNewToken = getNewTokenWithDependencies(fetch, { clientId, clientSecret, guildId, port });

app.get('/', [renderLogin, reuseSessionToken, getNewToken]);

app.use(handleErrors);

app.listen(port, () => pinoLogger.logger.info(`App listening at http://localhost:${port}`));
