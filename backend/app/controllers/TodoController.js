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
    if (!req.params.id) return res.json({ message: 'Workspace field required.' });
    
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
    const validationErrors = [];

    if (!req.params.id) validationErrors.push('Workspace field requried.');
    if (!req.body.description) validationErrors.push('Description field required.');

    const currentWorkspace = await Workspace.findOne({
        id: req.params.id
    });

    if (currentWorkspace === null) validationErrors.push('Invalid workspace.');
    if (validationErrors.length !== 0) return res.json({ message: validationErrors });

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
			return res.json({ message: error.errors['description'].message });
		}

        if (error.errors['workspace']) {
			return res.json({ message: error.errors['workspace'].message });
		}

        if (error.errors['author']) {
			return res.json({ message: error.errors['author'].message });
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
    const validationErrors = [];

    if (!req.body.workspace) validationErrors.push('Workspace field requried.');
    if (!req.body.todo) validationErrors.push('Todo field required.');
    if (!req.body.description) validationErrors.push('Description field required.');
    if (req.body.checked === undefined) validationErrors.push('Checked field required.');

    const currentWorkspace = await Workspace.findOne({
        _id: req.body.workspace
    });

    if (currentWorkspace === null) validationErrors.push('Invalid workspace.');
    if (validationErrors.length !== 0) return res.json({ message: validationErrors });

    const currentTodo = await Todo.findOne({
        _id: req.body.todo
    });

    if (currentTodo === null) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    if (!currentWorkspace.participants.includes(res.locals.user._id) && res.locals.user.role.name !== 'admin') {
        return res.status(401).json({ message: 'Access denied.' });
    }

    currentTodo.description = req.body.description;
    currentTodo.checked = req.body.checked;

    currentTodo.save((error) => {
		if (!error) {
			return res.json(currentTodo);
		}

		if (error.errors['description']) {
			return res.json({ message: error.errors['description'].message });
		}

		if (error.errors['checked']) {
			return res.json({ message: error.errors['checked'].message });
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
    const validationErrors = [];

    if (!req.params.todo) validationErrors.push('Todo field required.');
    if (!req.params.workspace) validationErrors.push('Workspace field requried.');

    const currentWorkspace = await Workspace.findOne({
        id: req.params.workspace
    });

    if (currentWorkspace === null) validationErrors.push('Invalid workspace.');
    if (validationErrors.length !== 0) return res.json({ message: validationErrors });

    const currentTodo = await Todo.findOne({
        _id: req.params.todo
    });

    if (currentTodo === null) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    currentTodo.delete();
    res.status(200).json({ message: 'Todo deleted.' });
};