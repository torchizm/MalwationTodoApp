const Todo = require("../../models/Todo");
const User = require("../../models/User");
const Workspace = require("../../models/Workspace");
const ObjectId = require('mongoose').Types.ObjectId;

exports.index = async (req, res) => {
    const users = await User.find().sort({'role': 'descending'}).populate('role');
    
    return res.status(200).json(users);
};

exports.get = async (req, res) => {
    if (req.params.id === undefined) {
        return res.status(404).json({
            message: 'User id field required.'
        })
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.json({
            message: "Not valid id."
        })
    }

    const validationErrors = [];

    const user = await User.findOne({
        _id: req.params.id
    })
    .select('username email role createdAt')
    .populate('role');

    if (user === null) validationErrors.push('User not found');

    const todos = await Todo.find({
        author: req.params.id
    });

    const workspaces = await Workspace.find({
        participants: ObjectId(req.params.id)
    }).populate('author', 'username');

    if (validationErrors.length !== 0) {
        return res.json({
            message: {
                validationErrors
            }
        });
    }

    return res.status(200).json({
        user: user,
        todos: todos,
        workspaces: workspaces
    });
}