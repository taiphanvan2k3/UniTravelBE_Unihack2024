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

    getMyVouchers: async (req, res, next) => {
        try {
            const { id } = req.params;
            const vouchers = await userService.getVouchers(id);
            res.status(200).json(vouchers);
        } catch (error) {
            if (error.message.includes("-")) {
                const [statusCode, message] = error.message.split("-");
                return res.status(statusCode).json({
                    message,
                });
            }
            next(error);
        }
    },
};
