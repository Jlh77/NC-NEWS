const express = require("express");
const app = express();
const model = require("./models/api.model");

app.use(express.json());

app.get("/api/topics", model.getTopics);
