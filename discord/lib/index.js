import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieSession from 'cookie-session';
import express from 'express';
// Someday soon we'll use the fetch api from node itself :)
import fetch from 'node-fetch';
import handlebars from 'hbs';
import pinoHttp from 'pino-http';

import config from './config.json' assert { type: 'json' };

import {
  getNewTokenWithDependencies,
  getRenderLoginWithData,
  getReuseSessionTokenWithDependencies,
  handleError,
} from './handlers';

const {
  clientId,
  clientSecret,
  guildId,
  port,
  sessionSecret,
} = config;

const { __express: handlebarsForExpress } = handlebars;

const app = express();
const pinoLogger = pinoHttp({
  autoLogging: false,
  level: process.env.DISCORD_LOG_LEVEL || 'info',
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', handlebarsForExpress);

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

app.use(handleError);

app.listen(port, () => pinoLogger.logger.info(`App listening at http://localhost:${port}`));
