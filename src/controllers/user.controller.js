const userService = require("../services/user/user-detail.service.js");

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userService.getListUser();
            res.status(200).json({ status: true, data: users });
        } catch (error) {
            next(error);
        }
    },
};
