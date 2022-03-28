exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err);
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psql = (err, req, res, next) => {
  let sqlErrs = ["22P02", "42703"];
  if (sqlErrs.includes(err.code)) {
    console.log(err, "<<<<<<<<<<<<< SQL ERR");
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.unknownGenericError = (err, req, res, next) => {
  console.log(err, ">>>>>>> 500");
  res.status(500).send({ msg: "Internal Server Error" });
};
