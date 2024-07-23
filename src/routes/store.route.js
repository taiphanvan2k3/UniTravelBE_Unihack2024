const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const MAX_IMAGE_COUNT = 5;
const MAX_VIDEO_COUNT = 2;

/**
 * @swagger
 * /stores/create:
 *   post:
 *     summary: Create a new store
 *     tags:
 *       - StoreController
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the store
 *                 example: "Store Name"
 *                 required: true
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail image of the store
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 5 images at most
 *                 maxItems: 5
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 2 videos at most
 *                 maxItems: 2
 *               provinceId:
 *                 type: string
 *                 description: Id of the province where the store is located
 *                 example: "6682d2a0a1514ba848db2a73"
 *               detailAddress:
 *                 type: string
 *                 description: Detailed address of the store
 *                 example: "123 Store Address, City, Country"
 *                 required: true
 *               openingHours:
 *                 type: string
 *                 description: Opening hours of the store
 *                 example: 15:00-22:00
 *                 required: true
 *               businessType:
 *                 type: string
 *                 description: Business type of the store (e.g., "food store", "cafe")
 *                 example: "food store"
 *                 required: true
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/create",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    storeController.createStore
);

router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.put("/:id", storeController.updateStoreById);
router.delete("/:id", verifyToken, storeController.deleteStoreById);

/**
 * @swagger
 * /stores/{storeId}/get-qr-code:
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
