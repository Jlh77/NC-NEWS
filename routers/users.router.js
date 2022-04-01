const controller = require("../controllers/");
const usersRouter = require("express").Router();

usersRouter.get("/", controller.users.getUsers);

usersRouter.get("/:username", controller.users.getUserById);

module.exports = usersRouter;
