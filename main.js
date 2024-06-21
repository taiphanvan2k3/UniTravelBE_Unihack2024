import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("UniTravel database connected!"))
  .catch((err) => console.log(err));

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server backend is running on port ${PORT}`);
});
