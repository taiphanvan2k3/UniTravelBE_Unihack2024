const Router = require("express");
const UserController = require("../controllers/user.controller.js");
const { authUser } = require("../middlewares/auth.middleware");
const { limitRequest } = require("../middlewares/limiter.middleware");

const router = Router();

router.get("/", limitRequest, authUser, UserController.getAllUsers);

module.exports = router;
