const { getValidation } = require("../../helpers/Admin/JoiUsersHelper");
const Todo = require("../../models/Todo");
const User = require("../../models/User");
const Workspace = require("../../models/Workspace");
const ObjectId = require('mongoose').Types.ObjectId;

exports.index = async (req, res) => {
    const users = await User.find().sort({'role': 'descending'}).populate('role');
    
    return res.status(200).json(users);
};

exports.get = async (req, res) => {
    const { error } = getValidation(req.params);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const user = await User.findOne({
        _id: req.params.id
    })
    .select('username email role createdAt')
    .populate('role');

    if (user === null) {
        return res.json({
            message: 'User not found'
        });
    }

    const todos = await Todo.find({
        author: req.params.id
    });

    const workspaces = await Workspace.find({
        participants: ObjectId(req.params.id)
    }).populate('author', 'username');

    return res.status(200).json({
        user: user,
        todos: todos,
        workspaces: workspaces
    });
}