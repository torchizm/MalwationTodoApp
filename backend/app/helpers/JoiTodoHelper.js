const Joi = require('joi');
const { JoiObjectId } = require('./JoiHelper');

const indexValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required()
    });

    return schema.validate(data);
}

const addValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required(),
        description: Joi.string().required()
    });

    return schema.validate(data);
}

const editValidation = (data) => {
    const schema = Joi.object({
        workspace: JoiObjectId().required(),
        todo: JoiObjectId().required(),
        description: Joi.string().required(),
        checked: Joi.boolean().required()
    });

    return schema.validate(data);
}

const deleteValidation = (data) => {
    const schema = Joi.object({
        todo: JoiObjectId().required(),
        workspace: JoiObjectId().required()
    });

    return schema.validate(data);
}

module.exports = {
    indexValidation,
    addValidation,
    editValidation,
    deleteValidation
}