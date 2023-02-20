import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import expressSesssion from 'express-session';
import handlebars from 'hbs';
import pinoHttp from 'pino-http';
import nedbStorage from 'tch-nedb-session';

import manifest from '@trshcmpctr/client' assert { type: 'json' };

import { authenticatedApiRouter } from './authenticated-api/router';
import config from './config.json' assert { type: 'json' };
import { handleAuthorizationCodeGrant } from './handlers/handle-authorization-code-grant';
import { handleError } from './handlers/handle-error';
import { handleRedirect } from './handlers/handle-redirect';
import { handleRenderAuthenticated } from './handlers/handle-render-authenticated';
import { handleRenderLogin } from './handlers/handle-render-login';

const {
  clientId,
  clientSecret,
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

const clientUrl = new URL(await import.meta.resolve('@trshcmpctr/client'));
const clientPublic = dirname(clientUrl.pathname);

// Dedicated router for API requests that the application will make
app.use('/api/v1', authenticatedApiRouter);

app.get('/login', [
  handleRenderLogin.bind(null, clientId, redirectUri),
  // Redirect to app if already authenticated
  handleRedirect.bind(null, '/'),
]);

app.get('/auth', [
  handleAuthorizationCodeGrant.bind(null, fetch, { clientId, clientSecret, redirectUri }),
  // Redirect to app once authenticated
  handleRedirect.bind(null, '/'),
]);

app.get('/', [
  handleRenderAuthenticated.bind(null, clientPublic, manifest['index.html']),
  // Redirect to login if not authenticated
  handleRedirect.bind(null, '/login'),
]);

// Always serve application static assets
app.use(express.static(clientPublic));

app.use(handleError);

app.listen(port, () => pinoLogger.logger.info(`App listening at http://localhost:${port}`));
