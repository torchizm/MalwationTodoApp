const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, "Description field required."]
    },
    checked: {
        type: Boolean,
        default: false
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Workspace field required."],
        ref: 'workspace'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Author field required."],
        ref: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('todo', todoSchema);