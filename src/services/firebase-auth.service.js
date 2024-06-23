const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
} = require("../config/firebase.js");
const userService = require("./user.service.js");

class FirebaseAuthService {
    constructor() {
        this.auth = getAuth();
    }

    async registerUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            await sendEmailVerification(
                userCredential.user,
                actionCodeSettings
            );
        } catch (error) {
            throw new Error(error.message);
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

            await userService.createUser(userCredential.user);
            const token = userCredential._tokenResponse.idToken;
            const user = userCredential.user;
            return {
                token,
                userInfo: {
                    userId: user.uid,
                    displayName: user.displayName,
                    providerId: "Email/Password",
                },
            };
        } catch (error) {
            throw new Error("Invalid email or password");
        }
    }

    async signOut(userId) {
        try {
            await signOut(this.auth);
            await userService.updateUser(userId, { isOnline: false });
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
}

module.exports = new FirebaseAuthService();
