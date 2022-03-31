// We have to use node-fetch@^2 because node-fetch@>=3 is esm-only.
const fetch = require('node-fetch');

/**
 * Get token with authorization code
 * @param {string} code Authorization code from Discord redirect
 * @returns Oauth result
 */
const authFromCode = async ({ clientId, clientSecret, code, port }) => {
  return await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `http://localhost:${port}`,
      scope: 'identify',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

/**
 * Curry fetch with authorization header
 * @param {*} oauthData Oauth result
 * @returns Function wrapping fetch with authorization header
 */
const getFetchWithOauth = ({ token_type: type, access_token: token }) => {
  return async url => await fetch(url, { headers: { authorization: `${type} ${token}` }});
};

/**
 * Get guild from list by id
 * @param {*} guilds List of guilds
 * @param {string} guildId Id of guild
 * @returns Guild if present, else undefined
 */
const getGuildById = (guilds, guildId) => guilds.find(({ id }) => id === guildId);

module.exports = {
  authFromCode,
  getFetchWithOauth,
  getGuildById,
};
