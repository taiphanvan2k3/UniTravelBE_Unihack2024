const firebaseAuthService = require("../services/firebase-auth.service.js");

class FirebaseAuthController {
    async registerUser(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }

        try {
            await firebaseAuthService.registerUser(email, password);
            res.status(201).json({
                message: "Verification email sent! User created successfully!",
            });
        } catch (error) {
            next(error);
        }
    }

    async loginUser(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }

        try {
            const { token, userInfo } = await firebaseAuthService.loginUser(
                email,
                password
            );

            res.cookie("access_token", token, {
                maxAge: 3600000,
                httpOnly: true,
            });

            res.status(200).json({
                token,
                user: userInfo,
            });
        } catch (error) {
            if (error.message === "Email is not verified") {
                return res.status(403).json({
                    type: "email_verification_error",
                    error: error.message,
                });
            } else {
                next(error);
            }
        }
    }

    signOutUser(req, res, next) {
        try {
            firebaseAuthService.signOut();
            res.clearCookie("access_token");
            res.status(200).json({
                message: `user with email ${req.user.email} signed out successfully!`,
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(422).json({
                email: "Email is required",
            });
        }

        try {
            await firebaseAuthService.resetPassword(email);
            res.status(200).json({
                message: "Password reset email sent!",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FirebaseAuthController();
