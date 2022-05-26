const express = require("express");
const app = express();

app.use(express.json());

// Full auth implementation with Passport and express-session

require("./auth")(app);

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
app.use(errorHandlers.unknownGenericError);

module.exports = app;
