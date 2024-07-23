const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");

router.post("/create-store", verifyToken, storeController.createStore);
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.put("/:id", storeController.updateStoreById);
router.delete("/:id", verifyToken, storeController.deleteStoreById);

/**
 * @swagger
 * /{storeId}/get-qr-code:
 *   post:
 *     summary: Generate a QR code for a store
 *     tags:
 *       - StoreController
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the store to generate a QR code for
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the generated QR code image
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
router.post("/:storeId/get-qr-code", verifyToken, storeController.getQRCodeUrl);

module.exports = router;
