const { getValidation, addMemberValidation, removeMemberValidation, editValidation, deleteValidation } = require('../../helpers/JoiWorkspaceHelper');
const Todo = require('../../models/Todo');
const User = require('../../models/User');
const Workspace = require('../../models/Workspace');
const ObjectId = require('mongoose').Types.ObjectId;

exports.index = async (req, res) => {
    let workspaces = await Workspace.aggregate([
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

    workspaces = await Workspace.populate(workspaces, {
        path: 'participants',
        select: 'username'
    })
    
    return res.status(200).json(workspaces);
};

exports.get = async (req, res) => {
    const { error } = getValidation(req.params);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    let workspace = await Workspace.aggregate([
        { $match: { _id: ObjectId(req.params.id) }},
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
    
    if (workspace.length === 0) {
        return res.json({
            message: 'Workspace not found'
        });
    }

    workspace = await Workspace.populate(workspace, [{
        path: 'participants',
        select: 'username'
    }]);

    return res.status(200).json(workspace[0]);
}

exports.addMember = async (req, res) => {
    const { error } = addMemberValidation(req.body);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }
    
    let currentWorkspace = await Workspace.findOne({
        _id: req.body.workspace
    });

    if (currentWorkspace === null) {
        return res.json({
            message: 'Workspace not found'
        });
    }
    
    const user = await User.findOne({
        username: req.body.member
    });

    if (user === null) {
        return res.json({
            message: 'User not found'
        });
    };

    if (currentWorkspace.participants.includes(user._id)) {
        return res.json({ 
            message: 'This member is already in workspace'
        });
    }
    
    currentWorkspace.participants.push(user._id);
    currentWorkspace.save();

    return res.status(200).json(currentWorkspace);
}

exports.removeMember = async (req, res) => {
    const { error } = removeMemberValidation(req.params);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    let currentWorkspace = await Workspace.findOne({
        _id: req.params.workspace
    });
    
    if (currentWorkspace === null) {
        return res.json({
            message: 'Workspace not found'
        });
    }

    if (!currentWorkspace.participants.includes(req.params.member)) {
        return res.json({
            message: 'This member is already not in workspace'
        });
    };
    
    const newParticipants = currentWorkspace.participants.filter(x => x.toString() !== req.params.member);

    currentWorkspace.participants = newParticipants;
    currentWorkspace.save();

    return res.status(200).json({
        message: 'User deleted'
    });
}

exports.edit = async (req, res) => {
    const { error } = editValidation(req.body);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const currentWorkspace = await Workspace.findOne({
        _id: req.body.workspace
    });
    
    if (currentWorkspace === null) {
        return res.json({
            message: 'Workspace not found'
        });
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
    const { error } = deleteValidation(req.body);

    if (error) {
        return res.json({
            message: error.details[0].message
        });
    }

    const currentWorkspace = await Workspace.findOne({
        _id: req.params.id
    });
    
    if (currentWorkspace === null) {
        return res.json({
            message: 'Workspace not found'
        });
    }
    
    await Todo.deleteMany({
        workspace: currentWorkspace._id
    });

    currentWorkspace.delete();
    res.status(200).json({ message: 'Workspace deleted' });
};