const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const mongoose = require("mongoose");
const constants = require("./src/common/constants.js");
const { swaggerUI, specs } = require("./src/config/swagger.js");

// Routers
const userRouter = require("./src/routes/user.route.js");
const authRouter = require("./src/routes/auth.route.js");
const errorHandler = require("./src/helpers/error-handler.js");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nạp các route vào ứng dụng
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || constants.SERVER_PORT;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("UniTravel database connected!"))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server backend is running at localhost:${PORT}`);
});
