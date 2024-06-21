const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require("./src/routes/user.route.js");
const errorHandler = require('./helpers/errorHandler');

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

const UserRoute = require('./src/routes/user.route');
app.use('/user', UserRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("UniTravel database connected!"))
  .catch((err) => console.log(err));

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server backend is running on port ${PORT}`);
});
