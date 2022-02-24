const { indexValidation, addValidation, editValidation, deleteValidation } = require('../helpers/JoiTodoHelper.js');
const Todo = require('../models/Todo');
const Workspace = require('../models/Workspace');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns users todo list of current workspace
 */
exports.index = async (req, res) => {
    const { error } = indexValidation(req.params);

    if (error) {
        return res.json({
            message: error.details[0].message
        })
    }

    const todos = await Todo.find({
        workspace: req.params.id
    }).sort({ checked: 'ascending', updatedAt: 'descending' });

    return res.json(todos);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns added todo list item
 */
exports.add = async (req, res) => {
    const { error } = addValidation({...req.params, ...req.body});

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const currentWorkspace = await Workspace.findOne({
        id: req.params.id
    });

    if (currentWorkspace === null) {
        return res.json({
            message: 'Invalid workspace'
        });
    }

    const newTodo = new Todo({
        description: req.body.description,
        workspace: req.params.id,
        author: res.locals.user._id
    });

    newTodo.save((error) => {
		if (!error) {
			return res.json(newTodo);
		}

		if (error.errors['description']) {
			return res.json({
                message: error.errors['description'].message
            });
		}

        if (error.errors['workspace']) {
			return res.json({
                message: error.errors['workspace'].message
            });
		}

        if (error.errors['author']) {
			return res.json({
                message: error.errors['author'].message
            });
		}
	});
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns edited todo item
 */
exports.edit = async (req, res) => {
    const { error } = editValidation({...req.params, ...req.body});

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const currentWorkspace = await Workspace.findOne({
        _id: req.params.workspace
    });

    if (currentWorkspace === null) {
        return res.json({
            message: 'Invalid workspace'
        });
    }

    const currentTodo = await Todo.findOne({
        _id: req.params.todo
    });

    if (currentTodo === null) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    if (!currentWorkspace.participants.includes(res.locals.user._id) && res.locals.user.role.name !== 'admin') {
        return res.status(401).json({
            message: 'Access denied'
        });
    }

    currentTodo.description = req.body.description;
    currentTodo.checked = req.body.checked;

    currentTodo.save((error) => {
		if (!error) {
			return res.json(currentTodo);
		}

		if (error.errors['description']) {
			return res.json({
                message: error.errors['description'].message
            });
		}

		if (error.errors['checked']) {
			return res.json({
                message: error.errors['checked'].message
            });
		}
	});
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @summary deletes specified todo list item from current workspace
 */
exports.delete = async (req, res) => {
    const { error } = deleteValidation(res.params);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const currentWorkspace = await Workspace.findOne({
        id: req.params.workspace
    });

    if (currentWorkspace === null) {
        return res.json({
            message: 'Invalid workspace'
        });
    }

    const currentTodo = await Todo.findOne({
        _id: req.params.todo
    });

    if (currentTodo === null) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    currentTodo.delete();

    res.status(200).json({
        message: 'Todo deleted'
    });
};