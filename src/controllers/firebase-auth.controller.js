const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
} = require("../config/firebase");

const auth = getAuth();

class FirebaseAuthController {
    registerUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(userCredential.user)
                    .then(() => {
                        // Lấy url của verification email của user từ userCredential.user.emailVerified
                        res.status(201).json({
                            message:
                                "Verification email sent! User created successfully!",
                        });
                    })
                    .catch(() => {
                        res.status(500).json({
                            type: "email_verification_error",
                            error: "Error sending email verification",
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    type: "create_user_error",
                    error: error.message,
                });
            });
    }

    loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (!userCredential.user.emailVerified) {
                    return res.status(403).json({
                        type: "email_verification_error",
                        error: "Email is not verified",
                    });
                }

                userCredential.user
                    .getIdToken()
                    .then((token) => {
                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: false,
                            maxAge: 60 * 60 * 1000,
                        });

                        res.status(200).json({
                            message: "Login successfully!",
                            token: token,
                            userInfo: {
                                userId: userCredential.user.uid,
                                displayName: userCredential.user.displayName,
                                providerId:
                                    userCredential.user.providerData[0]
                                        .providerId,
                            },
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            type: "get_token_error",
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    type: "login_error",
                    error: error.message,
                });
            });
    }

    signOutUser(req, res) {
        signOut(auth)
            .then(() => {
                const user = req.user;
                res.clearCookie("access_token");
                res.status(200).json({
                    message: `user with ${user.email} signed out successfully!`,
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
            });
    }

    resetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(422).json({
                email: "Email is required",
            });
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                res.status(200).json({
                    message: "Password reset email sent successfully!",
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
            });
    }
}

module.exports = new FirebaseAuthController();
