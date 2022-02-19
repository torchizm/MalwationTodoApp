const ObjectId = require('mongoose').Types.ObjectId
const Todo = require('../models/Todo');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

exports.index = async (req, res) => {
    let workspaces = await Workspace.aggregate([
        { $match: { participants: res.locals.user._id } },
        { $lookup: {
            from: 'todos', localField: '_id', foreignField: 'workspace', as: 'todos'
        }},
        { $sort: {
            "todos.updatedAt": -1
        }}
    ]);
    
    workspaces = await Workspace.populate(workspaces, {
        path: 'author',
        select: 'username'
    });

    return res.json(workspaces);
};

exports.get = async (req, res) => {
    validationErrors = [];

    if (req.params.id === undefined) {
        return res.json({
            message: 'Workspace ID field required.'
        });
    };

    if (!ObjectId.isValid(req.params.id)) {
        return res.json({
            message: "Not valid id."
        })
    }

    let workspace = await Workspace.aggregate([
        { $match: {
            $and: [
                { _id: ObjectId(req.params.id) },
                { participants: res.locals.user._id}
            ]}
        },
        { $lookup: {
            from: 'todos',
            as: 'todos',
            localField: '_id',
            foreignField: 'workspace',
            pipeline: [
                { $sort: {
                        'checked': 1,
                        'updatedAt': -1
                    },
                }
            ]
        }}
    ]);
    
    if (workspace.length === 0) validationErrors.push('Workspace not found.');
    
    if (validationErrors.length !== 0) {
        return res.json({
            message: validationErrors
        })
    }

    workspace = await Workspace.populate(workspace, [{
        path: 'participants',
        select: 'username'
    }]);

    return res.status(200).json(workspace[0]);
}

exports.getMembers = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.json({
            message: 'Not valid id.'
        })
    }

    const workspace = await Workspace.findOne({
        _id: ObjectId(req.params.id)
    }).populate('participants', 'username');

    return res.status(200).json(workspace);
}

exports.add = async (req, res) => {
    const currentWorkspace = await Workspace.findOne({
        name: req.body.name,
        author: res.locals.user._id
    });

    if (currentWorkspace !== null) {
        return res.json({ message: 'This workspace already exists.'});
    }

    let participants = [];
    participants.push(res.locals.user._id);


    const newWorkspace = new Workspace({
        name: req.body.name,
        participants: participants,
        author: res.locals.user._id
    });

    newWorkspace.save((error) => {
		if (!error) {
			return res.json(newWorkspace);
		}

		if (error.errors['name']) {
			return res.json({ message: error.errors['name'].message });
		}
	});
};

exports.addMember = async (req, res) => {
    const validationErrors = [];

    if (!req.body.workspace) validationErrors.push('Workspace id requried');
    if (!req.body.member) validationErrors.push('New member id required');
    
    let currentWorkspace = await Workspace.findOne({
        _id: req.body.workspace
    });

    if (currentWorkspace.author.toString() !== res.locals.user._id.toString()) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    if (currentWorkspace === null) validationErrors.push('Workspace not found.');

    const user = await User.findOne({
        username: req.body.member
    });

    if (user === null) {
        validationErrors.push('User not found.')
        return res.json({ message: validationErrors });
    };
    if (currentWorkspace.participants.includes(user._id)) validationErrors.push('This member is already in workspace.');
    
    if (validationErrors.length !== 0) {
        return res.json({ message: validationErrors });
    }

    currentWorkspace.participants.push(user._id);
    currentWorkspace.save();

    return res.status(200).json(currentWorkspace);
}

exports.removeMember = async (req, res) => {
    const validationErrors = [];

    if (!req.params.workspace) validationErrors.push('Workspace id requried');
    if (!req.params.member) validationErrors.push('Member id required');
    
    let currentWorkspace = await Workspace.findOne({
        _id: req.params.workspace
    });
    
    if (currentWorkspace.author.toString() !== res.locals.user._id.toString()) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    if (currentWorkspace === null) validationErrors.push('Workspace not found.');
    if (!currentWorkspace.participants.includes(req.params.member)) validationErrors.push('This member is already not in workspace.');
    
    if (validationErrors.length !== 0) {
        return res.json({ message: validationErrors });
    }

    const newParticipants = currentWorkspace.participants.filter(x => x.toString() !== req.params.member);
    currentWorkspace.participants = newParticipants;
    currentWorkspace.save();

    return res.status(200).json({ message: 'User deleted.' });
}

exports.edit = async (req, res) => {
    const validationErrors = [];

    if (!req.body.workspace) validationErrors.push('Workspace id requried');
    if (!req.body.participants) validationErrors.push('Workspace participants required');
    
    const currentWorkspace = await Workspace.findOne({
        _id: req.body.workspace
    });
    
    if (currentWorkspace === null) validationErrors.push('Workspace not found');
    
    if (validationErrors.length !== 0) {
        return res.json({ message: validationErrors });
    }

    if (currentWorkspace.author.toString() !== res.locals.user._id.toString()) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    currentWorkspace.name = req.body.name;
    currentWorkspace.participants = req.body.participants;

    currentWorkspace.save((error) => {
		if (!error) {
			return res.json(currentWorkspace);
		}

		if (error.errors['name']) {
			return res.json({ message: error.errors['name'].message });
		}

		if (error.errors['participants']) {
			return res.json({ message: error.errors['participants'].message });
		}
	});
};

exports.delete = async (req, res) => {
    const validationErrors = [];

    if (!req.params.id) validationErrors.push('Workspace id requried');
    
    const currentWorkspace = await Workspace.findOne({
        _id: req.params.id
    });
    
    if (currentWorkspace === null) validationErrors.push('Workspace not found');
    
    if (validationErrors.length !== 0) {
        return res.json({ message: validationErrors });
    }
    
    if (currentWorkspace.author.toString() !== res.locals.user._id.toString()) {
        return res.status(401).json({ message: 'Access denied.'});
    }

    await Todo.deleteMany({
        workspace: currentWorkspace._id
    });

    currentWorkspace.delete();
    res.status(200).json({ message: 'Workspace deleted.' });
};