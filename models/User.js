import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  isVerified: { type: Boolean, required: true },
});

export default mongoose.model("User", UserSchema);
