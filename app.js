const express = require("express");
const app = express();

app.use(express.json());

// Passport authentication

const passport = require("passport");
const helmet = require("helmet");
const flash = require("express-flash");
const db = require("./db/connection");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

app.use(flash());
app.use(helmet());
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

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

// if (process.env.NODE_ENV !== "test") {
//   const cookieParser = require("cookie-parser");
//   app.use(cookieParser());

//   const csurf = require("csurf");
//   app.use(
//     csurf({
//       cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         //maxAge: 3600,
//       },
//     })
//   );
//   console.log(">csurf implemented<<<<<<");
// }

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

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
app.use(errorHandlers.badCSRFToken);
app.use(errorHandlers.unknownGenericError);

module.exports = app;
