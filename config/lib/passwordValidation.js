// Simple check that password meets minimum requirements, which can be change here in future.

module.exports.pass = (password) => {
  if (password.length >= 6) {
    password = "";
    return true;
  } else {
    password = "";
    return false;
  }
};
