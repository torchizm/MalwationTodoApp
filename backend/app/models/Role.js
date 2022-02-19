const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    'name': String,
    'actions': String
});

module.exports = mongoose.model('role', roleSchema);