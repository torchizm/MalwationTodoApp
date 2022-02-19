const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
        index: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    image: {
        type: String
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.methods.getJwtToken = function() {
    return jwt.sign({ 
            _id: this._id,
            name: this.username,
            email: this.email,
        },
        process.env.SESSION_SECRET
    );
};

userSchema.methods.checkPassword = function(pass) {
    return bcrypt.compareSync(pass, this.password);
};

userSchema.plugin(validator);
module.exports = mongoose.model('user', userSchema);