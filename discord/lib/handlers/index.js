const {
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
} = require('./logged-in');
const { getRenderLoginWithData } = require('./login');
const { handleErrors } = require('./error');

module.exports = {
  getRenderLoginWithData,
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
  handleErrors,
};
