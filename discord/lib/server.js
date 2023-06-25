import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import expressSesssion from 'express-session';
import handlebars from 'hbs';
import pinoHttp from 'pino-http';
import nedbStorage from 'tch-nedb-session';

import manifest from '@trshcmpctr/client' assert { type: 'json' };

import { AuthenticatedAPIRouter } from './authenticated-api/router';
import { AuthenticatedHTMLRouter } from './authenticated-html-router';
import config from './config.json' assert { type: 'json' };
import { LoginRouter } from './login-router';

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

// 1 minute
const sessionLength = 60 * 1000;
// 7 * 24 * 60 * 60 * 1000 // 1 week (how long tokens are valid)

const sessionStore = nedbStorage(expressSesssion);
const nedbStorageWithExpressSession = new sessionStore({
  expiration: sessionLength,
});

app.use(expressSesssion({
  cookie: {
    maxAge: sessionLength
  },
  // resave is deprecated
  resave: false,
  // saveUninitialized is deprecated
  saveUninitialized: false,
  secret: sessionSecret,
  store: nedbStorageWithExpressSession,
}));

const loginRouter = new LoginRouter({
  clientId,
  clientSecret,
  fetch,
  // Redirect to home once authenticated
  loginRedirect: '/',
  redirectUri,
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
