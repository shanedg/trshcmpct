/**
 * Get token with authorization code
 * @param {Function} fetch Fetch implementation
 * @param {Object} configuration
 * @param {string} configuration.clientId Discord application id
 * @param {string} configuration.clientSecret Discord client secret
 * @param {string} configuration.code Authorization code from Discord Oauth redirect
 * @param {string} configuration.redirectUri Application authorization url
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
