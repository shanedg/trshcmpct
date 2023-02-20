/**
 * Get token with authorization code
 * @param {Function} fetch Fetch implementation
 * @param {Object} config Authorization configuration
 * @param {string} config.clientId Discord application id
 * @param {string} config.clientSecret Discord client secret
 * @param {string} config.code Authorization code from Discord Oauth redirect
 * @param {string} config.redirectUri Application authorization url
 * @returns {Object} Oauth result
 */
export const authFromCode = async (fetch, { clientId, clientSecret, code, redirectUri }) => {
  return await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      scope: 'guilds.members.read',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
