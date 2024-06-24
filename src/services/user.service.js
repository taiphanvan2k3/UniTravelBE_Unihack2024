const User = require("../models/user.model");

const findUserById = async (userId) => {
    try {
        const user = await User.findOne({ userId });
        return user;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const createUser = async (user) => {
    try {
        let userDB = await findUserById(user.uid);
        if (userDB) {
            userDB.isOnline = true;
            await userDB.save();
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

const getListUser = async () => {
    try {
        const users = await User.find().select("email username address");
        return users;
    } catch (error) {
        console.error("Error getListUser:", error.message);
        throw error;
    }
};

module.exports = {
    getListUser,
    createUser,
    updateUser,
};
