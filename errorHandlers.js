exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psql = (err, req, res, next) => {
  // 22003 - integer out of range
  // 23503 - foreign key violation
  let sqlErrs = ["22P02", "42703", "22003", "23503", "23502"];
  if (sqlErrs.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.usernameAlreadyTaken = (err, req, res, next) => {
  if (
    err.code === "23505" &&
    err.table === "users" &&
    err.constraint === "users_username_key"
  ) {
    res.status(400).send({ msg: "Username already taken." });
  } else {
    next(err);
  }
};

// exports.badCSRFToken = (err, req, res, next) => {
//   if (err.code == "EBADCSRFTOKEN") {
//     res.status(403).send({ msg: "Form tampered with, request denied" });
//   } else {
//     next(err);
//   }
// };

exports.unknownGenericError = (err, req, res, next) => {
  console.log("500 server error >>>>>>>", err, ">>>>>>> 500");
  res.status(500).send({ msg: "Internal Server Error" });
};
