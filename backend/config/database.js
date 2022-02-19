const mongoose = require('mongoose');
const env = require('dotenv');
const checkRoles = require('../app/controllers/RoleController');
env.config();

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, { 
    useNewUrlParser: true
});
    
const db = mongoose.connection

db.on('error', error => console.error(error));
db.once('open', () => {
    checkRoles();
    console.log('Database connection established.');
});