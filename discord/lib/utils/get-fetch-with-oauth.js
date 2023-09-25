/**
 * Helper function that fetches a url with the authorization header populated from the oauth result
 * @param {Function} fetch
 * @param {Object} oauthResult
 * @param {string} oauthResult.access_token Authorization access token
 * @param {string} oauthResult.token_type Type of token
 */
export const fetchWithOauth = async (fetch, { access_token: token, token_type: type }, url) => {
  return await fetch(url, { headers: { authorization: `${type} ${token}` }});
};
