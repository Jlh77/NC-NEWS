exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psql = (err, req, res, next) => {
  // 22003 - integer out of range
  let sqlErrs = ["22P02", "42703", "22003"];
  if (sqlErrs.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.unknownGenericError = (err, req, res, next) => {
  console.log(err, ">>>>>>> 500");
  res.status(500).send({ msg: "Internal Server Error" });
};
