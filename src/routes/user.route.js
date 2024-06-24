const Router = require("express");
const UserController = require("../controllers/user.controller.js");
const { authUser } = require("../middlewares/auth.middleware.js");

const router = Router();

router.get("/", authUser, UserController.getAllUsers);

module.exports = router;
