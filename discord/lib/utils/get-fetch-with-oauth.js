/**
 * Curry fetch with authorization header
 * @param {Function} fetch Fetch implementation
 * @param {*} oauthData Oauth result
 * @returns Function wrapping fetch with authorization header
 */
const getFetchWithOauth = (fetch, { token_type: type, access_token: token }) => {
  return async url => await fetch(url, { headers: { authorization: `${type} ${token}` }});
};

module.exports = { getFetchWithOauth };
