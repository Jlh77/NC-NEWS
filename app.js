const express = require("express");
const app = express();

app.use(express.json());

// Passport authentication

const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./db/connection");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

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

// if (process.env.NODE_ENV !== "test") {
//   const cookieParser = require("cookie-parser");
//   app.use(cookieParser());

//   const csurf = require("csurf");
//   app.use(
//     csurf({
//       cookie: {
//         httpOnly: true,
//         secure: isProduction,
//         //maxAge: 3600,
//       },
//     })
//   );
//   console.log(">csurf implemented<<<<<<");
// }

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("this guy is authed");
  }
  next();
});

// Add routes

const apiRouter = require("./routers/api.router");
app.use("/api", apiRouter);

// Error Handlers

const errorHandlers = require("./errorHandlers");

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(errorHandlers.customError);
app.use(errorHandlers.psql);
app.use(errorHandlers.usernameAlreadyTaken);
// app.use(errorHandlers.badCSRFToken);
app.use(errorHandlers.unknownGenericError);

module.exports = app;
