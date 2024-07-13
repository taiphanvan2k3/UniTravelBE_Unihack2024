const User = require("../../models/user.model");

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
};
