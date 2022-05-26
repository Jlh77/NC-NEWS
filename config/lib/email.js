// Does not currently work with Heroku as email provider must be set up, but general mailing config

const nodemailer = require("nodemailer");

module.exports.send = (config) => {
  const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transport.sendMail(config, (err, info) => {
    if (err) {
      console.log("EMAIL_CONFIG_ERROR: ", err);
    }
  });
};
