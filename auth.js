const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./db/connection");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

module.exports = async (app) => {
  const isProduction = process.env.NODE_ENV === "production" ? true : false;

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: isProduction
        ? "https://nc-news77.netlify.app"
        : "http://localhost:3000",
    })
  );

  app.set("trust proxy", 1);

  app.use(
    session({
      name: "SSID",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new pgSession({
        conString: process.env.DATABASE_URL,
        pool: db,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 5184000000, //1000 * 60 * 60 * 24 * 60 (Lasts 60 days)
        sameSite: isProduction ? "none" : undefined,
      },
    })
  );

  require("./config/passport");

  app.use(passport.initialize());
  app.use(passport.session());
};
