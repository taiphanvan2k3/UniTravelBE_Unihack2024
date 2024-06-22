const authService = require("../services/auth.service");

module.exports = {
    loginWithEmailAndPassword: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const userInfo = await authService.loginWithEmailAndPassword(
                email,
                password
            );
            res.json(userInfo);
        } catch (error) {
            next(error);
        }
    },
};
