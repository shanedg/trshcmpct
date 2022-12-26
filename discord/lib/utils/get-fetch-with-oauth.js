/**
 * Curry fetch with authorization header
 * @param {Function} fetch Fetch implementation
 * @param {Object} oauthData Oauth result containing the access token
 * @param {string} oauthData.access_token Authorization access token
 * @param {string} oauthData.token_type Type of token
 * @returns Function wrapping fetch with authorization header
 */
export const getFetchWithOauth = (fetch, { token_type: type, access_token: token }) => {
  return async url => await fetch(url, { headers: { authorization: `${type} ${token}` }});
};
