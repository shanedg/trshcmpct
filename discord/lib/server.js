import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import expressSesssion from 'express-session';
import handlebars from 'hbs';
import pinoHttp from 'pino-http';
import store from 'session-file-store';

import manifest from '@trshcmpctr/client' assert { type: 'json' };

import { AuthenticatedAPIRouter } from './authenticated-api/router';
import { AuthenticatedHTMLRouter } from './authenticated-html-router';
import config from './config.json' assert { type: 'json' };
import { LoginRouter } from './login-router';

// Support overriding redirectUri from environment for cypress testing
const optionalArgumentOverrideRedirectUri = process.argv.length > 2 ? process.argv[2] : null;

const {
  clientId,
  clientSecret,
  guildId,
  port,
  redirectUri,
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

// TODO: control session length with env variable
const sessionLength = 10 * 60; // 10 minutes in seconds
// 7 * 24 * 60 * 60 // 1 week in seconds (how long tokens are valid)

const SessionFileStore = store(expressSesssion);

app.use(expressSesssion({
  cookie: {
    // maxAge is in milliseconds
    maxAge: sessionLength * 1000,
  },
  // resave is deprecated
  resave: false,
  // saveUninitialized is deprecated
  saveUninitialized: false,
  secret: sessionSecret,
  store: new SessionFileStore({
    // https://www.npmjs.com/package/session-file-store#options
    // ttl is seconds
    ttl: sessionLength,
  }),
}));

const loginRouter = new LoginRouter({
  clientId,
  clientSecret,
  fetch,
  // Redirect to home once authenticated
  loginRedirect: '/',
  redirectUri: optionalArgumentOverrideRedirectUri ?? redirectUri,
});
app.use(loginRouter.middleware);

const clientUrl = new URL(await import.meta.resolve('@trshcmpctr/client'));
const clientDirectory = dirname(clientUrl.pathname);

const authenticatedViewRouter = new AuthenticatedHTMLRouter({
  htmlDirectory: clientDirectory,
  htmlFilename: manifest['index.html'],
});
app.use(authenticatedViewRouter.middleware);

const authenticatedApiRouter = new AuthenticatedAPIRouter({
  fetch,
  guildId,
});
app.use('/api/v1', authenticatedApiRouter.middleware);

app.listen(port, () => pinoLogger.logger.info(`App listening at http://localhost:${port}`));
