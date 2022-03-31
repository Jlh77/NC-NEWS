const controller = require("../controllers/");
const usersRouter = require("express").Router();

usersRouter.get("/", controller.users.getUsers);

module.exports = usersRouter;
