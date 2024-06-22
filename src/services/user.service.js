const createError = require('http-errors');
const User = require('../models/user.model');
const { mongoose } = require('mongoose');

const getListUser = async () => {
    try {
        const users = await User.find().select('email username address');
        return users;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports = {
    getListUser,
};