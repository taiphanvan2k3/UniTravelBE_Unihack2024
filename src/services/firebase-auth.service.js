const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
} = require("../config/firebase.js");

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

            await sendEmailVerification(userCredential.user);
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

            const token = await userCredential.user.getIdToken();
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
            throw new Error(error.message);
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
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
