const qrCodeService = require("../qr-code/qr-generation.service");
const { uploadFileFromFilePath } = require("../firestore-utils.service");
const { logInfo, logError } = require("../logger.service.js");
const { getNamespace } = require("node-request-context");
const { getPostsInLocation } = require("../post/list-posts.service");
const { calculateDistance } = require("../../helpers/utils.js");

const fs = require("fs");
const Store = require("../../models/store.model");
const User = require("../../models/user.model.js");
const CheckInHistory = require("../../models/checkin-history.model.js");
const appState = getNamespace("AppState");

const createStore = async (storeData, medias) => {
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
            province: storeData.provinceId,
            addressOnMap: {
                type: "Point",
                coordinates: [
                    storeData.longitude ?? "108.11263",
                    storeData.latitude ?? "16.12137",
                ],
            },
        });
        await newStore.save();

        // Không cần chờ upload file xong mới trả về response
        uploadFilesToFirebaseStorage(
            newStore,
            medias.thumbnail?.length > 0 ? medias.thumbnail[0] : null,
            medias.images,
            medias.videos
        );
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
        let storeData = store?.toObject();
        if (store) {
            const pageIndex = 1;
            const pageSize = 10;
            storeData.comments = await getPostsInLocation(
                store._id,
                "store",
                pageIndex,
                pageSize
            );
            storeData.pageIndex = pageIndex;
        }

        logInfo("getStoreById", "End");
        return storeData;
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

const checkInStore = async (storeId, qrCodePath, longitude, latitude) => {
    try {
        logInfo("checkInStore", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            throw new Error("404-User not found");
        }

        const storeInfo = await qrCodeService.decodeQRCode(qrCodePath);
        if (!storeInfo || storeInfo.storeId !== storeId) {
            throw new Error("400-Invalid QR code");
        }

        const store = await Store.findById(storeInfo.storeId);
        if (!store) {
            throw new Error("404-Store not found");
        }

        // Kiểm tra về khoảng cách
        const distance = calculateDistance(
            store.addressOnMap.coordinates[1],
            store.addressOnMap.coordinates[0],
            latitude,
            longitude
        );

        if (distance > 50) {
            throw new Error("401-You are too far from the store");
        }

        let checkInHistory = await CheckInHistory.findOne({
            user: currentUser._id,
            store: store._id,
        });

        if (!checkInHistory) {
            checkInHistory = new CheckInHistory({
                user: currentUser._id,
                store: store._id,
            });
        } else {
            checkInHistory.lastCheckIn = Date.now();
        }

        await checkInHistory.save();
        logInfo("checkInStore", "End");
    } catch (error) {
        logError("checkInStore", error.message);
        throw error;
    } finally {
        fs.unlink(qrCodePath, (err) => {
            if (err) {
                logError("checkInStore", err.message);
                throw new Error("checkInStore: " + err.message);
            }
        });
    }
};

const simpleCheckInStore = async (userId, storeId, longitude, latitude) => {
    try {
        logInfo("checkInStore", "Start");
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new Error("404-User not found");
        }

        const store = await Store.findById(storeId);
        if (!store) {
            throw new Error("404-Store not found");
        }

        // Kiểm tra về khoảng cách
        const distance = calculateDistance(
            store.addressOnMap.coordinates[1],
            store.addressOnMap.coordinates[0],
            latitude,
            longitude
        );

        if (distance > 50) {
            throw new Error("401-You are too far from the store");
        }
        
        let checkInHistory = await CheckInHistory.findOne({
            user: currentUser._id,
            store: store._id,
        });

        if (!checkInHistory) {
            checkInHistory = new CheckInHistory({
                user: currentUser._id,
                store: store._id,
            });
        } else {
            checkInHistory.lastCheckIn = Date.now();
        }

        await checkInHistory.save();
        logInfo("checkInStore", "End");
    } catch (error) {
        logError("checkInStore", error.message);
        throw error;
    }
};

//#region Private functions

const uploadFilesToFirebaseStorage = async (
    store,
    thumbnail,
    images,
    videos
) => {
    const files = [];
    try {
        logInfo("uploadFilesToFirebaseStorage", "Start");
        const bucketName = "store-media";

        if (images) {
            images.forEach((image) => {
                files.push(image);
            });
        }
        if (videos) {
            videos.forEach((video) => {
                files.push(video);
            });
        }

        const thumbnailUploadPromise = thumbnail
            ? uploadFileFromFilePath(thumbnail.path, bucketName)
            : Promise.resolve(null);
        const imageUploadPromises =
            images && images.length > 0
                ? images.map((image) =>
                      uploadFileFromFilePath(image.path, bucketName)
                  )
                : [];

        const videoUploadPromises =
            videos && videos.length > 0
                ? videos.map((video) =>
                      uploadFileFromFilePath(video.path, bucketName)
                  )
                : [];

        const [thumbnailUrl, ...fileUrls] = await Promise.all([
            thumbnailUploadPromise,
            ...imageUploadPromises,
            ...videoUploadPromises,
        ]);

        const imageUrls = fileUrls.slice(0, images?.length ?? 0);
        const videoUrls = fileUrls.slice(images?.length ?? 0);

        store.thumbnailUrl = thumbnailUrl;
        store.imageUrls = imageUrls;
        store.videoUrls = videoUrls;
        await store.save();

        logInfo("uploadFilesToFirebaseStorage", "End");
    } catch (error) {
        logError("uploadFilesToFirebaseStorage", error);
        throw error;
    } finally {
        if (thumbnail) files.push(thumbnail);
        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
    }
};

//#endregion

module.exports = {
    createStore,
    getStoreById,
    updateStoreById,
    deleteStoreById,
    getQRCodeUrl,
    generateQRCode,
    checkInStore,
    simpleCheckInStore,
};
