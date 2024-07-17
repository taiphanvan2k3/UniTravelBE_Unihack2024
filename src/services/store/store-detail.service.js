const Store = require("../../models/store.model");
const { logInfo, logError } = require("../logger.service.js");

const createStore = async (storeData) => {
    try {
        logInfo("createStore", "Start");
        const newStore = new Store(storeData);
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
        throw new Error("getStoreById: " + error.message);
    }
};

const updateStoreById = async (id, updateData) => {
    try {
        logInfo("updateStoreById", "Start");
        const updatedStore = await Store.findByIdAndUpdate(id, updateData, { new: true });
        logInfo("updateStoreById", "End");
        return updatedStore;
    } catch (error) {
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
        throw new Error("getAllStores: " + error.message);
    }
};

module.exports = {
    createStore,
    getStoreById,
    updateStoreById,
    deleteStoreById,
    getAllStores
};
