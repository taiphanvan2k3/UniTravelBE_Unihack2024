const User = require("../models/user.model");

const authUser = async (req, res, next) => {
    try {
        const userId = req.payload.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json("You need sign in!");
        } else if (user.delflag) {
            return res.status(403).json("User is deleted!");
        }
        req.user = user;
    } catch (error) {
        console.log(error.message);
        next(error);
    }
    next();
};
const authPage = (permission) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!permission.includes(role)) {
            return res.status(401).json("You don't have permission");
        }
        next();
    };
};

module.exports = {
    authUser,
    authPage,
};
