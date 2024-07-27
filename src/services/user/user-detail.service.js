const { logInfo, logError } = require("../logger.service.js");
const { getNamespace } = require("node-request-context");
const appState = getNamespace("AppState");

const User = require("../../models/user.model");
const UserVoucher = require("../../models/user-voucher.model");

const convertUserDBToUser = (userDB) => {
    return {
        userId: userDB._id,
        firebaseUserId: userDB.firebaseUserId,
        email: userDB.email,
        username: userDB.username,
        displayName: userDB.displayName,
        imageUrl: userDB.imageUrl,
        phoneNumber: userDB.phoneNumber,
        address: userDB.address,
        isAdmin: userDB.isAdmin,
        isVerified: userDB.isVerified,
        isOnline: userDB.isOnline,
        roles: userDB.roles,
        badges: userDB.badges,
    };
};

const findUser = async (type, value) => {
    try {
        const user = await User.findOne({ [type]: value });
        if (user) {
            return convertUserDBToUser(user);
        }
        return null;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const updateUserOnlineStatus = async (userDB) => {
    userDB.isOnline = true;
    userDB.isVerified = true;
    await userDB.save();
    return {
        userId: userDB._id,
        firebaseUserId: userDB.firebaseUserId,
        email: userDB.email,
        username: userDB.username,
        displayName: userDB.displayName,
        imageUrl: userDB.imageUrl,
        phoneNumber: userDB.phoneNumber,
        address: userDB.address,
        isAdmin: userDB.isAdmin,
        isVerified: userDB.isVerified,
        isOnline: userDB.isOnline,
        roles: userDB.roles,
        badges: userDB.badges,
    };
};

const createTempUser = async (user) => {
    let userDB = await User.findOne({ firebaseUserId: user.uid });
    if (!userDB) {
        const userInfo = {
            firebaseUserId: user.uid,
            email: user.email,
            username: user.email.split("@")[0],
            displayName: user.displayName,
            imageUrl: user.imageUrl ?? "",
            phoneNumber: "",
            address: "",
            isAdmin: false,
            isVerified: false,
            isOnline: false,
            roles: ["traveler"],
        };

        userDB = new User(userInfo);
        await userDB.save();
    }
};

const createOrUpdateUser = async (user) => {
    try {
        let userDB = await User.findOne({ firebaseUserId: user.uid }).populate(
            "badges"
        );
        if (userDB) {
            return await updateUserOnlineStatus(userDB);
        } else {
            const userInfo = {
                firebaseUserId: user.uid,
                email: user.email,
                username: user.email.split("@")[0],
                displayName: user.displayName ?? user.email.split("@")[0],
                imageUrl: user.photoURL,
                phoneNumber: user.phoneNumber,
                address: "",
                isAdmin: false,
                isVerified: true,
                isOnline: true,
                badges: [],
            };

            userDB = new User(userInfo);
            await userDB.save();
            userInfo.userId = userDB._id;
            return userInfo;
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const updateUser = async (identifier, identifierValue, data) => {
    try {
        const result = await User.updateOne(
            { [identifier]: identifierValue },
            { $set: data }
        );
        if (result.nModified === 0) {
            throw new Error("Update user failed");
        }
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
};

const getVouchers = async (userId) => {
    try {
        logInfo("getVouchers", "Start");
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new Error("404-User not found");
        }

        // Group by voucher theo loại
        const vouchers = await UserVoucher.find({
            user: currentUser._id,
        }).populate("voucher");

        const groupedVouchers = {};
        vouchers.forEach((userVoucher) => {
            const voucher = userVoucher.voucher;
            if (!groupedVouchers[voucher.code]) {
                groupedVouchers[voucher.code] = [];
            }
            groupedVouchers[voucher.code].push({
                voucher,
            });
        });

        logInfo("getVouchers", "End");
        return groupedVouchers;
    } catch (error) {
        logError("getVouchers", error.message);
        throw error;
    }
};

module.exports = {
    findUser,
    createTempUser,
    createOrUpdateUser,
    updateUser,
    getVouchers,
};
