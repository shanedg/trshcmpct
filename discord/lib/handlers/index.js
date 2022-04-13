const {
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
} = require('./authenticated');
const { getRenderLoginWithData } = require('./login');
const { handleErrors } = require('./error');

module.exports = {
  getRenderLoginWithData,
  getNewTokenWithDependencies,
  getReuseSessionTokenWithDependencies,
  handleErrors,
};
