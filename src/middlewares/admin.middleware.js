const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET);

            // Get user from the token
            // ...

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
};

module.exports = { protect };
