const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./src/routes/user.route.js");
const errorHandler = require("./src/helpers/error-handler.js");
const constants = require("./src/common/constants.js");
const {
    uploadFileFromFilePath,
} = require("./src/services/firestore.service.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.get("/upload-image", async (req, res, next) => {
    try {
        const url = await uploadFileFromFilePath("./image.jpg", "images");
        res.json({ url });
    } catch (error) {
        next(error);
    }
});

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
