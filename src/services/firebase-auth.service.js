const { admin } = require("./firestore.service.js");
const dotenv = require("dotenv");
dotenv.config();

const request = require("request-promise");

module.exports = {
    /**
     * Login by firebase authentication with email and password
     * @param {String} email
     * @param {String} password
     */
    loginWithEmailAndPassword: async (email, password) => {
        const apiKey = process.env.FIREBASE_WEB_API_KEY;
        const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

        const options = {
            method: "POST",
            uri: signInUrl,
            body: {
                email,
                password,
                returnSecureToken: true,
            },
            json: true,
        };

        const response = await request(options);
        const decodedToken = await admin.auth().verifyIdToken(response.idToken);
        return decodedToken;
    },
};
