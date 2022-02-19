const Todo = require('../../models/Todo');
const User = require('../../models/User');
const Workspace = require('../../models/Workspace');


exports.index = async (req, res) => {
    const workspaces = await Workspace.find();
    const todos = await Todo.find().populate('author');
    
    return res.status(200).json({
        workspaces: workspaces,
        todos: todos
    });
}