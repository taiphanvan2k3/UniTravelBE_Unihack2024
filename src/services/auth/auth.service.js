const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    admin,
} = require("../../config/firebase.js");
const userService = require("../user/user-detail.service.js");
const { logError } = require("../logger.service.js");

class AuthService {
    constructor() {
        this.auth = getAuth();
    }

    async registerUser(email, password, displayName, role) {
        let userCredential = null;
        // Sẽ điều hướng user đến trang sign-in sau khi xác thực email thành công
        const actionCodeSettings = {
            url: "http://localhost:5173/auth/sign-in",
            handleCodeInApp: false,
        };

        try {
            userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            await sendEmailVerification(
                userCredential.user,
                actionCodeSettings
            );

            userService.createTempUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName,
                role,
            });
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                const existingUser = await userService.findUser("email", email);
                if (existingUser.isVerified) {
                    throw new Error("Email is already in use");
                } else {
                    await this.reSentEmailVerification(
                        existingUser,
                        email,
                        password,
                        actionCodeSettings
                    );
                    throw new Error("Verification email is re-sent");
                }
            }

            throw new Error(error.message);
        }
    }

    async verifyToken(token) {
        try {
            const decodeToken = await admin.auth().verifyIdToken(token);
            return await userService.findUser(
                "firebaseUserId",
                decodeToken.uid
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUserClaimsIfNecessary(userCredential, userInSystem) {
        try {
            const userId = userCredential.user.uid;
            let token = userCredential._tokenResponse.idToken;
            const userRecord = await admin.auth().getUser(userId);
            if (
                !userRecord.customClaims ||
                userRecord.customClaims.userIdInSystem !==
                    userInSystem.userId.toString() ||
                userRecord.customClaims.roles !== userInSystem.roles
            ) {
                await admin.auth().setCustomUserClaims(userId, {
                    userIdInSystem: userInSystem.userId.toString(),
                    roles: userInSystem.roles,
                });
                token = await userCredential.user.getIdToken(true);
            }
            return token;
        } catch (error) {
            logError("updateUserClaimsIfNecessary", error.message);
        }
    }

    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            if (!userCredential.user.emailVerified) {
                throw new Error("Email is not verified");
            }

            const user = await userService.createOrUpdateUser(
                userCredential.user
            );

            // Update claims
            const token = await this.updateUserClaimsIfNecessary(
                userCredential,
                user
            );

            return {
                token,
                userInfo: user,
            };
        } catch (error) {
            if (error.message == "Email is not verified") {
                throw new Error(error.message);
            }
            throw new Error("Invalid email or password");
        }
    }

    async signOut(userId) {
        try {
            await signOut(this.auth);
            await userService.updateUser("firebaseUserId", userId, {
                isOnline: false,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(this.auth, email);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async checkEmailIsExist(email) {
        try {
            await admin.auth().getUserByEmail(email);
            return true;
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                return false;
            }
            throw new Error(error.message);
        }
    }

    async reSentEmailVerification(
        userFromDB,
        email,
        password,
        actionCodeSettings
    ) {
        try {
            // Xoá user
            const oldUserId = userFromDB.userId;
            await admin.auth().deleteUser(oldUserId);

            // Tạo lại user
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            // Gửi lại email xác thực
            await sendEmailVerification(
                userCredential.user,
                actionCodeSettings
            );

            userFromDB.userId = userCredential.user.uid;
            userService.updateUser("userId", oldUserId, userFromDB);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new AuthService();
