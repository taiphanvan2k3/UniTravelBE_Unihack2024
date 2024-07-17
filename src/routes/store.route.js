const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store.controller");

router.post("/create-store", StoreController.createStore);
router.get("/", StoreController.getAllStores);
router.get("/:id", StoreController.getStoreById);
router.put("/:id", StoreController.updateStoreById);
router.delete("/:id", StoreController.deleteStoreById);

module.exports = router;
