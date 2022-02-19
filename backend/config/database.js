const mongoose = require('mongoose');
const env = require('dotenv');
const checkRoles = require('../app/controllers/RoleController');
env.config();

mongoose.connect(process.env.DB_URL, { 
    useNewUrlParser: true
});

const db = mongoose.connection

db.on('error', error => console.error(error));
db.once('open', () => {
    checkRoles();
    console.log('Database connection established.');
});