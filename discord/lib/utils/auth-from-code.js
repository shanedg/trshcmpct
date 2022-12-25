/**
 * Get token with authorization code
 * @param {Function} fetch Fetch implementation
 * @param {Object} options Authorization code from Discord redirect
 * @returns Oauth result
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
      scope: 'identify',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
