const Joi = require('joi');

const userValidate = (data) => {
    const userSchema = Joi.object({
        username: Joi.string().lowercase().required(),
        password: Joi.string().min(4).max(32).required(),
        name: Joi.string().min(4).max(32).required(),
        age: Joi.number().min(1).max(150).required(),
        role: Joi.string().min(3).max(10).required(),
        delflag: Joi.boolean().required(),
    });

    return userSchema.validate(data);
};

const userLoginValidate = (data) => {
    const userSchema = Joi.object({
        username: Joi.string().lowercase().required(),
        password: Joi.string().min(4).max(32).required(),
    });

    return userSchema.validate(data);
};

module.exports = {
    userValidate,
    userLoginValidate
};
