const Joi = require('joi');
const { JoiStringValidate } = require('../helpers/JoiHelper');

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{0,}$/i;

const registerValidation = (data) => {
    const schema = Joi.object({
        username: JoiStringValidate().required().min(6).max(255),
        email: Joi.string().required().max(255).email(),
        password: Joi.string().required().min(6).max(255).pattern(passwordRegex)
    });
    
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).max(255).pattern(passwordRegex).required()
    });

    return schema.validate(data);
}

module.exports = {
    registerValidation,
    loginValidation
}