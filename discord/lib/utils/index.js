const { authFromCode } = require('./auth-from-code');
const { getFetchWithOauth } = require('./get-fetch-with-oauth');
const { getLoggedInData } = require('./get-logged-in-data');

module.exports = {
  authFromCode,
  getFetchWithOauth,
  getLoggedInData,
};
