const userRouter = require("../routes/user.route.js");
const authRouter = require("../routes/auth.route.js");
const experienceLocationRouter = require("../routes/experience-location.route.js");
const provinceRouter = require("../routes/province.route.js");
const storeRouter = require("../routes/store.route.js");
const postRouter = require("../routes/post.route.js");
const schedulesRouter = require("../routes/schedules.route.js");
const geminiRouter = require("../routes/gemini.route.js");
const socialRouter = require("../routes/social.route.js");

module.exports = (app) => {
    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/experience-locations", experienceLocationRouter);
    app.use("/provinces", provinceRouter);
    app.use("/stores", storeRouter);
    app.use("/posts", postRouter);
    app.use("/schedules", schedulesRouter);
    app.use("/gemini", geminiRouter);
    app.use("/social", socialRouter);
};
