const qrCodeService = require("../qr-code/qr-generation.service");
const { uploadFileFromFilePath } = require("../firestore-utils.service");
const { logInfo, logError } = require("../logger.service.js");
const fs = require("fs");
const { getNamespace } = require("node-request-context");

const Store = require("../../models/store.model");
const User = require("../../models/user.model.js");
const appState = getNamespace("AppState");

const createStore = async (storeData) => {
    try {
        logInfo("createStore", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            throw new Error("User not found");
        }

        const newStore = new Store({
            ...storeData,
            owner: currentUser._id,
        });

        await newStore.save();
        logInfo("createStore", "End");
        return newStore;
    } catch (error) {
        throw new Error("createStore: " + error.message);
    }
};

const getStoreById = async (id) => {
    try {
        logInfo("getStoreById", "Start");
        const store = await Store.findById(id);
        logInfo("getStoreById", "End");
        return store;
    } catch (error) {
        logError("getStoreById", error.message);
        throw new Error("getStoreById: " + error.message);
    }
};

const updateStoreById = async (id, updateData) => {
    try {
        logInfo("updateStoreById", "Start");
        const updatedStore = await Store.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        logInfo("updateStoreById", "End");
        return updatedStore;
    } catch (error) {
        logError("updateStoreById", error.message);
        throw new Error("updateStoreById: " + error.message);
    }
};

const deleteStoreById = async (id) => {
    try {
        logInfo("deleteStoreById", "Start");
        await Store.findByIdAndDelete(id);
        logInfo("deleteStoreById", "End");
        return { message: "Store deleted successfully" };
    } catch (error) {
        logError("deleteStoreById", error.message);
        throw new Error("deleteStoreById: " + error.message);
    }
};

const getAllStores = async () => {
    try {
        logInfo("getAllStores", "Start");
        const stores = await Store.find();
        logInfo("getAllStores", "End");
        return stores;
    } catch (error) {
        logError("getAllStores", error.message);
        throw new Error("getAllStores: " + error.message);
    }
};

const generateQRCode = async (storeId) => {
    try {
        logInfo("generateQRCode", "Start");
        const store = await Store.findById(storeId);
        if (!store) {
            throw new Error("Store not found");
        }

        let outputPath = `./images/${storeId}.png`;
        outputPath = await qrCodeService.generateQRCodeWithLogo(
            {
                storeId: store._id,
                storeName: store.name,
                thumbnailUrl: store.thumbnailUrl,
            },
            outputPath
        );

        const fileUrl = await uploadFileFromFilePath(outputPath, "qr-codes");
        store.qrCodeUrl = fileUrl;
        await store.save();

        // Xoá file QR code sau khi đã upload lên storage
        fs.unlink(outputPath, (err) => {
            if (err) {
                logError("generateQRCode", err.message);
                throw new Error("generateQRCode: " + err.message);
            }
        });

        logInfo("generateQRCode", "End");
        return fileUrl;
    } catch (error) {
        logError("generateQRCode", error.message);
        throw new Error("generateQRCode: " + error.message);
    }
};

const getQRCodeUrl = async (storeId) => {
    try {
        logInfo("getQRCodeUrl", "Start");
        const store = await Store.findById(storeId);
        if (!store) {
            throw new Error("Store not found");
        }

        if (!store.qrCodeUrl) {
            store.qrCodeUrl = await generateQRCode(storeId);
        }
        await store.save();

        logInfo("getQRCodeUrl", "End");
        return store.qrCodeUrl;
    } catch (error) {
        logError("getQRCodeUrl", error.message);
        throw new Error("getQRCodeUrl: " + error.message);
    }
};

module.exports = {
    createStore,
    getStoreById,
    updateStoreById,
    deleteStoreById,
    getAllStores,
    getQRCodeUrl,
    generateQRCode,
};
