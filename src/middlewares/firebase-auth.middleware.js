/**
 * Firebase Auth Middleware using Firebase Admin SDK
 */

const { admin } = require("../config/firebase.js");

const verifyToken = async (req, res, next) => {
    let accessToken = req.headers.authorization || req.cookies.access_token;
    accessToken = accessToken?.startsWith("Bearer ")
        ? accessToken.split("Bearer ")[1]
        : accessToken;
    if (!accessToken) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        const decodeToken = await admin.auth().verifyIdToken(accessToken);

        // Parse thông tin user từ token vào req.user
        req.user = decodeToken;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyToken;
