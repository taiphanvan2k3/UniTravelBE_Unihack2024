const User = require("../../models/user.model");

const convertUserDBToUser = (userDB) => {
    return {
        userId: userDB.userId,
        email: userDB.email,
        username: userDB.username,
        displayName: userDB.displayName,
        imageUrl: userDB.imageUrl,
        phoneNumber: userDB.phoneNumber,
        address: userDB.address,
        isAdmin: userDB.isAdmin,
        isVerified: userDB.isVerified,
        isOnline: userDB.isOnline,
    };
};

const findUserById = async (userId) => {
    try {
        const user = await User.findOne({ userId });
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
    await userDB.save();
    return {
        userId: userDB.userId,
        email: userDB.email,
        username: userDB.username,
        displayName: userDB.displayName,
        imageUrl: userDB.imageUrl,
        phoneNumber: userDB.phoneNumber,
        address: userDB.address,
        isAdmin: userDB.isAdmin,
        isVerified: userDB.isVerified,
        isOnline: userDB.isOnline,
    };
};

const createOrUpdateUser = async (user) => {
    try {
        let userDB = await User.findOne({ userId: user.uid });
        if (userDB) {
            return await updateUserOnlineStatus(userDB);
        } else {
            const userInfo = {
                userId: user.uid,
                email: user.email,
                username: user.email.split("@")[0],
                displayName: user.displayName ?? user.email.split("@")[0],
                imageUrl: user.photoURL,
                phoneNumber: user.phoneNumber,
                address: "",
                isAdmin: false,
                isVerified: true,
                isOnline: true,
            };

            userDB = new User(userInfo);
            await userDB.save();
            return userInfo;
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const updateUser = async (userId, data) => {
    try {
        const result = await User.updateOne({ userId }, { $set: data });

        if (result.nModified === 0) {
            throw new Error("Update user failed");
        }
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
};

module.exports = {
    findUserById,
    createOrUpdateUser,
    updateUser,
};