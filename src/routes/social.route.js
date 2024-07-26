const Router = require("express");
const router = Router();
const socialController = require("../controllers/social.controller");

/**
 * @swagger
 * /social/create-payment:
 *   post:
 *     summary: Create a PayPal payment
 *     tags: 
 *       - SocialController
 *     description: Creates a payment request to PayPal and returns the payment ID and approval URL.
 *     responses:
 *       201:
 *         description: Payment created successfully. Returns the payment ID and approval URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The PayPal payment ID.
 *                 link:
 *                   type: string
 *                   description: The PayPal approval URL.
 *       400:
 *         description: Error creating the payment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/create-payment", socialController.createPayment);

/**
 * @swagger
 * /social/capture-payment:
*   post:
 *     summary: Capture a PayPal payment
 *     tags: 
 *       - SocialController
 *     description: Captures an authorized PayPal payment using the payment ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The PayPal payment ID to capture.
 *     responses:
 *       200:
 *         description: Payment captured successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the captured payment.
 *       400:
 *         description: Error capturing the payment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/capture-payment", socialController.capturePayment);

/**
 * @swagger
 * /social/send-email:
 *   post:
 *     summary: Send an email with payment and event details
 *     tags:
 *       - SocialController
 *     description: Sends an email to the user with details of the transaction and event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The recipient's email address.
 *               name:
 *                 type: string
 *                 description: The recipient's name.
 *               amount:
 *                 type: string
 *                 description: The amount paid.
 *               transactionId:
 *                 type: string
 *                 description: The transaction ID from PayPal.
 *               eventName:
 *                 type: string
 *                 description: The name of the event.
 *               eventDate:
 *                 type: string
 *                 description: The date of the event.
 *               eventTime:
 *                 type: string
 *                 description: The time of the event.
 *               eventLocation:
 *                 type: string
 *                 description: The location of the event.
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageId:
 *                   type: string
 *                   description: The message ID of the sent email.
 *       400:
 *         description: Error sending the email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/send-email", socialController.sendEmail);

module.exports = router;
