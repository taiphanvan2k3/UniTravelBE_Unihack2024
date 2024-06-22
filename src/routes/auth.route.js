const Router = require("express");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const firebaseAuthController = require("../controllers/firebase-auth.controller.js");

const router = Router();
router.post("/register-with-email", firebaseAuthController.registerUser);
router.post("/login-with-email", firebaseAuthController.loginUser);
router.post("/sign-out", verifyToken, firebaseAuthController.signOutUser);
router.post("/reset-password", firebaseAuthController.resetPassword);

module.exports = router;
