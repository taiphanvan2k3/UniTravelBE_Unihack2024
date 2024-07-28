const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const mongoose = require("mongoose");
const constants = require("./src/common/constants.js");
const { swaggerUI, specs } = require("./src/config/swagger.js");
const { logInfo } = require("./src/services/logger.service.js");

// Routers
const routes = require("./src/routes");
const errorHandler = require("./src/helpers/error-handler.js");

// Crawl data
const seedData = require("./src/models/InitDB/DbInitialize.js");

const app = express();
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://lgprl5tl-5173.asse.devtunnels.ms",
            "https://uni-travel-fe-unihack2024.vercel.app",
        ],
        methods: ["GET", "POST"],

        // Nhằm cho phép client gửi cookie lên server
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nạp các route vào ứng dụng
routes(app);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || constants.SERVER_PORT;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        logInfo("main.js", "Connected to MongoDB successfully");
        seedData();
    })
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    logInfo("main.js", `Server backend is running at localhost:${PORT}`);
});
