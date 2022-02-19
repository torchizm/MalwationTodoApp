const Todo = require('../../models/Todo');
const User = require('../../models/User');
const Workspace = require('../../models/Workspace');


exports.index = async (req, res) => {
    const workspaces = await Workspace.count();
    const users = await User.count();
    const todos = await Todo.count();
    const todosFinished = await Todo.count({
        checked: true
    });
    
    return res.status(200).json({
        workspaces: workspaces,
        users: users,
        todos: {
            total: todos,
            finished: todosFinished
        }
    });
};