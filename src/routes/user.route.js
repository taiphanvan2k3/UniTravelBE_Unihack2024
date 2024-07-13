const Router = require("express");
const UserController = require("../controllers/user.controller.js");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const { limitRequest } = require("../middlewares/limiter.middleware");

const router = Router();

router.get("/users", limitRequest, verifyToken, UserController.getAllUsers);

module.exports = router;
