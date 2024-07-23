const storeService = require("../services/store/store-detail.service");

class StoreController {
    async createStore(req, res, next) {
        try {
            const storeData = req.body;
            const newStore = await storeService.createStore(storeData);
            return res.status(201).json(newStore);
        } catch (error) {
            next(error);
        }
    }

    async getStoreById(req, res, next) {
        try {
            const storeId = req.params.id;
            const store = await storeService.getStoreById(storeId);
            return res.status(200).json(store);
        } catch (error) {
            next(error);
        }
    }

    async updateStoreById(req, res, next) {
        try {
            const storeId = req.params.id;
            const updateData = req.body;
            const updatedStore = await storeService.updateStoreById(
                storeId,
                updateData
            );
            return res.status(200).json(updatedStore);
        } catch (error) {
            next(error);
        }
    }

    async deleteStoreById(req, res, next) {
        try {
            const storeId = req.params.id;
            const result = await storeService.deleteStoreById(storeId);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAllStores(req, res, next) {
        try {
            const stores = await storeService.getAllStores();
            return res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    }

    async getQRCodeUrl(req, res, next) {
        try {
            const { storeId } = req.params;
            const qrCodeUrl = await storeService.getQRCodeUrl(storeId);
            return res.status(200).json({ qrCodeUrl });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StoreController();
