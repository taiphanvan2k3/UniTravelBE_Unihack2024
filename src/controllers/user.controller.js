const User = require("../models/user.model.js");
const userService = require('../services/user.service');

module.exports = {
  createUser: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ status: true, message: "User created" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ status: true, data: users });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
