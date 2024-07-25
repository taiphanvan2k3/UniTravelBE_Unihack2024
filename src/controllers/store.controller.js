const storeService = require("../services/store/store-detail.service");
const listOfStoresService = require("../services/store/list-of-stores.service");
const { deleteAllUploadedFiles } = require("../helpers/utils");

class StoreController {
    async createStore(req, res, next) {
        const { thumbnail, images, videos } = req.files;
        try {
            const storeData = req.body;
            const newStore = await storeService.createStore(storeData, {
                thumbnail,
                images,
                videos,
            });
            return res.status(201).json(newStore);
        } catch (error) {
            deleteAllUploadedFiles(thumbnail, images, videos);
            next(error);
        }
    }

    async getStoreById(req, res, next) {
        try {
            const storeId = req.params.id;
            const store = await storeService.getStoreById(storeId);
            if (!store) {
                return res.status(404).json({
                    message: "Store not found",
                });
            }
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

    async getListOfStoresInProvince(req, res, next) {
        try {
            const { provinceId } = req.params;
            const { businessType } = req.query;
            if (!provinceId) {
                return res.status(400).json({
                    message: "Province ID is required",
                });
            }

            const stores = await listOfStoresService.getListOfStoresInProvince(
                provinceId,
                businessType
            );
            return res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    }

    async getListOwnStores(req, res, next) {
        try {
            const stores = await listOfStoresService.getListOwnStores();
            return res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    }

    async getListOfNearbyStores(req, res, next) {
        try {
            const { latitude, longitude, radius, businessType } = req.query;
            if (!latitude || !longitude) {
                return res.status(400).json({
                    message: "Latitude and Longitude are required",
                });
            }

            const stores = await listOfStoresService.getListOfNearbyStores(
                longitude,
                latitude,
                radius,
                businessType
            );
            return res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    }

    async getPostsInStore(req, res, next) {
        try {
            const storeId = req.params.id;
            const pageIndex = Number(req.query.pageIndex) || 0;
            const pageSize = Number(req.query.pageSize) || 10;
            const posts = await listOfStoresService.getPostsInStore(
                storeId,
                pageIndex,
                pageSize
            );
            return res.status(200).json(posts);
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

    async checkInStore(req, res, next) {
        try {
            const { images } = req.files;
            if (!images || images.length === 0) {
                return res.status(400).json({
                    message: "Images are required",
                });
            }

            const storeId = req.params.id;
            await storeService.checkInStore(storeId, images[0].path);
            return res.status(200).json({ message: "Check in successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StoreController();
