const Joi = require('joi');
const { JoiObjectId } = require('../JoiHelper');

const getValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required()
    });

    return schema.validate(data);
}

module.exports = {
    getValidation
}