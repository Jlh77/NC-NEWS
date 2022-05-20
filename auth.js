// Passport authentication

const passport = require("passport");
const helmet = require("helmet");
const flash = require("express-flash");
const db = require("./db/connection");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

app.use(flash());
app.use(helmet());

app.use(
  session({
    name: "SSID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: db,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 5184000000, //1000 * 60 * 60 * 24 * 60 (Lasts 60 days)
    },
  })
);

if (!process.env.NODE_ENV === "test") {
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  const csurf = require("csurf");
  app.use(
    csurf({
      cookie: true,
    })
  );

  app.get("/getCSRFToken", (req, res) => {
    res.json({ CSRFToken: req.CSRFToken() });
  });
}

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());
