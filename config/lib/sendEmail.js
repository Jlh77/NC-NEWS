// Does not currently work with Heroku as email provider must be set up, but general mailing config

const nodemailer = require("nodemailer");

module.exports.now = (config) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transport.sendMail(config, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
