/**
 * Propagate exit error code.
 * @param {Error} err
 * @param {*} _stdout
 * @param {*} _stderr
 */
const handleChildExit = (err, _stdout, _stderr) => {
  if (err) {
    process.exit(-1);
  }

  process.exit(0);
};

module.exports = {
  handleChildExit,
};
