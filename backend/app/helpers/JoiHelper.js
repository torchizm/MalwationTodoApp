const Joi = require("joi");

const JoiObjectId = (message) => Joi.string().regex(/^[a-fA-F0-9]{24}$/, message);
const JoiStringValidate = () => Joi.string().custom((value, helper) => {
    const re = /[^a-zA-Z0-9]/;
    if (!re.test(value)) return value;
    return helper.message('There are invalid chars in string');
});

module.exports = {
    JoiObjectId,
    JoiStringValidate
}