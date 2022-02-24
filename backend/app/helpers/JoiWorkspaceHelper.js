const Joi = require('joi');
const { JoiObjectId, JoiStringValidate } = require('./JoiHelper');

const getValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required()
    });

    return schema.validate(data);
}

const getMembersValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required()
    });

    return schema.validate(data);
}

const addValidation = (data) => {
    const schema = Joi.object({
        name: JoiStringValidate().required().max(128)
    });

    return schema.validate(data);
}

const addMemberValidation = (data) => {
    const schema = Joi.object({
        workspace: JoiObjectId().required(),
        member: JoiStringValidate().required().min(6).max(255)
    });

    return schema.validate(data);
}

const removeMemberValidation = (data) => {
    const schema = Joi.object({
        workspace: JoiObjectId().required(),
        member: JoiObjectId().required()
    });

    return schema.validate(data);
}

const editValidation = (data) => {
    const schema = Joi.object({
        workspace: JoiObjectId().required(),
        name: JoiStringValidate().required(),
        participants: Joi.array().items(JoiObjectId()).required()
    });

    return schema.validate(data);
}

const deleteValidation = (data) => {
    const schema = Joi.object({
        id: JoiObjectId().required()
    });

    return schema.validate(data);
}

module.exports = {
    getValidation,
    getMembersValidation,
    addValidation,
    addMemberValidation,
    removeMemberValidation,
    editValidation,
    deleteValidation
}