const path = require('path');

const express = require('express');
// We have to use node-fetch@^2 because node-fetch@>=3 is esm-only.
const fetch = require('node-fetch');

const { clientId, clientSecret, port } = require('./config.json');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', async (request, response) => {
  let avatar,
    id,
    username,
    discriminator;

  const { code } = request.query;
  if (code) {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',

        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}`,
          scope: 'identify',
        }),

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await oauthResult.json();
      const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      const { avatar: resultAvatar, discriminator: resultDiscriminator, id: resultId, username: resultUsername } = await userResult.json();
      avatar = resultAvatar;
      discriminator = resultDiscriminator;
      id = resultId;
      username = resultUsername;

    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      console.error(error);
    }
  }

  response.render('index', { avatar, clientId, discriminator, id, username }, (err, html) => {
    if (err) {
      console.error(err);
    }
    response.send(html);
  });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
