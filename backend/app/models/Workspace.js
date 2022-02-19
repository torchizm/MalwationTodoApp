const mongoose = require("mongoose");
const Todo = require("./Todo");
const User = require("./User");

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field required"]
    },
    participants: {
        type: Array,
        ref: 'user',
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true
});

workspaceSchema.methods.getTodos = async function() {
    const todos = await Todo.find({
        workspace: this._id
    });
    return todos;
};

workspaceSchema.methods.getUsers = async function() {
    if (this.participants.length === 0) {
        return null;
    }

    let users = [];

    this.participants.map(participant => {
        users.push({ _id: participant.id });
    });

    return await User.find(users);
};

module.exports = mongoose.model('workspace', workspaceSchema);