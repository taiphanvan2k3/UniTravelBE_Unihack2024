const { logInfo, logError } = require("../logger.service.js");
const { getNamespace } = require("node-request-context");
const appState = getNamespace("AppState");
const Store = require("../../models/store.model.js");

const getListOfStoresInProvince = async (provinceId, businessType) => {
    try {
        logInfo("getListOfStoresInProvince", "Start");
        const stores = await Store.find({
            province: provinceId,
            businessType:
                businessType == "all" ? { $exists: true } : businessType,
        });

        logInfo("getListOfStoresInProvince", "End");
        return stores;
    } catch (error) {
        logError("getListOfStoresInProvince", error.message);
        throw new Error("getListOfStoresInProvince: " + error.message);
    }
};

const getListOfNearbyStores = async (
    longitude,
    latitude,
    maxDistance,
    businessType
) => {
    try {
        logInfo("getListOfNearbyStores", "Start");
        const stores = await Store.find({
            addressOnMap: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            parseFloat(longitude) ?? 108.11263,
                            parseFloat(latitude) ?? 16.12137,
                        ],
                    },
                    $maxDistance: maxDistance,
                },
            },
            businessType:
                businessType == "all" ? { $exists: true } : businessType,
        });

        logInfo("getListOfNearbyStores", "End");
        return stores;
    } catch (error) {
        logError("getListOfNearbyStores", error.message);
        throw new Error("getListOfNearbyStores: " + error.message);
    }
};

/**
 * Lấy danh sách cửa hàng của người dùng hiện tại
 */
const getListOwnStores = async () => {
    try {
        logInfo("getListOwnStores", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const stores = await Store.find({ owner: currentUserId });

        logInfo("getListOwnStores", "End");
        return stores;
    } catch (error) {
        logError("getListOwnStores", error.message);
        throw new Error("getListOwnStores: " + error.message);
    }
};

module.exports = {
    getListOwnStores,
    getListOfNearbyStores,
    getListOfStoresInProvince,
};
