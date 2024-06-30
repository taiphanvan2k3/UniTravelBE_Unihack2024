const Router = require("express");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const firebaseAuthController = require("../controllers/firebase-auth.controller.js");

const router = Router();

/**
 * @swagger
 * /auth/register-with-email:
 *   post:
 *     summary: Register user with email
 *     tags: [FirebaseAuthController]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "taiphan2403a@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *     responses:
 *       201:
 *         description: Verification email sent! User created successfully!
 *       422:
 *         description: Invalid input, missing email or password
 *
 */
router.post("/register-with-email", firebaseAuthController.registerUser);

/**
 * @swagger
 * /auth/login-with-email:
 *   post:
 *     summary: Login user with email
 *     tags: [FirebaseAuthController]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "taiphan2403a@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized, invalid credentials
 *       403:
 *         description: Forbidden, email not verified
 */
router.post("/login-with-email", firebaseAuthController.loginUser);

/**
 * @swagger
 * /auth/sign-out:
 *   post:
 *     summary: Sign out user
 *     tags: [FirebaseAuthController]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "Admin@123"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User signed out successfully
 *       401:
 *         description: Unauthorized, token invalid
 *       403:
 *         description: Forbidden, email does not match with token
 */
router.post("/sign-out", verifyToken, firebaseAuthController.signOutUser);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [FirebaseAuthController]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email: string
 *             properties:
 *               email:
 *                 type: string
 *                 example: "taiphan2403a@gmail.com"
 *     responses:
 *       200:
 *         description: Password reset email sent!
 *       422:
 *         description: Invalid input, missing email
 */
router.post("/reset-password", firebaseAuthController.resetPassword);

module.exports = router;
