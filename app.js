const express = require("express");
const app = express();
const errorHandlers = require("./errorHandlers");

app.use(express.json());

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
