const path = require('path');

const cookieSession = require('cookie-session');
const express = require('express');
const pinoHttp = require('pino-http');

const { port, sessionSecret } = require('./config.json');
const { renderLogin, reuseSessionToken, getNewToken } = require('./handlers');

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
