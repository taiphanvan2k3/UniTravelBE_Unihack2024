const userRouter = require("../routes/user.route.js");
const authRouter = require("../routes/auth.route.js");
const experienceLocationRouter = require("../routes/experience-location.route.js");
const provinceRouter = require("../routes/province.route.js");
const storeRouter = require("../routes/store.route.js");

module.exports = (app) => {
    app.use("/user", userRouter);
    app.use("/auth", authRouter);
    app.use("/experience-locations", experienceLocationRouter);
    app.use("/provinces", provinceRouter);
    app.use("/stores", storeRouter);
};
