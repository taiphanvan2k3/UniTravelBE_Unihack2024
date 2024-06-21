const mongoose = require('mongoose');

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

const User = mongoose.model("User", UserSchema);
module.exports = User;