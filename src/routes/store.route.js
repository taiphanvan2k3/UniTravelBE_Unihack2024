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
 *               longitude:
 *                 type: number
 *                 description: Longitude of the store location
 *                 example: 108.11263
 *                 required: true
 *               latitude:
 *                  type: number
 *                  description: Latitude of the store location
 *                  example: 16.12137
 *                  required: true
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

/**
 * @swagger
 * /stores/my-stores:
 *   get:
 *     summary: Get list of stores owned by the current user
 *     tags:
 *       - StoreController
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores owned by the current user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/my-stores", verifyToken, storeController.getListOwnStores);

/**
 * @swagger
 * /stores/{provinceId}/available-stores:
 *  get:
 *    summary: Get a list of available stores in a specific province
 *    description: Retrieves a list of stores that are available in the specified province. You can optionally filter the results by business type.
 *    tags:
 *      - StoreController
 *    parameters:
 *      - name: provinceId
 *        in: path
 *        description: The ID of the province to filter stores by.
 *        required: true
 *        schema:
 *          type: string
 *      - name: businessType
 *        in: query
 *        description: The type of business to filter the stores by, such as (food store, coffee). Use 'all' to get stores of all types.
 *        required: false
 *        schema:
 *          type: string
 *          default: all
 *    responses:
 *      200:
 *        description: A list of stores available in the specified province.
 *      400:
 *        description: Bad request. The province ID might be invalid or missing.
 *      500:
 *        description: Internal server error. An error occurred while retrieving the stores.
 */
router.get(
    "/:provinceId/available-stores",
    storeController.getListOfStoresInProvince
);

/**
 * @swagger
 * /stores/nearby-stores:
 *   get:
 *     summary: Get a list of nearby stores
 *     description: Retrieves a list of stores that are near a specific location. You can optionally filter the results by business type.
 *     tags:
 *       - StoreController
 *     parameters:
 *       - name: longitude
 *         in: query
 *         description: The longitude of the location to search for nearby stores.
 *         required: true
 *         schema:
 *           type: string
 *           example: "108.11263"
 *       - name: latitude
 *         in: query
 *         description: The latitude of the location to search for nearby stores.
 *         required: true
 *         schema:
 *           type: string
 *           example: "16.12137"
 *       - name: radius
 *         in: query
 *         description: The maximum distance in meters to search for nearby stores.
 *         required: true
 *         schema:
 *           type: string
 *       - name: businessType
 *         in: query
 *         description: The type of business to filter the stores by, such as (food store, coffee). Use 'all' to get stores of all types.
 *         required: false
 *         schema:
 *           type: string
 *           default: all
 *     responses:
 *       200:
 *         description: A list of nearby stores
 *       400:
 *         description: Bad request. The latitude and longitude might be missing.
 *       500:
 *         description: Internal server error. An error occurred while retrieving the stores.
 */
router.get("/nearby-stores", storeController.getListOfNearbyStores);

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

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags:
 *       - StoreController
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the store to get
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store found
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", storeController.getStoreById);

router.post(
    "/:id/check-in",
    verifyToken,
    handleUpload(1, 0),
    storeController.checkInStore
);

router.put("/:id", storeController.updateStoreById);
router.delete("/:id", verifyToken, storeController.deleteStoreById);

module.exports = router;
