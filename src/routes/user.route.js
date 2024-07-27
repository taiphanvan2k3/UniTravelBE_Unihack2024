const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const { limitRequest } = require("../middlewares/limiter.middleware");
const UserController = require("../controllers/users.controller.js");

router.get("/users", limitRequest, verifyToken, UserController.getAllUsers);
router.get("/:id/my-vouchers", UserController.getMyVouchers);

module.exports = router;
