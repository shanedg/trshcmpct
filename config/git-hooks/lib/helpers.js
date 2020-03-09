/**
 * Propagate exit error code.
 * @param {Error} error
 * @param {*} _stdout
 * @param {*} _stderr
 */
const handleChildExit = (error, _stdout, _stderr) => {
  if (error) {
    process.exit(-1);
  } else {
    process.exit(0);
  }
};

module.exports = {
  handleChildExit,
};
