const authService = require("../services/auth/auth.service.js");
const { logInfo, logError } = require("../services/logger.service.js");

class AuthController {
    async registerUser(req, res, next) {
        logInfo("registerUser", "Start");
        const { email, password, displayName, role } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
                displayName: "Display name is required",
                role: "Role is required",
            });
        }

        try {
            await authService.registerUser(email, password, displayName, role);
            logInfo("registerUser", "End");
            return res.status(201).json({
                message: "Verification email sent! User created successfully!",
            });
        } catch (error) {
            if (error.message == "Verification email is re-sent") {
                return res.status(200).json({
                    message: error.message,
                });
            }

            logError("registerUser", error.message);
            res.status(500).json({
                message: error.message,
            });
            next(error);
        }
    }

    async verifyToken(req, res, next) {
        logInfo("verifyToken", "Start");
        let { token } = req.body;
        if (!token) {
            token = req.cookies?.access_token;
        }

        if (!token) {
            logInfo("verifyToken", "End");
            return res.status(422).json({
                token: "Token is required",
            });
        }

        try {
            const userInfo = await authService.verifyToken(token);
            if (!userInfo) {
                return res.status(404).json({
                    message: "User not found!",
                });
            }

            res.status(200).json({
                user: userInfo,
                token,
            });

            logInfo("verifyToken", "End");
        } catch (error) {
            logError("verifyToken", error.message);

            res.status(401).json({
                type: "token_error",
                message: "Verify token failed!",
            });
            next(error);
        }
    }

    async loginUser(req, res, next) {
        logInfo("loginUser", "Start");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }

        try {
            const { token, userInfo } = await authService.loginUser(
                email,
                password
            );

            res.cookie("access_token", token, {
                maxAge: 3600000,
                // httpOnly: true,
                path: "/",
            });

            res.status(200).json({
                token,
                user: userInfo,
            });

            logInfo("loginUser", "End");
        } catch (error) {
            logError("loginUser", error.message);
            if (error.message === "Email is not verified") {
                res.status(403).json({
                    type: "email_verification_error",
                    message: error.message,
                });
            } else {
                res.status(401).json({
                    type: "login_error",
                    message: error.message,
                });
            }
            next(error);
        }
    }

    async signOutUser(req, res, next) {
        try {
            logInfo("signOutUser", "Start");
            const { email } = req.body;
            const emailFromAccessToken = req.user.email;

            if (email !== emailFromAccessToken) {
                return res.status(403).json({
                    message: "Email does not match with the token!",
                });
            }

            await authService.signOut(req.user.uid);
            res.clearCookie("access_token");
            res.status(200).json({
                message: `user with email ${req.user.email} signed out successfully!`,
            });

            logInfo("signOutUser", "End");
        } catch (error) {
            logError("signOutUser", error.message);
            next(error);
        }
    }

    async resetPassword(req, res) {
        logInfo("resetPassword", "Start");
        const { email } = req.body;
        if (!email) {
            return res.status(422).json({
                email: "Email is required",
            });
        }

        try {
            await authService.resetPassword(email);
            res.status(200).json({
                message: "Password reset email sent!",
            });
            logInfo("resetPassword", "End");
        } catch (error) {
            logError("resetPassword", error.message);
            next(error);
        }
    }

    async checkEmailIsExist(req, res) {
        logInfo("checkEmailIsExist", "Start");
        const { email } = req.body;
        if (!email) {
            return res.status(422).json({
                email: "Email is required",
            });
        }

        try {
            const isExist = await authService.checkEmailIsExist(email);
            res.status(200).json({
                isExist,
            });
            logInfo("checkEmailIsExist", "End");
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
            logError("checkEmailIsExist", error.message);
        }
    }
}

module.exports = new AuthController();
