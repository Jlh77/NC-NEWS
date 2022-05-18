const express = require("express");
const app = express();
const errorHandlers = require("./errorHandlers");
const cors = require("cors");
const flash = require("express-flash");

// Cors should specify one place
app.use(cors());
app.use(express.json());
app.use(flash());

// Passport authentication

const passport = require("passport");
const db = require("./db/connection");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

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

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// Add routes

const apiRouter = require("./routers/api.router");
app.use("/api", apiRouter);

// Error Handlers

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(errorHandlers.customError);
app.use(errorHandlers.psql);
app.use(errorHandlers.unknownGenericError);

module.exports = app;
