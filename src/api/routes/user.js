const express = require("express");
const usersRouter = express.Router();
const { register, login, getUsers, getUserById, changeRole, deleteUser } = require("../controllers/user");
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const { upload } = require("../../middlewares/file");

usersRouter.post("/register", upload.single("img"), register);
usersRouter.post("/login", login);
usersRouter.get("/", isAuth, isAdmin, getUsers);
usersRouter.get("/:id", isAuth, getUserById);
usersRouter.patch("/role/:id", isAuth, isAdmin, changeRole);
usersRouter.delete("/:id", isAuth, deleteUser);

module.exports = usersRouter;