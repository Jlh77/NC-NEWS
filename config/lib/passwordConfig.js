/* ---------- Password Creation/Validation Functions ---------- */

const crypto = require("crypto");

module.exports.genHash = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, 64, { N: 16384 })
    .toString("hex");

  return {
    salt: salt,
    hash: hash,
  };
};

module.exports.validate = (password, hash, salt) => {
  let match = crypto
    .scryptSync(password, salt, 64, { N: 16384 })
    .toString("hex");
  return hash === match;
};
